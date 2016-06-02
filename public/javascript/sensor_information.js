$(document).ready(function(){	
	
	var yearChart_year = $("#option-year").val();
	displayChart("info-chart-year", "legend-year", yearChart_year, null);

	
	var text = $("#option-month option:selected").text();
	console.log(text);
	var month = $("#option-month").val();
	var monthChart_year = text.substring(text.length, text.length -4);

	displayChart("info-chart-month", "legend-month", monthChart_year, month);
	
});

$("#option-year").on("change", function(){

	var year = this.value;

	resetCanvas("info-chart-year", "canvas1-id");
	displayChart("info-chart-year", "legend-year", year, null);

});

$("#option-month").on("change", function(){

	var text = this.options[this.selectedIndex].text;
	var month = this.value;
	var year = text.substring(text.length, text.length -4);

	resetCanvas("info-chart-month", "canvas2-id");
	displayChart("info-chart-month", "legend-month", year, month);
	
});

function resetCanvas(canvas_id, container_id){
	$("#" + canvas_id).remove(); // this is my <canvas> element
	$("#" + container_id).append('<canvas class="center" id="' + canvas_id + '" width="800" height="400"></canvas>');
}

function displayChart(chart_id, chart_legend_id, year, month){

	var loc = $("#sensor-location").text();
	loc = loc.split().join("+");

	var api_url = "/api/sensorbylocation";

	if (month ==null){
		api_url += "/year?location=" + loc + "&year=" + year;
	}

	else {
		api_url += "/month?location=" + loc + "&month=" + month + "&year=" + year;
		console.log("api 2");
	}

    $.ajax(
    {
        type: 'GET',
        url: api_url,
        data: {},
        beforeSend: function(){
            $('body').addClass("loading");
        },
        success: function(data){

            $('body').removeClass("loading");

            var request = data;

            var json = request;
            var data = {labels : [], datasets : []};
            console.log(json);

            data.datasets.push({
                label: "Max Temperature °F",
                fillColor: "rgba(255,100,100,0)",
                strokeColor: "rgba(255,100,100,1)",
                pointColor: "rgba(255,100,100,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(255,50,50,1)",
                data: []
            },
            {
                label: "Min Temperature °F",
                fillColor: "rgba(151,187,205,0)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            },
            {
                label: "Average Humidity %",
                fillColor: "rgba(200,200,200,0)",
                strokeColor: "rgba(200,200,200,1)",
                pointColor: "rgba(200,200,200,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(200,200,200,1)",
                data: []
            });

            for (var i in json){

                if (month == null){
                    data.labels.push(json[i]._id.month + "/" + json[i]._id.day);
                }
                else {
                    data.labels.push(json[i]._id.day);
                }

                data.datasets[0].data.push(json[i].max);
                data.datasets[1].data.push(json[i].min);

                //add humidity to chart if it is not null in the database query
                if (json[i].humidity != null){
                    data.datasets[2].data.push(Math.ceil(json[i].humidity));
                }
                
            }

            // Get context with jQuery - using jQuery's .get() method.
            var ctx = $("#" + chart_id).get(0).getContext("2d");
            // This will get the first returned node in the jQuery collection.
            var myLineChart = new Chart(ctx).Line(data);

            $("#" + chart_legend_id).html(myLineChart.generateLegend());
        }


    });

}

Chart.defaults.global = {
    // Boolean - Whether to animate the chart
    animation: true,

    // Number - Number of animation steps
    animationSteps: 60,

    // String - Animation easing effect
    // Possible effects are:
    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
    //  easeOutElastic, easeInCubic]
    animationEasing: "easeOutCirc",

    // Boolean - If we should show the scale at all
    showScale: true,

    // Boolean - If we want to override with a hard coded scale
    scaleOverride: false,

    // ** Required if scaleOverride is true **
    // Number - The number of steps in a hard coded scale
    scaleSteps: null,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: null,
    // Number - The scale starting value
    scaleStartValue: null,

    // String - Colour of the scale line
    scaleLineColor: "rgba(0,0,0,.1)",

    // Number - Pixel width of the scale line
    scaleLineWidth: 1,

    // Boolean - Whether to show labels on the scale
    scaleShowLabels: true,

    // Interpolated JS string - can access value
    scaleLabel: "<%=value%>",

    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
    scaleIntegersOnly: true,

    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero: true,

    // String - Scale label font declaration for the scale label
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Scale label font size in pixels
    scaleFontSize: 12,

    // String - Scale label font weight style
    scaleFontStyle: "normal",

    // String - Scale label font colour
    scaleFontColor: "#666",

    // Boolean - whether or not the chart should be responsive and resize when the browser does.
    responsive: true,

    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,

    // Boolean - Determines whether to draw tooltips on the canvas or not
    showTooltips: true,

    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
    customTooltips: false,

    // Array - Array of string names to attach tooltip events
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

    // String - Tooltip background colour
    tooltipFillColor: "rgba(0,0,0,0.8)",

    // String - Tooltip label font declaration for the scale label
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip label font size in pixels
    tooltipFontSize: 14,

    // String - Tooltip font weight style
    tooltipFontStyle: "normal",

    // String - Tooltip label font colour
    tooltipFontColor: "#fff",

    // String - Tooltip title font declaration for the scale label
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

    // Number - Tooltip title font size in pixels
    tooltipTitleFontSize: 14,

    // String - Tooltip title font weight style
    tooltipTitleFontStyle: "bold",

    // String - Tooltip title font colour
    tooltipTitleFontColor: "#fff",

    // Number - pixel width of padding around tooltip text
    tooltipYPadding: 6,

    // Number - pixel width of padding around tooltip text
    tooltipXPadding: 6,

    // Number - Size of the caret on the tooltip
    tooltipCaretSize: 8,

    // Number - Pixel radius of the tooltip border
    tooltipCornerRadius: 6,

    // Number - Pixel offset from point x to tooltip edge
    tooltipXOffset: 10,

    // String - Template string for single tooltips
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

    // String - Template string for multiple tooltips
    multiTooltipTemplate: "<%= value %>",

    // Function - Will fire on animation progression.
    onAnimationProgress: function(){},

    // Function - Will fire on animation completion.
    onAnimationComplete: function(){}

}