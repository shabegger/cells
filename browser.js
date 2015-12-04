var PetriDish = require('./source/petriDish'),
	SVGDisplay = require('./display/svg'),
	SVGCell = SVGDisplay.SVGCell,
	SVGFood = SVGDisplay.SVGFood,
	Random = require('./ai/random'),
	Simple = require('./ai/simple'),
	
	width = 500,
	height = 225,
	
	svgElement = document.getElementById('cells-dish'),
	
	aiList, cellList, foodFactory,
	petriDish,
	intervalID;
	
function start() {
	var randomCount = 1,
		simpleCount = 1,
		i, circles, circle;
		
	document.getElementById('btn-start').disabled = true;
		
	circles = document.getElementById('cells-dish').childNodes;
	for (i = circles.length - 1; i >= 0; i--) {
		circle = circles[i];
		circle.remove();
	}
	
	aiList = Array.prototype.slice.call(document.getElementsByTagName('select')).map(function (select) {
		var value, option,
			i, len;
		
		for (i = 0, len = select.childNodes.length; i < len; i++) {
			option = select.childNodes[i];
			if (option.selected) {
				value = option.value;
				break;
			}
		}
		
		return value;
	}).filter(function (value) {
		return !!value;
	}).map(function (value) {
		switch (value) {
			case 'Random':
				return new Random('Random ' + randomCount++);
			case 'Simple':
				return new Simple('Simple ' + simpleCount++);
		}
	});
	
	cellList = aiList.map(function (ai) {
		var x = Math.random() * width,
			y = Math.random() * height,
			r, g, b;
			
		if (ai instanceof Simple) {
			r = 0;
			g = 0;
			b = 255;
		} else {
			r = 255;
			g = 0;
			b = 0;
		}
		
		return new SVGCell(svgElement, x, y, 10, ai, r, g, b);
	});
	
	foodFactory = function(width, height) {
		return new SVGFood(svgElement, width, height, 5);
	};
	
	petriDish = new PetriDish(width, height, 20, 12, 200, cellList, foodFactory);
	
	intervalID = setInterval(function () {
		petriDish.processTurn(function (err, results) {
			if (results) {
				clearInterval(intervalID);
				intervalID = null;
				
				alert(results.map(function (result, i) {
					return '' + (i + 1) + '. ' + result.name;
				}).join('\n'));
				
				document.getElementById('btn-start').disabled = false;
			}
		});
	}, 15);
	
	function animate() {
		petriDish.processDisplay();
		
		if (intervalID) {
			requestAnimationFrame(animate);
		}
	}
	
	requestAnimationFrame(animate);
}

document.getElementById('btn-start').onclick = start;
