const express = require('express')
const app = express()
const http = require("http")
const cors = require('cors')
const { Server } = require("socket.io")

const PORT = process.env.PORT || 3001

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://ticket-attention.vercel.app/",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on("send_remove_ticket", (data) =>{
        console.log('send_remove_ticket',data)
        socket.to('SNHD').emit("recive_remove_ticket", data)
    })





    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User ID: ${socket.id} joined to: ${data}`)
    })

    socket.on("send_message", (data) =>{
        console.log('send_message',data)
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", () => {
        console.log('User disconnected', socket.id)
    })
})

app.get('/', (req, res) => {
    res.send('hola')
})

server.listen(PORT, () => {
    console.log('SERVER RUNNING IN PORT: ', PORT)
})