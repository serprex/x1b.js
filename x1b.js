var x1b = (function(){"use strict";
function x1b(div, w, h){
	this.div = div;
	this.x = 0;
	this.y = 0;
	this.buffer = [];
	this.style = {
		backgroundColor: "#000",
		color: "#fff",
	};
	for (var i=0; i<Math.max(h, 1); i++){
		this.buffer[i] = [];
		for (var j=0; j<Math.max(w, 1); j++) {
			var span = this.buffer[i][j] = document.createElement('span');
			span.textContent = ' ';
			for (var key in this.style) span.style[key] = this.style[key];
			div.appendChild(span);
		}
		div.appendChild(document.createElement('br'));
	}
}

x1b.prototype.setch = function(ch) {
	if (this.x >= this.buffer[0].length) this.x = this.buffer[0].length - 1;
	else if (this.x < 0) this.x = 0;
	if (this.y >= this.buffer.length) this.y = this.buffer.length - 1;
	else if (this.y < 0) this.y = 0;
	var span = this.buffer[this.y][this.x];
	span.textContent = ch;
	for (var key in this.style) span.style[key] = this.style[key];
}

var rgb4 = ["#000","#800","#080","#880","#008", "#808", "#088","#ccc",
	"#444", "#f00", "#0f0", "#ff0", "#00f", "#f0f", "0ff", "#fff"];
x1b.prototype.write = function(s) {
	var esc = 0, args, num;
	for (var i=0; i<s.length; i++) {
		var si = s[i];
		if (si === "\x1b" && esc === 0) esc = 1;
		else if (si === "[" && esc === 1) {
			esc = 2;
			args = [];
			num = "";
		}
		else if (esc === 2){
			if (si.match(/\d/)) {
				num += si;
			} else {
				args.push(parseInt(num));
				num = "";
				switch (si){
				case ";":continue;
				case "H":
					this.x = args[1] - 1;
					this.y = args[0] - 1;
					esc = 0;
					break;
				case "m":
					if (args[0]) {
						var a0 = args[0];
						if (a0 >= 30 && a0 < 38){
							this.style.color = rgb4[a0-30];
						} else if (a0 >= 40 && a0 < 48){
							this.style.backgroundColor = rgb4[a0-40];
						} else if (a0 >= 90 && a0 < 98) {
							this.style.color = rgb4[a0-82];
						} else if (a0 >= 100 && a0 < 108) {
							this.style.backgroundColor = rgb4[a0-92];
						} else {
							switch (a0) {
							case 38:
							case 48:
								var prop = a0 == 38 ? "color" : "backgroundColor";
								if (args[1] == 5) {
									var a2 = args[2];
									// 256 color
									if (a2 < 16) {
										this.style[prop] = colors[a2];
									} else if (a2 < 232) {
										var a = a2-16;
										this.style[prop] = "#" + (((a%6)/6 * 256) << 16 | (((a/6|0)%6)/6 * 256) << 8 | ((a/36|0)/6 * 256)).toString(16);
									} else {
										this.style[prop] = "#"+((a2*10.24|0)*0x10101).toString(16);
									}
								} else if (args[1] == 2) {
									// 24 bit color
								   this.style[prop] = "#"+args[2].toString(16)+args[3].toString(16)+args[4].toString(16);
								}
								break;
							case 39:this.style.color="#fff";break;
							case 49:this.style.backgroundColor="#000";break;
							case 99:this.style.color="#fff";break;
							case 109:this.style.backgroundColor="#fff";break;
							}
						}
					} else {
						this.style.backgroundColor = "#000";
						this.style.color = "#fff";
					}
					break;
				}
				esc = 0;
			}
		} else if (esc === 0) {
			switch (si) {
			case "\n":
				this.y++; // fallthru
			case "\r":
				this.x=0;
				break;
			case "\v":
				this.y++;
				break;
			case "\t":
				do {
					this.setch(' ');
					x++;
				} while (this.x&7);
				break;
			default:
				this.setch(si);
				this.x++;
			}
		}
	}
}

return x1b;})();
