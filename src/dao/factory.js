import {mongoInstance} from "../config/objectConfig.js"
import UserDaoMongo from '../dao/mongo/user.mongo.js';
import ProductDaoMongo from '../dao/mongo/product.mongo.js';
import CartDaoMongo from '../dao/mongo/cart.mongo.js';
import TicketDaoMongo from '../dao/mongo/ticket.mongo.js';
import UserDaoFile from './filesystem/user.file.js';
import ProductDaoFile from './filesystem/product.file.js';
import CartDaoFile from './filesystem/cart.file.js';

// import TicketDaoFile from '../dao/filesystem/ticket.file';

let UserDao, ProductDao, CartDao, TicketDao;

switch (process.env.PERSISTENCE) {
  case 'MONGO':
    mongoInstance();
    UserDao = UserDaoMongo;
    ProductDao = ProductDaoMongo;
    CartDao = CartDaoMongo;
    TicketDao = TicketDaoMongo;
    break;

  case 'FILE':
    UserDao = UserDaoFile;
    ProductDao = ProductDaoFile;
    CartDao = CartDaoFile;
    // TicketDao = TicketDaoFile;
    break;

  default:
    throw new Error(`Unsupported PERSISTENCE value: ${process.env.PERSISTENCE}`);
}

export{ UserDao, ProductDao, CartDao, TicketDao };
