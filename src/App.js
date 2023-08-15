import express from "express";
import { config } from "./config/config.js"
import { productsRouter } from "./routes/products.routes.js";
import { messageModel } from "./dao/models/messsages.model.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import path from "path";

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

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(viewsRouter);


io.on("connection",(socket)=>{
    console.log("nuevo cliente conectado");

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
