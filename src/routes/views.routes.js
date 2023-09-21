import { Router } from "express";
import { cartService } from "../dao/index.js";
import { checkUserAuthenticated,showLoginView } from "../config/auth.js";
import { ViewsControllers } from "../controllers/views.controllers.js";

const router = Router()

router.get('/',ViewsControllers.renderHome)

router.get("/realtimeproducts",ViewsControllers.renderTimeProducts);

router.get("/chat",ViewsControllers.renderChat)

router.get("/products",checkUserAuthenticated,ViewsControllers.renderProducts );

router.get('/cart/:cid',ViewsControllers.renderGetCartById)

router.get('/login',showLoginView,ViewsControllers.renderLogin)

router.get('/register',showLoginView,ViewsControllers.renderRegister)

router.get('/faillogin',ViewsControllers.renderFailLogin)

router.get('/failregister',ViewsControllers.renderFailRegister)

router.get("/api/carts",ViewsControllers.renderApiCarts);


export { router as viewsRouter };