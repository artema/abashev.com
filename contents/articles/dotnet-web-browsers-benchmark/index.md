---
title: ".NET Web Browsers Benchmark"
author: Artem Abashev
date: 2014-03-14
template: article.jade
---

A web browser is an integral part of almost any kiosk application. There are several web browsers available on the .NET platform that vary in performance and supported features. To find out which implementation is best suited for my needs, I have tested all major products with several popular web browser benchmarks.

## Benchmarks

### Peacekeeper
[Peacekeeper](http://peacekeeper.futuremark.com/) is a popular online benchmark that is focused on measuring JavaScript performance. Its tests were built by profiling the code of four popular websites - YouTube, Facebook, GMail and Meebo, and analyzing the most most frequently used JavaScript functions. All tests fall into one of the following 8 categories: rendering, WebGL, HTML5 video, JavaScript web workers, 2D gaming, HTML5 canvas, data manipulation, HTML DOM operations and text parsing.

Aside from the overall score, the Peacekeeper also shows a number of tested HTML5 features that are supported by your browser.

### Browsermark 2.0

[Browsermark](http://browsermark.rightware.com/) is a web browser benchmark that has a wide range of tests. It does not only measures the JavaScript performance, but it also checks if your browser supports modern HTML and CSS features, as well as popular browser plug-ins such as Flash Player and Silverlight. There are 5 tests categories in total: CSS, DOM manipulations, 2D and 3D graphics, JavaScript performance and general HTML tests.

### Fish Bowl

* [HTML5 Fish Bowl](http://ie.microsoft.com/testdrive/performance/fishbowl/) is one of the [Internet Explorer Test Drive](http://ie.microsoft.com/testdrive/Default.html) tests by Microsoft. It is a simple tests that measures 2D performance of your browser. The result is a number of frames per second that your browser can output for a selected number of animated fish sprites on the screen. Since there is no final score for this test, I measured an average FPS count after a few seconds the test had started.

## Software

I'm going to cover only full .NET framework browsers, namely Windows Forms and WPF browsers. Mono implementations, as well as WinRT, are outside of the scope of this article.

.NET 4.5 has two built-in web browser components: `System.Windows.Forms.WebBrowser` for Windows Forms and `System.Windows.Controls.WebBrowser` for WPF applications. Both are based on the Internet Explorer that is installed on the user's machine, so the performance may vary. I'm going to use Internet Explorer 9. It also worth mentioning that by default a `WebBrowser` component works in a _IE7 emulation_ mode, unless you make some changes to the system registry, so many modern HTML features may not be available.

There are also several 3rd party implementations available on the market. Most of them can be used both in Windows Forms and WPF hosts, so I'm going to tests both versions when available. I have selected the following projects for my research:

* [Awesomium v1.7.3.0](http://www.awesomium.com/)
* [CefGlue v0.4.8](https://bitbucket.org/fddima/cefglue)
* [CefSharp v1.25.5](https://github.com/cefsharp/CefSharp)
* [Xilium CefGlue v3.1453.1236](https://bitbucket.org/xilium/xilium.cefglue)
* [GeckoFx v22.0-0.6](https://bitbucket.org/geckofx)

All of them, except for the last one, are based the Chromium web browser. GeckoFx is using Firefox.

The target system is running Windows 7 Professional x86-64 with Service Pack 1 installed. The .NET framework version is 4.5.1. All browsers are tested in fullscreen mode with resolution of 1920x1080 pixels. The complete source code for each browser test is [available on github](https://github.com/artema/WebViewBenchmark).

## Hardware

Most of the tests are directly dependent on CPU performance, but you can rarely find a powerful CPU in kiosks and other similar installations. I'm going to use the same hardware as I previously used in my [Android x86 test run](/android-x86-test/):

* ASUS E45M1-M PRO
    * AMD E-450 @ 1650 MHz
    * ATI Radeon HD 6320
* 2x4 GB DDR3 1600 MHz (PC-12800) RAM
* Kingston V100 32 GB SATA II SSD

The system score for hardware is:

* Processor: 3.9
* Memory: 5.9
* Graphics: 4.4
* Gaming graphics: 5.8
* Disk: 5.9

## Results

### Peacekeeper

#### Windows Forms Hosts

<div id="chartContainer1b" style="width: 100%; height: 360px;"></div>

#### WPF Hosts

<div id="chartContainer1a" style="width: 100%; height: 500px;"></div>

As you can see, the default .NET implementation is not the best choice when you need a proper web browser in your app. GeckoFx has the best HTML5 features support, but it lacks speed, probably because it uses `XULRunner` technology.

### Browsermark 2.0

#### Windows Forms Hosts

<div id="chartContainer2a" style="width: 100%; height: 260px;"></div>

#### WPF Hosts

<div id="chartContainer2b" style="width: 100%; height: 180px;"></div>

As in the previous benchmark, the built-in `WebBrowser` component failed all HTML5 tests, which made it impossible for the Browsermark to run.

Surprisingly, Windows Forms hosts showed a little more higher scores in this benchmark than their WPF counterparts. It's probably due to the fact that WPF renders everything into a buffer before showing on screen. Browsermark is more graphics-oriented benchmark than Peacekeeper, which is why there is almost no difference between Forms and WPF scores in the first batch of results.

### Fish Bowl

#### Windows Forms Hosts

<div id="chartContainer3a" style="width: 100%; height: 500px;"></div>

#### WPF Hosts
<div id="chartContainer3b" style="width: 100%; height: 360px;"></div>

Once again the `WebBrowser` component failed to initialize the test page. It's no surprise, the Fish Bowl test was first introduced as a demo for Internet Explorer 9, which was a huge step forward in terms of web standards support.

You can see an even bigger gap between Windows Forms and WPF results in this test. WPF is definetly a bottleneck when it comes to a raw graphics performance.

<script src="https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/amcharts.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/serial.js" type="text/javascript"></script>
<script src="/static/benchmark/charts.js" type="text/javascript"></script>
<script type="text/javascript">
(function() {
    AmCharts.ready(function () {
		var data = {
	"forms":[{
	    "browser": "Default",
	    "peacekeeper_points": 229,
	    "peacekeeper_html": 0,
	    "fishtank_20": 0,
	    "fishtank_1000": 0,
	    "browsermark": 0
	}, {
	    "browser": "Awesomium",
	    "peacekeeper_points": 1242,
	    "peacekeeper_html": 5,
	    "fishtank_20": 16,
	    "fishtank_1000": 3,
	    "browsermark": 2133
	}, {
	    "browser": "CefGlue",
	    "peacekeeper_points": 1006,
	    "peacekeeper_html": 6,
	    "fishtank_20": 8,
	    "fishtank_1000": 4,
	    "browsermark": 2060
	}, {
	    "browser": "CefSharp",
	    "peacekeeper_points": 1316,
	    "peacekeeper_html": 2,
	    "fishtank_20": 12,
	    "fishtank_1000": 4,
	    "browsermark": 2294
	}, {
	    "browser": "GeckoFx",
	    "peacekeeper_points": 681,
	    "peacekeeper_html": 7,
	    "fishtank_20": 46,
	    "fishtank_1000": 18,
	    "browsermark": 2313
	}, {
	    "browser": "Xilium CefGlue",
	    "peacekeeper_points": 1142,
	    "peacekeeper_html": 6,
	    "fishtank_20": 55,
	    "fishtank_1000": 17,
	    "browsermark": 2967
	}],

	"wpf":[{
	    "browser": "Default",
	    "peacekeeper_points": 238,
	    "peacekeeper_html": 0,
	    "fishtank_20": 0,
	    "fishtank_1000": 0,
	    "browsermark": 0
	}, {
	    "browser": "Awesomium",
	    "peacekeeper_points": 1342,
	    "peacekeeper_html": 5,
	    "fishtank_20": 12,
	    "fishtank_1000": 3,
	    "browsermark": 2078
	}, {
	    "browser": "CefSharp",
	    "peacekeeper_points": 1286,
	    "peacekeeper_html": 2,
	    "fishtank_20": 12,
	    "fishtank_1000": 2,
	    "browsermark": 2237
	}, {
	    "browser": "Xilium CefGlue",
	    "peacekeeper_points": 1101,
	    "peacekeeper_html": 6,
	    "fishtank_20": 5,
	    "fishtank_1000": 1,
	    "browsermark": 2472
	}]
};
            var bench = new browserBenchmarks();
            bench.chartColors = ["#1ABC9C", "#0F6F5C", "#0F6F5C"];
            bench.createPeacekeeperChart(data.forms, "chartContainer1a");
            bench.createPeacekeeperChart(data.wpf, "chartContainer1b");
            bench.createBrowsermarkChart(data.forms, "chartContainer2a");
            bench.createBrowsermarkChart(data.wpf, "chartContainer2b");
            bench.createFishtankChart(data.forms, "chartContainer3a");
            bench.createFishtankChart(data.wpf, "chartContainer3b");
    });
})();
</script>
