import express from "express"
import ProductRouter from "./products.router.js"
import ViewRouter from "./views.router.js"
import CartRouter from "./carts.router.js"
import SessionsRouter from "./sessions.router.js"

const mainRouter = express.Router()

const productRouter = new ProductRouter();
const cartRouter = new CartRouter()
const viewRouter = new ViewRouter()
const sessionsRouter = new SessionsRouter()


mainRouter.use('/api/products', productRouter.getRouter())
mainRouter.use('/api/carts', cartRouter.getRouter())
mainRouter.use('/api/sessions', sessionsRouter.getRouter())
mainRouter.use('/', viewRouter.getRouter())
mainRouter.use('*', (req, res, next) => {
    res.status(404).send({status: "error", error: 'Requested path not found',});
})

export default mainRouter