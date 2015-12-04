var PetriDish = require('./source/petriDish'),
	Cell = require('./source/cell'),
	Food = require('./source/food'),
	Random = require('./ai/random'),
	
	width = 1000,
	height = 800,
	
	aiList, cellList, foodFactory,
	petriDish;
	
aiList = [
	new Random('One'),
	new Random('Two'),
	new Random('Three'),
	new Random('Four'),
	new Random('Five'),
	new Random('Six'),
	new Random('Seven'),
	new Random('Eight')
];

cellList = aiList.map(function (ai) {
	var x = Math.random() * width,
		y = Math.random() * height;
	
	return new Cell(x, y, 10, ai);
});

foodFactory = function(width, height) {
	return new Food(width, height, 5);
};

petriDish = new PetriDish(width, height, 12, 10, 200, cellList, foodFactory);

function processTurn() {
	petriDish.processTurn(function (err, results) {
		if (results) {
			console.log(results[0].name);
			process.exit();
		} else {
			processTurn();
		}
	});
}

processTurn();
