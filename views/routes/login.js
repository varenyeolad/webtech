const express = require("express")
const router = express.Router()
const {checkNotAuthenticated} = require("../../middlewares/auth");
module.exports = router;
router
    .route('/')
    .get( checkNotAuthenticated, (req, res) => res.render('webpages/login.ejs'))
