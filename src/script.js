var shoppingcart = {};
var doneshopping = false;
var buying = false;

document.addEventListener("DOMContentLoaded", function(e) {

	d3.select(".g-popup-x").on("click", function(){
		d3.select(".g-popup").style("display", "none")
	})

	function elementInViewport2(el) {
		var el = el.node();
	  var top = el.offsetTop;
	  var left = el.offsetLeft;
	  var width = el.offsetWidth;
	  var height = el.offsetHeight;

	  while(el.offsetParent) {
	    el = el.offsetParent;
	    top += el.offsetTop;
	    left += el.offsetLeft;
	  }

	  return (
	    top < (window.pageYOffset + window.innerHeight) &&
	    left < (window.pageXOffset + window.innerWidth) &&
	    (top + height) > window.pageYOffset &&
	    (left + width) > window.pageXOffset
	  );
	}

   	function resize() {
   		d3.selectAll(".g-nav-list").each(function(){
   			var el = d3.select(this);
   			var nameheight = el.select(".g-nav-name").node().getBoundingClientRect().height;
   			var contentheight = el.select(".g-stock-list").node() ? el.select(".g-stock-list").node().getBoundingClientRect().height : nameheight;
   			el.attr("data-h1", nameheight)
   			
   			if (el.attr("data-incart") == "true") {
   				el.style("height", (+el.attr("data-h1") + el.select(".g-shopping-cart").node().getBoundingClientRect().height) + "px")
   			} else if (el.attr("data-instore") == "true") {
   				el.style("height", (+el.attr("data-h1") + el.select(".g-cur-stock").node().getBoundingClientRect().height + 120) + "px")
   			} else if (el.attr("data-state") == "show") {
   				el.attr("data-h2", nameheight + contentheight)
   				el.style("height", el.attr("data-h2") + "px");
   			} else {
   				el.attr("data-h2", nameheight + contentheight);
   				el.style("height", nameheight + "px");
   			}
   		})
   	}

   	// hash function show function
   	function show(slug, hash) {

   		d3.selectAll(".g-nav-list").each(function(){
   			var el = d3.select(this);
   			if (el.attr("class").indexOf("g-nav-list-" + slug) == -1) {
   				el.attr("data-state", "hidden");
   				el.classed("g-show", false);
   				el.style("height", +el.attr("data-h1") + "px")
   			}
   		})

   		var el = d3.select(".g-nav-list-" + slug);
   		el.attr("data-state", "show");
   		el.classed("g-show", true);

   		var hash = document.location.hash;

   		if (hash == "#cart") {
   			var el = d3.select(".g-nav-list-store")
   			el.classed("g-hide", false);
   			el.attr("data-state", "show");
   			el.select(".g-store-list").classed("g-hide", true);
   			el.select(".g-shopping-cart").classed("g-hide", false);
   			el.select(".g-buy-button").classed("g-hide", true);
   			el.selectAll(".g-store-buy").classed("g-hide", true);
   			el.transition().style("height", (+el.attr("data-h1") + d3.select(".g-shopping-cart").node().getBoundingClientRect().height) + "px");
   			el.attr("data-incart", true);

   			window.scrollTo(0,d3.select(".g-nav-list-store").node().getBoundingClientRect().top + window.scrollY - 5);
   		} else if ((hash.indexOf("-") > -1 && hash != "#project-upcoming")) {
   			el.attr("data-instore", "true")
   			el.attr("data-incart", "false");

   			el.select(".g-shopping-cart").classed("g-hide", true);
   			el.select(".g-store-list").classed("g-hide", true);

   			var id = hash.replace("#", "")
   			var name = id.split("-")[0];
   			d3.selectAll(".g-" + name + "-list").classed("g-hide", true);
   			d3.select(".g-" + id).classed("g-hide", false);	

   			d3.selectAll(".g-store-buy").classed("g-cur-stock", false);
   			d3.select(".g-" + id).classed("g-cur-stock", true);

   			loadImages(d3.select(".g-" + id))

   			el.transition().style("height", ((+el.attr("data-h1") + d3.select(".g-" + id).node().getBoundingClientRect().height) + 120) + "px");

   			window.scrollTo(0,d3.select(".g-nav-list-store").node().getBoundingClientRect().top + window.scrollY - 5);
   		} else if (hash.indexOf("lunch") > -1) {
   			dropbananas();
   		}  else if (hash == "#store" || hash == "#upcoming" || hash == "#blog" || hash == "#wood") {
   			el.select(".g-store-list").classed("g-hide", false)
   			el.select(".g-stock-list").classed("g-hide", false)
   			el.select(".g-shopping-cart").classed("g-hide", true);
   			el.attr("data-incart", false);
   			el.transition().style("height", (+el.attr("data-h1") + +el.attr("data-h2")) + "px")

   			loadImages(el, true)

   			el.selectAll(".g-stock-each").classed("g-hide", true)
   			window.scrollTo(0,d3.select(".g-nav-list-store").node().getBoundingClientRect().top + window.scrollY - 5);
   		} else {
   			el.select(".g-shopping-cart").classed("g-hide", true);
   			loadImages(el);
   			el.transition().style("height", (+el.attr("data-h1") + +el.attr("data-h2")) + "px")
   		}
   	}

   	// back function
   	function back(page) {
   		console.log(page)
   		d3.selectAll(".g-stock-list").classed("g-hide", false);
   		d3.selectAll(".g-store-buy").classed("g-hide", true);
   		d3.selectAll(".g-shopping-cart").classed("g-hide", true);
   		var nav = d3.select(".g-nav-list-" + page);
   		nav.attr("data-instore", "false");
   		nav.attr("data-incart", "false");
   		nav.transition().style("height", (+nav.attr("data-h1") + +nav.attr("data-h2")) + "px")
   		resetimgnav();
   		document.location.hash = page;
   	}

   	// shopping reset function
   	function shoppingreset() {
   		updateCartNum();
   		updateCart();
		stopbananas();
		d3.select(".g-button-adc").attr("data-clicked", "");
		d3.select(".g-submitted").classed("g-hide", true);
		d3.select(".g-submit").classed("g-hide", false);
		$('#my-form').trigger("reset");
		d3.select("#my-form").classed("g-submitted-form", false);
		d3.select(".g-form-options").classed("g-hide", true);
		d3.select(".g-buy-button").classed("g-hide", false);
	}

	// shopoing car functions
	function updateCartNum(slug, count) {
		shoppingcart = JSON.parse(localStorage.getItem('shoppingcart'));

		if (!shoppingcart) {
			localStorage.setItem('shoppingcart', '{}');
			shoppingcart = {};	
		}

		if (slug) { 
			if (!shoppingcart[slug]) {
				shoppingcart[slug] = 0;
			}
			shoppingcart[slug] += +count;
		}
			
		var totalcount = d3.sum(Object.values(shoppingcart));
		var cartel = d3.select(".g-shopping-cart-icon .g-cart-count");
		if (totalcount == 0) {
			cartel.classed("g-active", false);
		} else {
			cartel.classed("g-active", true);
			totalcount = totalcount > 9 ? "9+" : totalcount;
			cartel.text(totalcount)
		}

		localStorage.setItem('shoppingcart', JSON.stringify(shoppingcart))
	}

	function updateCart() {

		shoppingcart = JSON.parse(localStorage.getItem('shoppingcart'));

		var keys = Object.keys(shoppingcart);
		keys.sort();

		var tbody = d3.select(".g-tbody").html("");
		var totalprice = 0;
		var totalusdprice = 0;

		keys.forEach(function(d){

			var tr = tbody.append("div.g-tr");
			var split = d.split("_");

			var item = tr.append("div.g-td.g-item")
			var sourceimg;

			if (split.length == 4) {
				sourceimg = d3.select(".g-store-" + split[0]).select("img:nth-child(" + split[3].split("-")[0] + ")");
			} else {
				sourceimg = d3.select(".g-store-" + split[0]).select("img");
			}

			if (!sourceimg.attr("src")) {
				sourceimg = sourceimg.attr("data-src");
			} else {
				sourceimg = sourceimg.attr("src");
			}

			item.append("div.g-item-img").append("img").attr("src", sourceimg);
			item.append("div.g-item-inner").text(d.split("_")[1] + " " + d.split("_")[0] + " x " + d.split("_")[2]);
			
			var quantity = tr.append("div.g-td.g-quantity")
			var minus = quantity.append("div.g-minus").text("-");
			var count = quantity.append("div.g-count").text(shoppingcart[d])
			var add = quantity.append("div.g-add").text("+");

			minus.on("click", function(){
				if (shoppingcart[d] > 1) {
					shoppingcart[d] -= 1;
					localStorage.setItem('shoppingcart', JSON.stringify(shoppingcart))
					updateCart();
					updateCartNum();
				} else {
					delete shoppingcart[d];
					localStorage.setItem('shoppingcart', JSON.stringify(shoppingcart))
					updateCart();
					updateCartNum();
				}
			})

			add.on("click", function(){
				shoppingcart[d] += 1;
				count.text(shoppingcart[d])
				localStorage.setItem('shoppingcart', JSON.stringify(shoppingcart))
				updateCart();
				updateCartNum();
			})

			var price = 280;
			var usdprice = 40;
			if (split[0] == "001") {  }

			var pricecheck = stocklist.filter(d => d.id == split[0])[0];
			if (pricecheck && pricecheck.price == "10up") {
				price = split[2] == "小小心意" ? 10 : split[2] == "多多益善" ? 50 : 100;
			} else if (pricecheck) {
				price = +pricecheck.price;
			}

			if (price == 250) {
				usdprice = 35;
			}


			tr.append("div.g-td.g-price").text("$" + shoppingcart[d]*price);

			totalprice += shoppingcart[d]*price;
			totalusdprice += shoppingcart[d]*usdprice;

		})

		d3.select(".g-total-price").text("$" + totalprice);
		d3.select(".g-item-usd").text(totalusdprice + 35);

	}

	// go to cart function
	function goToCart() {
		d3.select(".g-store-list").classed("g-hide", true);
		d3.selectAll(".g-store-buy").classed("g-hide", true);
		d3.select("#my-form").classed("g-hide", false);
		d3.select(".g-nav-list-store").attr("data-instore", false);
		d3.select(".g-nav-list-store").attr("data-incart", true);
		d3.select(".g-form-options").classed("g-hide", true);
		d3.select(".g-buy-button").classed("g-hide", true);

		var el = d3.select(".g-nav-list-store");
		el.transition().style("height", (+el.attr("data-h1") + d3.select(".g-stock-cont").node().getBoundingClientRect().height + d3.select(".g-shopping-cart").node().getBoundingClientRect().height) + "px");

		document.location.hash = "cart";

		show("store", "#cart")
		d3.select(".g-nav-list-store").attr("data-incart", true);

		window.scrollTo(0,d3.select(".g-nav-list-store").node().getBoundingClientRect().top + window.scrollY - 5);
	}


	// drop bananas
	function stopbananas() {
		if (window.bananatimer) {
			window.bananatimer.stop();
			d3.selectAll(".g-drop-banana").html("").classed("g-active", false);
		}
	}

	function dropbananas(sel) {

		if (!sel) {
			sel = ".g-drop-banana.g-outside-form";
		}

		if (window.bananatimer) {
			window.bananatimer.stop();
		}

		var sel = d3.select(sel).html("");
		sel.classed("g-active", true);

		sel.on("click", stopbananas);

		var canvas = sel.append("canvas").attr("width", innerWidth).attr("height", innerHeight)

		// var qrcode = sel.append("div.g-img").append("img").attr("src", "img/IMG_0412.JPG");
		var qrcode = sel.append("div.g-img").append("img").attr("src", "img/payme-QR.webp");

		var qrw = innerWidth*.8;
		qrw = qrw > 460 ? 460 : qrw;

		qrcode.style("top", (innerHeight/2 - qrw/2) + "px")

		var ctx = canvas.node().getContext("2d");

		var img = new Image();
		img.src = "img/LKK-logo.webp"

		img.onload = function(){

			var bs = d3.range(0,100);
			var imgs = [];

			bs.forEach(function(b){
				imgs.push([Math.random()*(innerWidth-30), Math.random()*innerHeight*-1]);
			})

			function run() {
				ctx.clearRect(0, 0, innerWidth, innerHeight);
				imgs.forEach(function(d){
					d[1] += Math.random()*10;

					if (d[1] > innerHeight) {
						d[1] = Math.random()*innerHeight*-1;
					}

					ctx.drawImage(img, d[0], d[1], 30, 30);

				})
			}

			window.bananatimer = d3.timer(function(){
				run();
			})
		}
	}

	function loadImages(el, loadfirst) {

		var sel = loadfirst ? "img.g-load-first" : "img";

		el.selectAll(sel).each(function(){
			var im = d3.select(this);

			if (!im.attr("src")) {
				im.attr("src", im.attr("data-src"));
			}
		})
	}


	////////////////////////////// THINGS BEING CALLED //////////////////////////////

   	// onload functions
   	resize();
   	updateCartNum();
   	updateCart();
   	readHash();

   	function readHash() {
	 	if (document.location.hash != "") {
	 		if (document.location.hash.indexOf("lkk") == -1) {
	 			var hash = document.location.hash
	 			var page = hash.split("-")[0].replace("#", "");
	 			var cont = page == "project" ? "project-upcoming" : page;
				var name = page == "project" ? "upcoming" : page;
	 			show(cont, hash);
	 		} else {
	 			show(document.location.hash.replace("#", ""));
	 		}	
	 	} else {
	 		d3.selectAll(".g-nav-list").each(function(){
	 			var el = d3.select(this);
	 			el.style("height", el.attr("data-h1") + "px");
	 		})
	 	}
   	}

   	var containerWidthChanged = false;
   	var ow = innerWidth;
   	window.addEventListener("resize", function(){
   	    if (innerWidth != ow) {
   	        containerWidthChanged = true;
   	        ow = innerWidth;
   	        resize();
   	      }
   	});

   	// nav click function
	d3.selectAll(".g-nav-name").on("click", function(){
		var el = d3.select(d3.select(this).node().parentNode);
		var state = el.attr("data-state");
		var instore = el.attr("data-instore") == "true";
		var incart = el.attr("data-incart") == "true";
		var id = el.attr("data-id");

		if (id == "store" || id == "upcoming" || id == "wood" || id == "blog") {
			loadImages(el.select(".g-store-list"));
		}

		if (doneshopping) {
			shoppingreset();
			buying = false;
			doneshopping = false;
		}

		if (instore || incart) {
			back(el.attr("data-id"));
		} else {
			var hide = d3.select(".g-show")
			hide.classed("g-show", false)
			hide.attr("data-state", "hidden")
			hide.transition().style("height", el.attr("data-h1") + "px")
		}

		if (instore || incart) {
		} else if (id == "lunch") {
			dropbananas();
		} else if (state == "hidden") {
			stopbananas();
			el.attr("data-state", "show");
			el.transition().style("height", (+el.attr("data-h1") + +el.attr("data-h2")) + "px")
			el.classed("g-show", true);
			document.location.hash = el.attr("data-id");
			// window.scrollTo(0,el.node().getBoundingClientRect().top + window.scrollY - 5);

		} else if (id != "lunch") {
			stopbananas();
			el.attr("data-state", "hidden")
			el.transition().style("height", el.attr("data-h1") + "px")
			el.classed("g-show", false);
			document.location.hash = "";
		}
	})

	// stock click function
	d3.selectAll(".g-store-each .g-img").on("click", function(){
		var el = d3.select(this);
		el = d3.select(el.node().parentNode);
		storefunc(el);
	})

	d3.selectAll(".g-store-each .g-meta").on("click", function(){
		var el = d3.select(this);
		el = d3.select(el.node().parentNode);
		storefunc(el);
	})

	function storefunc(el) {
		var nav = d3.select(".g-nav-list-" + el.attr("data-page"));
		var list = d3.select(".g-" + el.attr("data-page") + "-list");
		var item = d3.select(".g-" + el.attr("data-page") + "-" + el.attr("data-id"));

		list.classed("g-hide", true);
		item.classed("g-hide", false);

		d3.selectAll(".g-img-slideshow").classed("g-on-top", false);
		d3.selectAll(".g-img-slideshow:first-child").classed("g-on-top", true);
		d3.selectAll(".g-store-buy").classed("g-cur-stock", false);
		item.classed("g-cur-stock", true);

		loadImages(item);

		var nameheight = nav.attr("data-h1");
		var stockheight = item.node().getBoundingClientRect().height;

		nav.transition().style("height", (+nameheight + +stockheight + 120) + "px");
		nav.attr("data-instore", "true");

		nav.select(".g-shopping-cart").classed("g-hide", true);

		window.scrollTo(0,d3.select(".g-nav-list-store").node().getBoundingClientRect().top + window.scrollY - 5);
		nav.attr("data-incart", "false");
		d3.select(".g-shopping-cart").classed("g-hide", true);

		if (doneshopping) {
			shoppingreset();
			buying = false;
			doneshopping = false;
		}

		document.location.hash = el.attr("data-page") + "-" + el.attr("data-id");
		resetimgnav();
	}


	d3.selectAll(".g-back").on("click", function(){
		back(d3.select(this).attr("data-page"))
		shoppingreset();
	})

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
		d3.selectAll(".g-img-slideshow-group-store-" + id).classed("g-on-top", false);
		d3.select(".g-img-slideshow-" + item).classed("g-on-top", true);

		var parent = d3.select(el.node().parentNode.parentNode.parentNode);

		var color = ((+item.split("-")[2])+1);
		var colorel = parent.select(".g-color-circle:nth-child(" + ((+item.split("-")[2])+1) +")");
		if (colorel.node() && colorel.attr("data-color").split("-")[1].charAt(0) != "x") {
			parent.selectAll(".g-color-circle").classed("g-picked", false);
			parent.select(".g-color-circle:nth-child(" + ((+item.split("-")[2])+1) +")").classed("g-picked", true);
		}

		var goto = +item.split("-")[2]-1;
		console.log(goto)
		var parentel = d3.select(el.node().parentNode.parentNode);
		imgnavfunc(parentel, null, goto);

	})



	// img slideshow 

	d3.selectAll(".g-store-each .g-img").each(function(){
		var el = d3.select(this);
		var id = el.attr("id");
		var parentel = d3.select(el.node().parentNode);
		if (id) {
			document.getElementById(id).addEventListener('swiped-left', function(e) {
			    // console.log("swiped left");
			    imgnavfunc(parentel, "right");
			});
			document.getElementById(id).addEventListener('swiped-right', function(e) {
			    // console.log("swiped right")
			    imgnavfunc(parentel, "left");
			});
		}
	})

	d3.selectAll(".g-stock-each .g-img").each(function(){
		var el = d3.select(this);
		var id = el.attr("id");
		var parentel = d3.select(el.node().parentNode);
		if (id) {
			document.getElementById(id).addEventListener('swiped-left', function(e) {
			    // console.log("swiped left");
			    imgnavfunc(parentel, "right");
			});
			document.getElementById(id).addEventListener('swiped-right', function(e) {
			    // console.log("swiped right")
			    imgnavfunc(parentel, "left");
			});
		}
	})

	d3.selectAll(".g-img-nav").on("click", function(){
		var el = d3.select(this);
		var parentel = d3.select(el.node().parentNode);
		var dir = el.attr("class").indexOf("g-left") > -1 ? "left" : "right";
		imgnavfunc(parentel, dir);
	})

	function imgnavfunc(parentel, dir, goto){
		var img;

		if (parentel.attr("class").indexOf("g-img") > -1) {
			img = parentel
		} else {
			img = parentel.select(".g-img");
		}

		var inner = parentel.select(".g-img-inner-cont");
		var current = img.attr("data-img");
		var max = +img.attr("data-img-max");
		var next;

		img.selectAll("img").each(function(){
			var imgel = d3.select(this);

			if (!imgel.attr("src")) {
				imgel.attr("src", imgel.attr("data-src"));
			}
		})

		if (goto != undefined) {
			next = goto;
		} else if (dir == "left" && current != 0) {
			next = +current - 1;
		} else if (dir == "right" && current != max) {
			next = +current + 1;
		}

		if (next <= max) {
			inner.style("transform", "translateX(-" + next*100 + "%)");
			img.attr("data-img", next);
			parentel.selectAll(".g-dot").classed("g-dot-active", false);
			parentel.select(".g-dot-" + next).classed("g-dot-active", true);
		}

		if (next == max) {
			parentel.select(".g-left").classed("g-active", true);
			parentel.select(".g-right").classed("g-active", false);
		} else if (next == 0) {
			parentel.select(".g-right").classed("g-active", true);
			parentel.select(".g-left").classed("g-active", false);
		} else if (next) {
			parentel.select(".g-left").classed("g-active", true);
			parentel.select(".g-right").classed("g-active", true);
		}
	}

	function resetimgnav() {
		d3.selectAll(".g-img-has-nav").attr("data-img", 0);
		d3.selectAll(".g-img-inner-cont").style("transform", "translateX(0)");
		d3.selectAll(".g-dot").classed("g-dot-active", false);
		d3.selectAll(".g-dot-0").classed("g-dot-active", true);
		d3.selectAll(".g-img-nav.g-left").classed("g-active", false);
		d3.selectAll(".g-img-nav.g-right").classed("g-active", true);
	}


	d3.selectAll(".g-button").on("click", function(){

		var el = d3.select(this);
		var action = el.attr("data-action");
		var cart = d3.select(".g-shopping-cart-inner");

		if (action == "add-to-cart") {

			var stockid = d3.select(".g-cur-stock").attr("data-id");
			var curstockel = d3.select(".g-store-" + stockid);
			var size = curstockel.select("#size").property("value");
			var name = curstockel.select("#stock-name").text().replace("(起碼三月先有貨)", "");
			var count = curstockel.select(".g-count").text();
			var color = curstockel.select(".g-color-circle.g-picked").node() ? curstockel.select(".g-color-circle.g-picked").attr("data-color") : "";
			var slug = stockid + "_" + name + "_" + size;

			if (color) {
				slug += "_" + color;
			}

			updateCartNum(slug, count);
			updateCart();

			el.attr("data-clicked", "true");

		} else if (action == "add-to-cart-checkout") {

			var stockid = d3.select(".g-cur-stock").attr("data-id");
			var curstockel = d3.select(".g-store-" + stockid);
			var size = curstockel.select("#size").property("value");
			var name = curstockel.select("#stock-name").text().replace("(起碼三月先有貨)", "");
			var count = curstockel.select(".g-count").text();
			var color = curstockel.select(".g-color-circle.g-picked").node() ? curstockel.select(".g-color-circle.g-picked").attr("data-color") : "";
			var slug = stockid + "_" + name + "_" + size;

			if (color) {
				slug += "_" + color;
			}

			var is_adc_clicked = curstockel.select(".g-button-adc").attr("data-clicked") == "true";
			curstockel.select(".g-button-adc").attr("data-clicked", "");

			if (!is_adc_clicked) {
				updateCartNum(slug, count);
				updateCart();
			}

			goToCart();

			// cart.classed("g-hide", true);
			d3.select("#my-form").classed("g-hide", false);
			// var summary = d3.select("#my-form .g-purchase-summary").html(d3.select(".g-shopping-cart-inner").html());

			var navel = d3.select(".g-nav-list-store");
			navel.transition().style("height", (+navel.attr("data-h1") + navel.select(".g-nav-content").node().getBoundingClientRect().height) + "px")

		} else if (action == "buy") {

			if (localStorage.shoppingcart == "{}") {

				d3.select(".g-tbody").transition().style("background", "rgba(255,0,0,1)").transition().style("background", "rgba(255, 255, 255, 0.8)")

			} else {
				// cart.classed("g-hide", true);
				d3.select(".g-form-options").classed("g-hide", false);
				d3.select(".g-buy-button").classed("g-hide", false);
				d3.select(".g-submit").classed("g-hide", true);
				// var summary = d3.select("#my-form .g-purchase-summary").html(d3.select(".g-shopping-cart-inner").html());

				var navel = d3.select(".g-nav-list-store");
				navel.transition().style("height", (+navel.attr("data-h1") + navel.select(".g-nav-content").node().getBoundingClientRect().height) + "px")

			}

		}
	})

	// form submission
	$( document ).ready( function(){
		var $form = $('form#my-form'),
		    url = 'https://script.google.com/macros/s/AKfycbxHCw8DUBjM3OMe9k-yewFaDLM8Zp43Q8i3lWqC4AvCof4eExIljQURrwOo-im_zIx5/exec'

		$('input[type="checkbox"]').on('change', function() {
		   $('input[type="checkbox"]').not(this).prop('checked', false);
		});

		$('#submit').on('click', function(e) {

			  e.preventDefault();

			  buying = true;

			  var now = new Date();
			  var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");

			  var name = d3.select("#name").property("value");
			  var phone = d3.select("#phone").property("value");
			  // var email = d3.select("#email").property("value");
			  var delivery = d3.select('input[name="deliver"]:checked');


			  if (phone == "" || name == "" || localStorage.shoppingcart == "{}" || !delivery.node()) {
			  	if (phone == "") {
			  		d3.select("#phone").transition().style("background", "rgba(255,0,0,1)").transition().style("background", "rgba(255, 255, 255, 0.8)")
			  	}
			  	if (name == "") {
			  		d3.select("#name").transition().style("background", "rgba(255,0,0,1)").transition().style("background", "rgba(255, 255, 255, 0.8)")
			  	}

			  	if (localStorage.shoppingcart == "{}") {
			  		d3.select(".g-tbody").transition().style("background", "rgba(255,0,0,1)").transition().style("background", "rgba(255, 255, 255, 0.8)")
			  	}

			  	if (!delivery.node()) {
			  		d3.select(".g-checkbox-cont").transition().style("background", "rgba(255,0,0,0.5)").transition().style("background", "rgba(255, 255, 255, 0.8)")	
			  	}

			  } else {

			  	d3.select("#submit").classed("g-loading", true);

			  	shoppingcart = JSON.parse(localStorage.getItem('shoppingcart'));

			  	var keys = Object.keys(shoppingcart);
			  	keys.sort();

			  	var orders = [];

			  	keys.forEach(function(d,i){

			  		var split = d.split("_");
			  		item = split[1] + " " + split[0]  + " x " + shoppingcart[d];

			  		if (split[2]) {
			  			item += " x " + split[2];
			  		}

			  		if (split[3]) {
			  			item += " x " + split[3].split("-")[1];
			  		}

			  		var price = 280;
			  		var pricecheck = stocklist.filter(d => d.id == split[0])[0];

			  		if (pricecheck) {
			  			price = +pricecheck.price;
			  		}

			  		if (split[0] == "001") { price = split[2] == "小小心意" ? 10 : split[2] == "多多益善" ? 50 : 100; };

			  		var totalprice = price*shoppingcart[d];
			  		var comment = d3.select("#comment").property("value");

			  		orders.push({
			  			name: name,
			  			phone: phone,
			  			// email: email,
			  			date: formatTime(now),
			  			item: item,
			  			price: totalprice,
			  			comment: comment,
			  			delivery: delivery.attr("value")
			  		})
			  	})

	  	  		var jqxhr = $.ajax({
	  	  		  url: url,
	  	  		  method: "GET",
	  	  		  dataType: "json",
	  	  		  data: JSON.stringify(orders),
	  	  		  success: function(res){ 

	  	  		  	console.log(res);

  	  		  		localStorage.setItem('shoppingcart', '{}')
  					// $('#my-form').trigger("reset");
  					d3.select("#submit").classed("g-loading", false);
  					// d3.select("#my-form").classed("g-hide", true);
  					d3.select(".g-submitted").classed("g-hide", false);
  					d3.select(".g-buy-button").classed("g-hide", true);
  					d3.select("#my-form").classed("g-submitted-form", true);
  					var navel = d3.select(".g-nav-list-store")
  					navel.style("height", (+navel.attr("data-h1")) + (+navel.select(".g-shopping-cart").node().getBoundingClientRect().height) + (+navel.select(".g-submitted-form").node().getBoundingClientRect().height) + "px")
  					dropbananas(".g-drop-banana.g-inside-form");
  					doneshopping = true;
	  	  		  }
	  	  		})

			  }

		})
	})

	// shopping cart
	d3.select(".g-submitted").on("click", function(){
		d3.select(".g-submitted").classed("g-hide", true);
		d3.select(".g-drop-banana.g-inside-form").html("");
		if (doneshopping == true) {
			shoppingreset();
			buying = false;
			doneshopping = false;
		}
		show("store", "#store")
	})

	// shopping cart icon
	d3.selectAll(".g-shopping-cart-icon").on("click", function(){
		if (doneshopping == true) {
			shoppingreset();
			buying = false;
			doneshopping = false;
		}
		show("store", "#store");
		d3.select(".g-nav-list-lkk").style("height", d3.select(".g-nav-list-lkk").attr("data-h1") + "px");
		d3.select(".g-nav-list-upcoming").style("height", d3.select(".g-nav-list-upcoming").attr("data-h1") + "px");
		d3.select(".g-nav-list-wood").style("height", d3.select(".g-nav-list-wood").attr("data-h1") + "px");
		d3.select(".g-submit").classed("g-hide", false);
		goToCart();
	})

	// size chart expand button
	d3.selectAll(".g-expand-button").on("click", function(){
		var el = d3.select(this);
		var parent = d3.select(d3.select(d3.select(this).node().parentNode).node().parentNode);
		var chart = parent.select(".g-size-chart");
		var buttonthingy = el.select(".g-expand-size-chart");
		if (chart.attr("class").indexOf("g-active") == -1) {
			buttonthingy.classed("g-collapsed", false)
			buttonthingy.html("▲");
			chart.classed("g-active", true);
		} else {
			buttonthingy.classed("g-collapsed", true)
			buttonthingy.html("▼");
			chart.classed("g-active", false);
		}
	})


	// color picker
	d3.selectAll(".g-color-circle").on("click", function(){

		var el = d3.select(this);
		var parent = d3.select(el.node().parentNode);

		if (el.attr("class").indexOf("g-color-not-available") == -1) {
			parent.selectAll(".g-color-circle").classed("g-picked", false);
			el.classed("g-picked", true);

			var parentel = d3.select(".g-store-" + el.attr("data-store") + " .g-img.g-img-slideshow-cont");
			imgnavfunc(parentel, null, el.attr("data-order")-1);
		}


	})


	// back forward button compatibility
	// Vanilla javascript
	window.addEventListener('popstate', function (e) {

		if (!buying) {
			readHash();
		}

		// var state = e.state;
	 //    if (state !== null) {
	 //        if (state.urlPath == "#cart") {
	 //        	shoppingcartclick();
	 //        }
	 //    }
	});



/* Your D3.js here */
})


