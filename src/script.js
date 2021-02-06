var curid = "";


document.addEventListener("DOMContentLoaded", function(e) {
   	
   	function resize() {
   		d3.selectAll(".g-nav-list").each(function(){
   			var el = d3.select(this);
   			var nameheight = el.select(".g-nav-name").node().getBoundingClientRect().height;
   			var contentheight = el.select(".g-nav-content").node() ? el.select(".g-nav-content").node().getBoundingClientRect().height : nameheight;
   			el.attr("data-h1", nameheight)
   			el.attr("data-h2", nameheight + contentheight)
   			el.style("height", nameheight + "px")
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


   	function showThing(slug) {
   		var el = d3.select(".g-nav-list-" + slug);
   		el.attr("data-state", "show");
   		el.classed("g-show", true);
   		el.transition().style("height", el.attr("data-h2") + "px")
   	}


   	if (document.location.hash.indexOf("lkk-") > -1) {
   		showThing("store");
   		d3.select(".g-stock-list").classed("g-hide", true);
   		d3.select(".g-stock-" + document.location.hash.replace("#lkk-", "")).classed("g-hide", false);	

   		d3.selectAll(".g-store-buy").classed("g-cur-stock", false);
   		d3.select(".g-stock-" + document.location.hash.replace("#lkk-", "")).classed("g-cur-stock", true);
   	} else if (document.location.hash) {
   		showThing(document.location.hash.replace("#", ""));
   		curid = document.location.hash.replace("#", "")
   	}

	d3.selectAll(".g-nav-name").on("click", function(){

		// d3.selectAll(".g-nav-list").each(function(){
		// 	var el = d3.select(this);
		// 	el.attr("data-state", "hidden")
		// 	el.transition().style("height", el.attr("data-h1") + "px")
		// })


		var el = d3.select(d3.select(this).node().parentNode);
		var state = el.attr("data-state");
		var id = el.attr("data-id");


		// if (curid != id) {
		// 	console.log({curid, id})
			var hide = d3.select(".g-show")
			hide.classed("g-show", false)
			hide.attr("data-state", "hidden")
			hide.transition().style("height", el.attr("data-h1") + "px")
		// 	curid = id;
		// }


		if (state == "hidden") {
			el.attr("data-state", "show")
			el.transition().style("height", el.attr("data-h2") + "px")
			el.classed("g-show", true);

			document.location.hash = el.attr("data-id");

		} else {
			el.attr("data-state", "hidden")
			el.transition().style("height", el.attr("data-h1") + "px")
			el.classed("g-show", false);

			document.location.hash = "";
		}
	})

	d3.selectAll(".g-store-each").on("click", function(){

		var el = d3.select(this);

		d3.select(".g-stock-list").classed("g-hide", true);
		d3.select(".g-stock-" + el.attr("data-id")).classed("g-hide", false);

		d3.selectAll(".g-store-buy").classed("g-cur-stock", false);
		d3.select(".g-stock-" + el.attr("data-id")).classed("g-cur-stock", true);

		document.location.hash = "lkk-" + el.attr("data-id");

	})

	d3.selectAll(".g-back").on("click", function(){

		d3.select(".g-stock-list").classed("g-hide", false);
		d3.selectAll(".g-store-buy").classed("g-hide", true);

		document.location.hash = "store";		

	})


	d3.select(".g-buy-popup").style("width", innerWidth).style("height", innerHeight)

	d3.select("#g-x").on("click", function(){
		d3.select(".g-buy-popup").classed("g-active", false);

		d3.select("#my-form").classed("g-hide", false)
		d3.select(".g-submitted").classed("g-hide", true)	

	})

	d3.selectAll(".g-count-button").on("click", function(){
		var el = d3.select(this);
		var type = el.attr("data-type");

		var count = +d3.select(".g-count").text();

		if (type == "minus") {
			count -= 1;
		} else if (type == "add") {
			count += 1;
		}

		count = count < 1 ? 1 : count;

		d3.select(".g-count").text(count);

	})

	d3.selectAll(".g-button").on("click", function(){
		d3.select(".g-buy-popup").classed("g-active", true);

		var curstockid = d3.select(".g-cur-stock").attr("data-id");
		var curstockel = d3.select(".g-stock-" + curstockid);

		var stockid = curstockel.select("#stock-name").attr("data-id");
		var size = curstockel.select("#size").property("value");

		var name = curstockel.select("#stock-name").text().replace("(起碼三月先有貨)", "");

		d3.select(".g-bought").property("value", name + " " + stockid + " x " + +d3.select(".g-count").text() + " x " + size)

		if (stockid == "001") {
			var amount = size == "小小心意" ? 10 : size == "多多益善" ? 50 : 100;
			d3.select("#price").property("value", "$" + amount*+d3.select(".g-count").text())
			d3.select(".g-note").style("display", "none")
		} else {
			d3.select("#price").property("value", "$" + d3.select(".g-count").text()*280)
			d3.select(".g-note").style("display", "block")
		}
	
	})


	$( document ).ready( function(){
		var $form = $('form#my-form'),
		    url = 'https://script.google.com/macros/s/AKfycbzyYUxhWKsfDJlVt6JP0Y6A-DB_YBFfTbnyBqAkd9-fWjkfpAxEZVPX/exec'

		$('#submit').on('click', function(e) {

			  e.preventDefault();

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

			  	var jqxhr = $.ajax({
			  	  url: url,
			  	  method: "GET",
			  	  dataType: "json",
			  	  data: $form.serialize(),
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


