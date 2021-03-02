//const router=require('express').Router();
const jwt=require('jsonwebtoken');
const User=require('../controllers/users');


/*router.post('/register', async (req,res)=>{
     const saved=await User.register(req.body);
     if (saved==0)
          res.status(406).send('User data is not full');
     else if (saved==1){
          res.status(406).send('User already exists');
     }
     else
          res.status(200).send({id:saved.id});
});


router.post('/login', async (req,res)=>{
     console.log(req.body);
     const valid=await User.login(req.body);
     if (valid){
          const token=jwt.sign({_id: valid.id},process.env.TOKEN_SECRET)
          res.cookie("auth-token", token,{httpOnly: true, maxAge: 11000000}).send(token);
     }   
     else
          res.status(401).send('Email or password is incorrect');
});




module.exports=router;*/

exports.login=(socket)=>{

     socket.on("login", function (user, callback) {
          console.log("login")
          User.login(user)
          .then((valid)=>{
               if (valid){
                    const token=jwt.sign({_id: valid.id},process.env.TOKEN_SECRET)
                    callback({statusCode:200, result:token});
               }   
               else
                    callback({statusCode:401, msg:'Email or password is incorrect'});
          })
     })
}

exports.register=(socket)=>{

     socket.on("register", function (user, callback) {
          console.log("register")
          User.register(user)
          .then((saved)=>{
               if (saved==0)
                    callback({statusCode:406, msg:'User data is not full'});
               else if (saved==1){
                    callback({statusCode:406, msg:'User already exists'});
               }
               else
                    callback({statusCode:200, result:saved.id});
               })
          })
}

exports.unauthorized=(socket)=>{
     socket.on("error", (err) => {
          console.log(err.message)
          socket.emit("auth", {statusCode: 401, msg: err.message});  
     })
}