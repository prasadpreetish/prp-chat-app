const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
app.use(cors())


const server = http.createServer(app);


const io = new Server(server,{
    cors:{
        origin:"http://192.168.85.15:3000",
        methods:["GET","POST"]
    }
})


io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log(`User with id: ${socket.id} joined room ${data}`)
    })

    socket.on("send_message",(data)=>{
        // console.log(data)
        io.to(data.room).emit("receive_message",data)
    })

    socket.on("disconnect",()=>{
        console.log(`User disconnnected`,socket.id)
    })
})

server.listen(3001,()=>{
    console.log(`Server running`)
})