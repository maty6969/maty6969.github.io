class Snake {
    constructor(boxSize) {
        this.boxSize = boxSize; // Velikost jednoho čtverce na hrací ploše
        this.body = [{ x: 8 * boxSize, y: 8 * boxSize }]; // Vytvoření hada na pozici uprostřed plátna
        this.direction = "RIGHT"; // Počáteční směr pohybu hada
    }

    move() {
        // Vytvoření nové hlavy hada podle aktuálního směru
        const head = { x: this.body[0].x, y: this.body[0].y };

        // Změna pozice hlavy podle směru
        if (this.direction === "UP") head.y -= this.boxSize;
        if (this.direction === "DOWN") head.y += this.boxSize;
        if (this.direction === "LEFT") head.x -= this.boxSize;
        if (this.direction === "RIGHT") head.x += this.boxSize;

        // Přidání nové hlavy na začátek 
        this.body.unshift(head);
        return head; // Vrací novou pozici hlavy
    }

    setDirection(newDirection) {
        // Zabránění tomu, aby had šel opačným směrem (např. zleva rovnou doprava)
        if ((newDirection === "UP" && this.direction !== "DOWN") ||
            (newDirection === "DOWN" && this.direction !== "UP") ||
            (newDirection === "LEFT" && this.direction !== "RIGHT") ||
            (newDirection === "RIGHT" && this.direction !== "LEFT")) {
            this.direction = newDirection; // Nastavení nového směru
        }
    }

    checkCollision(canvasWidth, canvasHeight) {
        // Kontrola, jestli had narazil do stěny nebo sám do sebe
        const head = this.body[0];

        // Kontrola kolize se stěnou
        if (head.x < 0 || head.y < 0 || head.x >= canvasWidth || head.y >= canvasHeight) {
            return true;
        }

        // Kontrola kolize s vlastním tělem
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }

        return false; // Žádná kolize
    }

    draw(ctx) {
        // Vykreslení hada na plátně
        for (let i = 0; i < this.body.length; i++) {
            const segment = this.body[i];
            ctx.fillStyle = i === 0 ? "lightblue" : "blue"; // Hlava je světle modrá, tělo modré
            ctx.fillRect(segment.x, segment.y, this.boxSize, this.boxSize); // Kreslení čtverců hada
        }
    }
}

// Inicializace hry
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20; // Velikost jednoho políčka
let snake = new Snake(boxSize); // Vytvoření hada
let food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) }; // Vygenerování počáteční pozice jídla
let score = 0;

// Funkce pro generování náhodné pozice pro jídlo
function randomPosition(max) {
    return Math.floor(Math.random() * max / boxSize) * boxSize; // Náhodná pozice zarovnaná na mřížku
}

// Funkce pro vykreslení všech prvků hry
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Vyčištění plátna
    snake.draw(ctx); // Vykreslení hada
    ctx.fillStyle = "red"; // Barva jídla
    ctx.fillRect(food.x, food.y, boxSize, boxSize); // Vykreslení jídla
    ctx.fillStyle = "white"; // Barva textu skóre
    ctx.font = "20px Arial"; // Styl písma
    ctx.fillText("Score: " + score, 10, 20); // Zobrazení skóre
}

// Funkce pro aktualizaci stavu hry
function update() {
    const newHead = snake.move(); // Posunutí hada
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) }; // Vytvoření nového jídla
    } else {
        snake.body.pop(); // Odstranění posledního článku těla, aby se simuloval pohyb
    }

    if (snake.checkCollision(canvas.width, canvas.height)) {
        clearInterval(gameInterval); // Zastavení hry při kolizi
        document.getElementById("restartButton").style.display = "block"; // Zobrazení tlačítka pro restart
    }
}

// Hlavní smyčka hry
function gameLoop() {
    update();
    draw();
}

// Posluchač událostí pro ovládání směru pomocí šipek
document.addEventListener("keydown", function (event) {  // Po stisknutí klávesy dostane parametr event informaci o tom která klavesa byla stisknuta
    const directions = {
        "ArrowUp": "UP",
        "ArrowDown": "DOWN",
        "ArrowLeft": "LEFT",
        "ArrowRight": "RIGHT"
    };

    if (directions[event.key]) {
        snake.setDirection(directions[event.key]); // Nastavení nového směru podle klávesy
    }
});

// Posluchač událostí pro restartování hry
document.getElementById("restartButton").addEventListener("click", function () {
    snake = new Snake(boxSize); // Vytvoření nového hada
    score = 0; // Resetování skóre
    food = { x: randomPosition(canvas.width), y: randomPosition(canvas.height) }; // Nová pozice jídla
    document.getElementById("restartButton").style.display = "none"; // Skrytí tlačítka restartu
    gameInterval = setInterval(gameLoop, 200); // Restartování herní smyčky
});

let gameInterval = setInterval(gameLoop, 200); // Hra se aktualizuje každých 200 ms
