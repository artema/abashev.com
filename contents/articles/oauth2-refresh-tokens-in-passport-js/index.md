---
title: "OAuth2 Refresh Tokens in Passport.js"
author: Artem Abashev
date: 2015-01-01
template: article.jade
---

When using OAuth2 on the server, chances are that you will have to renew your access tokens with the OAuth2 refresh tokens workflow. **Passport.js** has several authentication strategies that handle OAuth2 authentication, but refreshing access tokens is something that you still need to do yourself manually (e.g. using [passport-oauth2-refresh strategy](https://github.com/fiznool/passport-oauth2-refresh) with a CRON job). [passport-oauth2-middleware](https://github.com/artema/passport-oauth2-middleware) automates this process and can fetch a new access token on request when an old one is about to expire.

## Setup

	npm install passport-oauth2-middleware

Consider the following example:

```javascript
var OAuth2Strategy = require('passport-oauth2'),
OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy,
passport = require('passport');

module.exports = function() {
  var refreshStrategy = new OAuth2RefreshTokenStrategy({
    refreshWindow: 10, // Time in seconds to perform a token refresh before it expires
    userProperty: 'ticket', // Active user property name to store OAuth tokens
    authenticationURL: '/login', // URL to redirect unathorized users to
    callbackParameter: 'callback' //URL query parameter name to pass a return URL
  });

  passport.use('main', refreshStrategy);  //Main authorization strategy that authenticates
                                          //user with OAuth access token
                                          //and performs a token refresh if needed

  var oauthStartegy = new OAuth2Strategy({
    authorizationURL: 'https://authserver/oauth2/auth',
    tokenURL: 'https://authserver/oauth2/token',
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    callbackURL: '/oauth/callback',
    passReqToCallback: false //Must be omitted or set to false in order to work with OAuth2RefreshTokenStrategy
  },
    refreshStrategy.getOAuth2StrategyCallback() //Create a callback for OAuth2Strategy
  );

  passport.use('oauth', oauthStartegy); //Strategy to perform regular OAuth2 code grant workflow
  refreshStrategy.useOAuth2Strategy(oauthStartegy); //Register the OAuth strategy
                                                    //to perform OAuth2 refresh token workflow
};
```

`passport-oauth2-middleware` can be used alongside with `passport-oauth2` strategy. When a request comes in and the `main` strategy is used, `OAuth2RefreshTokenStrategy` will check if the active access token is still valid and will try to renew it with an access token if needed. This process is transparent for the `OAuth2Strategy` and doesn't require any changes to your code. Access/refresh token pair will then be stored in the **Passport.js** user session. You can choose to refresh access tokens before they expire by settings the `refreshWindow` option that indicates number of seconds before a token should be refreshed prior to expiration.

Your **Express** controllers would look something like this:

```javascript
//GET /oauth
app.get('/oauth', passport.authenticate('oauth'));

//GET /oauth/callback
app.get('/oauth/callback', passport.authenticate('oauth'), function(req, res) {
  res.redirect('/profile');
});

//GET /profile
app.get('/profile',
passport.authenticate('main'), function(req, res) {
 res.render('profile_page');
});

//GET /api/data
app.get('/api/data',
passport.authenticate('main', {
  noredirect: true //Don't redirect a user to the authentication page, just show an error
}), function(req, res) {
  res.render('profile_page');
});
```

## OAuth2 password grant workflow

Another **Passport.js** OAuth workflow that [passport-oauth2-middleware](https://github.com/artema/passport-oauth2-middleware) `OAuth2RefreshTokenStrategy ` provides is OAuth2 password grant workflow. It can be used in conjunction with [passport-local](https://github.com/jaredhanson/passport-local)'s `LocalStrategy` to perform username/password authentication against an OAuth2 provider that supports it.

The configuration is similar:

```javascript
var OAuth2Strategy = require('passport-oauth2'),
    LocalStrategy = require('passport-local').Strategy,
    OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy,
    passport = require('passport');

module.exports = function(app) {
  var refreshStrategy = new OAuth2RefreshTokenStrategy({
    refreshWindow: 10,
    userProperty: 'ticket',
    authenticationURL: '/login',
    callbackParameter: 'callback'
  });

  passport.use('main', refreshStrategy);

  var oauthStartegy = new OAuth2Strategy({
    authorizationURL: 'https://authserver/oauth2/auth',
    tokenURL: 'https://authserver/oauth2/token',
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    callbackURL: '/oauth/callback',
    passReqToCallback: false
  },
    refreshStrategy.getOAuth2StrategyCallback()
  );

  refreshStrategy.useOAuth2Strategy(oauthStartegy);

  var localStrategy = new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
  },
    refreshStrategy.getLocalStrategyCallback() //Create a callback for LocalStrategy
  );

  passport.use('local', localStrategy); //Strategy to perform a username/password login
  refreshStrategy.useLocalStrategy(localStrategy); //Register the LocalStrategy
                                                   //to perform an OAuth 'password' workflow
};
```

Controllers:

```javascript
//GET /login
app.get('/login', function(req, res){
 var callback = req.query.callback || '/';

 if (req.isAuthenticated()) {
   return res.redirect(callback);
 }

 res.render('login_page');
});

//POST /login
app.post('/login', function(req, res, next) {
 var callback = req.query.callback || '/profile';

 passport.authenticate('local', function(err, user, info) {
   if (err || !user) {
     res.render('login_page', {
       error: info ? info.message : 'Unable to login.',
       username: req.body.username
     });
     return next();
   }

   req.logIn(user, function(err) {
     if (err) {
       return next(err);
     }

     return res.redirect(callback);
   });
 })(req, res, next);
});
```

Note that you still need to use `OAuth2Strategy` in order to make OAuth requests to the authentication endpoint.
