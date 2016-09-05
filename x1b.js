var x1b = (function(){"use strict";
function x1b(div, w, h){
	this.div = div;
	this.x = 0;
	this.y = 0;
	this.w = w;
	this.h = h;
	this.buffer = [];
	this.bg = "#000";
	this.fg = "#fff";
	for (var i=0; i<h; i++){
		this.buffer[i] = [];
		for (var j=0; j<w; j++) {
			var span = this.buffer[i][j] = document.createElement('span');
			span.textContent = ' ';
			span.style.backgroundColor = this.bg;
			span.style.color = this.fg;
			div.appendChild(span);
		}
		div.appendChild(document.createElement('br'));
	}
}

x1b.prototype.write = function(s) {
	var esc = 0, args, num;
	for (var i=0; i<s.length; i++) {
		var si = s[i];
		i
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
				if (si == ";") continue;
				else if (si == "H") {
					this.x = args[1] - 1;
					this.y = args[0] - 1;
					esc = 0;
				}
				else if (si == "m") {
					switch (args[0]){
						case 30:this.fg=args[1]?"#444":"#000";break;
						case 31:this.fg=args[1]?"#f00":"#800";break;
						case 32:this.fg=args[1]?"#0f0":"#080";break;
						case 33:this.fg=args[1]?"#ff0":"#880";break;
						case 34:this.fg=args[1]?"#00f":"#008";break;
						case 35:this.fg=args[1]?"#f0f":"#808";break;
						case 36:this.fg=args[1]?"#0ff":"#088";break;
						case 37:this.fg=args[1]?"#fff":"#ccc";break;
						case 39:this.fg=args[1]?"#fff":"#fff";break;
						case 40:this.bg=args[1]?"#444":"#000";break;
						case 41:this.bg=args[1]?"#f00":"#800";break;
						case 42:this.bg=args[1]?"#0f0":"#080";break;
						case 43:this.bg=args[1]?"#ff0":"#880";break;
						case 44:this.bg=args[1]?"#00f":"#008";break;
						case 45:this.bg=args[1]?"#f0f":"#808";break;
						case 46:this.bg=args[1]?"#0ff":"#088";break;
						case 47:this.bg=args[1]?"#fff":"#ccc";break;
						case 49:this.bg=args[1]?"#000":"#000";break;
					}
					esc = 0;
				}
			}
		} else if (esc === 0) {
			this.buffer[this.y][this.x].textContent = si;
			this.buffer[this.y][this.x].style.backgroundColor = this.bg;
			this.buffer[this.y][this.x].style.color = this.fg;
			this.x++;
		}
	}
}

return x1b;})();
