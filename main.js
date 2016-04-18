"use strict";



        

var car_data;
var available_dimensions;
var xAxisGroup;
var yAxisGroup;
var svg;
$(document).ready(function(){
    svg = d3.select("svg");
    xAxisGroup = svg.append("g").attr("class", "x axis");
    yAxisGroup = svg.append("g").attr("class", "x axis");
    $("#sel-x").change(function(){
        draw_chart(car_data);
    });
    $("#sel-y").change(function(){
        draw_chart(car_data);
    });
    $("#update").click(function(){
        filter_chart();
    });
    d3.csv("car.csv", function(data){
        car_data = data;
        var data_keys = Object.keys(data[0]);
        available_dimensions = data_keys.splice(1, data_keys.length-2);
        for (var i = 0; i < available_dimensions.length; i ++){
            $('#sel-x').append($("<option></option>")
                .attr("value",available_dimensions[i])
                .text(available_dimensions[i]));
            $('#sel-y').append($("<option></option>")
                .attr("value",available_dimensions[i])
                .text(available_dimensions[i]));  
        }
        $('#sel-x').val('mpg');
        $('#sel-y').val('displacement');
        svg.append("text").attr("id","x_text").attr("class","textaxis");
        svg.append("text").attr("id","y_text").attr("class","textaxis");
        draw_chart(car_data);
    })
});

function draw_chart(data){
    var svg_size = [parseFloat(svg.style("width")),parseFloat(svg.style("height"))]
    var xaxis_name = $("#sel-x").val();
    var yaxis_name = $("#sel-y").val();
    var xscale = d3.scale.linear();
    var yscale = d3.scale.linear();

    var xtext = svg.select("#x_text")
    var ytext = svg.select("#y_text")

    xtext.text(xaxis_name);
    ytext.text(yaxis_name);

    xtext.attr("x", svg_size[0])
    xtext.style("text-anchor","end")
xtext.attr("y", svg_size[1] - 28);

    ytext.attr("transform","rotate(90)");
    ytext.attr("y", -52 );

    

    //#### Computing scales
    var xrange = [0, 0];
    var yrange = [0, 0]
    
    var alpha = 0.1
    xrange[0] = d3.min(data, function(d) { return +d[xaxis_name]; })
    xrange[1] = d3.max(data, function(d) { return +d[xaxis_name]; })
    var xdiff = xrange[1]-xrange[0] 
    xrange[0] = xrange[0] - xdiff*alpha
    xrange[1] = xrange[1] + xdiff*alpha


    yrange[0] = d3.min(data, function(d) { return +d[yaxis_name]; })
    yrange[1] = d3.max(data, function(d) { return +d[yaxis_name]; })
    var ydiff = yrange[1]-yrange[0]
    yrange[0] = yrange[0] - ydiff*alpha
    yrange[1] = yrange[1] + ydiff*alpha

    xscale.range([50, svg_size[0]-2]).domain(xrange);
    yscale.range([svg_size[1]-25,5]).domain(yrange);
    var axisX = d3.svg.axis().scale(xscale).orient("bottom");
    var axisY = d3.svg.axis().scale(yscale).orient("left");
    xAxisGroup
        .attr("transform", "translate(0, "+(svg_size[1]-25)+")");
    yAxisGroup
        .attr("transform", "translate(50, 0)");
    
    var circles = svg.selectAll("circle").data(data, function(obj){
        //compute objecct id
        return obj['name'];
    });

    //Enter
    circles.enter().append("circle").attr("r", 2).on("mouseover", function(x){
        $("#hovered").text(x["name"])
    });

    //Exit
    circles.exit().remove();

    // Update
    circles
        .attr("cx", function(data){
            return (xscale(data[xaxis_name]));
        })
        .attr("cy", function(data){
            return (yscale(data[yaxis_name]));
        })
    xAxisGroup.transition().call(axisX); //Update the X Axis
    yAxisGroup.transition().call(axisY); //Update the Y Axis
};

function filter_chart(){
    var min = parseFloat($("#mpg-min").val());
    var max = parseFloat($("#mpg-max").val());

    var data = car_data.filter(function(d){
        return parseFloat(d["mpg"]) >= min && parseFloat(d["mpg"]) <= max;
    });
    draw_chart(data);
}