var list = ["獨角蟲","地鼠","奇異種子","小火龍","椰蛋怪","比卡超","波波","波波球","穿山鼠","超音蝠","車厘龜", ];

var w = d3.select(".g-item-cont").node().getBoundingClientRect().width;
var h = 667;

var contleft = d3.select(".g-item-cont").node().getBoundingClientRect().left;

var sel = d3.select(".g-item-cont");

if (innerHeight > h) {
	sel.style("margin-top", (innerHeight/2 - h/2) + "px");
}

var score = 0;

var counter = 0;
var length = list.length;
d3.selectAll(".g-n-count").text(length);
d3.shuffle(list);

var inner = sel.select("div.g-item-cont-inner");
d3.select(".g-body").style("height", innerHeight + "px")
inner.style("width", ((list.length+3)*w + 100) + "px").style("height", innerHeight + "px");
// .style("width", (list.length*w) + "px").html("");

var cont = d3.select(".g-item-cont-inner");

list.forEach(function(item,i){

	var div = cont.insert("div.g-item.g-item-" + item, ".g-item-end").append("div.g-item-inner");

	if (item != "start" && item != "end") {

		var imgcont = div.append("div.g-img-cont-outer");
		imgcont.append("div.g-img-cont").append("div.g-img").style("background-image", "url(img/" + item + "_s.png)")
		imgcont.append("div.g-img-cont.g-img-answer").append("div.g-img.g-img-answer").style("background-image", "url(img/" + item + ".png)")

		div.append("input").attr("id", "input-" + item)
		div.append("div.g-button-cont")
			.append("div")
			.attr("class", "g-button g-button-play")
			.attr("data-id", item)
			.text("開估");

		div.append("div.g-button-cont")
			.append("div")
			.attr("class", "g-button g-button-next")
			.attr("data-id", item)
			.text("下題");

		div.append("div.g-correct-answer")
			.text(item)
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

	var targetel = d3.select(".g-item-" + counter);
	var targetleft = targetel.attr("data-left");
	inner.transition().style("transform", "translate(-" + targetleft + "px,0)");
	d3.select(".g-n-bg").classed("g-animate", false);	
})

d3.selectAll(".g-button-play").on("click", function(){
	var el = d3.select(this);
	var answer = el.attr("data-id");
	var itemel = d3.select(".g-item-" + answer);

	var input = d3.select("#input-" + answer).node().value;

	// if (input == "") {
	// 	console.log("no input")
	// 	itemel.select("input").transition().style("background", "red").transition().style("background", "#181818")
	// } else {
		itemel.select(".g-img").style("background-image", "url(img/" + answer + ".png)")

		if (input.trim() == answer) {
			console.log("correct")
			itemel.classed("g-correct", true)
			score += 1;
			d3.selectAll(".g-n").text(score);
			d3.select(".g-n-bg").classed("g-animate", true);
		} else {
			console.log("wrong")
			itemel.classed("g-wrong", true)
			itemel.select(".g-correct-answer").style("display", "block");
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
						inner.transition().style("transform", "translate(-" + endleft + "px,0)");

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

