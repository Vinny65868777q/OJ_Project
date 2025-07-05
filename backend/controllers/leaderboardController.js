
const Submission = require('../models/Submission');
const User = require('../models/User');



const getLeaderboard = async (req, res, next) => {

    try {
        const leaderboardData = await Submission.aggregate([
            {
                $group: {
                    _id: '$userId',
                    solvedCount: {
                        $sum: { $cond: [{ $eq: ['$verdict', 'Accepted'] }, 1, 0] }
                    },
                    submissionCount: { $sum: 1 }
                }
            },//Group the remaining submissions by userId//For each userId, count the number of times they appear and store in new field - solvedCount

            {
                $addFields: {
                    accuracy: {
                        $cond: [
                            { $eq: ['$submissionCount', 0] },
                            0,
                            { $multiply: [{ $divide: ['$solvedCount', '$submissionCount'] }, 100] }
                        ]
                    }
                }
            },
            { $sort: { solvedCount: -1 } },

            {
                $lookup: {//this is like a JOIN operation
                    from: 'users',//for this we have imported User // which collection to join
                    localField: '_id',// this collection’s field to match
                    foreignField: '_id',// other collection’s field to match
                    as: 'user'  // where to store the result

                }//MongoDB joins the matching user info into an array
            },
            { $unwind: '$user' },	//Flattens the array to a single object
            { $match: { 'user.role': 'user' } },  // filter out admins
            {
                $project: {//Choose what fields I want to keep or rename in the final output.
                    _id: 0, //Don’t include MongoDB's default _id field
                    userId: '$user._id',//Create a field called userId, and copy it from user._id
                    username: { $concat: ['$user.firstname', ' ', '$user.lastname'] },
                    solvedCount: 1,
                    submissionCount: 1,
                    accuracy: 1
                }
            }

        ]);
        res.status(200).send(leaderboardData);

    } catch (error) {
        next(error);
    }

};

module.exports = { getLeaderboard };