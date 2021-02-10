document.addEventListener("DOMContentLoaded", function(e) {
   	
   	function resize() {
   		d3.selectAll(".g-nav-list").each(function(){
   			var el = d3.select(this);
   			var nameheight = el.select(".g-nav-name").node().getBoundingClientRect().height;
   			var contentheight = el.select(".g-stock-list").node() ? el.select(".g-stock-list").node().getBoundingClientRect().height : nameheight;
   			el.attr("data-h1", nameheight)
   			
   			if (el.attr("data-instore") == "true") {
   				el.style("height", (+el.attr("data-h1") + el.select(".g-cur-stock").node().getBoundingClientRect().height) + "px")
   			} else if (el.attr("data-state") == "show") {
   				el.attr("data-h2", nameheight + contentheight)
   				el.style("height", el.attr("data-h2") + "px")
   			} else {
   				el.attr("data-h2", nameheight + contentheight)
   				el.style("height", nameheight + "px")
   			}
   		})
   	}

   	resize();
   	var containerWidthChanged = false;
   	var ow = innerWidth;

   	window.addEventListener("resize", function(){
   	    if (innerWidth != ow) {
   	        containerWidthChanged = true;
   	        ow = innerWidth;
   	        resize();
   	      }
   	});	


   	// hash function
   	function showThing(slug, hash) {
   		var el = d3.select(".g-nav-list-" + slug);
   		el.attr("data-state", "show");
   		el.classed("g-show", true);

   		if (hash.indexOf("-") > -1 && hash != "#project-upcoming") {

   			el.attr("data-instore", "true")

   			var id = hash.replace("#", "")
   			d3.selectAll(".g-" + name + "-list").classed("g-hide", true);
   			d3.select(".g-" + id).classed("g-hide", false);	

   			d3.selectAll(".g-store-buy").classed("g-cur-stock", false);
   			d3.select(".g-" + id).classed("g-cur-stock", true);

   			console.log(d3.select(".g-" + id))
   			console.log((+el.attr("data-h1") + d3.select(".g-" + id).node().getBoundingClientRect().height))
   			el.transition().style("height", (+el.attr("data-h1") + d3.select(".g-" + id).node().getBoundingClientRect().height) + "px")
   		} else {
   			el.transition().style("height", (+el.attr("data-h1") + +el.attr("data-h2")) + "px")
   		}
   	}

   	if (document.location.hash != "") {
   		if (document.location.hash.indexOf("lkk") == -1) {
   			var hash = document.location.hash
   			var page = hash.split("-")[0].replace("#", "");
   			var cont = page == "project" ? "project-upcoming" : page;
  			var name = page == "project" ? "upcoming" : page;
   			
   			showThing(cont, hash);
   		} else if (document.location.hash != "") {
   			showThing(document.location.hash.replace("#", ""));
   		}	
   	} 

   	function back(page) {
   		d3.selectAll(".g-stock-list").classed("g-hide", false);
   		d3.selectAll(".g-store-buy").classed("g-hide", true);

   		var nav = d3.select(".g-nav-list-" + page);
   		nav.attr("data-instore", "false");
   		nav
   			.transition()
   			.style("height", (+nav.attr("data-h1") + +nav.attr("data-h2")) + "px")

   		document.location.hash = page;
   	}

   	// nav click function
	d3.selectAll(".g-nav-name").on("click", function(){
		var el = d3.select(d3.select(this).node().parentNode);
		var state = el.attr("data-state");
		var instore = el.attr("data-instore") == "true";
		console.log(state, instore)
		var id = el.attr("data-id");

		if (instore) {
			back(el.attr("data-id"));
		} else {
			var hide = d3.select(".g-show")
			hide.classed("g-show", false)
			hide.attr("data-state", "hidden")
			hide.transition().style("height", el.attr("data-h1") + "px")
		}

		if (instore) {
		} else if (state == "hidden") {
			el.attr("data-state", "show");
			el.transition().style("height", (+el.attr("data-h1") + +el.attr("data-h2")) + "px")
			el.classed("g-show", true);
			document.location.hash = el.attr("data-id");
		} else {
			el.attr("data-state", "hidden")
			el.transition().style("height", el.attr("data-h1") + "px")
			el.classed("g-show", false);
			document.location.hash = "";
		}
	})

	// stock click function
	d3.selectAll(".g-store-each").on("click", function(){
		var el = d3.select(this);
		var nav = d3.select(".g-nav-list-" + el.attr("data-page"));
		var list = d3.select(".g-" + el.attr("data-page") + "-list");
		var item = d3.select(".g-" + el.attr("data-page") + "-" + el.attr("data-id"));

		list.classed("g-hide", true);
		item.classed("g-hide", false);

		d3.selectAll(".g-store-buy").classed("g-cur-stock", false);
		item.classed("g-cur-stock", true);

		var nameheight = nav.attr("data-h1");
		var stockheight = item.node().getBoundingClientRect().height;

		nav.transition().style("height", (+nameheight + +stockheight) + "px");
		nav.attr("data-instore", "true");

		document.location.hash = el.attr("data-page") + "-" + el.attr("data-id");

	})

	d3.selectAll(".g-back").on("click", function(){
		back(d3.select(this).attr("data-page"))
	})

	d3.select(".g-buy-popup").style("width", innerWidth).style("height", innerHeight)
	d3.select("#g-x").on("click", function(){
		d3.select(".g-buy-popup").classed("g-active", false);
		d3.select("#my-form").classed("g-hide", false);
		d3.select(".g-submitted").classed("g-hide", true);
	});

	// count button
	d3.selectAll(".g-count-button").on("click", function(){
		var el = d3.select(this);
		var id = d3.select(el.node().parentNode).attr("data-id");
		var type = el.attr("data-type");

		var parentel = d3.select(el.node().parentNode);

		var count = +parentel.select(".g-count").text();

		if (type == "minus") {
			count -= 1;
		} else if (type == "add") {
			count += 1;
		}

		count = count < 1 ? 1 : count;
		parentel.select(".g-count").text(count);
	})


	// img slideshow 
	d3.selectAll(".g-img-thumbnail").on("click", function(){

		var el = d3.select(this);
		var id = el.attr("data-id");
		var item = el.attr("data-item");
		console.log(id)

		d3.selectAll(".g-img-slideshow-group-store-" + id).classed("g-on-top", false);
		d3.select(".g-img-slideshow-" + item).classed("g-on-top", true);

	})


	// buy popup
	d3.selectAll(".g-button").on("click", function(){
		d3.select(".g-buy-popup").classed("g-active", true);

		var stockid = d3.select(".g-cur-stock").attr("data-id");
		var curstockel = d3.select(".g-store-" + stockid);
		var size = curstockel.select("#size").property("value");
		var name = curstockel.select("#stock-name").text().replace("(起碼三月先有貨)", "");
		var count = curstockel.select(".g-count").text();
		d3.select(".g-bought").property("value", "").property("value", name + " " + stockid + " x " + count + " x " + size)

		if (stockid == "001") {
			var amount = size == "小小心意" ? 10 : size == "多多益善" ? 50 : 100;
			d3.select("#price").property("value", "$" + amount*+count)
			d3.select(".g-note").style("display", "none")
		} else {
			d3.select("#price").property("value", "$" + +count*280)
			d3.select(".g-note").style("display", "block")
		}
	})

	// form submission
	$( document ).ready( function(){
		var $form = $('form#my-form'),
		    url = 'https://script.google.com/macros/s/AKfycbzyYUxhWKsfDJlVt6JP0Y6A-DB_YBFfTbnyBqAkd9-fWjkfpAxEZVPX/exec'

		$('#submit').on('click', function(e) {

			  e.preventDefault();

			  var now = new Date();
			  var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");

			  console.log("hi")

			  var name = d3.select("#name").property("value");
			  var phone = d3.select("#phone").property("value");

			  if (phone == "" || name == "") {
			  	if (phone == "") {
			  		d3.select("#phone").transition().style("background", "rgba(255,0,0,0.5)").transition().style("background", "rgba(255, 255, 255, 0.8)")
			  	}
			  	if (name == "") {
			  		d3.select("#name").transition().style("background", "rgba(255,0,0,0.5)").transition().style("background", "rgba(255, 255, 255, 0.8)")
			  	}
			  } else {

			  	d3.select("#submit").classed("g-loading", true);

			  	var formdata = $form.serialize();

			  	console.log(formdata)
			  	formdata += "&date=" + formatTime(now);

			  	var jqxhr = $.ajax({
			  	  url: url,
			  	  method: "GET",
			  	  dataType: "json",
			  	  data: formdata,
			  	  success: function(){ 

			  	  	$('#my-form').trigger("reset");

			  	  	d3.select("#submit").classed("g-loading", false);
			  	  	d3.select("#my-form").classed("g-hide", true)
			  	  	d3.select(".g-submitted").classed("g-hide", false)
			  	  }
			  	})
			  	
			  }

		})
	})

/* Your D3.js here */
})


