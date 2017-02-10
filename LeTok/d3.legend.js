// d3.legend.js
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

// Adaptations to display symbols
// (C) 2016 thomas@wielfaert.be

(function() {
d3.legend = function(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legend]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legend")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke"),
          shape : self.attr("data-legend-shape") != undefined ? self.attr("data-legend-shape") : self.attr("d") != "none" ? self.attr("d") : d3.svg.symbol().type("circle")
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

	function sortByKey(array, key) {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}

    li.selectAll("text")
        .data(sortByKey(items, "key"))
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return (i+1)+"em"})
        .attr("x", "1em")
		.attr("font-weight", "normal")
        .text(function(d) { ;return d.key})

// Append title to legend
	li.append("text")
		.attr("x", "-1em")
		.attr("y", "0em")
		.attr("font-weight", "bold")
		.text(legendParam)

    function convert(i) {
      var result;
      (i==0) ? result = -4 : result = -4+i*12
      return String(result);
    }

    li.selectAll("path")
        .data(items, function(d) { return d.key})
        .call(function(d) { d.enter().append("path")})
		.classed("immutable", true)
        .call(function(d) { d.exit().remove()})
        .attr("transform", function(d,i) { return "translate(0," + convert(i+1) + ")"; })
        // .attr("cy",function(d,i) { return i-0.25+"em"})
        // .attr("cx",0)
        // .attr("r","0.4em")
        .attr("d", function(d) {return d.value.shape})
        .style("fill",function(d) { console.log(d.value.color);return d.value.color})

	var legendSelection = [];
	li.selectAll('path[class = immutable]').on("click", function (d) {
		var index = legendSelection.indexOf(d.key);
		if (index === -1) {
			legendSelection.push(d.key);
		} else {
			legendSelection.splice(index, 1);
		}

		if (legendSelection.length == 0) {
			d3.selectAll("path").style("opacity", .8);
		} else {
			d3.selectAll("path:not(.immutable)").style("opacity", 0.2);
		}

		legendSelection.forEach(function (d) {
			d3.selectAll("path:not(.immutable)").filter(function (e) {return d == e[legendParam];}).style("opacity", 0.8);
		});
		// if (selection.indexOf(d.key) < -1) {
		// 	d3.selectAll("path").filter(function (e) {return e[legendParam] !== d.key; }).style("opacity", 0.2);
		// 	d3.select(this).style("opacity", .8);
		// 	d3.selectAll("path:not(.immutable)").filter(function (e) {return e[legendParam] == d.key; }).style("opacity", 0.8);
		// 	hide = d.key;
		// } else {
		// 	d3.selectAll("path").filter(function (e) {return e[legendParam] !== d.key; }).style("opacity", 0.8);
		// 	hide = "null";
		// }
	});

	// Reposition and resize the box
    var lbbox = li[0][0].getBBox()
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})()
