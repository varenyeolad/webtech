const express = require("express")
const {checkAuthenticated} = require("../../middlewares/auth");
const router = express.Router()

module.exports = router;
router
    .route('/')
    .get(checkAuthenticated,(req, res) => res.render('webpages/profile.ejs', { name: req.user.name }))















