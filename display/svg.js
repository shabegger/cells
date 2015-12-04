var Cell = require('../source/cell'),
	Food = require('../source/food'),
	svgNS = 'http://www.w3.org/2000/svg';
	
function makeSVGCircleClass(constructor) {
	function newConstructor(svgElement) {
		var args = Array.prototype.slice.call(arguments, 1);
		
		this.svg = svgElement;
		
		constructor.apply(this, args);
	}
	
	newConstructor.prototype = Object.create(constructor.prototype);
	newConstructor.prototype.constructor = newConstructor;
	
	newConstructor.prototype.draw = function draw() {
		var elem = document.createElementNS(svgNS, 'circle');
		
		elem.setAttributeNS(null, 'cx', this.x);
		elem.setAttributeNS(null, 'cy', this.y);
		elem.setAttributeNS(null, 'r', this.radius);
		elem.setAttributeNS(null, 'fill', [
			'rgb(',
			this.r, ',',
			this.g, ',',
			this.b, ')'
		].join(''));
		
		this.elem = elem;
		this.svg.appendChild(elem);
	};
	
	newConstructor.prototype.move = function move() {
		var elem = this.elem;
		
		elem.setAttributeNS(null, 'cx', this.x);
		elem.setAttributeNS(null, 'cy', this.y);
		elem.setAttributeNS(null, 'r', this.radius);
	};
	
	newConstructor.prototype.remove = function remove() {
		this.elem.remove();
		delete this.elem;
	};
	
	return newConstructor;
}

module.exports = {
	SVGCell: makeSVGCircleClass(Cell),
	SVGFood: makeSVGCircleClass(Food)
};
