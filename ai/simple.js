var AI = require('../source/ai'),
	Random = require('./random'),
	_2_PI = 2 * Math.PI,
	_1_2_PI = Math.PI / 2;

function correctAngle(theta) {
	theta = theta % _2_PI;
	
	if (theta < 0) {
		theta += _2_PI;
	}
	
	return theta;
}

function isOutsideRange(theta, thetaLow, thetaHigh) {
	if (thetaLow < thetaHigh) {
		return (theta < thetaLow) ||
			(theta > thetaHigh);
	} else {
		return (theta < thetaLow) &&
			(theta > thetaHigh);
	}
}

function Simple(name) {
	var random = new Random(name),
		currentDirection,
		currentTheta,
		directions;

	function turnFn(size, cells, food) {
		var smallCells, bigCells,
			badThetaLow = null,
			badThetaHigh = null,
			smallCell, goodTheta,
			i, len;
		
		// Sort smaller cells biggest to smallest, so we go after the meatiest first
		smallCells = cells.filter(function (cell) {
			return cell.size < size;
		}).sort(function (a, b) {
			return b.size - a.size;
		});
		
		bigCells = cells.filter(function (cell) {
			return cell.size > size;
		});
		
		// Stay away from all bigger cells
		bigCells.forEach(function (cell) {
			var theta = Math.atan2(cell.y, cell.x),
				thetaLow = correctAngle(theta - _1_2_PI),
				thetaHigh = correctAngle(theta + _1_2_PI);
			
			if (badThetaLow === null) {
				badThetaLow = thetaLow;
				badThetaHigh = thetaHigh;
			} else if (isOutsideRange(thetaLow, badThetaLow, badThetaHigh)) {
				badThetaLow = thetaLow;
			} else if (isOutsideRange(thetaHigh, badThetaLow, badThetaHigh)) {
				badThetaHigh = thetaHigh;
			}
		});
		
		// Try to eat smaller cells if they're around and away from bigger cells
		for (i = 0, len = smallCells.length; i < len; i++) {
			smallCell = smallCells[i];
			goodTheta = correctAngle(Math.atan2(smallCell.y, smallCell.x));
			
			if (badThetaLow === null || isOutsideRange(goodTheta, badThetaLow, badThetaHigh)) {
				currentDirection = smallCell;
				return currentDirection;
			}
		}
		
		// Otherwise, move away from nearby bigger cells
		if (badThetaLow !== null) {
			if (badThetaLow < badThetaHigh) {
				goodTheta = correctAngle(((badThetaHigh - badThetaLow) / 2) + badThetaLow + Math.PI);
			} else {
				goodTheta = ((badThetaLow - badThetaHigh) / 2) + badThetaHigh;
			}
			
			currentDirection = {
				x: Math.cos(goodTheta),
				y: Math.sin(goodTheta)
			};
			
			return currentDirection;
		}
		
		// Find food in direction most like current direction
		if (food.length) {
			if (currentDirection) {
				currentTheta = Math.atan2(currentDirection.y, currentDirection.x);
				
				directions = food.map(function (food) {
					var theta = Math.atan2(food.y, food.x),
						delta = correctAngle(currentTheta - theta);
					
					if (delta > Math.PI) {
						delta = _2_PI - delta;
					}
					
					return {
						food: food,
						delta: delta
					};
				}).sort(function (a, b) {
					return a.delta - b.delta;	
				});
				
				currentDirection = directions[0].food;
				return currentDirection;
			} else {
				currentDirection = food[0];
				return currentDirection;
			}
		} else {
			currentDirection = null;
		}
		
		return random.turnFn(size, cells, food);
	}

	AI.call(this, name, turnFn);
}

Simple.prototype = Object.create(AI.prototype);
Simple.prototype.constructor = Simple;

module.exports = Simple;
