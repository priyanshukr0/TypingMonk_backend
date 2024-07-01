const User = require('../models/User');
const TypingStats = require('../models/TypingStats');

// all fields initializer
async function initializeStats(_id) {
    const newStats = new TypingStats({
        user: _id,
        timeStats: {
            "10sec": { wpm: "0", accuracy: "0" },
            "30sec": { wpm: "0", accuracy: "0" },
            "60sec": { wpm: "0", accuracy: "0" },
            "120sec": { wpm: "0", accuracy: "0" },

        },
        wordStats: {
            "10words": { wpm: "0", accuracy: "0" },
            "25words": { wpm: "0", accuracy: "0" },
            "50words": { wpm: "0", accuracy: "0" },
            "100words": { wpm: "0", accuracy: "0" },

        }
    })
    await newStats.save();
    await User.findByIdAndUpdate(_id, { $set: { bestScore: newStats._id } });
    return newStats;
}

async function saveScore(req, res) {
    // testMode ---> "time" or "word" 
    //testName--> "10words","25words", "50words", "100words" / "10sec" "30sec" "60sec" "120sec" 
    try {
        const { _id } = req.user;
        const { testMode, testName, wpm, accuracy, } = req.body;

        //checking all fields are present or not
        if (!testMode || !testName || !wpm || !accuracy) {
            console.log(testName, testMode, wpm, accuracy);
            return res.status(400).json({
                success: false,
                message: 'Invalid request'
            })
        }
        const validTest = ["10sec", "30sec", "60sec", "120sec", "10words", "25words", "50words", "100words"];
        if (!(validTest.includes(testName))) {
            return res.status(400).json({ success: false, message: 'invalid testName' })
        }

        //checking if user is present or not
        const user = await User.findById(_id);
        if (!user) {
            return res.status.json({
                success: false,
                message: 'User not found'
            })
        }
        //save the score based on test mode is "time" or "word
        if (testMode === "time") {
            const userStats = await TypingStats.findOne({ user: _id });
            if (!userStats) {
                return res.status(400).json({
                    success: false,
                    message: 'Stats not found'
                });
            }
            else {
                const userStats = await TypingStats.findOne({ user: _id });
                if (parseInt(userStats.timeStats[testName].wpm) < parseInt(wpm) ||
                    parseInt(userStats.timeStats[testName].wpm === wpm) && parseInt(userStats.timeStats[testName].accuracy) < parseInt(accuracy)
                ) {
                    userStats.timeStats[testName].wpm = wpm;
                    userStats.timeStats[testName].accuracy = accuracy;
                    await userStats.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Score saved successfully'
                    })
                }
                else {
                    return res.status(200).json({
                        success: false,
                        message: 'Score is not greater than previous score'
                    })
                }
            }

        } else if (testMode === "word") {
            const stats = await TypingStats.findOne({ user: _id });
            if (!stats) {
                return res.status(400).json({
                    success: false,
                    message: 'stats not found'
                })
            }
            else {
                const userStats = await TypingStats.findOne({ user: _id });
                if (parseInt(userStats.wordStats[testName].wpm) < parseInt(wpm) ||
                    (parseInt(userStats.wordStats[testName].wpm) === parseInt(wpm) && parseInt(userStats.wordStats[testName].accuracy) < parseInt(accuracy))
                ) {
                    userStats.wordStats[testName].wpm = wpm;
                    userStats.wordStats[testName].accuracy = accuracy;
                    await userStats.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Score saved successfully'
                    })
                } else {
                    return res.status(200).json({
                        success: false,
                        message: 'Score is not greater than previous score'
                    })
                }
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid test mode'
            })
        }
    } catch (error) {
        console.log('Internal server error', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
}

async function getStats(req, res) {
    try {
        const { _id } = req.user;
        const userStats = await TypingStats.findOne({ user: _id }).populate('user');
        if (!userStats) {
            return res.status(400).json({
                success: false,
                message: 'Stats not found'
            })
        }
        // hiding the user ID before sending the response
        const userData = {
            name: userStats.user.name,
            email: userStats.user.email,
            bestScore: {
                timeStats: {
                    '10sec': {
                        wpm: userStats.timeStats['10sec'].wpm,
                        accuracy: userStats.timeStats['10sec'].accuracy
                    },
                    '30sec': {
                        wpm: userStats.timeStats['30sec'].wpm,
                        accuracy: userStats.timeStats['30sec'].accuracy
                    },
                    '60sec': {
                        wpm: userStats.timeStats['60sec'].wpm,
                        accuracy: userStats.timeStats['60sec'].accuracy
                    },
                    '120sec': {
                        wpm: userStats.timeStats['120sec'].wpm,
                        accuracy: userStats.timeStats['120sec'].accuracy
                    }
                },
                wordStats: {
                    '10words': {
                        wpm: userStats.wordStats['10words'].wpm,
                        accuracy: userStats.wordStats['10words'].accuracy
                    },
                    '25words': {
                        wpm: userStats.wordStats['25words'].wpm,
                        accuracy: userStats.wordStats['25words'].accuracy
                    },
                    '50words': {
                        wpm: userStats.wordStats['50words'].wpm,
                        accuracy: userStats.wordStats['50words'].accuracy
                    },
                    '100words': {
                        wpm: userStats.wordStats['100words'].wpm,
                        accuracy: userStats.wordStats['100words'].accuracy
                    }
                }


            }
        }

        return res.status(200).json({
            success: true,
            data: userData,
        })
    } catch (error) {
        console.log('Internal server error occured while fetching the records', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function leaderboardStats(req, res) {
    try {
        const { testMode } = req.query;
        // const { testMode } = req.body;
        if (testMode === "time") {
            const allTests = ["10sec", "30sec", "60sec", "120sec"];
            const result = await Promise.all(allTests.map(async (test) => {
                const score = await TypingStats.find({}).
                    sort({ [`timeStats.${test}`.wpm]: -1, [`timeStats.${test}.accuracy`]: -1 }).
                    limit(10).populate('user');

                const userDatas = score.map(val => {
                    return {
                        name: val.user.name,
                        email: val.user.email,
                        wpm: val.timeStats[test].wpm,
                        accuracy: val.timeStats[test].accuracy
                    }
                })
                return {
                    [test]: userDatas
                };
            }))
            const data = result.reduce((acc, curr) => Object.assign(acc, curr), {});
            return res.status(200).json({
                success: true,
                data: data,
            })

        } else if (testMode === "word") {

            const allTests = ["10words", "25words", "50words", "100words"];

            const result = await Promise.all(allTests.map(async (test) => {
                const score = await TypingStats.find({}).
                    sort({ [`wordStats.${test}`.wpm]: -1, [`wordStats.${test}.accuracy`]: -1 }).
                    limit(10).populate('user');

                const userDatas = score.map(val => {
                    return {
                        name: val.user.name,
                        email: val.user.email,
                        wpm: val.wordStats[test].wpm,
                        accuracy: val.wordStats[test].accuracy
                    }
                })
                return {
                    [test]: userDatas
                };
            }))

            const data = result.reduce((acc, curr) => Object.assign(acc, curr), {});

            return res.status(200).json({
                success: true,
                data: data
            })
        } else {
            return res.status(400).json({ success: false, message: 'invalid testMode' })
        }
    } catch (error) {
        console.error('Error occuered while fetching the leaderboard', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while fetching leaderboard '
        })
    }

}

module.exports = { saveScore, getStats, leaderboardStats };