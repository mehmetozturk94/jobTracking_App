const jwt = require('jsonwebtoken')

const authControl= (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,'mmtoztrkJWT0T',(err,result)=>{
            if(err){
                res.redirect('/login');
            }else{
                next();
            }
        })
    }else{
        res.redirect('/login')
    }
}

module.exports={authControl}