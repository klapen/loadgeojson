var data;
document.addEventListener('DOMContentLoaded', function(){
    // Load map
    var width = 690,
 	height = 800;
    var map_url = "data/barrios.geo.json";
    var feature_classname = 'barrios';
    var id_prop = 'objectid';
    
    var projection = d3.geoLittrow();
    var path = d3.geoPath().projection(projection);
    
    var svg = d3.select("#map").append("svg")
 	.attr("width", width)
 	.attr("height", height);
    
    d3.json(map_url, function(error,shapes) {
	data = shapes.features;
 	var map = svg.append('g').attr('id','svg-map');
	var paths = map.selectAll('path')
 	    .data(shapes.features)
 	    .enter()
 	    .append('path')
 	    .attr('class',feature_classname)
 	    .attr('id',function(d){return d.properties[id_prop]})
 	    .attr('d', path)
	var dim = document.getElementById('svg-map').getBBox();
	var scale = dim.height > dim.width ? height/dim.height : width/dim.width;
	console.log(dim,dim.x*scale,dim.y*scale,scale);
	paths.attr('transform','translate(-'+dim.x*scale+',-'+dim.y*scale+') scale('+scale+')');

	// ToDo: set event transform to transform values
 	//svg.call(d3.zoom().scaleExtent([1, 3000]).on("zoom", function(){
 	//    svg.selectAll('path').attr('transform', d3.event.transform);
 	//}));
    });
});

// Utils
var utils = {
    translation: function (x,y) {return 'translate(' + x + ',' + y + ')';}, 
    widthCalc: function (id){return document.getElementById(id).clientWidth;},
    heightCalc: function (id){return document.getElementById(id).clientHeight;}
}

function processFeatures(features){
    var keys = Object.keys(features[0].properties);
    var dataString = keys.join(',')+'\n' + features.reduce(function(acc,curr){
	acc = acc + keys.reduce(function(ac,cu){
	    var prop = curr.properties[cu];
	    if (Array.isArray(prop)) prop = prop.toString().replace(',',':')
	    ac=ac+prop+',';
	    return ac;
	},'') +'\n';
	return acc;
    },'');
    return 'data:text/csv:charset=utf-8,'+dataString;
}

function saveProps(){
    saveFile(processFeatures(data),'props.csv');
}
function saveSvg(){
    var header = 'data:image/svg+xml;charset=utf-8,'
    var content = document.getElementById('map').getElementsByTagName('svg')[0].outerHTML;
    saveFile(header+content,'map.svg');
}
var oas;

function saveFile(content,filename){
    var encodedUri = encodeURI(content);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
