---
title: "How to build Flex projects with Grunt"
author: Artem Abashev
date: 2014-03-25
template: article.jade
---

With the decline of Flash in the web, sometimes it can be hard to find the tools for it in modern platforms, such as Node. That happened with me when I was preparing a Grunt build script for [FlashWarp](https://github.com/artema/FlashWarp) and discovered that there is no Node package for building Flash SWC libraries. And so I made it myself - [grunt-compc](https://github.com/artema/grunt-compc), a Grunt plugin that can build SWC files with the `compc` compiler from the Flex SDK. It depends on [node-flex-sdk](https://github.com/JamesMGreene/node-flex-sdk), so you can use it alongside with [grunt-mxmlc](https://github.com/JamesMGreene/grunt-mxmlc), [grunt-asdoc](https://github.com/JamesMGreene/grunt-asdoc) and other Flash tools for Node out there.

## Installing Flash tools

The first thing to do to make your Grunt project Flash-enabled is to install the Flex SDK:

	npm install flex-sdk@4.6.0 --save-dev

You can find the complete list of available SDK versions [here](https://github.com/JamesMGreene/node-flex-sdk/blob/master/FlexSDKs.md).

The next thing to do is to install packages that provide wrappers for Flash compilers:

  npm install grunt-mxmlc --save-dev
  npm install grunt-compc --save-dev

And you are ready to go.

## Configuring Grunt

Let's assume that your Flex project consists of two parts: a library and a Flex app. In this case, your Grunt code for building that application could look like this:

```javascript
compc: {
    compc: {
        src: ['lib/src/**/*.as', 'lib/src/**/*.mxml'],
        dest: 'lib/bin/example-lib.swc',
        options: {
            'source-path': ['lib/src/']
        }
    }
},

mxmlc: {
    options: {
        rawConfig: '-library-path+=lib/bin'
    },
    mxmlc: {
        files: {
            'app/bin-release/app.swf': ['app/src/**/*.as', 'app/src/**/*.mxml']
        }
    }
}
```

You can find the [complete example project here](https://github.com/artema/grunt-flash-example).
