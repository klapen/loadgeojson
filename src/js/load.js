var oas;
document.addEventListener('DOMContentLoaded', function(){
    // Load map
    var width = 690,
 	height = 800;
    var map_url = "data/barrios.geo.json";
    var feature_classname = 'barrios';
    var id_prop = 'cod_polbar';
    
    var projection = d3.geoLittrow();
    var path = d3.geoPath().projection(projection);
    
    var svg = d3.select("#map").append("svg")
 	.attr("width", width)
 	.attr("height", height);
    oas = svg;
    d3.json(map_url, function(error,shapes) {
 	svg.selectAll('path')
 	    .data(shapes.features)
 	    .enter()
 	    .append('path')
 	    .attr('class',feature_classname)
 	    .attr('id',function(d){return d.properties[id_prop]})
 	    .attr('d', path)
	    .attr('transform',
		  'translate(-607820.5885038204,-439749.6151207932) scale(1782.8875536304574)');
 	svg.call(d3.zoom().scaleExtent([1, 2000]).on("zoom", function(){
 	    svg.selectAll('path').attr('transform', d3.event.transform);
 	}));
    });
});
