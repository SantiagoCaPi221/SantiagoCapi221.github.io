const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

// Tamaño de cada celda del juego
const gridSize = 20;
const canvasSize = 400;

// Puntos de la serpiente
let snake = [{ x: 160, y: 160 }];
let direction = { x: gridSize, y: 0 };

// Comida
let food = { x: 0, y: 0 };

// Variables de puntuación
let score = 0;
let highcore = localStorage.getItem("highcore") || 0;  // Recuperar el puntaje más alto almacenado

// Función para generar comida en una posición aleatoria
function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Función para actualizar el juego
function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Comprobar si la serpiente choca con los bordes
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || collision(head)) {

        // Si el puntaje es más alto, actualizamos el highcore
        if (score > highcore){
            highcore = score;
            localStorage.setItem("highcore", highcore);  // Guardar el nuevo highcore
        }

        alert("¡Perdiste! Tu puntuación fue: " + score);
        resetGame();
        return;
    }

    snake.unshift(head);

    // Si la serpiente come la comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop(); // Eliminar la cola de la serpiente si no comió
    }

    // Dibujar el tablero
    drawGame();
}

// Función para verificar si la serpiente choca consigo misma
function collision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Función para dibujar el juego
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Limpiar el lienzo

    // Dibujar la serpiente
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Dibujar la comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Dibujar la puntuación
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Puntuación: " + score, 10, 20);

    // Dibujar el mejor puntaje
    ctx.fillText("Mejor Puntuación: " + highcore, 10, 40);
}

// Función para manejar las teclas presionadas
function changeDirection(event) {
    if (event.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (event.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (event.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (event.key === "ArrowRight" && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

// Función para reiniciar el juego
function resetGame() {
    snake = [{ x: 160, y: 160 }];
    direction = { x: gridSize, y: 0 };
    score = 0;
    generateFood();
}

// Configuración de los eventos de teclado
document.addEventListener("keydown", changeDirection);

// Generar la primera comida
generateFood();

// Llamada inicial al juego
setInterval(updateGame, 100);
