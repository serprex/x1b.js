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
						switch (args[0]){
						case 30:this.style.color="#000";break;
						case 31:this.style.color="#800";break;
						case 32:this.style.color="#080";break;
						case 33:this.style.color="#880";break;
						case 34:this.style.color="#008";break;
						case 35:this.style.color="#808";break;
						case 36:this.style.color="#088";break;
						case 37:this.style.color="#ccc";break;
						case 39:this.style.color="#fff";break;
						case 40:this.style.backgroundColor="#000";break;
						case 41:this.style.backgroundColor="#800";break;
						case 42:this.style.backgroundColor="#080";break;
						case 43:this.style.backgroundColor="#880";break;
						case 44:this.style.backgroundColor="#008";break;
						case 45:this.style.backgroundColor="#808";break;
						case 46:this.style.backgroundColor="#088";break;
						case 47:this.style.backgroundColor="#ccc";break;
						case 49:this.style.backgroundColor="#000";break;
						case 90:this.style.color="#444";break;
						case 91:this.style.color="#f00";break;
						case 92:this.style.color="#0f0";break;
						case 93:this.style.color="#ff0";break;
						case 94:this.style.color="#00f";break;
						case 95:this.style.color="#f0f";break;
						case 96:this.style.color="#0ff";break;
						case 97:this.style.color="#fff";break;
						case 99:this.style.color="#fff";break;
						case 100:this.style.backgroundColor="#444";break;
						case 101:this.style.backgroundColor="#f00";break;
						case 102:this.style.backgroundColor="#0f0";break;
						case 103:this.style.backgroundColor="#ff0";break;
						case 104:this.style.backgroundColor="#00f";break;
						case 105:this.style.backgroundColor="#f0f";break;
						case 106:this.style.backgroundColor="#0ff";break;
						case 107:this.style.backgroundColor="#fff";break;
						case 109:this.style.backgroundColor="#fff";break;
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
