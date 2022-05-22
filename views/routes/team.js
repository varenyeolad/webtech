const express = require("express")
const router = express.Router()

module.exports = router;
router
    .route('/')
    .get((req, res) => res.render('webpages/team.ejs'))
