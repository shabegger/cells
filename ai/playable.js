var AI = require('../source/ai');

function Playable(name) {
	var up = false,
		down = false,
		left = false,
		right = false;

	$(window).on('keydown', function (e) {
		switch (e.which) {
			case 38: // Up Arrow
			case 87: // W
				up = true;
				break;
			case 40: // Down Arrow
			case 83: // S
				down = true;
				break;
			case 37: // Left Arrow
			case 65: // A
				left = true;
				break;
			case 39: // Right Arrow
			case 68: // D
				right = true;
				break;
		}
	});

	$(window).on('keyup', function (e) {
		switch (e.which) {
			case 38: // Up Arrow
			case 87: // W
				up = false;
				break;
			case 40: // Down Arrow
			case 83: // S
				down = false;
				break;
			case 37: // Left Arrow
			case 65: // A
				left = false;
				break;
			case 39: // Right Arrow
			case 68: // D
				right = false;
				break;
		}
	});

	AI.call(this, name, function () {
		var x = 0, y = 0;

		if (up) y--;
		if (down) y++;
		if (left) x--;
		if (right) x++;

		return {
			x: x,
			y: y
		};
	});
}

Playable.prototype = Object.create(AI.prototype);
Playable.prototype.constructor = Playable;

module.exports = Playable;
