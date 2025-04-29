const express = require("express");
const getAnswers = require("../controllers/ChatBotController");
// const temp=require("../../temp")

const router = express.Router();

router.get('/chat',getAnswers)
// router.post('/storeanswer',temp)

module.exports = router;