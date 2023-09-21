import { ProductsDao } from "./mannagers/mongo/productsMongo.js";
import { CartsDao } from "./mannagers/mongo/cartsMongo.js";
import { UsersDao } from "./mannagers/mongo/usersMongo.js";
import { connectDB } from "../config/dbConnection.js"

connectDB()

const productService = new ProductsDao();
const cartService = new CartsDao()
const userService = new UsersDao()

export {productService, cartService, userService}