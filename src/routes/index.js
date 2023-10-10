import express from "express";
import cookieParser from "cookie-parser"; // Importa cookie-parser
import ProductRouter from "./products.router.js";
import ViewRouter from "./views.router.js";
import CartRouter from "./carts.router.js";
import SessionsRouter from "./sessions.router.js";
import errorHandler from "../middlewares/errors.js";

const mainRouter = express.Router();

// Configura cookie-parser como middleware
mainRouter.use(cookieParser());

const productRouter = new ProductRouter();
const cartRouter = new CartRouter();
const viewRouter = new ViewRouter();
const sessionsRouter = new SessionsRouter();

mainRouter.use('/api/products', productRouter.getRouter());
mainRouter.use('/api/carts', cartRouter.getRouter());
mainRouter.use('/api/sessions', sessionsRouter.getRouter());
mainRouter.use('/', viewRouter.getRouter());
mainRouter.use('/mockingproducts', (req, res, next) => {
    res.send(mockingProducts());
});
mainRouter.use('*', (req, res, next) => {
    res.status(404).send({ status: "error", error: 'Requested path not found' });
});
mainRouter.use(errorHandler);

export default mainRouter;
