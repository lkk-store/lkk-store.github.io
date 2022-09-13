#!/usr/bin/env node

var fs = require("fs");
var { exec } = require("child_process");
var arg = process.argv[2];
var ejs = require("ejs");
var currentPath = process.cwd();
var express = require('express');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var SocketServer = require('ws').Server;
var chokidar = require('chokidar');
var child = require('child_process');
var d3 = require("d3v4");

function compile() {

	var data = {};

	var datafolder = fs.readdirSync("data");

	datafolder.forEach(function(d){
		var dat = fs.readFileSync("data/" + d, "utf8");
		dat = JSON.parse(dat)
		data[d.replace(".json", "")] = dat
	});

	// look for other images
	var imgdir = fs.readdirSync("img");

	data.store.forEach(function(d){
		// console.log(d)

		var match = imgdir.filter(a => a.indexOf("store-" + d.id) > -1);

		if (match.length > 1) {
			d.img = match
		}

	})

	data.blog.forEach(function(d){
		// console.log(d)

		var match = imgdir.filter(a => a.indexOf("blog-" + d.id) > -1);

		if (match.length > 1) {
			d.img = match
		}

	})

	data.upcoming.forEach(function(d){
		// console.log(d)

		var match = imgdir.filter(a => a.indexOf("upcoming-" + d.id) > -1);

		if (match.length > 1) {
			d.img = match
		}

	})

	data.wood = data.wood.filter(d => d.id.indexOf("-") == -1);
	data.store = data.store.filter(d => d.hide != "1");

	var pages = ["index"]

	var script = fs.readFileSync("src/script.js", "utf8");

	var c = child.exec("lessc src/style.less " + currentPath + "/build/style.css", (err, stdout, stderr) => {

		if (err) { console.log(err); }

	}).on("exit", function(){

		// var partials = {};	

		// var partial_files = fs.readdirSync(currentPath + "/src/");	

		// partial_files.forEach(function(partial){
		// 	var h = fs.readFileSync(currentPath + "/src/" + partial, "utf8");
		// 	partials[partial.replace(".html", "")] = ejs.render(h, {pages: pages, page: page, d3: d3}); 
		// })

		pages.forEach(function(page){

			var html = page == "index" ? fs.readFileSync("src/index.jst.html", "utf8") : fs.readFileSync("src/page.jst.html", "utf8");;

			var ejs_rendered = ejs.render(html, {pages: pages, page: page, data: data, d3: d3});
				// , partials: partials});

			var out = "";

			out += "<!DOCTYPE html>\n";
			out += '<html>\n';
			out += '<head>\n';
			out += '<title>黎根記</title>\n';
			out += '<meta charset="utf-8"> \n';
			out += '<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">\n';
			out += '<link rel="shortcut icon" href="img/lkk-logo-06.webp" />\n';
			out += '<link rel="apple-touch-icon" sizes="128x128" href="app-icon.png">\n'
			// out += '<meta name="apple-mobile-web-app-capable" content="yes" />\n'
			out += '<link rel="stylesheet" href="https://use.typekit.net/nri5irx.css">\n';
			// out += '<link rel="preconnect" href="https://fonts.gstatic.com">\n'
			// out += '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@300;400;700&display=swap" rel="stylesheet">\n'
			out += '<meta property="og:title" content="lkk.store"/>\n<meta property="og:type" content=""/>\n<meta property="og:url" content="http://lkk-store.com"/>\n<meta property="og:image" content="https://www.lkk-store.com/img/twitter.jpg"/>\n<meta property="og:site_name" content="lkk.store"/>\n<meta property="og:description" content="make something 9ood"/>'

			var style = fs.readFileSync("build/style.css", "utf8");
			out += "<style>\n";
			out += style;
			out += "</style>\n";

			out += '</head>\n';
			out += '<body>\n';

			out += '<a href="index.html"><div class="g-logo-cont"><img src="img/laikankee.webp"></div></a>';

			out += ejs_rendered;

			out += '<script src="d3_.js"></script>\n';
			out += '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>\n';

			out += "\n<script>\n";
			out += script;
			out += "\n</script>\n";
			
			// out += '</div>\n'
			out += '</body>\n'
			out += '</html>\n'

			var output_name = page == "index" ? "index" : "lkk-" + page.page;

			fs.writeFileSync(output_name + ".html", out);


		})

	})

}



if (arg == "make") {

	compile();

} else {

	compile();

	fs.watch('src', (eventType, filename) => {
		console.log(filename + " changed...");
		compile();
	})

	fs.watch(currentPath + '/data', (eventType, filename) => {
		console.log(filename + " changed...");
		compile();
	})

	// this is from https://github.com/1wheel/hot-server
	
	var defaults = {port: 3989, dir: currentPath} 
	var args = require('minimist')(process.argv.slice(2))
	var {port, dir} = Object.assign(defaults, args)
	dir = require('path').resolve(dir) + '/'

	// set up express static server with a websocket
	var server = express()
		.get('*', injectHTML)
		.use(serveStatic(dir))
		.use('/', serveIndex(dir))
		.listen(port)
		.on('listening', () => {
			child.exec('open http://localhost:' + port)
			console.log('hot-server http://localhost:' + port)
		})
		
	process.on('uncaughtException', (err => 
		err.errno == 'EADDRINUSE' ? server.listen(++port) : 0)) //inc port if in use

	// append websocket/injecter script to all html pages served
	var wsInject = fs.readFileSync('bin/ws-inject.html', 'utf8')

	function injectHTML(req, res, next){
		try{
			var path = req.params[0].slice(1)
			if (path.slice(-1) == '/') path = path + '/index.html'
			if (path == '') path = 'index.html'
			if (path.slice(-5) != '.html') return next()

			res.send(fs.readFileSync(dir + path, 'utf-8') + wsInject)
		} catch(e){ next() }
	}

	// if a .js or .css files changes, load and send to client via websocket
	var wss = new SocketServer({server})
	chokidar
		.watch(dir, {ignored: /node_modules|\.git|[\/\\]\./ })
		.on('change', path => {
			var str = fs.readFileSync(path, 'utf8')
			var path = '/' + path.replace(__dirname, '')

			var type = 'reload'
			if (path.includes('.js'))  type = 'jsInject'
			if (path.includes('.css')) type = 'cssInject'

			var msg = {path, type, str}
			wss.clients.forEach(d => d.send(JSON.stringify(msg)))
		})

}