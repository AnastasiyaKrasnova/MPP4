const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookies = require("cookie-parser");
const socketIo =require("socket.io")
const http=require("http")
var siofu = require("socketio-file-upload")
const {serverPort} =require('../api_config.json');
const Auth=require('../server/middleware/verifyToken')

global.appRoot = path.resolve(__dirname);

const app=express();

app.use(cors())
app.use(express.json());
app.use(fileUpload());
app.use(cookies());
app.use(siofu.router)
app.use("/static", express.static("public/build"));


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

app.get('/',(req, res) => {
    res.sendFile("index.html", {root: path.join(global.appRoot, "../public/build")});
});

io.on("connection", socket => {
    console.log("New client connected");
    socket.use((packet,next) => {
       Auth.wsTokenVerify(socket,packet,next)
    })
    addListeners(socket)
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(serverPort, ()=>console.log('Server is running'));

function addListeners(socket) {
    users.login(socket)
    users.register(socket)
    users.unauthorized(socket)
    tasks.load_Tasks(socket)
    tasks.delete_Task(socket)
    tasks.create_Task(socket)
    tasks.update_Task(socket)
    tasks.filter_Tasks(socket)
    var uploader = new siofu();
    uploader.listen(socket); 
    tasks.upload_File(socket,uploader)
    tasks.download_File(socket)
    tasks.delete_File(socket)
}