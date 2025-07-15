const Contest = require('../models/Contest');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');

const ONE_HOUR = 60 * 60 * 1_000;
const ONE_DAY = 24 * 60 * 60 * 1_000;
const localToUTC = str => new Date(str).toISOString();
exports.getTodayContests = async (req, res, next) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - ONE_DAY);
    const contests = await Contest
      .find({ endAt: { $gt: twentyFourHoursAgo } })
      .select('title description startAt endAt participants')
      .sort({ startAt: 1 })          // oldest first
      .lean();

    const now = Date.now();

    const enriched = contests.map(c => {
      const start = c.startAt.getTime();
      const end = c.endAt.getTime();
      const joinCut = start + ONE_HOUR;

      let status, canJoin = false;

      if (now < start) { status = 'JOIN_NOW'; canJoin = true; }
      else if (now <= joinCut) { status = 'JOIN_NOW'; canJoin = true; }
      else if (now < end) { status = 'NO_MORE_TRIALS'; }
      else { status = 'WAIT_RESULTS'; } // ended < 24 h ago

      return { ...c, status, canJoin };
    });

    res.json(enriched);               // always an array
  } catch (err) { next(err); }
};



/**
 * POST /api/contests/:id/join
 * – allows joining until 1 h after startAt
 */
exports.joinContest = async (req, res, next) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest)
      return res.status(404).json({ ok: false, error: 'Contest not found' });

    if (contest.participants.some(p => p.toString() === req.user.id))
      return res.json({ ok: true, message: 'Already registered' });

    const now = Date.now();
    const start = contest.startAt.getTime();
    const joinCut = start + ONE_HOUR;

    if (now > joinCut)
      return res.status(400).json({ ok: false, error: 'Registration closed' });

    contest.participants.push(req.user.id);
    await contest.save();

    res.json({ ok: true, message: 'Successfully registered' });
  } catch (err) { next(err); }
};

/*get contest details*/
exports.getContestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findById(id)
      .select('-__v')                   // hide Mongo meta
      .lean();
    if (!contest) return res.status(404).json({ ok: false, error: 'Contest not found' });

    res.json(contest);
  } catch (err) {
    next(err);
  }
};

exports.getContestProblem = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const contest = await Contest.findById(cid).lean();
    if (!contest) return res.status(404).json({ error: 'Contest not found' });

    const prob = contest.problems.find(
      p => p._id.toString() === pid
    );
    if (!prob) return res.status(404).json({ error: 'Problem not found' });
    if (contest.isLive && !contest.participants.some(p => p.toString() === user._id.toString())) {
      return res.status(403).json({ message: 'Access denied during live contest' });
    }

    res.json(prob);                // includes its embedded testCases[]
  } catch (err) { next(err); }
}


exports.getLeaderboard = async (req, res, next) => {
  try {
    const { id: contestId } = req.params;
    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ ok: false, error: 'Contest not found' });

    // collect the embedded‐problem IDs
    const problemIds = contest.problems.map(p => p._id);

    const rows = await Submission.aggregate([
      { $match: {
          verdict: 'Accepted',
          submittedAt: { $gte: contest.startAt, $lte: contest.endAt },
          $or: [
            // newly‐saved submissions that have contestId
            { contestId: new mongoose.Types.ObjectId(contestId) },
            // older submissions saved only under problemId
            { problemId: { $in: problemIds } }
          ]
      }},
      { $group: {
          _id: '$userId',
          score: { $sum: 1 },
          last:  { $max: '$submittedAt' }
      }},
      { $sort: { score: -1, last: 1 } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
          _id:     0,
          userId: '$_id',
          username: { $concat: ['$user.firstname', ' ', '$user.lastname'] },
          score:  1
      }},
      { $limit: 10 }
    ]);

    // attach 1-based rank
    const leaderboard = rows.map((r, i) => ({ rank: i + 1, ...r }));
    res.json(leaderboard);

  } catch (err) {
    next(err);
  }
};



// controllers/contestController.js
exports.createContest = async (req, res, next) => {
  try {
    const { title, description, startAt, endAt, problems } = req.body;

    if (!title || !problems?.length || !startAt || !endAt)
      return res.status(400).json({ ok: false, error: 'Missing fields' });

    // Simple sanity: each problem must have ≥1 hidden & ≥1 sample
    for (const p of problems) {
      const samples = p.testCases?.filter(tc => tc.isSample).length || 0;
      const hidden = p.testCases?.filter(tc => !tc.isSample).length || 0;
      if (!samples || !hidden)
        return res.status(400).json({
          ok: false,
          error: `Problem "${p.title}" must have at least 1 sample and 1 hidden test-case`
        });
    }

    const contest = await Contest.create({
      title, description,
      /* convert once to true UTC ISO strings */
      startAt: localToUTC(startAt),   // 2025-07-16T04:30:00.000Z
      endAt: localToUTC(endAt),
      problems,
      createdBy: req.user.id
    });
    res.status(201).json({ ok: true, id: contest._id });
  } catch (err) { next(err); }
};
