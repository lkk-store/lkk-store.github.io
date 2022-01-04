var renderedW = innerWidth;
var renderedH = innerWidth*1080/1920
var framewidth = renderedW*(1300/1920)
var frameheight = renderedH*(962/1080)

$(document).ready( function() {
	$(".g-marquee-cont").css("height", renderedH + "px")
	$(".g-marquee-cont").css("margin-top", (innerHeight/2 - renderedH/2) + "px")

	$(".g-marquee-frame").css("width", renderedW*(1300/1920) + "px");
	$(".g-marquee-frame").css("top", innerHeight*(60/1080) + "px");
	$(".g-marquee-frame").css("left", innerWidth*(308.8496/1920) + "px");
	$(".g-marquee-frame").css("height", renderedH*(958/1080) + "px");


	run("forward");
	run("backward");

	document.onkeydown = checkKey;

});

var texts = data;
console.log(data)
var textcount = -1;
var imcount = 0;
var newimcount = 0;

var photolookup = ["alta.png","am.png","ama1.png","angie.png","arnold-kala-hinny.png","calvin.png","david-ester.png","dotdotdot1.png","fibi1.png","fibia1.png","fulon.png","hato.png","hill1.png","i-do.png","jing.png","joyce.png","kermit.png","kidding-u1.png","leo.png","leungmo.png","sandy.png","showroom.png","tiffany.png","toby-hill.png","wing1.png","但以理團1.png","佩虹1.png","全-Huey.png","哥哥1.png","嘉希.png","媽媽1.png","子龍.png","孔孔孔孔1.png","晴仔.png","歐陽.png","爸爸1.png","爸爸媽媽.png","發仔1.png","豆奶.png","豪1.png","開心壁球協會.png","阿嫂-山B.png","陳發濤1.png","陳發鴻1.png","魷魚.png",];

var containerWidth, containerHeight, elWidth, elHeight, move, getSizes;
var $el = $(".marquee");

var settings = {
	horizontal: true,
	vertical: true,
	speed: 300, // In pixels per second
	container: $(".g-marquee-frame"),
	bumpEdge: function () {}
}

var getSizes = function () {
	containerWidth = settings.container.outerWidth();
	containerHeight = settings.container.outerHeight();
	elWidth = $el.outerWidth();
	elHeight = $el.outerHeight();
};

var move = {
	right: function () {
		$el.animate({left: (containerWidth - elWidth)}, {duration: ((containerWidth/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
			settings.bumpEdge();
			move.left();
		}});
	},
	left: function () {
		$el.animate({left: 0}, {duration: ((containerWidth/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
			settings.bumpEdge();
			move.right();
		}});
	},
	down: function () {
		$el.animate({top: (containerHeight - elHeight)}, {duration: ((containerHeight/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
			settings.bumpEdge();
			move.up();
		}});
	},
	up: function () {
		$el.animate({top: 0}, {duration: ((containerHeight/settings.speed) * 1000), queue: false, easing: "linear", complete: function () {
			settings.bumpEdge();
			move.down();
		}});
	}
};

var started = false;

function run(direction) {

	if (direction == "forward") {
		textcount += 1;
		if (textcount == texts.length) {
			textcount = texts.length - 1;
		}

	} else if (direction == "backward") {
		textcount -= 1;
		if (textcount == -1) {
			textcount = 0;
		}
	}

	if (direction == "up" || direction == "down") {

		if (texts[textcount].photos.length > 1) {
			if (direction == "up" && texts[textcount].photos[imcount - 1]) {
				newimcount = imcount - 1;
			} else if (direction == "down") {
				newimcount = imcount + 1;
			}

			if (newimcount != imcount) {
				var photoname = texts[textcount].photos[newimcount] + ".png";
				
				// var photoid = photolookup.indexOf(photoname);
				// var x = photoid/(photolookup.length-1)*100;
				// $(".g-background").css("background-position", x + "% 0");

				var photoid = photolookup.indexOf(photoname);
				var y = newimcount/(texts[textcount].photos.length-1)*100;
				$(".g-background-v-" + texts[textcount].file).css("background-position", "0 " + y + "%");

				imcount = newimcount;
			}	
		}
		
	}

	if (direction == "backward" || direction == "forward") {

		$(".g-background-v").hide();
		$(".g-background-v").css("background-position", "0 0%")
		$(".g-background").show();

		imcount = 0;

		var photoname = texts[textcount].photos[imcount] + ".png";
		var photoid = photolookup.indexOf(photoname);
		var x = photoid/(photolookup.length-1)*100;
		$(".g-background").css("background-position", x + "% 0");

		var h = 200;
		var w = h*texts[textcount].width/texts[textcount].height;
		$(".marquee").css({
			width: w + "px",
			height: h + "px"
		})

		$(".marquee img")
				.css({
					width: w + "px",
					height: h + "px"
				}).attr("src", 'text/' + texts[textcount].file + ".png")

		if (!started) {
			getSizes();
			move.right();
			move.down();
			started = true;
		} else {
			getSizes();
		}


		if (texts[textcount].photos.length > 1) {
			setTimeout(function(){
				$(".g-background").hide();
				$(".g-background-v-" + texts[textcount].file).show();
			}, 1000)
		}

	}
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        console.log("up")
        run("up");
    }
    else if (e.keyCode == '40') {
        // down arrow
        console.log("down")
        run("down");
    }
    else if (e.keyCode == '37') {
       // left arrow
       console.log("left")
			run("backward");
    }
    else if (e.keyCode == '39') {
       // right arrow
       console.log("right")
       run("forward");
    }
}



