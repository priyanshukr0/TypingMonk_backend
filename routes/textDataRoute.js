const { fetchTextData } = require("../controllers/TextController");
const router = require("express").Router(); 

router.post('/data/text', fetchTextData)

module.exports = router; 