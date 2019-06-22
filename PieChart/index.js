"use strict";
exports.__esModule = true;
var d3 = require("d3");
var PieChart = /** @class */ (function () {
    /**
     * Empty constructor.
     */
    function PieChart() {
    }
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
     */
    PieChart.prototype.init = function (context, notifyOutputChanged, state, container) {
        ;
        var dataset = [
            { label: 'Abulia', count: 10 },
            { label: 'Betelgeuse', count: 20 },
            { label: 'Cantaloupe', count: 30 },
            { label: 'Dijkstra', count: 40 }
        ];
        var width = 260;
        var height = 260;
        var radius = Math.min(width, height) / 2;
        var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"];
        var svg = d3.select("." + container.className.replace(" ", ",."))
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
        /*var legsvg = d3.select("."+container.className.replace(" ", ",."))
            .append('svg')
            .attr('width', 200)
            .attr('height', 360);

        legsvg.append("circle").attr("cx",10).attr("cy",130).attr("r", 6).style("fill", "#69b3a2")
        legsvg.append("circle").attr("cx",10).attr("cy",160).attr("r", 6).style("fill", "#404080")
        legsvg.append("text").attr("x", 220).attr("y", 130).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
        legsvg.append("text").attr("x", 220).attr("y", 160).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")*/
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        var pie = d3.pie()
            .value(function (d) { return d.count; })
            .sort(null);
        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
            return colors[i];
        })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1);
    };
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    PieChart.prototype.updateView = function (context) {
        // Add code to update control view
    };
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    PieChart.prototype.getOutputs = function () {
        return {};
    };
    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    PieChart.prototype.destroy = function () {
        // Add code to cleanup control if necessary
    };
    return PieChart;
}());
exports.PieChart = PieChart;
