var should = require("should");
var mongoose = require('mongoose');
var Account = require("../models/account.js");
var db;

describe('Account', function() {

before(function(done) {
 db = mongoose.connect('mongodb://localhost/test');
   done();
 });

 after(function(done) {
   mongoose.connection.close()
   done();
 });

 beforeEach(function(done) {
  var account = new Account({
    full_name: 'Joe Smith',
    email: 'foo@bar.com',
    password: 'testy'
  });

  account.save(function(error) {
    if (error) console.log('error' + error.message);
    else console.log('no error');
    done();
   });
 });

 it('find a user by email', function(done) {
    Account.findOne({ email: 'foo@bar.com' }, function(err, account) {
      account.email.should.eql('foo@bar.com');
      console.log("   email: ", account.email)
      done();
    });
 });

 afterEach(function(done) {
    Account.remove({}, function() {
      done();
    });
 });

});