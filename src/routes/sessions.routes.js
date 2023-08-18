import { Router } from "express";
import { userService } from "../dao/index.js";

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, date_of_birth } = req.body;

        if (!first_name || !last_name || !email || !password || !date_of_birth) {
            return res.send({ status: 'error', message: 'Hay campos sin completar.' });
        }

        const existsUser = await userService.getUserByEmail(email);
        if (existsUser) {
            return res.send({ status: 'error', message: 'El email ya está registrado.' });
        }

        const user = {
            first_name,
            last_name,
            date_of_birth,
            email,
            password
        };
        await userService.addUser(user);

        res.redirect('/login');
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const isAdmin = (email === 'adminCoder@coder.com' && password === 'adminCod3r123');
        
        const role = isAdmin ? 'admin' : 'user';

        const userDB = isAdmin ? null : await userService.getUserByLogin(email, password);
        
        if (!isAdmin && !userDB) {
            return res.send({ status: 'error', message: 'El usuario ingresado no existe.' });
        }

        req.session.user = {
            first_name: isAdmin ? 'Admin' : userDB.first_name,
            last_name: isAdmin ? 'Admin' : userDB.last_name,
            email: isAdmin ? 'adminCoder@coder.com' : userDB.email,
            role
        };

        res.redirect('/products');
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});


router.get('/logout', (req, res)=>{
    req.session.destroy(err => {
        if (err) return res.send({status: 'error', message: err})
        res.redirect('/login')
    })
})

export { router as sessionsRouter };
