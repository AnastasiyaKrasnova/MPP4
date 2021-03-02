const jwt=require('jsonwebtoken');
var cookie = require('cookie');


/*exports.verifyToken=function(req,res,next){
    const token = req.cookies['auth-token'];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
       
    try{
        const verified=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verified;
        console.log(verified)
        next();

    }catch(err){
        res.status(401).send("Invalid token");
    }
}*/

exports.wsTokenVerify=function(socket,packet,next) {

    if (packet[0]=="login" || packet[0]=="register"){
        next()
    }
    else{
        if (socket.request.headers.cookie){
            console.log(socket.request.headers.cookie)
            const cookie_token = socket.request.headers.cookie;
            const token=cookie.parse(cookie_token)['auth-token']
            console.log(token)
            if (!token) {
                next(new Error("Unauthorized"))
            }
            try{
                const verified=jwt.verify(token,process.env.TOKEN_SECRET);
                console.log(verified)
                next();
            }catch(err){
                next(new Error("Unauthorized"))
            } 
        }
        else{
            next(new Error("Unauthorized")) 
        }
    }
}