import axios from 'axios';
import {apiPrefix} from '../../api_config.json';
import {socket} from '../components/App.jsx';
const SocketIOFileUpload = require('socketio-file-upload');

export default {
     async loadTasks() {
        return new Promise((resolve, reject) =>{
            socket.emit("load_tasks", function (data) {
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    createTask(note) {

        return new Promise((resolve, reject) =>{
            socket.emit("create_task", note, function (data) {
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    async deleteTask(id) {
        return new Promise((resolve, reject) =>{
            socket.emit("delete_task", id, function (data) {
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    filterTask(status){
        return new Promise((resolve, reject) =>{
            socket.emit("filter_tasks", status, function (data) {
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    updateTask(note){

        return new Promise((resolve, reject) =>{
            socket.emit("update_task", note, function (data) {
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    uploadFile(files, id){
        return new Promise((resolve, reject) =>{
            socket.emit("upload_files", id, function (data) {
                var uploader = new SocketIOFileUpload(socket);
                uploader.submitFiles(files)
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });
        })
    },

    downloadFile(filename,id){
        return new Promise((resolve, reject) =>{
            socket.emit("download_file", {filename: filename, id: id}, function (data) {
                if (data.statusCode==500){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    deleteFile(filename,id){
        return new Promise((resolve, reject) =>{
            socket.emit("delete_file", {filename: filename, id: id}, function (data) {
                if (data.statusCode==500){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    login(user){
        return new Promise((resolve, reject) =>{
            socket.emit("login", user, function (data) {
                if (data.statusCode==401){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    reconnect(){
        socket.close()
        socket.open()
    },


    register(user){
        return new Promise((resolve, reject) =>{
            socket.emit("register", user, function (data) {
                if (data.statusCode==406){
                    console.log(data.msg);
                    reject(data)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    }

}