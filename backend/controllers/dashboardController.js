const Submission = require('../models/Submission');
const Problem    = require('../models/problems');
const Contest    = require('../models/Contest');
const User       = require('../models/User');

//This function returns the start of the day (00:00 UTC) for d days ago.
const dayStart = d => {
  const t = new Date();
  t.setUTCHours(0,0,0,0);
  t.setUTCDate(t.getUTCDate() - d);
  return t;
};

/* 1) solved problems history (last 30 d) */
exports.getStats = async (req, res, next) => {
  try {
    const rows = await Submission.aggregate([
      { $match: {
          userId:  req.user.id,
          verdict:'Accepted',
          
      }},
      { $group: {
          _id  : { $dateToString:{format:'%Y-%m-%d',date:'$submittedAt'} },
          count: { $sum:1 }
      }},
      { $sort: { _id:1 } }
    ]);
    const solvedHistory = rows.map(r=>({ date:r._id, count:r.count }));
    res.json({ solvedHistory });
  } catch(err){ next(err); }
};

/* streak + 42-day heatmap */
exports.getSkills = async (req, res, next) => {
  try {
    const logs = await Submission.aggregate([
      { $match:{
          userId:req.user.id,
          verdict:'Accepted',
          submittedAt:{ $gte: dayStart(41) }
      }},
      { $group:{
          _id:{ $dateToString:{format:'%Y-%m-%d',date:'$submittedAt'} },
          cnt:{ $sum:1 }
      }}
    ]);
    const map = Object.fromEntries(logs.map(x=>[x._id,x.cnt]));
    const heatmap=[]; let streak=0;
    for(let i=41;i>=0;i--){
      const day = dayStart(i).toISOString().slice(0,10);
      const v   = map[day]||0;
      heatmap.push(v);
      if(i===0||v>0) streak++; else streak=0;
    }
    res.json({ streak, heatmap });
  } catch(err){ next(err); }
};


/* 6 unsolved problems */
exports.getRecommendedProblems = async (req,res,next)=>{
  try{
    const solved = await Submission.distinct('problemId',
                     { userId:req.user.id, verdict:'Accepted' });
    const rec = await Problem.aggregate([
      { $match:{ _id:{ $nin:solved }}},
      { $sample:{ size:6 }},
      { $project:{ title:1, difficulty:1 }}
    ]);
    res.json(rec);
  }catch(err){ next(err); }
};





