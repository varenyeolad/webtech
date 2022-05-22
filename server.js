require('dotenv').config()

//Requests
const express =require('express')
const mongoose = require('mongoose')

const port = process.env.PORT || 3000;

/* for to validate and authentication*/
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./modules/User')
const bcrypt = require('bcrypt')

const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('./middlewares/auth')
/*------------------------------------------*/

const app = express()

app.use(session({ secret: 'somevalue' }));

//Find users
const initializePassport = require('./passport-config')
const {check} = require("express-validator");
const {createServer} = require("http");
initializePassport(
    passport,
    async(email)=>{
        const userFound = await User.findOne({email})
        return userFound
    },
    async(id) =>{
        const userFound = await User.findOne({_id: id})
        return userFound
    }
)
app.use(express.urlencoded({extended: true}))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/styles',express.static(__dirname +'/styles'));
app.use('/js',express.static(__dirname +'/js'));
app.use('/img',express.static(__dirname +'/img'));
app.use("/", require("./views/routes/home"));
app.use("/about", require("./views/routes/about"));
app.use("/logout", require("./views/routes/profile"));
app.use("/team", require("./views/routes/team"));
app.use("/login", require("./views/routes/login"));
app.use("/register", require("./views/routes/register"));

app.get('logout', checkAuthenticated, (req,res)=>{
    res.render("profile.ejs", { name: req.user.name })//GO TO PROFILE!!!! NOT MAIN
})
app.get('login',checkNotAuthenticated, (req,res)=>{
    res.render('signin.ejs')
})
app.get('register',checkNotAuthenticated, (req,res)=>{
    res.render('signup.ejs')
})


//---Login case---//
app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
        successRedirect: '/logout',
        failureRedirect: '/login',
        failureFlash: true,
    })
)


//---Register case---//
app.post('/register', checkNotAuthenticated, async (req,res)=>{
    const userFound = await User.findOne({email: req.body.email})

    if(userFound){
        req.flash('error', 'User already exist')
        res.redirect('/register')
    }
    else{
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            await user.save() //Add to DB
            res.redirect('/login')

        }catch (e){
            console.log(e)
            res.redirect('register')
        }
    }
})

//---Log out---//
app.delete('/logout', ({logOut}, res)=>{
    logOut()
    res.redirect('/login')
} )



///---MongoDB connect---///
mongoose.connect('mongodb+srv://aruzhandata:aruzhandata21@cluster.rbfi6.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
}).then(()=>console.log('MongoDb successfully connected'))
    .catch(e => console.log(e))
const server = createServer(app)
server.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
);
