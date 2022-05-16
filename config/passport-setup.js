// const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } =  process.env;

function initializePassport(passport) {
////////////////////////////////////////////////////////////
    const authenticateUser = async (email,password,done)=>{
        const foundUser = await User.findOne({email:email})
        if(!foundUser) return done(null, false, { message: 'No user with that email' })
        try{
            if(await bcrypt.compare(password,foundUser.password)){
                console.log(foundUser);
                return done(null,foundUser)
            }else{
                return done(null,false,{ message: 'Password incorrect' })
            }
        }catch(err){
            return done(err)
        }
     }

/////////////////////////////////////////////////////////////

   const authenticateGoogleUser=async(accessToken,refreshToken,profile,done)=>{
     const foundUser = await User.findOne({googleid:profile.id})
     if(foundUser){
         console.log(foundUser);
         done(null,foundUser)
     }else{
         console.log(profile.name.givenName);
         console.log(profile.name.familyName);
         const newUser = await User.create({
             "first_name":profile.name.givenName || '',
             "last_name":profile.name.familyName || "",
             "email": profile._json.email,
             "googleid":profile.id
         })
         
         console.log(newUser);
         done(null,newUser)
     }
   }

/////////////////////////////////////////////////////////////
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    
    passport.use(new GoogleStrategy({

        callbackURL:'/auth/google/redirect',
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
  
    },authenticateGoogleUser))
    
//////////////////////////////////////////////////////////// 
  passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id,done)=>{
        console.log(id);
        User.findById(id).then((user)=>{
            console.log(user);
           done(null,user)
       })
   })
  }
  
module.exports = initializePassport
  