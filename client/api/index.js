import axios from 'axios';
import {apiPrefix} from '../../api_config.json';
import {socket} from '../components/App.jsx';

export default {
     async loadTasks() {
        return new Promise((resolve, reject) =>{
            socket.emit("load_tasks", function (data) {
                if (data.statusCode==400){
                    console.log(data.msg);
                    reject(data.statusCode)
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
                    reject(data.statusCode)
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
                    reject(data.statusCode)
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
                    reject(data.statusCode)
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
                    reject(data.statusCode)
                }
                if (data.statusCode==200){
                    resolve(data.result)
                }
              });  
        })
    },

    uploadFile(formData,id){
            return axios.post(`${apiPrefix}/tasks/files?id=${id}`, formData);
    },

    downloadFile(filename,id){
        return axios.post(`${apiPrefix}/tasks/download?filename=${filename}&id=${id}`);
    },

    deleteFile(filename,id){
        return axios.delete(`${apiPrefix}/tasks/files?filename=${filename}&id=${id}`);
    },

    login(user){
        return axios.post(`${apiPrefix}/login`,user);
    },

    register(user){
        return axios.post(`${apiPrefix}/register`,user);
    }

}