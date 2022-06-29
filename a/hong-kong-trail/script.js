console.clear();

var sel = d3.select(".g-map").html("");
var width = sel.node().getBoundingClientRect().width;
var height = width*0.8;

d3.queue()
	.defer(d3.json, "trail.json")
	.defer(d3.json, "data.json")
	.awaitAll(function (err, res){

		var trail = res[0];
		var trailshape = topojson.feature(trail, trail.objects.trail);

		var svg = sel.append("svg").attr("width", width).attr("height", height);
		var projection = d3.geoMercator().fitSize([width, height], trailshape);
		var path = d3.geoPath().projection(projection);

		var trailf = trailshape.features.filter(d => d.geometry.type == "LineString");
		var trailg = svg.append("g.g-trailg");
		trailg.appendMany("path.g-trail-path", trailf)
			.attr("d", path)

		var wp = svg.append("g.g-wp");
		var wps = trailshape.features.filter(d => d.geometry.type == 'Point')
		console.log(wps[0].geometry)
		wp.appendMany("rect.g-pts", wps)
			.style("width", 2)
			.style("height", 2)
			.translate(d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]))
		

		var data = res[1];
		var cont = d3.select(".g-content").html("");

		var dp = cont.appendMany("div.g-post", data)
		var textcont = dp.append("div.g-text-cont");

		textcont.append("div.g-label")
			.text(d => "H" + d.id)

		textcont.append("div.g-time")
			.text(d => d.time)

		textcont.append("div.g-text")
			.text(d => d.text_en)

		textcont.append("div.g-text")
			.text(d => d.text_cn)

})
