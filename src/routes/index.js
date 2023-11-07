import express from "express";
import cookieParser from "cookie-parser";
import ProductRouter from "./products.router.js";
import ViewRouter from "./views.router.js";
import CartRouter from "./carts.router.js";
import SessionsRouter from "./sessions.router.js";
import errorHandler from "../middlewares/errors.js";
import { mockingProducts } from "../utils/mockingProducts.js";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'; 
const mainRouter = express.Router();

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

mainRouter.use('/loggerTest', (req, res, next) => {
    req.logger.fatal('testing fatal log')
    req.logger.error('testing error log')
    req.logger.warning('testing warning log')
    req.logger.info('testing info log')
    req.logger.http('testing http log')
    req.logger.debug('testing debug log')
    res.send('Logger')
});

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentation of my eCommerce api',
            description: 'This is the documentation of my api that I have developed for an ecommerce in the Coderhouse backend course.'
        }
    },
    apis: [`./docs/**/*.yaml`]
};

const specs = swaggerJsDoc(swaggerOptions);
mainRouter.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

mainRouter.use('*', (req, res, next) => {
    res.status(404).send({ status: "error", error: 'Requested path not found' });
});
mainRouter.use(errorHandler);

export default mainRouter;
