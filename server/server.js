import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import{Server} from 'socket.io';

//create express app  and HTTP server

const app = express();
const server = http.createServer(app);//socket.io support http server

// Initialize socket. io server
export const io = new Server(server,{
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
});

// Store online users
export const userSocketMap = {};  //{ userId: socket.id }
// Socket. io connection handler
io.on("connection", (socket) => {
    // { userId: socket.id }
    const userId = socket.handshake.query.userId;
    console.log("User Connected:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //disconnect event

   socket.on("disconnect", () => {
       console.log("User Disconnected:", userId);
       delete userSocketMap[userId];
       io.emit("getOnlineUsers", Object.keys(userSocketMap));
   });
});

//middleware
app.use(cors());
app.use(express.json({ limit: '4mb' })); // to support JSON-encoded bodies

//Routes setup

app.use("/api/status", (req, res) => {
    res.json("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to database

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});