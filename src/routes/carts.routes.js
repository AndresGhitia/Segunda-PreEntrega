import { Router } from "express";
import { cartService } from "../dao/index.js";
import { CartsControllers } from "../controllers/carts.controllers.js";

const router = Router();

router.get('/:cid',CartsControllers.renderGetCartId )

router.post('/',CartsControllers.renderCreateCart )

router.post('/:cid/products/:pid',CartsControllers.renderAddCart)

router.put('/:cid',CartsControllers.renderUpdateCart)

router.put('/:cid/products/:pid',CartsControllers.renderQuantityCart)

router.delete('/:cid/products/:pid',CartsControllers.renderDeleteProductCart )

router.delete('/:cid',CartsControllers.renderDeleteAllCart )

export { router as cartsRouter }