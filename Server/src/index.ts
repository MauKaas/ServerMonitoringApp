import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import cors from "cors"
import { disconnect } from "cluster";

const app = express();
app.use(cors())

const server = createServer(app)
const io = new Server(server, {cors: {origin: "http://localhost:5173"}})

const metric = new Map()

io.on("connection", (socket) => {
    const agentHostName = socket.handshake.query.id as string;
    console.log ("Client Connected: " + socket.id)

    socket.on("metrics", (data) => {
        console.log("Received: " + data.hostname + data.cpu )
        metric.set(data.hostname, data)

        io.emit("update", data)
    })

    socket.on("getData", () => {
        socket.emit("allData", Array.from(metric.values()))
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected:" + socket.id)
        io.emit("status", { status: false, agentHostName: agentHostName })
    })
})

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})