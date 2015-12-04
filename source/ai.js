function AI(name, turnFn) {
	this.name = name;
	this.turnFn = turnFn;
}

AI.prototype.takeTurn = function takeTurn(size, cells, food) {
	return this.turnFn(size, cells, food);	
};

module.exports = AI;
