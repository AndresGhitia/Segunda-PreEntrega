import { Router } from "express";
import jwt from 'jsonwebtoken';

class RouterClass {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                if (!params[1].headersSent) { // Verificar si aún no se han enviado los encabezados
                    params[1].status(500).json({ error: error.message }); // Enviar una respuesta JSON con el error
                }
            }
        });
    }

    generateRandomResponse = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: 'success', payload });
        res.sendServerError = error => res.send({ status: 'error', error });
        res.sendUserError = error => res.send({ status: 'error', error });
        next();
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next();

        const authCookie = req.headers.cookie;
        if (!authCookie) return res.send({ status: 'error', error: 'Usuario no identificado o token inválido.' });

        const token = authCookie.split('=')[1];
        const user = jwt.verify(token, process.env.JWT_KEY);
        if (!policies.includes(user.user.role.toUpperCase())) return res.status(403).send({ status: 'error', error: 'Usuario sin permisos' });
        req.user = user;
        next();
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateRandomResponse, this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateRandomResponse, this.applyCallbacks(callbacks));
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateRandomResponse, this.applyCallbacks(callbacks));
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateRandomResponse, this.applyCallbacks(callbacks));
    }
}

export default RouterClass;
