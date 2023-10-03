import passport from "passport"
import RouterClass from "./RouterClass.js"
import generateToken  from "../utils/jwt.js"
import UserController from "../controllers/users.controller.js";

const authenticateJWT = passport.authenticate('current', { session: false });
const authenticateGithub = passport.authenticate('github', { session: false })

class SessionRouter extends RouterClass {
    init(){
        this.get('/current', ['PUBLIC'], authenticateJWT,  async (req, res) => {
            try{
                res.sendSuccess(UserController.current(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/register', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await UserController.register(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.post('/login', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await UserController.login(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/logout', ['PUBLIC'], async (req, res) => {
            try{
                res.sendSuccess(await UserController.logout(req, res))
            }catch(error){
                res.sendServerError(error.message)
            }
        })

        this.get('/github', ['PUBLIC'],authenticateGithub, async (req, res)=>{})

        this.get('/githubcallback', ['PUBLIC'], authenticateGithub,  async (req, res) => {
            try{
                const user = req.user
                const token = generateToken(user)
                res.cookie(process.env.JWT_COOKIE_KEY, token, {maxAge: 3600000, httpOnly: true})
                res.redirect('/products')
            }catch(error){
                res.sendServerError(error.message)
            }
        })
    }
}

export default SessionRouter