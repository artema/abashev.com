function browserBenchmarks()
{
	this.chartColors = ["#CC0000", "#00CC00", "#880000"];
	
	this.createPeacekeeperChart = function(data, container)
	{
	    var valueAxis1 = new AmCharts.ValueAxis();
	    valueAxis1.position = "top";

	    var valueAxis2 = new AmCharts.ValueAxis();
	    valueAxis2.position = "bottom";
	    valueAxis2.maximum = 7;
	    valueAxis2.gridAlpha = 0;
	    valueAxis2.autoGridCount = false;
	    valueAxis2.gridCount = 7;
	    valueAxis2.labelFrequency = 7;

	    var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = data;
	    chart.categoryField = "browser";
	    chart.rotate = true;
	    chart.colors = [ this.chartColors[0], this.chartColors[1] ];

	    var categoryAxis = chart.categoryAxis;
	    categoryAxis.gridPosition = "start";
	    categoryAxis.gridAlpha = 0.1;
	    categoryAxis.axisAlpha = 0;

	    var legend = new AmCharts.AmLegend();
	    legend.data = [
	        { title:"Total points", color:chart.colors[0] },
	        { title:"HTML5 Capabilities", color:chart.colors[1] }
	    ];

	    var graph1 = new AmCharts.AmGraph();
	    graph1.valueField = "peacekeeper_points";
	    graph1.type = "column";
	    graph1.fillAlphas = 1.0;
	    graph1.labelText = "[[value]]";
	    graph1.valueAxis = valueAxis1;
	    chart.addGraph(graph1);

	    var graph2 = new AmCharts.AmGraph();
	    graph2.valueField = "peacekeeper_html";
	    graph2.type = "column";
	    graph2.fillAlphas = 1.0;
	    graph2.labelText = "[[value]]";
	    graph2.valueAxis = valueAxis2;
	    graph2.columnWidth = 0.5;
	    chart.addGraph(graph2);

	    chart.addValueAxis(valueAxis1);
	    chart.addValueAxis(valueAxis2);    
	    chart.addLegend(legend);
	    chart.write(container);
	}
	
	this.createBrowsermarkChart = function(data, container)
	{
	    var valueAxis = new AmCharts.ValueAxis();
	    valueAxis.position = "bottom";

	    var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = data;
	    chart.categoryField = "browser";
	    chart.rotate = true;
	    chart.colors = [ this.chartColors[0] ];

	    var categoryAxis = chart.categoryAxis;
	    categoryAxis.gridPosition = "start";
	    categoryAxis.gridAlpha = 0.1;
	    categoryAxis.axisAlpha = 0;

	    var graph = new AmCharts.AmGraph();
	    graph.valueField = "browsermark";
	    graph.type = "column";
	    graph.fillAlphas = 1.0;
	    graph.labelText = "[[value]]";
	    graph.valueAxis = valueAxis;
	    chart.addGraph(graph);

	    chart.addValueAxis(valueAxis);
	    chart.write(container);
	}
	
	this.createFishtankChart = function(data, container)
	{
	    var valueAxis = new AmCharts.ValueAxis();
	    valueAxis.position = "bottom";
		valueAxis.maximum = 60;

	    var chart = new AmCharts.AmSerialChart();
	    chart.dataProvider = data;
	    chart.categoryField = "browser";
	    chart.rotate = true;
	    chart.colors = [ this.chartColors[0], this.chartColors[2] ];

	    var categoryAxis = chart.categoryAxis;
	    categoryAxis.gridPosition = "start";
	    categoryAxis.gridAlpha = 0.1;
	    categoryAxis.axisAlpha = 0;

	    var legend = new AmCharts.AmLegend();
	    legend.data = [
	        { title:"20 fish", color:chart.colors[0] },
	        { title:"1000 fish", color:chart.colors[1] }
	    ];

	    var graph1 = new AmCharts.AmGraph();
	    graph1.valueField = "fishtank_20";
	    graph1.type = "column";
	    graph1.fillAlphas = 1.0;
	    graph1.labelText = "[[value]]";
	    graph1.valueAxis = valueAxis;
		graph1.columnWidth = 0.75;
	    chart.addGraph(graph1);

	    var graph2 = new AmCharts.AmGraph();
	    graph2.valueField = "fishtank_1000";
	    graph2.type = "column";
	    graph2.fillAlphas = 1.0;
	    graph2.labelText = "[[value]]";
	    graph2.valueAxis = valueAxis;
	    graph2.columnWidth = 0.75;
	    chart.addGraph(graph2);

	    chart.addValueAxis(valueAxis);  
	    chart.addLegend(legend);
	    chart.write(container);
	}
}