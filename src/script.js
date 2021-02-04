d3.select(".g-buy-popup").style("width", innerWidth).style("height", innerHeight)

d3.select("#g-x").on("click", function(){
	d3.select(".g-buy-popup").classed("g-active", false);

	d3.select("#my-form").classed("g-hide", false)
	d3.select(".g-submitted").classed("g-hide", true)	

})

d3.selectAll(".g-count-button").on("click", function(){
	var el = d3.select(this);
	var type = el.attr("data-type");

	console.log(type)
	var count = +d3.select(".g-count").text();

	if (type == "minus") {
		count -= 1;
	} else if (type == "add") {
		count += 1;
	}

	count = count < 1 ? 1 : count;

	d3.select(".g-count").text(count);

})

d3.select(".g-button").on("click", function(){
	d3.select(".g-buy-popup").classed("g-active", true);

	var stockid = d3.select("#stock-name").attr("data-id");
	var size = d3.select("#size").property("value");

	var name = d3.select("#stock-name").text().replace("(起碼三月先有貨)", "");

	d3.select(".g-bought").property("value", name + " " + stockid + " x " + +d3.select(".g-count").text() + " x " + size)

	if (stockid == "003") {

		var amount = size == "小小心意" ? 10 : size == "多多益善" ? 50 : 100;
		d3.select("#price").property("value", "$" + amount*+d3.select(".g-count").text())

	} else {

		d3.select("#price").property("value", "$" + d3.select(".g-count").text()*280)	
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
