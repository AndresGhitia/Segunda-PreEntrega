import { ProductManager } from "./mannagers/fileSystem/productsFiles.js"
import { CartManager } from "./mannagers/fileSystem/cartsFiles.js"
import { config } from "../config/config.js"
import { ProductsMongo } from "./mannagers/mongo/productsMongo.js";
import { CartsMongo } from "./mannagers/mongo/cartsMongo.js";
import { connectDB } from "../config/dbConnection.js"

// const productService = new ProductManager(config.fileSystem.productsFile);
// const cartService = new CartManager(config.fileSystem.cartsFile)

connectDB()
const productService = new ProductsMongo();
const cartService = new CartsMongo()

export {productService, cartService}