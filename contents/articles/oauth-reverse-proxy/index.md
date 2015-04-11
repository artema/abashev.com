---
title: "OAuth 1 Reverse proxy"
author: Artem Abashev
date: 2014-08-02
template: article.jade
---

One of the most common tasks when developing a rich web application with JavaScript or Flash is data access and authentication. The workflow is usually straightforward when you have control over the API, but things can get pretty complicated when you need to work with a 3rd-party service directly from the client side.

For example, when you need to write a JavaScript application that works with the Twitter API, one of the first obstacles that you encounter is storing the API credentials on the client. Exposing OAuth access keys on a web client is a major security flaw. JavaScript does not provide any secure storage option such as [DPAPI](http://en.wikipedia.org/wiki/Data_Protection_API), so any client-side cryptography that does not involve a server-side processing is as secure as storing the data in plaintext.

Another issue worth mentioning is cross-domain requests. By default, such requests are prohibited due to the same-origin policy. So unless the API you need to use allows cross-domain requests, you need to setup a proxy on your server.

## Solution

One of the possible ways to counter those issues is to let the server handle credentials and do the OAuth request signing. This way the client application has no access to OAuth consumer and access token key pairs. This is were the [OAuth Reverse proxy](https://github.com/artema/oauth-reverse-proxy) comes in handy.

OAuth Reverse proxy is a Node.js Express/Connect middleware for reverse proxying OAuth 1 web services. It signs all incoming requests with an OAuth Authorization header and performs a request proxying to the requested API URL.

## Getting Started

`npm install oauth-reverse-proxy`

A typical middleware configuration looks like this:

```javascript
var app = require('express')();
var when = require('when');

app.use(require('oauth-reverse-proxy').oauth1({
  endpoint: '/api/',
  target: 'https://api.twitter.com/1.1/',
  provider: function(req) {
    return when({
      consumerKey: 'active-consumer-key',
      consumerSecret: 'active-consumer-secret',
      tokenKey: 'active-access-token',
      tokenSecret: 'active-access-token-secret'
    });
  }
}));
```

The most interesting part here is the `provider` function. It is invoked for every `/api/*` request to get the OAuth credentials of the active user. This is where you match a session cookie or any other user authentication data with the user's OAuth credentials. In case a user is not authenticated, the provider should return `null` to trigger the HTTP 401 error. To make a unauthorized API request, it needs to return an empty object promise (`{}`)

The proxy trims a request'a URL `endpoint` part and replaces it with the `target` API URL. So when you make a `GET /api/statuses/user_timeline.json` request to your website, the actual API request URL would be `/1.1/statuses/user_timeline.json`.

By default, all cookies will be removed from the API requests. To keep cookies and to pass them with an API request, you can use the `keepCookies` option.

## Conclusion

I've been using this solution in production in two projects for a few months now, so I'm considering it stable. Any comments, bug reports and suggestions are highly appreciated.
