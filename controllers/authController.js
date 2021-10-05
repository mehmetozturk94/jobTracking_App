const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { MongoExpiredSessionError } = require("mongodb");

const catchError = (err) => {
  let errors = { email: "", password: "" };
  if (err.code === 11000) {
    errors.email = "Mail exist in Database";
    return errors;
  }
  if(err.message.includes('user validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]= properties.message;
      })
  }
  if(err.message==='email-error'){
    errors.email='Wrong Email Address'
  };
  if(err.message==='password-error'){
    errors.password='Wrong Password'
  }
  return errors;
};

const maxAge=3*24*60*60*1000;
const createToken=(id)=>{
    return jwt.sign({id},'mmtoztrkJWT0T',{
    expiresIn: maxAge,
    })
}   

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt',token, {httpOnly:true,maxAge:maxAge})
    res.status(201).json(user);
  } catch (error) {
    const errors = catchError(error);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge});
    res.status(200).json({user:user._id})
  }catch{
    const errors= catchError(error);
    res.status(400).json({errors})
  }
};

module.exports.logout_get=(req,res)=>{
  res.cookie('jwt','Closed',{maxAge:1});
  res.redirect('/');
}