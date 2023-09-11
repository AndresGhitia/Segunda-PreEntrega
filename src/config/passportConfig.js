import passport from "passport"
import local from "passport-local"
import { userService } from "../dao/index.js"
import { createHash, isValidPassword } from "../utils.js"
import GitHubStrategy from "passport-github2"

const LocalStrategy = local.Strategy

export const initPassport = () => {
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'},

    async (req, username, password, done) => {
        try{
            const { first_name, last_name, email, date_of_birth } = req.body
            const user = await userService.getUserByEmail(username)
            if(user) { 
                return done(null, false)}

            const newUser = {
                first_name,
                last_name,
                date_of_birth,
                email,
                password: createHash(password)
            }

            const result = await userService.addUser(newUser)
            return done(null, result)
        }catch(error){
            return done(error)
        }
    }))

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email'
        },
    async(username, password, done) => {
        const userDB = await userService.getUserByEmail(username)
        try{
            if(!userDB) {
                return done(null, false)}

            if(!isValidPassword(userDB, password)){
                return done(null, false)}

            return done(null, userDB)
        }catch(error){
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserById(id)
        done(null, user)
    })
}

export const initPassportGithub = () => {
    passport.use('github', new GitHubStrategy({ 
        clientID: 'Iv1.aaacd1c8749ef0f0',
        clientSecret: '3b1f7dbc1a22b339d17c38ef2d10a3a50d197644',
        callbackUrl: 'http://localhost:8080/api/sessions/githubcallback' },
    async(accessToken, refreshToken, profile, done) => {
        try{
            const user = await userService.getUserByEmail(profile._json.email)
            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: ' ',
                    date_of_birth: ' ',
                    email: profile._json.email,
                    password: ' ',
                }
                const result = await userService.addUser(newUser)
                return done(null, result)
            }else{
                return done(null, user)
            }
        }catch(error){
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userService.getUserById(id)
        done(null, user)
    })
}