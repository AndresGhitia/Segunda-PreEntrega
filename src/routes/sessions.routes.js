import { Router } from "express";
import { userService } from "../dao/index.js";
import passport from "passport";
import { SessionControllers } from "../controllers/sessions.controllers.js";

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}),SessionControllers.renderSessionRegister)

router.get('/failregister',SessionControllers.renderSessionFail)

router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), SessionControllers.renderSessionLogin )


router.get('/failloing',SessionControllers.renderSessionFailLogin)

router.get('/logout',SessionControllers.renderSessionLogout )

router.get('/github', passport.authenticate('github', {scope: ['user:email']}),SessionControllers.renderSessionGitHub )

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),SessionControllers.renderSessionCallback )

export { router as sessionsRouter };