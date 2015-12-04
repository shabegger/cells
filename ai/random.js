var AI = require('../source/ai');

function Random(name) {
	var x, y;
	
	function setDirection() {
		x = (2 * Math.random()) - 1;
		y = (2 * Math.random()) - 1;
	}
	
	function turnFn(size, cells, food) {
		if (Math.random() > 0.98) {
			setDirection();
		}
		
		return {
			x: x,
			y: y
		};
	}
	
	setDirection();
	AI.call(this, name, turnFn);
}

Random.prototype = Object.create(AI.prototype);
Random.prototype.constructor = Random;

module.exports = Random;
