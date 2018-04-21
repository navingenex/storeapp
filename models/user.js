const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const User = module.exports = mongoose.model('User', userSchema);


//get user by id
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

//signup
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

//find by username
module.exports.getUserByUserName = function (username, callback) {
    const query = { username: username };
    User.findOne(query, callback);
}

//compare passwort to hash password
module.exports.comparePassword=function(candicatePassword,hash,callback){
    bcrypt.compare(candicatePassword,hash,(err,isMatch)=>{
        if(err) throw err
        callback(null,isMatch);
    });
}