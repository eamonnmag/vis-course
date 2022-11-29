/**
 * Created by eamonnmaguire on 05/01/2014.
 */

var graph = (function () {
    var fill = d3.scaleOrdinal(d3.schemeCategory10);;
    var svg, cursor, nodes, links, node, link, force, placement, zoom;

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return {
        createNetworkVisualization: function (url, place, width, height) {

            placement = place;
            d3.select(placement).html("");

            var svg = d3.select(placement).append('svg').attr('width', width)
                .attr('height', height);



            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) { return d.id; }))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2));

            d3.json(url).then(function (json) {

                console.log(json);
                json.links.forEach((d, i) => d.id = i);

                var link = svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(json.links)
                    .enter().append("line")

                var node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(json.nodes)
                    .enter().append("circle")
                    .attr("r", 5)
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                node.append("title")
                    .text(function (d) { return d.id; });


                simulation
                    .nodes(json.nodes)
                    .on("tick", ticked);

                simulation.force("link")
                    .links(json.links);

                function ticked() {
                    link
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                    node
                        .attr("cx", function (d) { return d.x; })
                        .attr("cy", function (d) { return d.y; });
                }
            });

        },

        create_hive_visualization: function (placement, data, width, height) {

            var innerRadius = 40,
                outerRadius = 240;

            var angle = d3.scaleOrdinal().domain(d3.range(4)).rangePoints([0, 2 * Math.PI]),
                radius = d3.scaleLinear().range([innerRadius, outerRadius]),
                color = d3.scaleOrdinal().range(["#1abc9c", "#f39c12", "#e67e22"]);

            var nodes = [
                { x: 0, y: .1 },
                { x: 0, y: .9 },
                { x: 1, y: .2 },
                { x: 1, y: .3 },
                { x: 2, y: .1 },
                { x: 2, y: .8 }
            ];

            var links = [
                { source: nodes[0], target: nodes[2] },
                { source: nodes[1], target: nodes[3] },
                { source: nodes[2], target: nodes[4] },
                { source: nodes[2], target: nodes[5] },
                { source: nodes[3], target: nodes[5] },
                { source: nodes[4], target: nodes[0] },
                { source: nodes[5], target: nodes[1] }
            ];

            var svg = d3.select(placement).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.selectAll(".axis")
                .data(d3.range(3))
                .enter().append("line")
                .attr("class", "hive-axis")
                .attr("transform", function (d) { return "rotate(" + degrees(angle(d)) + ")"; })
                .attr("x1", radius.range()[0])
                .attr("x2", radius.range()[1]);

            svg.selectAll("text")
                .data(d3.range(3))
                .enter().append("text").attr("transform", function (d) { return "rotate(" + degrees(angle(d)) + ")"; }).text(function (d) {
                    return 'Axis ' + d;
                }).attr('x', radius.range()[1] - 20).attr('y', 20);

            svg.selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", d3.hive.link()
                    .angle(function (d) { return angle(d.x); })
                    .radius(function (d) { return radius(d.y); }))
                .style("stroke", function (d) { return color(d.source.x); });

            svg.selectAll(".node")
                .data(nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("transform", function (d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
                .attr("cx", function (d) { return radius(d.y); })
                .attr("r", 5)
                .style("fill", function (d) { return color(d.x); });

            function degrees(radians) {
                return radians / Math.PI * 180 - 90;
            }

        }
    }
})();

