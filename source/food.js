var Circle = require('./circle');

function Food(width, height, minSize, maxSize) {
	var x, y, size;
	
	x = width * Math.random();
	y = height * Math.random()
	
	size = maxSize ?
		minSize + ((maxSize - minSize) * Math.random()) :
		minSize;
	
	Circle.call(this, x, y, size);
}

Food.prototype = Object.create(Circle.prototype);
Food.prototype.constructor = Food;

module.exports = Food;
