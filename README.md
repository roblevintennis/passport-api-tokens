# REST API Tokens With Passport.js and jwt-simple

- Demonstrates how to use auth token to Node.js with Passport.js and jwt-simple which is useful for building a token-based REST API.

Install
=======

    git clone <REPO>
    cd passport-jwt
    npm install
    git submodule init && git submodule update
    npm install -g mongodb
    mongod #start up mongodb (do this in another terminal tab)
    node app
    open http://localhost:1337/
    Go to Register. Create user.
    Go to Login and enter user's email/pass
    Click Test Token button and view user returned in console

Tests
=====

    make test #to run the test

Background
==========

This is an adaptation of Michael Herman's http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/ tutorial where he shows an example of using passport-local with an expressjs stack to do local user/password style authentication. I had a need to do API token based authentication where you, essentially:
1. register
2. login
3. get an API token
4. make subsequent ajax http requests to your REST API using the token

Disclaimer
==========

I feel the need to mention that my background is as a front-end developer with some full stack. I've built similar API's but there are many others that would be more qualified to do this and security, etc., are "hard". If you see a mistake and/or something that could be better feel free to contribute back or create an issue. Thanks!

References
==========
    http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/
    https://github.com/jaredhanson/passport-local
    http://stackoverflow.com/questions/20228572/passport-local-with-node-jwt-simple
    http://coderead.wordpress.com/2012/08/16/securing-node-js-restful-services-with-jwt-tokens/

Contributing
============

github "Fork and Pull Request" model

