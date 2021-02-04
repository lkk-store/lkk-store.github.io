d3.select(".g-buy-popup").style("width", innerWidth).style("height", innerHeight)

d3.select("#g-x").on("click", function(){
	d3.select(".g-buy-popup").classed("g-active", false);

	d3.select("#my-form").classed("g-hide", false)
	d3.select(".g-submitted").classed("g-hide", true)	

})

d3.select(".g-button").on("click", function(){
	d3.select(".g-buy-popup").classed("g-active", true);

	var stockid = d3.select("#stock-name").attr("data-id");
	var size = d3.select("#size").property("value");

	d3.select(".g-bought").property("value", d3.select("#stock-name").text() + " " + stockid + " x " + d3.select("#fname").property("value") + " x " + size)

	if (stockid == "003") {

		var amount = size == "小小心意" ? 10 : size == "多多益善" ? 50 : 100;
		d3.select("#price").property("value", amount*d3.select("#fname").property("value"))

	} else {

		d3.select("#price").property("value", d3.select("#fname").property("value")*280)	
	}
	
})


$( document ).ready( function(){
	var $form = $('form#my-form'),
	    url = 'https://script.google.com/macros/s/AKfycbzyYUxhWKsfDJlVt6JP0Y6A-DB_YBFfTbnyBqAkd9-fWjkfpAxEZVPX/exec'

	$('#submit').on('click', function(e) {
	  e.preventDefault();

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
	})
})
