//CREDITS
//https://www.d3-graph-gallery.com/graph/basic_datamanipulation.html
//http://bl.ocks.org/jarobertson/1439067

var WIDTH = 1000;
var HEIGHT = 800;
var scale_of_map = 72000;
var SCALE = 1;

d3.select('#content g.map').append("rect").attr("width", 1200)
    .attr("height", 1000)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", 2)

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var div = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);

var proj = d3.geoMercator()
    .center([-0.18, 51.52])
    .scale(scale_of_map)
    .translate([WIDTH / 2, HEIGHT / 2]);

function zoomed() {
    SCALE = d3.event.transform["k"];
    d3
        .selectAll('path')
        .attr('transform', d3.event.transform);
    d3
        .selectAll('circle')
        .attr("r", 2 / d3.event.transform["k"])
        .attr('transform', d3.event.transform);
    d3
        .selectAll('line')
        .attr("stroke-width", 2 / d3.event.transform["k"])
        .attr('transform', d3.event.transform);
}
var ZOOM = d3.zoom()
    .scaleExtent([1, 200])
    .on('zoom', zoomed);

var PATH = d3.geoPath().projection(proj);

d3.json("london_boroughs.json", function(json) {
    d3.select('#content g.map')
        .selectAll('path')

    .data(json.features)
        .enter()
        .append("path")
        .attr("d", function(d) {
            return PATH(d);
        }).style("fill", "grey").style("stroke", "black").style("stroke-width", "2").on('mouseover', function(d, i) {
            console.log(d);
            const [xp, y] = d3.mouse(event.target);
            d3.select(this).style("fill", "pink").style('fill-opacity', 1)
                .attr("r", 4 / SCALE)
            d3.select('.tooltip2').transition()
                .duration(200)
                .style("opacity", .9);
            d3.select('.tooltip2').html(`${d.properties.name}`)
                .style("left", (xp + 25 / SCALE) + "px")
                .style("top", (y - 25 / SCALE) + "px");
        }).on('mouseout', function(d, i) {
            const [xp, y] = d3.mouse(event.target);
            d3.select(this).style("fill", "grey").style('fill-opacity', 1)
                .attr("r", 2 / SCALE)
            d3.select('.tooltip2').transition()
                .duration(200)
                .style("opacity", .0);
            d3.select('.tooltip2').html(`${d.properties.name}`)
                .style("left", (xp) + "px")
                .style("top", (y - 2) + "px");
        });

    d3.csv("london_station.csv", function(data) {
        var abs = d3.select('#content g.map')
            .selectAll('circle')
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("cx", function(d) {
                var i = [parseFloat(d['longitude']), parseFloat(d['latitude'])];
                return proj(i)[0];
            })
            .attr("cy", function(d) {
                var i = [parseFloat(d['longitude']), parseFloat(d['latitude'])];
                return proj(i)[1];
            })

        abs.transition()
            .style("fill", "red")

        abs.on('mouseover', function(d, i) {
            console.log(d);
            const [xp, y] = d3.mouse(event.target);
            d3.select(this).style("fill", "black").style('fill-opacity', 1)
                .attr("r", 4 / SCALE)
            d3.select('.tooltip').transition()
                .duration(200)
                .style("opacity", .9);
            d3.select('.tooltip').html(`Longitude: ${d.longitude}  <br></br> Latitude: ${d.latitude}`)
                .style("left", (xp + 25 / SCALE) + "px")
                .style("top", (y - 25 / SCALE) + "px");
        })

        abs.on('mouseout', function(d, i) {
            const [xp, y] = d3.mouse(event.target);
            d3.select(this).style("fill", "red").style('fill-opacity', 1)
                .attr("r", 2 / SCALE)
            d3.select('.tooltip').transition()
                .duration(200)
                .style("opacity", .0);
            d3.select('.tooltip').html(`Longitude: ${d.longitude}  <br></br> Latitude: ${d.latitude}`)
                .style("left", (xp) + "px")
                .style("top", (y - 2) + "px");
        });
    });

    var arr = ['NONE', 'ALL', 2017, 2018, 2019, 2020]
    var option;
    d3.select("#selectButton")
        .style("left", 850 + "px")
        .selectAll('myOptions')
        .data(arr)
        .enter()
        .append('option')
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; })
    d3.select("#selectButton").on('change', function(d) {
        option = d3.select(this).property("value")
        console.log(option)
        d3.selectAll('line').remove()

        d3.csv("small_data.csv", function(small_data) {
            newselect = option
            small_data = small_data.filter(d => {
                if (newselect === 'ALL') {
                    return (
                        d
                    );
                } else {
                    return (
                        d.year == newselect
                    );
                }
            });

            d3.select('#content g.map')
                .selectAll('line')
                .data(small_data)
                .enter()
                .append("line")
                .attr("y1", function(d) {
                    var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                    return proj(i)[1];
                })
                .attr("x1", function(d) {
                    var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                    return proj(i)[0];
                })
                .attr("y2", function(d) {
                    var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                    return proj(i)[1];
                })
                .attr("x2", function(d) {
                    var i = [parseFloat(d['end_longitude']), parseFloat(d['end_latitude'])];
                    return proj(i)[0];
                })
                .attr("y2", function(d) {
                    var i = [parseFloat(d['start_longitude']), parseFloat(d['start_latitude'])];
                    return proj(i)[1];
                })
                .attr("x2", function(d) {
                    var i = [parseFloat(d['start_longitude']), parseFloat(d['start_latitude'])];
                    return proj(i)[0];
                })
                .style("fill", "red").style("stroke", "white");
        });
    })
});
var svg = d3.select('#content g.map');
svg.attr("stoke", "white")
svg.call(ZOOM);