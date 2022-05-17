require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
const app = express()
const authRoutes = require('./routes/auth-routes')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500
const { SESSION_SECRET } =  process.env;
const initializePassport =require('./config/passport-setup')

connectDB()
//middlewares
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:false}))

//passport
app.use(flash())
// app.use(cookieSession({
//     maxAge:24 * 60 * 60 * 1000,
//     keys:[SESSION_SECRET]
//   }))
initializePassport(passport)
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
app.use(passport.initialize())
app.use(passport.session())

//view engine
app.set("view engine",'ejs')

//routes
app.use('/auth',authRoutes)

app.get('/',(req,res)=>{
    // console.log('user hai',req.user);
    
    const userName = req.user ? (req.user?.first_name + ' ' + req.user?.last_name) :  null
    // console.log('username',userName);
    // console.log('isAuthenticated',req.isAuthenticated());
    res.render('home',{isAuthenticated:req.isAuthenticated(),user:userName })
})


mongoose.connection.once('open',()=>{
    console.log('connect to mongodb');
    
})

app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}`);
})