const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rectWidth = 300;
const rectHeight = 300;


//Draw the canvas
function clearCanvas(){
    ctx.fillStyle = "pink";
    ctx.fillRect(0,0,rectWidth,rectHeight);
    ctx.strokeStyle = "hotpink";
    ctx.lineWidth = 2;
    ctx.strokeRect(0,0,rectWidth,rectHeight);

}

// Draw the snake
let snake = [ {x: 150, y:150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150}];
let score = 0;

function drawSnakePart(snakePart) {
    ctx.fillStyle = "hotpink";
    ctx.strokeStyle = "fuchsia";
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

// Move horizontally + vertically
let dx = 10;
let dy = 0;
let changingDirection;

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if(changingDirection) {
        return;
    }
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingLeft = dx === -10;
    const goingRight = dx === 10;

    if(keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if(keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if(keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if(keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const ateFood = snake[0].x === foodX && snake[0].y === foodY;
    if(ateFood) {
        score+=10;
        document.getElementById('score').innerHTML = "Score: " + score;
        createFood();
    } else {
        snake.pop();
    }
}

//Create food
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
    snake.forEach( function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if(foodIsOnSnake) {
            createFood();
        }
    })
}

function drawFood() {
    ctx.fillStyle = "violet";
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeStyle = "indigo";
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for(let i=4; i< snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if(didCollide) {
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y > canvas.height - 10;
    const hitBottomWall = snake[0].y < 0;

    return hitBottomWall || hitLeftWall || hitRightWall || hitTopWall;
}

//Move automatically
function main() {
    if(didGameEnd()) {
        return;
    }
    setTimeout( function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 100);
}

createFood();

main();

document.addEventListener("keydown", changeDirection);



