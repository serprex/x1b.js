var x1b = (function(){"use strict";
function x1b(div, w, h){
	this.div = div;
	this.x = 0;
	this.y = 0;
	this.w = w;
	this.h = h;
	this.buffer = [];
	for (var i=0; i<h; i++){
		this.buffer[i] = [];
		for (var j=0; j<w; j++)
			this.buffer[i][j] = " ";
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
			}
		} else if (esc === 0) {
			this.buffer[this.y][this.x] = si;
			this.x++;
		}
	}
	var text = [];
	for (var i=0; i<this.buffer.length; i++)
		text.push(this.buffer[i].join(''));
	this.div.textContent = text.join("\n");
}

return x1b;})();
