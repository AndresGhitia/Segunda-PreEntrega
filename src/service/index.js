import { ProductDao } from "../dao/factory.js";
import { CartDao } from  "../dao/factory.js";
import { UserDao } from  "../dao/factory.js";
import { TicketDao } from "../dao/factory.js"
 
import CartRepository from "../repositories/cart.repository.js";
import TicketRepository from "../repositories/ticket.repositry.js";
import ProductRepository from "../repositories/product.repository.js";
import UserRepository from "../repositories/user.repository.js";

const userService = new UserRepository(new UserDao)
const productService = new ProductRepository(new ProductDao);
const cartService = new CartRepository(new CartDao)
const ticketService = new TicketRepository (new TicketDao)

export {productService, cartService, userService, ticketService}