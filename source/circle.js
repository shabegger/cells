function Circle(x, y, size, r, g, b) {
	var sum;
	
	this.x = x;
	this.y = y;
	this.size = size;
	this.radius = Math.sqrt(size);
	
	if ((typeof r === 'number') &&
		(typeof g === 'number') &&
		(typeof b === 'number')) {
		this.r = r;
		this.g = g;
		this.b = b;
	} else {
		r = Math.random();
		g = Math.random();
		b = Math.random();
		
		sum = r + g + b;
		
		this.r = Math.floor((r / sum) * 255);
		this.g = Math.floor((g / sum) * 255);
		this.b = Math.floor((b / sum) * 255);
	}
}

Circle.prototype.draw = function draw() {};
Circle.prototype.move = function move() {};
Circle.prototype.remove = function remove() {};

module.exports = Circle;
