//CREDITS
//https://bl.ocks.org/denjn5/6914f73f8bc3f009a875fa2bd11f81d8
//https://observablehq.com/@d3/force-directed-graph

var WIDTH = 500;
var HEIGHT = 500;

d3.select('#content g.map2').append("rect").attr("width", 1200)
    .attr("height", 1200)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", 2)

var svg = d3.select('#content g.map2')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .style('background-color', 'white')

var edges = [];
var nodes = [];

d3.csv("london_station.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
        var map = {
            "label": data[i]["station_name"],
            "id": data[i]["station_id"]
        }
        nodes.push(map);
    };
});
d3.csv("small_data.csv", function(data) {
    for (var i = 0; i < data.length; i++) {

        var map = {
            "source": data[i]["start_station_id"],
            "target": data[i]["end_station_id"].split(".")[0],
            "strength": 1
        }
        edges.push(map);
    };


    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(-25))
        .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))

    var node_elements = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', "black")

    var text_elements = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .text(node => node.label)
        .attr('font-size', 15)
        .attr('dx', 15)
        .attr('dy', 4)
        .attr("opacity", 0)



    simulation.nodes(nodes).on('tick', () => {
        node_elements
            .attr('cx', node => node.x)
            .attr('cy', node => node.y)
        text_elements
            .attr('x', node => node.x)
            .attr('y', node => node.y)
    })

    simulation.force('link', d3.forceLink()
        .id(function(d, i) {
            return d.id;
        }).strength(link => link.strength)
    )


    const linkElements = svg.append('g')
        .selectAll('line')
        .data(edges)
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')

    linkElements
        .attr('x1', function(d, i) {
            return d.source.x;
        })
        .attr('y1', link => link.source.y)
        .attr('x2', link => link.target.x)
        .attr('y2', link => link.target.y)


    simulation.force('link').links(edges)
    simulation.on('tick', () => {
        node_elements
            .attr('cx', node => node.x)
            .attr('cy', node => node.y)
        text_elements
            .attr('x', node => node.x)
            .attr('y', node => node.y)
        linkElements
            .attr('x1', function(d, i) {
                return d.source.x;
            })
            .attr('y1', link => link.source.y)
            .attr('x2', link => link.target.x)
            .attr('y2', link => link.target.y)
    })


    const dragDrop = d3.drag()
        .on('start', node => {
            node.fx = node.x
            node.fy = node.y
        })
        .on('drag', node => {
            simulation.alphaTarget(0.7).restart()
            node.fx = d3.event.x
            node.fy = d3.event.y
        })
        .on('end', node => {
            if (!d3.event.active) {
                simulation.alphaTarget(0)
            }
            node.fx = null
            node.fy = null
        })
    node_elements.call(dragDrop)

    function zoomed() {
        svg
            .selectAll('text')
            .attr('transform', d3.event.transform);
        svg
            .selectAll('line')
            .attr("stroke-width", 1 / d3.event.transform["k"])
            .attr('transform', d3.event.transform);
        if (d3.event.transform["k"] > 1) {
            svg
                .selectAll('circle')
                .attr("r", 10 / d3.event.transform["k"])
                .attr('transform', d3.event.transform);
        } else {
            svg
                .selectAll('circle')
                .attr('transform', d3.event.transform);
        }
        if (d3.event.transform["k"] > 1.5) {
            svg
                .selectAll('text')
                .attr("font-size", 15 / d3.event.transform["k"])
                .attr('transform', d3.event.transform).attr("opacity", 1);
        } else {
            svg.selectAll('text')
                .attr("opacity", 0)
                .attr('transform', d3.event.transform);
        }

    }
    var zoom = d3.zoom()
        .scaleExtent([-5, 200])
        .on('zoom', zoomed);
    svg.call(zoom);
});