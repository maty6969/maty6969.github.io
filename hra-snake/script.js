const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake = [{ x: 8 * boxSize, y: 8 * boxSize }];
let direction = "RIGHT";
let food = {
    x: randomPosition(canvas.width),
    y: randomPosition(canvas.height)
};
let score = 0;

// Náhodná pozice jídla
function randomPosition(max) {
    return Math.floor(Math.random() * max / boxSize) * boxSize;
}

// Kreslení plátna
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kreslení hada
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lightblue" : "blue";
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });

    // Kreslení jídla
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Zobrazení skóre
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Aktualizace herní logiky
function update() {
    const head = { ...snake[0] };

    // Pohyb hlavy
    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    // Kolize s jídlem
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
    } else {
        snake.pop(); // Odstraní poslední článek hada
    }

    // Kolize se stěnami nebo se sebou samým
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        document.getElementById("restartButton").style.display = "block";
        return;
    }

    snake.unshift(head); // Přidá nový článek na začátek hada
}

// Herní smyčka
function gameLoop() {
    update();
    draw();
}

// Ovládání klávesnicí
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Tlačítko "Hrát znovu"
document.getElementById("restartButton").addEventListener("click", () => {
    snake = [{ x: 8 * boxSize, y: 8 * boxSize }];
    direction = "RIGHT";
    score = 0;
    food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
    document.getElementById("restartButton").style.display = "none";
    gameInterval = setInterval(gameLoop, 200);
});

// Spuštění hry
let gameInterval = setInterval(gameLoop, 200);
