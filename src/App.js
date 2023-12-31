import { fileURLToPath } from 'url';
import { dirname } from 'path';

import express from 'express';

import logger, { addLogger } from './config/logger.js';
import cors from 'cors'

import { Server } from 'socket.io';
import socketProduct from './utils/socketProducts.js';
import socketChat from './utils/socketChat.js';

import mainRouter from './routes/index.js';

import handlebars from 'express-handlebars';

import passport from 'passport';
import { initPassport, initPassportGithub } from './config/passport.config.js';
import cookieParser from 'cookie-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(addLogger)

const PORT = process.env.PORT;
const ALIAS = process.env.ALIAS;

const httpServer = app.listen(PORT, () => {
  logger.info('Servidor conectado en el PUERTO: ' + PORT);
  logger.info('Conectado como: ' + ALIAS)
});

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.set('views', __dirname + '/views');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))


initPassport();
initPassportGithub();
app.use(passport.initialize());

app.use(mainRouter);

const io = new Server(httpServer);
socketProduct(io);
socketChat(io);
