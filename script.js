const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const size = 20;

// Одна функція використовується для двох об'єктів.
// this звертається до об'єкта, для якого викликається метод.
function drawEntity() {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, size, size);
}

// Об'єкт гравця
const character = {
  x: 200, y: 200, color: "#75df75",
  body: [], dx: size, dy: 0,
  draw: drawEntity
};

// Об'єкт перешкоди
const enemy = {
  x: 100, y: 100, color: "#e65b5b",
  draw: drawEntity
};

let apple = { x: 300, y: 200 };
let score = 0;
let gameOver = false;

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  character.body.forEach(part => {
    ctx.fillStyle = "#459b45";
    ctx.fillRect(part.x, part.y, size, size);
  });

  // Та сама функція drawEntity викликається для двох об'єктів.
  character.draw();
  enemy.draw();

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, size, size);
}

function moveGame() {
  if (gameOver) return;

  character.body.unshift({ x: character.x, y: character.y });
  character.x += character.dx;
  character.y += character.dy;

  if (character.x === apple.x && character.y === apple.y) {
    score++;
    document.getElementById("score").textContent = score;
    moveApple();
  } else {
    character.body.pop();
  }

  if (character.x < 0 || character.x >= 400 ||
      character.y < 0 || character.y >= 400) {
    endGame();
  }

  character.body.forEach(part => {
    if (character.x === part.x && character.y === part.y) {
      endGame();
    }
  });

  if (character.x === enemy.x && character.y === enemy.y) {
    endGame();
  }

  drawGame();
}

function moveApple() {
  apple.x = Math.floor(Math.random() * 20) * size;
  apple.y = Math.floor(Math.random() * 20) * size;

  if ((apple.x === enemy.x && apple.y === enemy.y) ||
      (apple.x === character.x && apple.y === character.y)) {
    moveApple();
  }
}

function endGame() {
  gameOver = true;
  document.getElementById("message").textContent =
    "Гру завершено! Твій рахунок: " + score;
}

function restartGame() {
  character.x = 200;
  character.y = 200;
  character.dx = size;
  character.dy = 0;
  character.body = [];

  enemy.x = 100;
  enemy.y = 100;

  score = 0;
  gameOver = false;

  document.getElementById("score").textContent = "0";
  document.getElementById("message").textContent =
    "Збирай яблука та уникай перешкод!";

  moveApple();
  drawGame();
}

document.addEventListener("keydown", function(event) {
  const key = event.key.toLowerCase();

  if ((key === "arrowup" || key === "w") && character.dy === 0) {
    character.dx = 0;
    character.dy = -size;
  } else if ((key === "arrowdown" || key === "s") && character.dy === 0) {
    character.dx = 0;
    character.dy = size;
  } else if ((key === "arrowleft" || key === "a") && character.dx === 0) {
    character.dx = -size;
    character.dy = 0;
  } else if ((key === "arrowright" || key === "d") && character.dx === 0) {
    character.dx = size;
    character.dy = 0;
  }
});

restartGame();
setInterval(moveGame, 130);
