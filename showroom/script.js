console.log(stocklist)

var total = 0;
var shoppingcart = {};
var customprice = {};
var customcount = 0;

d3.selectAll(".g-item").on("click", function(){

	var el = d3.select(this);
	var price = el.attr("data-price");
	var count = +el.attr("data-count");
	var slug = el.attr("data-slug");


	if (price == "custom") {

		let item = prompt("買咩", "");
		if (item != null) {
			slug = item;
		}

		let price = prompt("幾錢", "0");
		if (price != null) {
			total += +price;
		}

		stocklist.push({
			slug: slug,
			price: price
		})

		if (!shoppingcart[slug]) {
			shoppingcart[slug] = 0;
		}
		shoppingcart[slug] += 1;

	} else if (slug == "黎膠") {

		if (!shoppingcart[slug]) {
			shoppingcart[slug] = 0;
		}
		shoppingcart[slug] += 1;

		if (shoppingcart[slug] && shoppingcart[slug]%2 === 0) {
			total += 112;
		} else {
			total += +price;
		}


	} else {

		if (!shoppingcart[slug]) {
			shoppingcart[slug] = 0;
		}
		shoppingcart[slug] += 1;

		total += +price;
	}

	
	count += 1;
	el.select(".g-item-count").classed("g-active", true);
	el.select(".g-item-count").html(count);
	el.attr("data-count", count);

	d3.select(".g-total-num").html(total);
})

		// form submission
		$( document ).ready( function(){
			var $form = $('form#my-form'),
			    // url = 'https://script.google.com/macros/s/AKfycbxHCw8DUBjM3OMe9k-yewFaDLM8Zp43Q8i3lWqC4AvCof4eExIljQURrwOo-im_zIx5/exec'
			    url = 'https://script.google.com/macros/s/AKfycbwfZ1Jlkw_uD3XLRsdkvva2FWuQmAVa_RqY4XvobCKAVCuFYfGy93ZtQUgCITLvjW-0fA/exec'


			$('#submit').on('click', function(e) {

				  e.preventDefault();

				  var now = new Date();
				  var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");
				  var nowtime = formatTime(now);

				  // if (no payment method) {
				  
				  // } else {
				
				  	var orders = [];

				  	var keys = Object.keys(shoppingcart);
				  	keys.sort();

				  	var paymentel = document.getElementById("payment");
				  	var payment = paymentel.value;

				  	if (payment == "點俾錢") {

				  		d3.select("#payment").transition().style("background", "rgba(255,0,0,1)").transition().style("background", "rgba(255, 255, 255, 0.8)")

				  	} else {
	  				  	keys.forEach(function(d,i){
	  				  		console.log(d)
	  				  		var price = stocklist.filter(a => a.slug == d)[0].price;
	  				  		console.log("hi")
	  				  		console.log(stocklist.filter(a => a.slug == d))

	  				  		orders.push({
	  				  			datetime: nowtime,
	  				  			date: nowtime.split(" ")[0],
	  				  			time: nowtime.split(" ")[1],
	  				  			item: d,
	  				  			count: shoppingcart[d],
	  				  			price: price*shoppingcart[d],
	  				  			payment: payment
	  				  		})
	  				  	})

	  				  	d3.select(".g-loading").style("display", "block");

	  		  	  		var jqxhr = $.ajax({
	  		  	  		  url: url,
	  		  	  		  method: "GET",
	  		  	  		  dataType: "json",
	  		  	  		  data: JSON.stringify(orders),
	  		  	  		  success: function(res){ 
	  		  	  		  	console.log(res);
	  		  	  		  	location.reload();
	  		  	  		  }
	  		  	  		})	
				  	}

				  	

				  // }

			})
		})


