var Promise = require('bluebird'),
	
	replenishFoodAsync,
	checkCellsEatenAsync,
	checkFoodEatenAsync,
	runCellTurnsAsync,
	checkWinnerAsync;

function PetriDish(width, height, xPartitions, yPartitions, foodAmount, cellList, foodFactory) {
	var partitions = new Array(xPartitions),
		cells = cellList.slice(),
		xPartitionSize = width / xPartitions,
		yPartitionSize = height / yPartitions,
		totalCellSize,
		visibilitySize = Math.min(width, height) / 2,
		foodCount = 0, food,
		results = [],
		processing,
		i, j;
	
	totalCellSize = cells.reduce(function (previous, cell) {
		cell.draw();
		return previous + cell.size;
	}, 0);
	
	// Initialize Partitions
	for (i = 0; i < xPartitions; i++) {
		partitions[i] = new Array(yPartitions);
		for (j = 0; j < yPartitions; j++) {
			partitions[i][j] = [];
		}
	}
	
	function replenishFood(callback) {
		var xPartition,
			yPartition;
		
		while (foodCount < foodAmount) {
			food = foodFactory(width, height);
			food.draw();
			
			xPartition = Math.floor(food.x / xPartitionSize);
			yPartition = Math.floor(food.y / yPartitionSize);
			
			partitions[xPartition][yPartition].push(food);
			foodCount++;
		}
		
		callback && callback(null, null);
	}
	
	function checkCellsEaten(callback) {
		var i, j, xDelta, yDelta,
			bigCell, smallCell;
		
		// Sort biggest to smallest, so we know the higher index is smaller
		cells.sort(function (a, b) {
			return b.size - a.size;
		});
			
		for (i = cells.length - 1; i >= 0; i--) {
			for (j = i - 1; j >= 0; j--) {
				bigCell = cells[j];
				smallCell = cells[i];
				
				xDelta = bigCell.x - smallCell.x;
				yDelta = bigCell.y - smallCell.y;
				
				// If small cell is eaten, add to big cell and remove small cell
				if (Math.sqrt((xDelta * xDelta) + (yDelta * yDelta)) < bigCell.radius) {
					bigCell.size += smallCell.size;
					bigCell.radius = Math.sqrt(bigCell.size);
					
					cells.splice(i, 1);
					smallCell.remove();
					results.push(smallCell);
					
					break;
				}
			}
		}
		
		callback && callback(null, null);
	}
	
	function checkFoodEaten(callback) {
		var i, j, cell,
			x, y, foods, food,
			xMin, xMax, yMin, yMax,
			xDelta, yDelta;
		
		for (i = cells.length - 1; i >= 0; i--) {
			cell = cells[i];
			
			xMin = Math.max(Math.floor((cell.x - cell.size) / xPartitionSize), 0);
			xMax = Math.min(Math.floor((cell.x + cell.size) / xPartitionSize), xPartitions - 1);
			yMin = Math.max(Math.floor((cell.y - cell.size) / yPartitionSize), 0);
			yMax = Math.min(Math.floor((cell.y + cell.size) / yPartitionSize), yPartitions - 1);
			
			for (x = xMin; x <= xMax; x++) {
				for (y = yMin; y <= yMax; y++) {
					foods = partitions[x][y];
					
					for (j = foods.length - 1; j >= 0; j--) {
						food = foods[j];
						
						xDelta = cell.x - food.x;
						yDelta = cell.y - food.y;
						
						// If food is eaten, add to cell and remove food
						if (Math.sqrt((xDelta * xDelta) + (yDelta * yDelta)) < cell.radius) {
							cell.size += food.size;
							totalCellSize += food.size;
							
							cell.radius = Math.sqrt(cell.size);
							
							foods.splice(j, 1);
							food.remove();
							foodCount--;
						}
					}
				}
			}
		}
		
		callback && callback(null, null);
	}
	
	function runCellTurns(callback) {
		var i, j, cell,
			xMin, xMax, yMin, yMax,
			x, y,
			visibility, speed,
			food, otherCells,
			turn, absTurn, turnFactor;
		
		for (i = cells.length - 1; i >= 0; i--) {
			cell = cells[i];
			food = [];
			
			visibility = (((1 - (cell.radius / visibilitySize)) * 18) + 2) * cell.radius;
			speed = ((1 - (cell.radius / visibilitySize)) * 2) + 1;
			
			xMin = Math.max(Math.floor((cell.x - visibility) / xPartitionSize), 0);
			xMax = Math.min(Math.floor((cell.x + visibility) / xPartitionSize), xPartitions - 1);
			yMin = Math.max(Math.floor((cell.y - visibility) / yPartitionSize), 0);
			yMax = Math.min(Math.floor((cell.y + visibility) / yPartitionSize), yPartitions - 1);
			
			for (x = xMin; x <= xMax; x++) {
				for (y = yMin; y <= yMax; y++) {
					food = food.concat(partitions[x][y].map(function (food) {
						return {
							x: food.x - cell.x,
							y: food.y - cell.y,
							size: food.size	
						};
					}));
				}	
			}
			
			otherCells = cells.filter(function (otherCell, j) {
				return j !== i &&
					otherCell.x > (cell.x - visibility) &&
					otherCell.x < (cell.x + visibility) &&
					otherCell.y > (cell.y - visibility) &&
					otherCell.y < (cell.y + visibility);
			}).map(function (otherCell) {
				return {
					x: otherCell.x - cell.x,
					y: otherCell.y - cell.y,
					size: otherCell.size	
				};
			});
			
			turn = cell.takeTurn(otherCells, food);
			
			if (turn.x !== 0 || turn.y !== 0) {
				absTurn = Math.sqrt((turn.x * turn.x) + (turn.y * turn.y));
				turnFactor = speed / absTurn;
				
				cell.x += turnFactor * turn.x;
				cell.y += turnFactor * turn.y;
				
				cell.x = Math.max(0, cell.x);
				cell.x = Math.min(width, cell.x);
				cell.y = Math.max(0, cell.y);
				cell.y = Math.min(height, cell.y);
			}
		}
		
		callback && callback(null, null);
	}
	
	function checkWinner(callback) {
		var i, cell,
			finalResults;
		
		for (i = cells.length - 1; i >= 0; i--) {
			cell = cells[i];
			if ((cell.size / totalCellSize) > 0.5) {
				results = results.concat(cells.sort(function (a, b) {
					return a.size - b.size;
				}));
				
				finalResults = [];
				while (results.length) {
					finalResults.push(results.pop());
				}
				
				callback && callback(null, finalResults);
			}
		}
		
		callback && callback(null, null);
	}
	
	replenishFoodAsync = Promise.promisify(replenishFood);
	checkCellsEatenAsync = Promise.promisify(checkCellsEaten);
	checkFoodEatenAsync = Promise.promisify(checkFoodEaten);
	runCellTurnsAsync = Promise.promisify(runCellTurns);
	checkWinnerAsync = Promise.promisify(checkWinner);
	
	this.processTurn = function processTurn(callback) {
		if (processing) {
			return;
		}
		
		processing = true;
		
		replenishFoodAsync().then(function () {
			return checkCellsEatenAsync();
		}).then(function () {
			return checkFoodEatenAsync();
		}).then(function () {
			return runCellTurnsAsync();
		}).then(function () {
			return checkWinnerAsync();
		}).then(function (results) {
			processing = false;
			callback(null, results);
		});
	};
	
	this.processDisplay = function processDisplay() {
		cells.forEach(function (cell) {
			cell.move();
		});
	};
	
	processing = false;
}

module.exports = PetriDish;
