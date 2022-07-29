var list = ["1綠毛蟲","2車厘龜","3波波球","5爛泥怪","6蛋蛋","7精靈球","9比卡超"];

var w = d3.select(".g-item-cont").node().getBoundingClientRect().width;
var h = 667;

var contleft = d3.select(".g-item-cont").node().getBoundingClientRect().left;

var sel = d3.select(".g-item-cont");

if (innerHeight > h && innerWidth > 460) {
	sel.style("margin-top", (innerHeight/2 - h/2) + "px");
}

var score = 0;
var counter = 0;
var length = list.length;

var scorecont = d3.select(".g-score-cont").html("");
list.forEach(function(d,i){
	scorecont.append("div.g-score-dot.g-score-dot-" + i);
})


// d3.shuffle(list);

var inner = sel.select("div.g-item-cont-inner");
d3.select(".g-body").style("height", innerHeight + "px")
inner.style("width", ((list.length+3)*w + 100) + "px").style("height", innerHeight + "px");
// .style("width", (list.length*w) + "px").html("");

var cont = d3.select(".g-item-cont-inner");

list.forEach(function(item,i){

	var itemname = item.substring(1,item.length);
	var div = cont.insert("div.g-item.g-item-" + itemname, ".g-item-end").append("div.g-item-inner");

	if (item != "start" && item != "end") {

		var imgcont = div.append("div.g-img-cont-outer");
		imgcont.append("div.g-img-cont").style("background-image", "url(img/" + item + "b.png)")
		imgcont.append("div.g-img-cont.g-img-answer").style("background-image", "url(img/" + item + ".png)")

		var inputcont = div.append("div.g-input-cont");
		inputcont.append("input.g-input").attr("id", "input-" + itemname);

		div.append("div.g-button-cont")
			.append("div")
			.attr("class", "g-button g-button-play")
			.attr("data-id", itemname)
			.text("開估");

		div.append("div.g-button-cont")
			.append("div")
			.attr("class", "g-button g-button-next")
			.attr("data-id", itemname)
			.text(i == list.length - 1 ? "計分" : "下題");

		inputcont.append("div.g-correct-answer")
			.text(itemname)
	}
})


var left = 0;
d3.selectAll(".g-item").each(function(el,eli){
	var el = d3.select(this);
	el.classed("g-item-" + eli, true);
	el.attr("data-left", left)

	left += el.node().getBoundingClientRect().width;
})


d3.selectAll(".g-button-next").on("click", function(){
	counter += 1;
	move();
})

d3.selectAll(".g-nav-button").on("click", function(){

	var el = d3.select(this);
	var dir = el.attr("data-dir");

	if (dir == "next") {
		counter += 1;
	} else {
		counter -= 1;
	}

	if (counter < 0) {
		counter = 0;
	} else if (counter > (list.length)) {
		counter = list.length;
	}

	move();
})

function move() {
	var targetel = d3.select(".g-item-" + counter);
	var targetleft = targetel.attr("data-left");
	inner.transition().style("transform", "translate(-" + (+targetleft+3.5) + "px,0)");

	d3.selectAll(".g-score-dot").classed("g-now", false);
	d3.select(".g-score-dot-" + (counter-1)).classed("g-now", true);

	if (counter > 0) {
		d3.selectAll(".g-nav-button").classed("g-active", true);
	}

	if (counter == 0) {
		d3.selectAll(".g-nav-button").classed("g-active", false);
	}

	if (counter == (list.length+1)) {
		d3.selectAll(".g-nav-button").classed("g-active", true);
		d3.select(".g-nav-button.g-next").classed("g-active", false);
	}

	if (counter == list.length) {
		d3.select(".g-nav-button.g-next").classed("g-active", false);
	}

}


d3.selectAll(".g-button-play").on("click", function(){
	var el = d3.select(this);
	var answer = el.attr("data-id");
	var itemel = d3.select(".g-item-" + answer);

	var inputel = itemel.select(".g-input-cont");
	var input = itemel.select("input").node().value;

	itemel.select(".g-img-answer").classed("g-active", true)

	if (input.trim() == answer) {
		console.log("correct")
		inputel.classed("g-correct", true)
		score += 1;
		d3.selectAll(".g-n").text(score);
		d3.select(".g-score-dot-" + (counter-1)).classed("g-correct", true);

		if (score > 4) {
			d3.select(".g-item-end .g-item-inner").style("background-image", "url(img/prize.png");
		}
	} else {
		console.log("wrong")
		inputel.classed("g-wrong", true)
		itemel.select(".g-correct-answer").style("display", "block");

		d3.select(".g-score-dot-" + (counter-1)).classed("g-wrong", true);
	}

	itemel.select(".g-button-play").style("display", "none")
	itemel.select(".g-button-next").style("display", "block")
	
})

$( document ).ready( function(){
		var $form = $('form#my-form'),
		    url = 'https://script.google.com/macros/s/AKfycbwessvsE_ZJkNYam4LJXcWbJ050505NaQL_kl4bVnfsD2C9hrEanmkS1D00xjCkdcZqcA/exec'
	
		$('#submit').on('click', function(e) {
			e.preventDefault();

			var now = new Date();
			var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");
			var name = d3.select("#input-name").node().value;

			if (name == "") {
				d3.select("#input-name").transition().style("background", "red").transition().style("background", "#181818");
			} else {

				d3.select(".g-loading").style("display", "block");

				var orders = [
					{
						name: name,
						date: formatTime(now),
						score: score
					}
				]

				var jqxhr = $.ajax({
					url: url,
					method: "GET",
					dataType: "json",
					data: JSON.stringify(orders),
					success: function(res){ 
						d3.select(".g-loading").style("display", "none");
						counter +=1 

						var endleft = d3.select(".g-item-scoreboard").attr("data-left");
						inner.transition().style("transform", "translate(-" + (endleft+3) + "px,0)");

						var scoreboardel = d3.select(".g-item-scoreboard");
						scoreboardel.select(".g-score-name").text(name)
						scoreboardel.select(".g-score-time").text(formatTime(now))

						if (+score > 5) {
							d3.select(".g-gift").style("display", "block")
						} else {
							d3.select(".g-failed").style("display", "block")
						}

					}
				})

			}

		})
});

d3.select(".g-replay").on("click", function(){

	location.reload();

})


// var scores = [];
// var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTM0-XQbY_9OgYT5b09K9uRX0LoE3tBWXuKzPf1hmqgWcMoyAPnvgcBHd-nX8Y96BPl89D03fnHSrSO/pub?output=tsv';
// fetch(url)
// 	.then(response => response.text())
// 	.then(function(data){
// 		data = data.split("\n");
// 		data.forEach(function(d,i){
// 			if (i != 0) {
// 				var tab = d.split("\t");
// 				scores.push({
// 					name: tab[1],
// 					score: tab[2]
// 				})
// 			}
// 		})
// 	});

