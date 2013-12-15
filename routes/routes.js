var path = require('path'),
    config = require(path.join(__dirname, '..', '/config/config.js')),
    Account = require(path.join(__dirname, '..', '/models/account')),
    flash = require(path.join(__dirname, '..', '/include/utils')).flash;

module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/register', function(req, res) {
        res.render('register', {info: null, err: null});
    });

    app.post('/register', function(req, res) {
        // console.log(req.body);
        Account.register(new Account({ full_name: req.body.fullname, email: req.body.email}), req.body.password, function(err, account) {
            if (err) {
                if (err.name === 'BadRequestError' && err.message && err.message.indexOf('exists') > -1) {
                    return res.render("register", flash(null, "Sorry. That email already exists. Try again."));
                } else if (err.name === 'BadRequestError' && err.message && err.message.indexOf('argument not set')) {
                    return res.render("register", flash (null, "It looks like you're missing a required argument. Try again."));
                } else {
                    return res.render("register", flash(null, "Sorry. There was an error processing your request. Please try again or contact technical support."));
                }
            }
            //Successfully registered user
            res.redirect('login?registered=1');
        });
    });

    app.get('/login', function(req, res) {
        var messages = flash(null, null);
        if (req.param("registered") === '1') {
            messages = flash("Congratulations, your account was created!", null);
        }
        res.render('login', messages);
    });

    app.post('/token/', passport.authenticate('local', {session: false}), function(req, res) {
        if (req.user) {
            Account.createUserToken(req.user.email, function(err, usersToken) {
                // console.log('token generated: ' +usersToken);
                // console.log(err);
                if (err) {
                    res.json({error: 'Issue generating token'});
                } else {
                    res.json({token : usersToken});
                }
            });
        } else {
            res.json({error: 'AuthError'});
        }
    });

    app.get('/apitest/', function(req, res) {
        var incomingToken = req.headers.token;
        console.log("incomingToken: " + incomingToken);
        var decoded = Account.decode(incomingToken);
        //Now do a lookup on that email in mongodb ... if exists it's a real user
        if (decoded && decoded.email) {
            Account.findUser(decoded.email, incomingToken, function(err, user) {
                if (err) {
                    console.log(err);
                    res.json({error: 'Issue finding user.'});
                } else {
                    res.json({
                        user: {
                            email: user.email,
                            full_name: user.full_name,
                            token: user.token.token
                        }
                    });
                }
            });
        } else {
            console.log("Whoa! Couldn't even decode incoming token!");
            res.json({error: 'Issue decoding incoming token.'});
        }
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/ping', function(req, res){
        res.send("pong!", 200);
    });
};
