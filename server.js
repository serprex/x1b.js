#!/usr/bin/node
"use strict";
const http = require("http");
const fs = require("fs");
const child = require("child_process");
const app = http.createServer(function(req, res){
	var file = req.url[req.url.length-1] == "s" ? "./x1b.js" : "./x1b.htm";
	fs.readFile(file, function(err, content){
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(content, 'utf-8');
	});
});
function onSocketClose(){
	this.prog.kill();
}
function onSocketMessage(data){
	console.log(data);
	this.prog.stdin.write(data, 'utf-8');
}
function onSocketConnection(socket){
	socket.prog = child.spawn("../rg/target/release/rg", {
		stdio: ['pipe', 'pipe', 'pipe'],
	});
	socket.prog.stdout.on('data', data => {
		try {
		if (socket.readyState == 1) {
			socket.send(data.toString('utf-8'));
		}}catch(e){console.log('outdata', e)}
	});
	socket.prog.stdout.on('close', data => {
		socket.close();
	});
	socket.on("close", onSocketClose);
	socket.on("message", onSocketMessage);
}
const wss = new (require("ws/lib/WebSocketServer"))({server:app.listen(13220)});
wss.on("connection", onSocketConnection);
