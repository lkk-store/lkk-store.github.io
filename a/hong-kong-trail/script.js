console.clear();

var sel = d3.select(".g-map").html("")
sel = sel.append("div.g-map-inner");

var hed = sel.append("div.g-hed-text")
// hed.append("div.g-text.g-text-cn.g-text-shadow").text("港島徑")
// hed.append("div.g-text.g-text-en.g-text-shadow").text("Hong Kong Trail")

var width = 350;
var height = width*0.4;

d3.select(".g-body").style("margin-top", (innerHeight/2 - d3.select(".g-body").node().getBoundingClientRect().height/2) + "px")

var dot, ids, wps, dotg, projection, trailpath, path, trailf, totalLength, wps, trackpts, totaldist, trailshape, hkg, all;

var dsvg, dw, dh, dproj, dpath, dline, dmap;

var pts = {
	"start": [114.14943400741993, 22.271377235993967],
	"end": [114.2450688769546, 22.247412223842055]
}

var dist = 0;

var counter = 0;
var prevcounter = 0;

var totaltime = 0;

function addemojis(x) {
	return x.replace(":lol:", "😂").replace(":tear:", "🥲")
}


d3.queue()
	.defer(d3.json, "trail.json")
	.defer(d3.json, "data.json")
	.defer(d3.json, "parsed.json")
	.defer(d3.json, "hkg.json")
	.defer(d3.json, "contours.json")
	.defer(d3.json, "all.json")
	.awaitAll(function (err, res){

		hkg = res[3];
		contours = res[4];
		trackpts = res[2];
		all = res[5];
		totaldist = trackpts[trackpts.length - 1].dist

		var trail = res[0];
		trailshape = topojson.feature(trail, trail.objects.trail);
		var svg = sel.append("svg").attr("width", width).attr("height", height);
		projection = d3.geoMercator().fitSize([width, height], trailshape);
		path = d3.geoPath().projection(projection);

		var defs = svg.append("defs");
		var filter = defs.append("filter")
		    .attr("id", "drop-shadow")
		    .attr("height", "500%");
		filter.append("feGaussianBlur")
		    .attr("in", "SourceAlpha")
		    .attr("stdDeviation", 3)
		    .attr("result", "blur");
		filter.append("feOffset")
		    .attr("in", "blur")
		    .attr("dx", 0)
		    .attr("dy", 0)
		    .attr("result", "offsetBlur");
		var feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode")
		    .attr("in", "offsetBlur")
		feMerge.append("feMergeNode")
		    .attr("in", "SourceGraphic");

		trailf = trailshape.features.filter(d => d.geometry.type == "LineString");

		var line = d3.line()
          .x(function(d) { return projection(d)[0]; })
          .y(function(d) { return projection(d)[1]; })
          .curve(d3.curveBasis);
			
		var trailbg = svg.append("g.g-trailbg");
		trailbg.appendMany("path.g-trail-path", trailf)
			.style("filter", "url(#drop-shadow)")
			.style("stroke", "rgba(255,255,255,0.3)")
			.attr("d", line(trailf[0].geometry.coordinates))

		var trailg = svg.append("g.g-trailg");
		trailpath = trailg.append("path.g-trail-path")
			.style("filter", "url(#drop-shadow)")
			.attr("d", line(trailf[0].geometry.coordinates))

		totalLength = Math.ceil(trailpath.node().getTotalLength());

		var data = res[1];
		ids = data.map(d => d.id);
		var cont = d3.select(".g-content").html("")

		var dp = cont.appendMany("div", data)	
			.attr("data-time", d => d.time)
			.attr("data-id", d => d.id)
			.attr("data-labeled", d => d.labeled)
			.attr("class", (d,i) => i == 0 ? "g-post g-post-active" : "g-post")
			.attr("id", (d,i) => "g-post-" + d.id)
			.style("background-image", d => "url(photos-100/h" + d.id + ".jpg)")

		var textcont = dp.append("div.g-text-cont")
			.style("opacity", d => !d.text_cn && !d.text_en ? "0" : "1")
			.append("div.g-text-cont-inner");
		textcont.append("div.g-text.g-text-cn")
			.style("opacity", d => !d.text_cn ? "0" : "1")
			.append("div.g-text-inner")
			.text(d => addemojis(d.text_cn))
		textcont.append("div.g-text.g-text-en")
			.style("opacity", d => !d.text_en ? "0" : "1")
			.append("div.g-text-inner")
			.text(d => addemojis(d.text_en))

	dotg = svg.append("g")
		.translate(projection([pts.start[0], pts.start[1]]))

	var dot = dotg.append("circle")
		.attr("r", 4)
		.attr("stroke-width", 1)
		.attr("fill", "none")
		.attr("stroke", "#ffcc00")
		.attr("id", "ring")

	dotg.append("circle")
			.attr("r", 4)
			.attr("fill", "#ffcc00")

	var labelg = svg.append("g");

	var list = ["start", "end"]
	list.forEach(function(d,i){
		labelg.append("text")
			.translate(function(){
				var pos = projection(pts[d])
				return i == 0 ? [pos[0]+5, pos[1]] : [pos[0]+5, pos[1]+20]
			})
			.tspans(i == 0 ? ["山頂", "The Peak"] : ["大浪灣", "Big Wave Bay"], 10) 
	})


	if (document.location.hash) {
		var id = document.location.hash.replace("#", "");
		prevcounter = (ids.indexOf(id))-1;
		counter = ids.indexOf(id);
		move(id, true);
	} else {
		move("cover", true)
	}


})

d3.selectAll(".g-nav-button").on("click", function(){
	var el = d3.select(this);
	var dir = el.attr("data-dir");
	prevcounter = counter;

	if (dir == "right") {
		counter += 1;
	}

	if (dir == "left") {
		counter -= 1;
	}

	if (counter < 0) {
		counter = 0;
	}

	if (counter > ids.length - 1) {
		counter = ids.length - 1
	}

	move(counter)
})


document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;


    if (e.keyCode == '37' || e.keyCode == '39') {

    	prevcounter = counter;

	    if (e.keyCode == '37') {
	       counter -= 1;
	    }
	    else if (e.keyCode == '39') {
	       counter += 1;
	    }

		if (counter < 0) {
			counter = 0;
		} else if (counter > ids.length - 1) {
			counter = ids.length - 1
		}
		move(counter)
    }

}

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);


var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/

    	prevcounter = counter;

        if ( xDiff > 0 ) {
        	counter += 1;
        } else {
            counter -= 1;
        }

        if (counter < 0) {
			counter = 0;
		} else if (counter > ids.length - 1) {
			counter = ids.length - 1
		}
		move(counter)

    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
        } else { 
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};


var starttime = new Date(2021,5,27,7,25);
function move(id, hash) {

	// d3.select("#g-post-" + ids[prevcounter]).classed("g-post-prev", false);
	// d3.select(".g-post-active").classed("g-post-prev", true);
	// d3.selectAll(".g-post").classed("g-post-active", false);


	if (id == "cover") {
		d3.select(".g-hint").style("display", "block")
		d3.selectAll(".g-detailed-map").classed("g-hide", true)
	} else {
		d3.select(".g-hint").style("display", "none")
	}

	var id = hash ? id : ids[id];
	var n = ids.indexOf(id);
	var el = d3.select("#g-post-" + id)

	var duration = id == "cover" ? 10000 : 1000

	var prev = true;
	
	d3.selectAll(".g-post").each(function(){
		var el = d3.select(this);
		var dd = el.attr("id");
		if (id == dd.replace("g-post-", "")) {
			el.style("transform", "translate(0,0)")
			prev = false;
		} else if (prev) {
			el.style("transform", "translate(-100%,0)")
		} else {
			el.style("transform", "translate(100%,0)")
		}
	})

	
	var photoid = el.attr("data-id")
	var time = el.attr("data-time")	

	console.log()

	var ext = el.attr("data-labeled") == "y" ? "-labeled" : "";

	el.style("background-image", "url(photos/h" + id + ext + ".jpg)")

	d3.select("#g-post-" + ids[n+1])
		.style("background-image", "url(photos/h" + ids[n+1] + ext + ".jpg)")

	// if (photoid == "cover" || photoid == "map") {
	// 	d3.selectAll(".g-dp").text("H000");
	// 	d3.selectAll(".g-time .g-hour").text("00");
	// 	d3.selectAll(".g-time .g-minute").text("00");

	// 	d3.selectAll(".g-distance .g-num").text("0.0")
	// 	d3.selectAll(".g-up .g-n").text("0")
	// 	d3.selectAll(".g-down .g-n").text("0")

	// 	dotg.translate(projection([pts.start[0], pts.start[1]]))
	// } else if (photoid == "101" || photoid == "102") {

	// } else {
		var idstring = id.substr(0,3);
		idstring = idstring.indexOf("map") > -1 ? "000" : idstring == "101" || idstring == "102" ? "100" : idstring
		d3.selectAll(".g-dp").transition().duration(0).text("H" + idstring);

		var previdstr = ids[prevcounter]
		previdstr = !previdstr ? "000" : previdstr
		previdstr = previdstr.substring(0,3)
		if (id != "101" && id != "102" && previdstr != idstring) {
			d3.select(".g-dp-bg")
				.transition()	
				.duration(0)
				.style("transform", "scale(1)")
				.style("opacity", "1")
				.transition()	
				.duration(1000)
				.style("transform", "scale(2)")
				.style("opacity", "0")	
		}

		var dattime = el.attr("data-time");
		
		if (id == "cover" || id == "101" || id == "102") {
			dattime = d3.select("#g-post-100").attr("data-time")
		}

		var newtime = new Date(2021,5,27,dattime.split(":")[0],dattime.split(":")[1]);
		var diffMs = (newtime - starttime); // milliseconds between now & Christmas
		var diffDays = Math.floor(diffMs / 86400000); // days
		var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
		var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

		if (id == "cover") {
			d3.select(".g-time .g-hour")
			.transition()
			.ease(d3.easeLinear)
			.duration(duration)
			.tween("text", function(d) {
			        var element = d3.select(this);
		        	var i = d3.interpolate(0, diffHrs);
		        	return function(t) {
		        	    element.text( String(Math.round(i(t))).padStart(2, '0'));
		        	};
			})

			d3.select(".g-time .g-minute")
			.transition()
			.ease(d3.easeLinear)
			.duration(duration)
			.tween("text", function(d) {
		        var element = d3.select(this);
		        	var i = d3.interpolate(0, diffMins);
		        	return function(t) {
		        	    element.text( String(Math.round(i(t))).padStart(2, '0'));
		        	};
			})

		} else if (id.indexOf("map") == -1) {

			d3.select(".g-detailed-map").classed("g-hide", true);
			d3.select(".g-time .g-hour").transition().duration(0).text(String(diffHrs).padStart(2, '0'));

			var lastmin = d3.select(".g-time .g-minute").text();
			lastmin = lastmin == "NaN" ? 0 : lastmin

			d3.select(".g-time .g-minute")
			.transition()
			.ease(d3.easeLinear)
			.duration(duration)
			.tween("text", function(d) {
			        var element = d3.select(this);
			        if (diffMins < lastmin) {
			        	var i = d3.interpolate(0, diffMins);
			        	return function(t) {
			        	    element.text( String(Math.round(i(t))).padStart(2, '0'));
			        	};
			        } else {
			        	var i = d3.interpolate(lastmin, diffMins);
			        	return function(t) {
			        	    element.text( String(Math.round(i(t))).padStart(2, '0'));
			        	};
			        }
			})
		}
		

	if (photoid.indexOf("map") > -1) {

		d3.select(".g-map").classed("g-hide", true)
		d3.select(".g-meta").classed("g-hide", true)
		d3.select(".g-detailed-map").classed("g-hide", false);
		trailpath
			.transition().duration(0)
			.ease(d3.easeLinear)
		  .attr("stroke-dasharray", totalLength + " " + totalLength)
		  .attr("stroke-dashoffset", totalLength)



		if (photoid == "map") {
			drawDetailedMap();
		} else {
			if (!dmap) {
				drawDetailedMap();
			}
			zoomMap();
		}

		

	// } else if (photoid == "000") {

	// 	d3.select(".g-map").classed("g-hide", false)
	// 	dotg.transition().duration(0).translate(projection([pts.start[0], pts.start[1]]))
	// 	trailpath.transition().duration(0)
	// 			  .attr("stroke-dasharray", totalLength + " " + totalLength)
	// 			  .attr("stroke-dashoffset", totalLength)



	} else {

		d3.select(".g-map").classed("g-hide", false)
		d3.select(".g-detailed-map").classed("g-hide", true)
		d3.select(".g-meta").classed("g-hide", false)

		var endnum = id == "cover" || id == "H000" ? 0: id.replace("H", "").slice(0, 3)
		var endpt = trackpts.filter(d => d.dp == "H" + endnum)[0];
		endpt = !endpt ? trackpts[trackpts.length - 1] : endpt

		var endpct = id == "cover" || id == "100" ? 1 : id == "000" ? 0 : endpt.dist/totaldist;

		var previd = ids[prevcounter];
		previd = !previd ? "cover" : previd;
		var prevnum = previd == "cover" ? 0 : previd.replace("H", "").slice(0, 3)
		var startpt = trackpts.filter(d => d.dp == "H" + prevnum)[0];
		var startpct = previd == "cover" || !startpt ? 0 : startpt.dist/totaldist;

		// var prevup = +d3.select(".g-up .g-n").html();
		// var prevdown = +d3.select(".g-down .g-n").html();

		if (id == "102") {

			dotg.transition()
				.duration(0)
				.ease(d3.easeLinear)
				.tween("pathTween", function(){return pathTween(trailpath)})

		} else {
			dotg.transition()
				.duration(duration)
				.ease(d3.easeLinear)
				.tween("pathTween", function(){return pathTween(trailpath)})
		}
		

		if (endpt) {

			var lastdist = d3.select(".g-distance .g-num").text();

			lastdist = id == "cover" ? 0 : lastdist;
			endpt = id == "000" ? trackpts[0] : id == "100" ? trackpts[trackpts.length - 1] : endpt;

			if (id == '000') {
				d3.select(".g-distance .g-num")
					.transition()
					.text("0.0")
			} else {

				d3.select(".g-distance .g-num")
				.transition()
				.ease(d3.easeLinear)
				.duration(duration)
				.tween("text", function(d) {
				        var element = d3.select(this);
				        var i = d3.interpolate(lastdist, Math.round(endpt.dist*10)/10);
				        return function(t) {
				            element.text( (Math.round(i(t)*10)/10).toFixed(1) );
				        };
				})
			}

			if (id == "cover") {
				d3.selectAll(".g-dp")
					.transition()
					.ease(d3.easeLinear)
					.duration(duration)
					.tween("text", function(d){
						var element = d3.select(this);
						var i = d3.interpolate(0, 100);
						return function(t) {
						    element.text( "H" + String(Math.round(i(t))).padStart(3,'0') );
						};
					})
			}
		}

		function pathTween(path){
			var r = d3.interpolate(totalLength*startpct, totalLength*endpct);
			return function(t){
				if (!isNaN(r(t))) {

					trailpath
						.transition().duration(0)
					  .attr("stroke-dasharray", (r(t)/totalLength)*totalLength + " " + totalLength)
					  .transition()
					  	.ease(d3.easeLinear)
					    .attr("stroke-dashoffset", 0)

					var point = trailpath.node().getPointAtLength(r(t));
					dotg.attr("transform", "translate(" + point.x + "," + point.y + ")")
				}
			}
		}

	}

	document.location.hash = id;	

}


function drawDetailedMap() {

	dmap = d3.select(".g-detailed-map").html("");

	dw = dmap.node().getBoundingClientRect().width;
	dh = dmap.node().getBoundingClientRect().height;
	dsvg = dmap.append("svg").attr("width", dw).attr("height", dh);

	dsvg = dsvg.append("g").translate([dw*0.14,0])

	var hkg_shape = topojson.feature(all, all.objects.hkg)

	dproj = d3.geoMercator().fitSize([dw*0.7, dh], trailshape);
	dpath = d3.geoPath().projection(dproj);
	var dlabels = [
		[114.14943400741993, 22.271377235993967, ["山頂","The Peak"], "start", 5, -10, 0],
		[114.2455999, 22.2447003, ["大浪灣","Big Wave", "Bay"], "start", 8, -20, 2800],
		[114.19838854860322, 22.266363543179235, ["渣甸山", "Jardine's" , "Lookout", "433m"], "end", -8, -30, 1500],
		[114.21106306951931, 22.267696293070586, ["畢拿山", "Mount Butler", "435m"], "start", 5, -25, 1800],
		[114.2436948721778, 22.235820773514856, ["打爛埕頂山", "Shek O", "Peak", "284m"], "start", 5, 10, 2200]
	]

	dsvg.appendMany("path.g-hkg-shape", hkg_shape.features)
		.style("stroke-width", 0.3)
		.style("fill", "none")
		.style("stroke", "rgba(255,255,255,0.5)")
		.attr("d", dpath)

	// var contourf = topojson.feature(contours, contours.objects["contours100-clipped"]).features
	// contourf = contourf.sort((a,b) => a.geometry.coordinates.length - b.geometry.coordinates.length)
	// dsvg.append("g.g-contours").appendMany("path", contourf)
	// 	.style("stroke-width", 0.3)
	// 	.style("fill", "none")
	// 	.style("stroke", "rgba(255,255,255,0.2)")
	// 	.attr("d", dpath)

	dline = d3.line()
      .x(function(d) { return dproj(d)[0]; })
      .y(function(d) { return dproj(d)[1]; })
      .curve(d3.curveBasis);
		
	dtrailpath = dsvg.append("path.g-trail-path")
				.style("filter", "url(#drop-shadow)")
				.attr("d", dline(trailf[0].geometry.coordinates))

	var dtotalLength = dtrailpath.node().getTotalLength();
	dtrailpath.transition()
	.attr("stroke-dasharray", dtotalLength + " " + dtotalLength)
	.attr("stroke-dashoffset", dtotalLength)
	.transition()
	  .duration(3000)
	  .ease(d3.easeLinear)
	  .attr("stroke-dashoffset", 0);	
		
	var dlabelsg = dsvg.append("g")
	var dlabs = dlabelsg.appendMany("g.g-labels", dlabels)
		.translate(d => dproj([d[0], d[1]]))
	
	dlabs.style("opacity", 0)
		.transition()
		.duration(1000)
		.delay(d => d[6])
		.style("opacity", 1)

	dlabs.append("circle")
		.attr("r", 3)
		.style("fill", "#ffcc00")
		.style("stroke", "#000")

	dlabs.append("text")
		.attr("text-anchor", d => d[3])
		.translate(d => [d[4], d[5]])
		.style("fill", "#c6c6c6")
		.tspans(d => d[2], 10.5)

	dmap.append("div.g-big-text.g-big-text-cn")
		.text("香港島")

	dmap.append("div.g-big-text.g-big-text-en")
		.text("Hong Kong Island")
}

function zoomMap() {

	var duration = 2000;
	dsvg.transition().duration(duration)
		.attr("transform", "scale(0.28) translate(" + dw/0.52 + "," + dh/0.6 + ")")
	d3.select(".g-hkg-shape")
		.style("fill", "rgba(255,255,255,0")
		.transition().duration(duration)
		.style("stroke-width", 0.5).style("stroke", "rgba(255,255,255,1)")
		.style("fill", "rgba(255,255,255,0.06")

	dsvg.selectAll(".g-labels").remove();
	dmap.selectAll(".g-big-text").remove();


	var trails = ["t_hk", "t_lantau", "t_maclehose", "t_wilson"]
	var trailnames = ["港島徑//Hong Kong Trail", "鳳凰徑//Lantau Trail", "麥理浩徑//MacLehose Trail", "衞奕信徑//Wilson Trail"]

	trails.forEach(function(trail, ti){

		var trailf = topojson.feature(all, all.objects[trail]).features

		if (dtrailpath && trail == "t_hk") {
			dtrailpath.transition().duration(0).attr("stroke-dashoffset", 0);	
		} else {
			dsvg.appendMany("path.g-trail-path.g-four-trail-path", trailf)
				.attr("id", (d,i) => trail + "_" + i)
				.style("stroke", trail == "t_hk" ? "#ffcc00" : "rgba(2555,255,255,0.7)")
				.style("stroke-width", 4)
				.attr("d", dpath)	
		}

		if (trail == "t_wilson") {
			dsvg.append("path.g-trail-path.g-four-trail-path")
				.attr("id", "hi")
				.style("stroke", "rgba(2555,255,255,0.5)")
				.style("stroke-width", 2)
				.attr("d", dline([[114.214945,22.284631], [114.23487,22.30812]]))
		}

		var dd = dmap.append("div.g-trail-label.g-tl-" + trail)
		
		dd.style("opacity", 0)
			.transition()
			.delay(duration)
			.duration(1000)
			.style("opacity", 1)

		dd.append("div.g-text-cn").text(trailnames[ti].split("//")[0])
		dd.append("div.g-text-en").text(trailnames[ti].split("//")[1])
	})

	dsvg.selectAll(".g-four-trail-path").each(function(){

		var el = d3.select(this)
		var id = el.attr("id");
		var dtotalLength = el.node().getTotalLength();

		el.transition()
		.attr("stroke-dasharray", dtotalLength + " " + dtotalLength)
		.attr("stroke-dashoffset", dtotalLength)
		.transition()
			.delay(id == "hi" ? 300 : 0)
		  .duration(id.indexOf("hk") > -1 ? 0 : id == "hi" ? 500 : duration)
		  .ease(d3.easeLinear)
		  .attr("stroke-dashoffset", 0);

	})

}