const router=require('express').Router();
const Task=require('../controllers/tasks');
const fs = require('fs');
const path = require('path');
var siofu = require("socketio-file-upload")
const Auth=require('../middleware/verifyToken')


/*router.post('/tasks', auth, async (req,res)=>{
    const saved=await Task.add(req.body);
   if (saved)
        res.status(200).send(saved);
   else
        res.status(400).send('json data is incorrect');
});

router.post('/tasks/files', auth, async (req,res)=>{
     console.log(req.files)
     if (!req.files) {
          return res.status(500).send({ msg: "file is not found" })
      }
      const dir=`${global.appRoot}/public/${req.query.id}`
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      const myFile = req.files.file;
      myFile.mv(`${dir}/${myFile.name}`, function (err) {
          if (err) {
              console.log(err)
              return res.status(500).send({ msg: "Error occured" });
          }
          return res.send({name: myFile.name, path: `/${myFile.name}`});
      });
});

router.delete('/tasks/files',auth, async (req,res)=>{
     const dir=`${global.appRoot}/public/${req.query.id}`
     let filePath = path.resolve(`${dir}/${req.query.filename}`);
     fs.unlinkSync(filePath, (err) => {
          if (err){
               console.log(err);
               return res.status(500).send({ msg: "file is not found" })
          }
     });
     res.status(200).send('deleted');
});

router.post('/tasks/download',auth, async(req, res) => {

     const dir=`${global.appRoot}/public/${req.query.id}`
     let filePath = path.resolve(`${dir}/${req.query.filename}`);
     res.download(filePath, (err) => {
          if (err){
               console.log(err);
               return res.status(500).send({ msg: "file is not found" })
          }
     });
});


router.get('/tasks', auth ,async (req,res)=>{

     if (!req.query.status){
          const saved=await Task.listAll();
          if (saved)
               res.status(200).send(saved);
          else
               res.status(400).send('DB error while getting list of tasks');
     }
     else{
          const saved=await Task.filterByStatus(req.query.status);
          if (saved)
               res.status(200).send(saved);
          else
               res.status(400).send('DB error while getting list of tasks by tasks');
     }
     
 });

router.put('/tasks', auth, async (req,res)=>{

     console.log(req.body)
     const saved=await Task.update(req.body);
    if (saved){
          res.status(200).send(saved);
    }     
    else
         res.status(400).send('DB error while updating date');
 });

router.delete('/tasks', auth, async (req,res)=>{

     const dir=`${global.appRoot}/public/${req.query.id}`
     fs.rmdir(dir, { recursive: true }, (err) => {
          if (err) console.log(err)})
     const saved=await Task.delete(req.query.id);
     if (saved)
         res.status(200).send(saved);
     else
         res.status(400).send('DB error while deleting task');
 });


module.exports=router;*/

exports.load_Tasks=(socket)=>{
     socket.on("load_tasks", function (callback) {
          console.log("Got It")
          Task.listAll()
          .then((saved)=>{
               if (!saved) {
                    callback({statusCode:'400', msg:'DB error while getting list of tasks'});
                    return;
               }
               else{
                    callback({statusCode:'200', result:saved});
               }
          })
     })
}

exports.filter_Tasks=(socket)=>{

     socket.on("filter_tasks", function (status, callback) {
          console.log("Filter")
          Task.filterByStatus(status)
          .then((saved)=>{
               if (!saved) {
                    callback({statusCode:'400', msg:'DB error while getting list of tasks by tasks'});
                    return;
               }
               else{
                    callback({statusCode:'200', result:saved});
               }
          })
     })
}

exports.delete_Task=(socket)=>{

     socket.on("delete_task", function (id, callback) {
          console.log(id)
          const dir=`${global.appRoot}/public/${id}`
          fs.rmdir(dir, { recursive: true }, (err) => {
               if (err) console.log(err)})
          Task.delete(id)
          .then((saved)=>{
               if (!saved) {
                    callback({statusCode:'400', msg:'DB error while deleting task'});
                    return;
               }
               else{
                    callback({statusCode:'200', result:saved});
               }
          })
     })
}

exports.create_Task=(socket)=>{

     socket.on("create_task", function (note, callback) {
          console.log("Creating")
          Task.add(note)
          .then((saved)=>{
               if (!saved) {
                    callback({statusCode:'400', msg:'json data is incorrect'});
                    return;
               }
               else{
                    callback({statusCode:'200', result:saved});
               }
          })
     })
}

exports.update_Task=(socket)=>{

     socket.on("update_task", function (note, callback) {
          console.log("Update")
          Task.update(note)
          .then((saved)=>{
               if (!saved) {
                    callback({statusCode:'400', msg:'DB error while updating date'});
                    return;
               }
               else{
                    callback({statusCode:'200', result:saved});
               }
          })
     })
}

exports.upload_File=(socket, uploader)=>{

     socket.on("upload_files", function (id, callback) {
          try{
               const dir=`${global.appRoot}/public/${id}`
               if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
               }
               uploader.dir = dir;
               callback({statusCode:'200', result: true});
          }
          catch{
               callback({statusCode:'400', msg:'Error on file uploading'});
          }
          
     })
}

exports.download_File=(socket)=>{
     socket.on("download_file", function(file_data, callback){
          const dir=`${global.appRoot}/public/${file_data.id}`
          let filePath = path.resolve(`${dir}/${file_data.filename}`);
          console.log("Download")
          fs.readFile(filePath, function(err, buf){
               if (!err){
                    callback({statusCode:'200', result: buf});
               }
               else{
                    callback({statusCode:'500', msg:'File not found'});
               }
          });
     })   
}

exports.delete_File=(socket)=>{
     socket.on("delete_file", function(file_data, callback){
          const dir=`${global.appRoot}/public/${file_data.id}`
          let filePath = path.resolve(`${dir}/${file_data.filename}`);
          fs.unlinkSync(filePath, (err) => {
               if (err){
                    console.log(err);
                    callback({statusCode:'500', msg:'File not found'});
               }    
          });
          callback({statusCode:'200', result: true});
     }) 
     
}