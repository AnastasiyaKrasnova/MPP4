const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookies = require("cookie-parser");
const socketIo =require("socket.io")
const http=require("http")
const {serverPort} =require('../api_config.json');

global.appRoot = path.resolve(__dirname);

const app=express();
const server = http.createServer(app);
const io = socketIo(server);

const tasks=require('./routes/tasks');
const users=require('./routes/users');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    ()=>{
        console.log('connected to db');
        mongoose.set('useFindAndModify', false);
    }
);

app.use(cors())
app.use(express.json());
app.use(fileUpload());
app.use(cookies());

app.use("/static", express.static("public/build"));
app.get('/',(req, res) => {
    res.sendFile("index.html", {root: path.join(global.appRoot, "../public/build")});
});

io.on("connection", socket => {
    console.log("New client connected");
    tasks.load_Tasks(socket)
    tasks.delete_Task(socket)
    tasks.create_Task(socket)
    tasks.update_Task(socket)
    tasks.filter_Tasks(socket)
    socket.on("disconnect", () => console.log("Client disconnected"));
});




server.listen(serverPort, ()=>console.log('Server is running'));

