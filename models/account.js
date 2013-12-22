var mongoose = require('mongoose'),
    _ = require('underscore')._,
    Schema = mongoose.Schema,
    path = require('path'),
    config = require(path.join(__dirname, '..', '/config/config.js')),
    passportLocalMongoose = require('passport-local-mongoose'),
    crypto = require('crypto');
    jwt = require('jwt-simple'),
    tokenSecret = 'put-a-$Ecr3t-h3re';

var Token = new Schema({
    token: {type: String},
    date_created: {type: Date, default: Date.now},
});
Token.methods.hasExpired= function(){
    var now = new Date();
    return (now.getTime() - this.date_created.getTime()) > config.ttl;
};
var TokenModel = mongoose.model('Token', Token);

var Account = new Schema({
    //TODO: fname, lname, phone, notifications, friends, etc.
    birthdate: Date,
    email: { type: String, required: true, lowercase:true, index: { unique: true } },
    full_name: {type: String, required: true},//TODO: break out first / last names
    date_created: {type: Date, default: Date.now},
    token: {type: Object},
    //For reset we use a reset token with an expiry (which must be checked)
    reset_token: {type: String},
    reset_token_expires_millis: {type: Number}
});
Account.plugin(passportLocalMongoose, {usernameField: 'email'});

Account.statics.encode = function(data) {
    return jwt.encode(data, tokenSecret);
};
Account.statics.decode = function(data) {
    return jwt.decode(data, tokenSecret);
};
Account.statics.findUser = function(email, token, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
        } else if (token === usr.token.token) {
            cb(false, {email: usr.email, token: usr.token, date_created: usr.date_created, full_name: usr.full_name});
        } else {
            cb(new Error('Token does not match.'), null);
        }
    });
};

Account.statics.findUserByEmailOnly = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
        } else {
            cb(false, usr);
        }
    });
};
Account.statics.createUserToken = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            console.log('err');
        }
        //Create a token and add to user and save
        var token = self.encode({email: email});
        usr.token = new TokenModel({token:token});
        usr.save(function(err, usr) {
            if (err) {
                cb(err, null);
            } else {
                console.log("about to cb with usr.token.token: " + usr.token.token);
                cb(false, usr.token.token);//token object, in turn, has a token property :)
            }
        });
    });
};

Account.statics.generateResetToken = function(email, cb) {
    console.log("in generateResetToken....");
    this.findUserByEmailOnly(email, function(err, user) {
        if (err) {
            cb(err, null);
        } else if (user) {
            //Generate reset token and URL link; also, create expiry for reset token
            user.reset_token = require('crypto').randomBytes(32).toString('hex');
            var now = new Date();
            var expires = new Date(now.getTime() + (config.resetTokenExpiresMinutes * 60 * 1000)).getTime();
            user.reset_token_expires_millis = expires;
            user.save();
            cb(false, user);
        } else {
            //TODO: This is not really robust and we should probably return an error code or something here
            cb(new Error('No user with that email found.'), null);
        }
    });
};

module.exports = mongoose.model('Account', Account);
