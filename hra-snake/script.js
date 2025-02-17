class Snake {
    constructor(boxSize) {
        // Iiicializace velikosti políčka, těla hadu a počátečního směru
        this.boxSize = boxSize;
        this.body = [{ x: 8 * boxSize, y: 8 * boxSize }];
        this.direction = "RIGHT";
    }

    move() {
        // vytvoření nové hlavy hada na základě aktuálního směru
        const head = { x: this.body[0].x, y: this.body[0].y };

        // změna pozice hlavy podle směru
        if (this.direction === "UP") head.y -= this.boxSize;
        if (this.direction === "DOWN") head.y += this.boxSize;
        if (this.direction === "LEFT") head.x -= this.boxSize;
        if (this.direction === "RIGHT") head.x += this.boxSize;

        // přidání nové hlavy na začátek těla
        this.body.unshift(head);
        return head;
    }

    setDirection(newDirection) {
        // zabránění hadovi jít opačným směrem
        if ((newDirection === "UP" && this.direction !== "DOWN") ||
            (newDirection === "DOWN" && this.direction !== "UP") ||
            (newDirection === "LEFT" && this.direction !== "RIGHT") ||
            (newDirection === "RIGHT" && this.direction !== "LEFT")) {
            this.direction = newDirection; // nastavení nového směru
        }
    }

    checkCollision(canvasWidth, canvasHeight) {
        // kontrola, jestli had narazil do zdi nebo sám do sebe
        const head = this.body[0];

        // kontrola kolize se zdí
        if (head.x < 0 || head.y < 0 || head.x >= canvasWidth || head.y >= canvasHeight) {
            return true;
        }

        // kontrola kolize s tělem 
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }

        return false;
    }

    draw(ctx) {
        // kreslení těla hada
        for (let i = 0; i < this.body.length; i++) {
            const segment = this.body[i];
            // hlava hada je světle modrá, zbytek těla je modrý
            ctx.fillStyle = i === 0 ? "lightblue" : "blue";
            ctx.fillRect(segment.x, segment.y, this.boxSize, this.boxSize);
        }
    }
}

// inicializace hry
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400; // šířka plátna
canvas.height = 400; // výška plátna

const boxSize = 20;
let snake = new Snake(boxSize);
let food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
let score = 0;

// funkce pro generování náhodné pozice pro jablko
function randomPosition(max) {
    return Math.floor(Math.random() * max / boxSize) * boxSize;
}

// funkce pro vykreslení herních prvků
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // vyčištění plátna
    snake.draw(ctx);
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// funkce pro aktualizaci stavu hry
function update() {
    const newHead = snake.move(); // Posun hada
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
    } else {
        // odstraníme poslední políčko hada, abychom simulovali pohyb
        snake.body.pop();
    }

    if (snake.checkCollision(canvas.width, canvas.height)) {
        // pokud dojde k kolizi, zastavíme hru a zobrazíme tlačítko pro restart
        clearInterval(gameInterval);
        document.getElementById("restartButton").style.display = "block";
    }
}

function gameLoop() {
    update(); // aktualizace stavu hry
    draw(); // kreslení aktualizovaného stavu hry
}

// posluchač pro klávesové vstupy pro změnu směru hada
document.addEventListener("keydown", function (event) {
    const directions = {
        "ArrowUp": "UP",
        "ArrowDown": "DOWN",
        "ArrowLeft": "LEFT",
        "ArrowRight": "RIGHT"
    };

    // nastavení směru hada na základě stisknuté klávesy
    if (directions[event.key]) {
        snake.setDirection(directions[event.key]);
    }
});

// posluchač pro tlačítko restartu
document.getElementById("restartButton").addEventListener("click", function () {
    // resetování stavu hry
    snake = new Snake(boxSize);
    score = 0;
    food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) };
    document.getElementById("restartButton").style.display = "none";
    gameInterval = setInterval(gameLoop, 200); // restartování herní smyčky
});

// spuštění herní smyčky
let gameInterval = setInterval(gameLoop, 200);
