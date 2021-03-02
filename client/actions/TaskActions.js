import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/AppConstants';

import api from '../api';
import download from 'js-file-download';
import {Cookies} from "react-cookie";

const TaskActions = {
    loadTasks() {
        AppDispatcher.dispatch({
            type: Constants.LOAD_TASKS_REQUEST
        });

        api.loadTasks()
        .then((data) =>{
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_SUCCESS,
                tasks: data
            })
        }
        )
        .catch((err) =>{
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        }
            
        );
    },

    createTask(note) {
        var files=note.file
        note.file=[]
        api.createTask(note)
        .then((res)=>{
            this.uploadFile(files,res._id)
            this.loadTasks()
        }).catch(err =>  
            AppDispatcher.dispatch({
            type: Constants.LOAD_TASKS_FAIL,
            error: err
        }))
    },

    uploadFile(files,id){
        api.uploadFile(files,id)
        .then(()=>{
            console.log("Start file loading")
        }).catch(err =>  
            AppDispatcher.dispatch({
            type: Constants.LOAD_TASKS_FAIL,
            error: err
        }))
    },

    deleteTask(noteId) {
        api.deleteTask(noteId)
        .then(() =>
            this.loadTasks()
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        );
    },

    updateTask(note) {
        var files=note.file
        note.file=[]
        api.updateTask(note)
        .then(() =>{
            this.uploadFile(files,note.id)
            this.loadTasks()
        })
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        );

    },

    filterTask(status){

        AppDispatcher.dispatch({
            type: Constants.LOAD_TASKS_REQUEST
        });

        api.filterTask(status)
        .then((data) =>{
            console.log("Filtered:", data)
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_SUCCESS,
                tasks: data
            })
        })
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        );
    },

    downloadFile(filename,id){
        api.downloadFile(filename,id)
        .then((res) => {
            download(res, filename);
        })
        .catch(err => {
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        });
    },

    deleteFile(filename,id){
        api.deleteFile(filename,id)
        .catch(err => {
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        });
    },

    login(user){
        api.login(user)
        .then((res) =>{
            const cookies = new Cookies();
            cookies.set('auth-token', res, {maxAge: 100});
            api.reconnect()
            this.loadTasks()
        }
        )
        .catch(err => {
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        });
    },

    register(user){
        api.register(user)
        .then(() =>
        this.loadTasks()
        )
        .catch(err => {
            AppDispatcher.dispatch({
                type: Constants.LOAD_TASKS_FAIL,
                error: err
            })
        });
    }, 

    authError(err){
        AppDispatcher.dispatch({
            type: Constants.LOAD_TASKS_FAIL,
            error: err
        })
    }
};

export default TaskActions;