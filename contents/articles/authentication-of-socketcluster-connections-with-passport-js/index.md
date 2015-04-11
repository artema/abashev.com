---
title: "Authentication of SocketCluster connections with Passport.js"
author: Artem Abashev
date: 2015-01-03
template: article.jade
---

[Passport.SocketCluster](https://github.com/artema/passport.socketcluster) is a SocketCluster middleware that can be used to authenticate socket connections with [Passport.js](http://passportjs.org/).

## Installation

		npm install passport.socketcluster

## How it works

It plugs into the socket handshake process and parses your Express session cookie associated with the request. If the authentication was successful, you will receive a Passport user object that you can store in a SocketCluster socket session or any other store for later use.

## Usage

```javascript
//worker.js

var session = require('express-session'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    passportSocketCluster = require('passport.socketcluster'),
    RedisStore = require('connect-redis')(session);

module.exports.run = function(worker) {
  var app = express(),
      store = new RedisStore(),
      cookieKey = 'session',
      cookieSecret = 'keyboard cat';

  var server = worker.getHTTPServer(),
      sc = worker.getSCServer();

  server.on('req', app);

  app.use(session({
    name:     cookieKey,
    secret:   cookieSecret,
    store:    store
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  //Handshake authentication
  sc.addMiddleware(sc.MIDDLEWARE_HANDSHAKE, passportSocketCluster.handshake({
    cookieParser:cookieParser, //Cookie parser
    key:         cookieKey, //Express session cookie name
    secret:      cookieSecret, //Express session cookie secret
    store:       store, //User store
    passport:    passport, //Passport reference
    //Callback function. You will get an `err` in case
    //of user authentication failure or a `user` object
    //if a user was authenticated.
    //`next` is a callback function that
    //should be called both in case of failure
    //and success. You should pass and error or
    //no argument in case of sucessfull authentication
    callback:    function(err, req, user, next) {
      if (err) {
        return next(err);
      }
      //Save Passport user in the session store for later use
      req.session.set('user', user, next);
    }
  }));
};
```

You can later retrieve a user object in your socket server code this way:

```javascript
module.exports = function(worker) {
	var sc = worker.getSCServer();

	sc.on('connection', function(socket) {
		var user;
	  socket.session.get('user', function(err, value) {
	  	user = value;
	  	console.log('User connected: ' + user);
	  });

	  socket.on('disconnect', function() {
	  	console.log('User disconnected: ' + user);
	  });
	});
};
```
