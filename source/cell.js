var AI = require('./ai'),
	Circle = require('./circle');

function Cell(x, y, size, ai, r, g, b) {
	Circle.call(this, x, y, size, r, g, b);
	
	this.ai = ai;
	this.name = ai.name;
}

Cell.prototype = Object.create(Circle.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.takeTurn = function takeTurn(cells, food) {
	var size = this.size,
		turn = this.ai.takeTurn(size, cells, food);
	
	return turn;
};

module.exports = Cell;
