---
title: "FlashWarp: a Flash-JavaScript bridge library"
author: me
date: 2014-03-30
template: article.jade
---

[FlashWarp](https://github.com/artema/FlashWarp) is a library that makes JavaScript-Flash interaction easy and powerful. In addition to generic [ExternalInterface](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html) features, it allows to define two-way bindings between Flash and JavaScript.

## Browser Support

The library has the same requirements as the `ExternalInterface`, which are either [ActiveX](http://en.wikipedia.org/wiki/ActiveX) or [NPAPI](http://en.wikipedia.org/wiki/NPAPI) support, so almost any browser with Flash should be enough. A Flash movie should be embedded with an appropriate `allowScriptAccess` value for this library to work.

It can be used with any Flex or ActionScript project, including the binding support.

## Binaries

Pre-built binaries are available via [Bower](http://bower.io/):

	bower install FlashWarp

or can be [downloaded from github](https://github.com/artema/FlashWarp/releases).

## Flash Usage

Include `FlashWarp.swc` to your project and define the bindings when your application starts:

```actionscript
//Don't forget to make the binding field bindable to,
//so that it can be used in a binding chain in MXML code
[Bindable] private var binding:IObservable;

private function initializeHandler(event:FlexEvent):void
{
	//Define a procedure named "hello" with a single argument
	//It can be called from JavaScript
	FlashWarp.map("hello", function(text:String):void{
		Alert.show(text, "Message from HTML");
	});

	//Call the "hello" procedure,
	//defined on the JavaScript side of the bridge
	FlashWarp.invoke("hello", [ "Message from Flash" ]);

	//Create a binding named "textfield"
	binding = FlashWarp.binding("textfield");
}
```

You change a binding value mainually:

	binding.value = "Hello World";

or it can be attached to a component:

	<s:TextInput text="@{binding.value}" />

## JavaScript Usage

Include `flashwarp.min.js` and define the bindings after your SWF file is embedded into the page:

```actionscript
//Get the Flash object by ID
var warp = $FlashWarp("FlashContent");

  //Call the "hello" procedure in Flash
  warp.invoke("hello", "Message from JavaScript");

  //Handle incoming Flash calls
  warp.map("hello", function(message) {
  	alert("Message from Flash: " + message);
  });

  //Subscribe for binding changes
  warp.binding("textfield").addListener(function (value) {
	alert('Binding value has changed to ' + value);
});

//Binding values can also be updated manually
warp.binding("textfield").setValue("New value");
```

## Performance and Limitations

Marshalling is built on XML, so it can be slow when you need to pass complex object or long arrays. Since all procedure calls, including the binding, are synchronous, it would hang the whole web page.

You can find the list of supported data types in [Flash documentation here](http://help.adobe.com/en_US/as3/dev/WS5b3ccc516d4fbf351e63e3d118a9b90204-7cb2.html#WS5b3ccc516d4fbf351e63e3d118a9b90204-7caf).
