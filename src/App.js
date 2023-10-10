import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import mainRouter from './routes/index.js';
import socketProduct from './utils/socketProducts.js';
import socketChat from './utils/socketChat.js';
import { initPassport, initPassportGithub } from './config/passport.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT;

const httpServer = app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT);
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

initPassport();
initPassportGithub();
app.use(passport.initialize());

app.use(mainRouter);

const io = new Server(httpServer);
socketProduct(io);
socketChat(io);
