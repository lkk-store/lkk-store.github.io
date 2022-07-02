console.clear();

var sel = d3.select(".g-map").html("")
sel = sel.append("div.g-map-inner");
var width = 350;
var height = width*0.4;

d3.select(".g-body").style("margin-top", (innerHeight/2 - d3.select(".g-body").node().getBoundingClientRect().height/2) + "px")

var dot, ids, wps, dotg, projection, trailpath, path, trailf, totalLength;

var pts = {
	"start": [114.14943400741993, 22.271377235993967],
	"end": [114.2450688769546, 22.247412223842055]
}

var counter = 0;
var prevcounter = 0;

function addemojis(x) {
	return x.replace(":lol:", "😂").replace(":tear:", "🥲")
}

d3.queue()
	.defer(d3.json, "trail.json")
	.defer(d3.json, "data.json")
	// .defer(d3.json, "hkg.json")
	.awaitAll(function (err, res){

		var trail = res[0];
		var trailshape = topojson.feature(trail, trail.objects.trail);

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
		var cont = d3.select(".g-content").html("");

		var dp = cont.appendMany("div", data)	
			.attr("data-time", d => d.time)
			.attr("data-id", d => d.id)
			.attr("class", (d,i) => i == 0 ? "g-post g-post-active" : "g-post")
			.attr("id", (d,i) => "g-post-" + d.id)
			.style("background-image", d => "url(photos-100/h" + d.id + ".jpg)")

		var textcont = dp.append("div.g-text-cont").append("div.g-text-cont-inner");

		textcont.append("div.g-text.g-text-cn").append("div.g-text-inner")
			.text(d => addemojis(d.text_cn))
		textcont.append("div.g-text.g-text-en").append("div.g-text-inner")
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
		move(id, true)
		prevcounter = ids.indexOf(id)-1;
		counter = ids.indexOf(id);
	} else {
		move("cover", true)
	}


})

function animatePath(type, to) {

	if (type == "start") {
		trailpath
		  .transition()
		  .attr("stroke-dasharray", totalLength + " " + totalLength)
		  .attr("stroke-dashoffset", totalLength)
		  .transition()
		    .duration(10000)
		    .ease(d3.easeLinear)
		    .attr("stroke-dashoffset", 0);	

	} else if (type == "first") {
		trailpath
			.attr("stroke-dasharray", totalLength + " " + totalLength)
		  .transition()
		    .duration(500)
		    .ease(d3.easeLinear)
		    .attr("stroke-dashoffset", totalLength)

	}
	
}


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


function move(id, hash) {

	// d3.select("#g-post-" + ids[prevcounter]).classed("g-post-prev", false);
	// d3.select(".g-post-active").classed("g-post-prev", true);
	// d3.selectAll(".g-post").classed("g-post-active", false);
	
	var id = hash ? id : ids[id];
	var n = ids.indexOf(id);
	var el = d3.select("#g-post-" + id)

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

	el.style("background-image", "url(photos/h" + id + ".jpg)")

	d3.select("#g-post-" + ids[n+1])
		.style("background-image", "url(photos/h" + ids[n+1] + ".jpg)")



	if (photoid == "cover" || photoid == "101" || photoid == "map" || photoid == "102") {
		d3.select(".g-dp").text("");
		d3.select(".g-time").text("");
	} else {
		d3.select(".g-dp").text("H" + id.substr(0,3));
		d3.select(".g-time").text(time);
	}


	if (photoid == "map") {

		d3.select(".g-map").classed("g-hide", true)
		trailpath
		  .attr("stroke-dasharray", totalLength + " " + totalLength)
		  .attr("stroke-dashoffset", totalLength)

	} else {

		d3.select(".g-map").classed("g-hide", false)

		var endnum = id == "cover" ? 0 : id.replace("H", "").slice(0, 3)
		var endpct = endnum/100;

		var previd = ids[prevcounter];
		var prevnum = previd == "cover" ? 0 : previd.replace("H", "").slice(0, 3)
		var startpct = prevnum/100;

		if (id == "cover") {
			animatePath("start");
		} else if (trailpath.node()) {
			dotg.transition()
				.tween("pathTween", function(){return pathTween(trailpath)})
		}

		function pathTween(path){
			var r = d3.interpolate(totalLength*startpct, totalLength*endpct);
			return function(t){
				if (!isNaN(r(t))) {

					trailpath
					  .attr("stroke-dasharray", (r(t)/totalLength)*totalLength + " " + totalLength)
					  .transition()
					    .duration(500)
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



