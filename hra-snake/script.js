class Snake {
    constructor(boxSize) {
        this.boxSize = boxSize;
        this.body = [{ x: 8 * boxSize, y: 8 * boxSize }];
        this.direction = "RIGHT";
    }

    move() {
        const head = { x: this.body[0].x, y: this.body[0].y };

        if (this.direction === "UP") head.y -= this.boxSize;
        if (this.direction === "DOWN") head.y += this.boxSize;
        if (this.direction === "LEFT") head.x -= this.boxSize;
        if (this.direction === "RIGHT") head.x += this.boxSize;

        this.body.unshift(head);
        return head;
    }

    setDirection(newDirection) {
        if ((newDirection === "UP" && this.direction !== "DOWN") ||
            (newDirection === "DOWN" && this.direction !== "UP") ||
            (newDirection === "LEFT" && this.direction !== "RIGHT") ||
            (newDirection === "RIGHT" && this.direction !== "LEFT")) {
            this.direction = newDirection;
        }
    }

    checkCollision(canvasWidth, canvasHeight) {
        const head = this.body[0];

        // Vráceno zpět na tradiční if podmínky
        if (head.x < 0 || head.y < 0 || head.x >= canvasWidth || head.y >= canvasHeight) {
            return true;
        }

        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }

        return false;
    }

    draw(ctx) {
        for (let i = 0; i < this.body.length; i++) {
            const segment = this.body[i];
            ctx.fillStyle = i === 0 ? "lightblue" : "blue";
            ctx.fillRect(segment.x, segment.y, this.boxSize, this.boxSize);
        }
    }
}

// Inicializace hry
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake = new Snake(boxSize);
let food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
let score = 0;

function randomPosition(max) {
    return Math.floor(Math.random() * max / boxSize) * boxSize;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw(ctx);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function update() {
    const newHead = snake.move();
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
    } else snake.body.pop();

    if (snake.checkCollision(canvas.width, canvas.height)) {
        clearInterval(gameInterval);
        document.getElementById("restartButton").style.display = "block";
    }
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener("keydown", function (event) {
    const directions = {
        "ArrowUp": "UP",
        "ArrowDown": "DOWN",
        "ArrowLeft": "LEFT",
        "ArrowRight": "RIGHT"
    };

    if (directions[event.key]) {
        snake.setDirection(directions[event.key]);
    }
});

document.getElementById("restartButton").addEventListener("click", function () {
    snake = new Snake(boxSize);
    score = 0;
    food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
    document.getElementById("restartButton").style.display = "none";
    gameInterval = setInterval(gameLoop, 200);
});

let gameInterval = setInterval(gameLoop, 200);
