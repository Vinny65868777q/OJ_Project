const Contest = require('../models/Contest');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');

exports.getNextContest = async (req, res, next) => {
    try {
        const contest = await Contest.findOne({ startAt: { $gt: new Date() } }) //Finds the first contest whose startAt time is in the future.
            .sort({ startAt: 1 })// sorts acc to startat in asc order
            .select('title description startAt endAt') //Retrieves only the title, description, startAt, and endAt fields.
            .lean();
        return res.json(contest || {}); //Sends the contest data as JSON in the response, or an empty object if no contest was found.
    } catch (err) {
        next(err);
    }
};

exports.joinContest = async (req, res, next) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findById(id);
        if (!contest) return res.status(404).json({ ok: false, error: 'Contest not found' });

        if (contest.participants.includes(req.user.id)) {
            return res.json({ ok: true, message: 'Already registered' });
        }
        contest.participants.push(req.user.id);
        await contest.save();
        res.json({ ok: true, message: 'Successfully registered' });

    } catch (err) {
        next(err);
    }
};

/*get contest details*/
exports.getContestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findById(id)
                                 .populate('problems', 'title difficulty')
                                 .lean();
    if (!contest) return res.status(404).json({ ok:false, error:'Contest not found' });

    res.json(contest);
  } catch (err) {
    next(err);
  }
};

/* -- contest leaderboard -- */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { id } = req.params;

    // aggregate each user’s accepted submissions in this contest window
    const contest = await Contest.findById(id).lean();
    if (!contest) return res.status(404).json({ ok:false, error:'Contest not found' });

    const rows = await Submission.aggregate([
      {
        $match: {
          problemId : { $in: contest.problems },
          verdict   : 'Accepted',
          submittedAt: { $gte: contest.startAt, $lte: contest.endAt }
        }
      },
      {
        $group: {
          _id  : '$userId',
          score: { $sum: 1 },          
          last : { $max: '$submittedAt' }
        }
      },
      { $sort: { score: -1, last: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { username:'$user.username', score:1 } }
    ]);

    // attach ranks
    const leaderboard = rows.map((r, i) => ({ rank:i+1, ...r }));
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
};

