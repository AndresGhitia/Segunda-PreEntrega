import { Router } from "express";
import { productService,} from "../dao/index.js";
import { ProductsControllers } from "../controllers/products.controllers.js";

const router = Router();

router.get('/',ProductsControllers.renderGetProducts)

router.get('/:pid',ProductsControllers.renderGetProductsById)

router.post('/',ProductsControllers.renderAddProduct)

router.put("/:pid",ProductsControllers.renderUpdateProduct);

router.delete('/:pid',ProductsControllers.renderDeleteProduct );

export { router as productsRouter }