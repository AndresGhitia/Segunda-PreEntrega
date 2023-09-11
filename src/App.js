import express from "express";
import { config } from "./config/config.js"
import { productsRouter } from "./routes/products.routes.js";
import { messageModel } from "./dao/models/messsages.model.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import session from "express-session"
import MongoStore from "connect-mongo"
import path from "path";
import passport from "passport";
import {initPassport, initPassportGithub} from './config/passportConfig.js'

const app = express();

const port = config.server.port;
const httpServer = app.listen(port, () => {console.log(`Server listening on port ${port}`);
});

const io = new Server(httpServer);

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.url,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 1000000,
    }),
    secret: 'prueba123',
    resave: false,
    saveUninitialized: false
}))

initPassport()
initPassportGithub()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/sessions', sessionsRouter)
app.use(viewsRouter);


io.on("connection",(socket)=>{
    console.log("Nuevo cliente conectado");

    socket.on("authenticated",async(msg)=>{
        const messages = await messageModel.find()
        socket.emit("messageHistory", messages);
        socket.broadcast.emit("newUser",msg);
    });

    socket.on("message",async (data)=>{
        console.log("data", data);
        const messageCreated = await messageModel.create(data)
        const messages = await messageModel.find()

        io.emit("messageHistory", messages);
    })
});