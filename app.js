'use strict';

window.onload = () => {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	const size = 20;
	const length = {l: 5};
	const tail = [];
	const loc = {x: 200, y: 200};
	const dir= {x: size, y: 0};
	const food = {
		x: Math.floor(Math.random() * canvas.width / size) * size,
		y: Math.floor(Math.random() * canvas.height / size) * size
	};

	document.addEventListener('keydown', event => changeDirection(event, dir, size));
	window.setInterval(drawGame, 100, canvas, ctx, loc, length, dir, size, tail, food);
};

const changeDirection = (event, dir, size) => {
	switch(event.keyCode) {
		case 37:
			dir.x = dir.x === size ? size : -size;
			dir.y = 0;
			break;
		case 38:
			dir.x = 0;
			dir.y = dir.y === size ? size : -size;
			break;
		case 39:
			dir.x = dir.x === -size ? -size : size;
			dir.y = 0;
			break;
		case 40:
			dir.x = 0;
			dir.y = dir.y === -size ? -size : size;
	}
};

const drawGame = (canvas, ctx, loc, length, dir, size, tail, food)  => {
	drawField(ctx, canvas);
	updateLocation(loc, tail, dir, length);
	checkLose(tail, length, loc, dir, size);
	drawFood(loc, food, length, canvas, ctx, size);
	jumpOver(canvas, loc, size);
	drawSnake(ctx, loc, tail, size, length);
};

const drawField = (ctx, canvas) => {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.height, canvas.width);

	ctx.fillStyle = 'black';
	ctx.strokeRect(0, 0, canvas.height, canvas.width);
};

const updateLocation = (loc, tail, dir, length) => {
	loc.x += dir.x;
  	loc.y += dir.y;
};

const jumpOver = (canvas, loc, size) => {
	switch(true) {
		case loc.x === canvas.width:
			loc.x = 0;
			break;
		case loc.x < 0:
			loc.x = canvas.width - size;
			break;
		case loc.y === canvas.height:
			loc.y = 0;
			break;
		case loc.y < 0:
			loc.y = canvas.height - size;
			break;
		default:
			break;
	}
};

const drawSnake = (ctx, loc, tail, size, length) => {
	ctx.fillStyle = 'black';
	ctx.fillRect(loc.x, loc.y, size, size);
	tail.push({x: loc.x, y: loc.y});
	reduceTail(tail, length);
	tail.forEach(elem => {
		ctx.fillRect(elem.x, elem.y, size, size)
	});
};

const reduceTail = (tail, length) => {
	if (tail.length > length.l) {
		tail.shift();
		reduceTail(tail, length);
	}
};

const checkLose = (tail, length, loc, dir, size) => {
	if (tail.some(elem => elem.x === loc.x && elem.y === loc.y)) {
		length.l = 5;
		loc.x = 200;
		loc.y = 200;
		dir.x = size;
		dir.y = 0;
	}
};

const drawFood = (loc, food, length, canvas, ctx, size) => {
	if (loc.x === food.x && loc.y === food.y) {
		length.l += 1;
		food.x = Math.floor(Math.random() * canvas.width / size) * size;
		food.y = Math.floor(Math.random() * canvas.height / size) * size;
	}

	ctx.fillStyle = 'red';
	ctx.fillRect(food.x, food.y, size, size)
};

