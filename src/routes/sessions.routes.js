import { Router } from "express";
import { userService } from "../dao/index.js";
import passport from "passport";

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async(req, res) => {
    // res.send({status: 'success', message: 'User registered'})
    res.redirect('/login')
})

router.get('/failregister', async(req, res) => {
    res.send({status: 'error', message: 'Failed register'})
})

router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), async(req, res) => {
    if(!req.user) return res.status(400).send({status: 'error', message: 'Invalid credentials'})
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        date_of_birth: req.user.date_of_birth,
        role: req.user.email == 'adminCoder@coder.com' ? 'admin' : 'user'
    }
    // res.send({status: 'success', payload: req.user})
    res.redirect('/products')
})


router.get('/failloing', async(req, res) => {
    res.send({status: 'error', message: 'Failed login'})
})

router.get('/logout', (req, res)=>{
    req.session.destroy(err => {
        if (err) return res.send({status: 'error', message: err})
        // res.send('Successfully logged out.')
        res.redirect('/login')
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res)=>{
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        date_of_birth: req.user.date_of_birth,
        role: req.user.email == 'adminCoder@coder.com' ? 'admin' : 'user'
    }
    res.redirect('/products')
})

export { router as sessionsRouter };
