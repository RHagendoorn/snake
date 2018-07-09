'use strict';

window.onload = () => {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	const size = 20;

	const model = {
		size: size,
		length: 5,
		tail: [],
		loc: {x: canvas.width / 2, y: canvas.height / 2},
		dir: {x: size, y: 0},
		foodLoc: getFoodLoc(canvas, size)
	};

	document.addEventListener('keydown', event => changeDirection(event, model));
	window.setInterval(drawGame, 100, {canvas, ctx, model});
};

const changeDirection = (event, model) => {
	switch(event.keyCode) {
		case 37:
			model.dir.x = model.dir.x === model.size ? model.size : -model.size;
			model.dir.y = 0;
			break;
		case 38:
			model.dir.x = 0;
			model.dir.y = model.dir.y === model.size ? model.size : -model.size;
			break;
		case 39:
			model.dir.x = model.dir.x === -model.size ? -model.size : model.size;
			model.dir.y = 0;
			break;
		case 40:
			model.dir.x = 0;
			model.dir.y = model.dir.y === -model.size ? -model.size : model.size;
	}
};

const drawGame = ({canvas, ctx, model})  => {
	drawField(ctx, canvas);
	updateLocation(model);
	checkLose(canvas, model);
	drawFood({ctx, canvas, model});
	jumpOver(canvas, model);
	drawSnake(ctx, model);
};

const drawField = (ctx, canvas) => {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.height, canvas.width);

	ctx.fillStyle = 'black';
	ctx.strokeRect(0, 0, canvas.height, canvas.width);
};

const updateLocation = (model) => {
	model.loc.x += model.dir.x;
  	model.loc.y += model.dir.y;
};

const jumpOver = (canvas, model) => {
	switch(true) {
		case model.loc.x === canvas.width:
			model.loc.x = 0;
			break;
		case model.loc.x < 0:
			model.loc.x = canvas.width - model.size;
			break;
		case model.loc.y === canvas.height:
			model.loc.y = 0;
			break;
		case model.loc.y < 0:
			model.loc.y = canvas.height - model.size;
			break;
		default:
			break;
	}
};

const drawSnake = (ctx, model) => {
	ctx.fillStyle = 'black';
	ctx.fillRect(model.loc.x, model.loc.y, model.size, model.size);
	const tail = [...model.tail, {x: model.loc.x, y: model.loc.y}];
	model.tail = reduceTail(tail, model.length);
	tail.forEach(elem => {
		ctx.fillRect(elem.x, elem.y, model.size, model.size)
	});
};

const reduceTail = (tail, length) => {
	if (tail.length > length) {
		return reduceTail(tail.slice(1), length);
	}
	return tail;
};

const checkLose = (canvas, model) => {
	if (model.tail.some(elem => elem.x === model.loc.x && elem.y === model.loc.y)) {
		model.length = 5;
		model.loc.x = canvas.width / 2;
		model.loc.y = canvas.height / 2;
		model.dir.x = model.size;
		model.dir.y = 0;
	}
};

const getFoodLoc = (canvas, size) => {
	return {
		x: Math.floor(Math.random() * canvas.width / size) * size,
		y: Math.floor(Math.random() * canvas.height / size) * size
	};
};

const drawFood = ({ctx, canvas, model}) => {
	if (model.loc.x === model.foodLoc.x && model.loc.y === model.foodLoc.y) {
		model.length += 1;
		model.foodLoc = getFoodLoc(canvas, model.size);
	}

	ctx.fillStyle = 'red';
	ctx.fillRect(model.foodLoc.x, model.foodLoc.y, model.size, model.size)
};

