const mongoose              = require('mongoose'),
passportLocalMongoose       = require('passport-local-mongoose'),
Schema                      = mongoose.Schema;

//create user schema
var userSchema = new Schema({
    username:String,
    Password:String
})


//Give schema access to passport-local-mongoose methods
userSchema.plugin(passportLocalMongoose);

//create user model
module.exports = mongoose.model("User",userSchema);
