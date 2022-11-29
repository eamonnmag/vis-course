/**
 * Created by eamonnmaguire on 13/11/15.
 */

var primitives = (function () {

    var get_line = function (interpolation) {
        return d3.line()
            .curve(function(d) {
                console.log(interpolation)
                return interpolation(0.4)
            }) // there are many different interpolators
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });


    };

    return {
        create_line_chart: function (placement, data, interpolation) {
            d3.select(placement).html("");
            var svg = d3.select(placement).append("svg").attr('width', 200)
            .attr('height', 50);

            svg.append("path").attr("d", get_line(interpolation)(data))
                .attr('class', 'line')
                .style({'stroke-width': 2, 'stroke-linecap': 'round'});
        },


        create_rectangles: function (placement, data) {
            d3.select(placement).html('');
            var g = d3.select(placement).append("svg")
                .attr('width', 200)
                .attr('height', 100)
                .append("g");

            g.selectAll("rect").data(data).enter().append("rect").attr('x', function (d) {
                return d.x
            })
                .attr('y', function (d) {
                    return d.y
                })
                .attr('width', function (d) {
                    return d.width
                })
                .attr('height', function (d) {
                    return d.height
                }).style('fill', function (d) {
                    return d.color ? d.color : 'white';
                })
        }
    }

})();