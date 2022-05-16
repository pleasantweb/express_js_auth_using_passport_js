const router = require('express').Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/User')
const {checkAuth} = require('../middlewares/checkAuthentication')

/////////////////////////////////////////////////////////////
                          //register 
router.get('/register',checkAuth,(req,res)=>{
    res.render('register',{isAuthenticated:false})
})
router.post('/register',async(req,res)=>{
    try{
        const {first_name,last_name,email,password} =req.body
        const hashedPwd = await bcrypt.hash(password,10)
        const foundEmail =await User.findOne({email:email})
        if(foundEmail) return res.redirect('/auth/register')
        const user = new User({
            first_name:first_name,
            last_name:last_name,
            email:email,
            password:hashedPwd
        })
        await user.save()
        res.redirect('/auth/login')
    }catch(err){
        console.log(err);
        res.redirect('/auth/register')
    }
    console.log(req.body);
    
})
//////////////////////////////////////////////////////////
                      // login
               
router.get('/login',checkAuth,(req,res)=>{
    res.render('login',{isAuthenticated:false})
})

router.post('/login',passport.authenticate('local',{ failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
})
// {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//     failureFlash: true,
    
// }))

////////////////////////////////////////////////////////////////////////////
router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.redirect('/')
})

///////////////////////////////////////////////////////////////////////////
router.get('/logout',(req,res)=>{
    // res.send('logging out')
    req.logOut()
    res.redirect('/')
})


module.exports = router