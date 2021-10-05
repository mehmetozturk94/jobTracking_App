const mongoose = require('mongoose');
const {isEmail}= require('validator');
const bcrypt = require('bcrypt');

const UserSchema= new mongoose.Schema({
    email : {
        type : String,
        required : [true,'Please Enter Your Mail'],
        unique : true,
        lowercase : true,
        validate : [isEmail, 'Please Enter Valid Email']
    },
    password:{
        type : String,
        required : [true,'Please Enter Your Password'],
        minlength : 6 
    }
});

//Crypt before send password
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt)
    next()
})
UserSchema.statics.login= async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user
        }
        throw Error('Password-Error')
    }
    throw Error('Email-Error')
}
module.exports = User = mongoose.model('user',UserSchema)
