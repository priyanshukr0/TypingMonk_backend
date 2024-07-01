const { saveScore, getStats, leaderboardStats } = require('../controllers/Scores');
const auth = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/score/save', auth,saveScore);
router.get('/score/stats',auth, getStats);
router.get('/score/leaderboard', leaderboardStats);

module.exports = router;