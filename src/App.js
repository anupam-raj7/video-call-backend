import express from "express";
import {createServer} from "node:http";

import {Server} from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";

import userRoutes from "./routes/users.routes.js";


//these 3 lines attach all the server, or These lines are written so that 
//Express and Socket.IO can both use the same HTTP server.

// socket.io ka server alag h and express ka instance ko connect karta h createserver.
const app = express();  //app ka instance create kiya.
const server = createServer(app);// app ko server se connect kar diya yaha se.
// const io = new Server(server); // new server ko server se connect kiys.
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({ limit: "40kb" })); //convert middleware convert incoming json into javascript.
app.use(express.urlencoded({ limit: "40kb", extended: true })); // ye use karte he It prevents: very large payloads accidental huge JSON basic DoS attacks

app.get("/home",(req,res)=>{
    return res.json({"hello" : "world"})  
}
);
//This runs when someone visits: http://localhost:8000/home.

app.get("/", (req, res) => {
    res.send("Backend is running successfully");
});

app.use("/api/v1/users", userRoutes);

const start = async () => {
    app.set("port", process.env.PORT || 8000);
    const connectionDb = await mongoose.connect("mongodb+srv://admin:anupam24062005@cluster0.e4mujxv.mongodb.net/?")
    console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
    
    server.listen(app.get("port"),()=>{
    console.log("Listening on Port 8000")
});
}
//An async function that starts your server

start();