// 🎮 EMERGENCY RECOVERY ENGINE: STARTING FROM THE "WORKING" TEST CODE
const TILE_SIZE = 60;
const LEVELS = [
  ["##########", "#@       #", "#        #", "#       E#", "##########"],
  ["##########", "#@       #", "#   #O   #", "#        #", "#      E #", "##########"],
  ["##########", "#E       #", "#        #", "#   #    #", "# O @ O  #", "##########"],
  ["##########", "#        #", "#  O     #", "# # #  E #", "#@       #", "##########"],
  ["##########", "#E  #    #", "#   O    #", "#   #    #", "#   O   @#", "##########"],
  ["##########", "#@  O    #", "## ###  E#", "#   O    #", "##########"],
  ["############", "#E         #", "#          #", "#    #O    #", "#    O#    #", "#     @    #", "############"],
  ["############", "#@         #", "#   O      #", "# # # # #  #", "#    O     #", "#         E#", "############"],
  ["############", "#@    O    #", "#  #  O #  #", "#  O  O    #", "#     #   E#", "#          #", "############"],
  ["############", "#E  #      #", "#   O  O   #", "#   #  #   #", "#   O  O   #", "#          #", "#      @   #", "############"],
  ["############", "#@        E#", "#  #O#  #O##", "#          #", "#  #O#  #O##", "#          #", "############"],
  ["############", "#E         #", "##  O  O  ##", "#   #  #   #", "##  O  O  ##", "#          #", "#     @    #", "############"],
  ["############", "#@        E#", "# O #  # O #", "#   O  O   #", "# # O  O # #", "#   O  O   #", "############"],
  ["############", "#@    #    #", "#  #  O #  #", "#  O  O  E #", "#  #  O #  #", "#     #    #", "############"],
  ["############", "#E    #   @#", "#  #  O #  #", "#  O  O    #", "#  #  O #  #", "#     #    #", "############"]
];

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const titleElem = document.getElementById('level-title');
const movesElem = document.getElementById('moves-count');

let currentLevelIdx = 0;
let grid = [], player = null, boxes = [], exitPos = null;
let rows = 0, cols = 0, movesCount = 0;

function drawLevel() {
  if (!ctx) return;
  // Background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Walls
  ctx.fillStyle = '#475569';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === '#') ctx.fillRect(x * 60 + 2, y * 60 + 2, 56, 56);
    }
  }

  // Exit
  if (exitPos) {
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(exitPos.x * 60 + 30, exitPos.y * 60 + 30, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Boxes
  boxes.forEach((b, i) => {
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(b.x * 60 + 4, b.y * 60 + 4, 52, 52);
  });

  // Player
  if (player) {
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(player.x * 60 + 30, player.y * 60 + 30, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(player.x * 60 + 22, player.y * 60 + 22, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loadLevel(idx) {
  const levelData = LEVELS[idx];
  rows = levelData.length;
  cols = levelData[0].length;
  canvas.width = cols * TILE_SIZE;
  canvas.height = rows * TILE_SIZE;

  if (titleElem) titleElem.innerText = `Level ${idx + 1}`;
  movesCount = 0;
  if (movesElem) movesElem.innerText = movesCount;

  grid = []; boxes = []; player = null; exitPos = null;
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      const char = levelData[y][x];
      if (char === '#') row.push('#');
      else if (char === 'E') { exitPos = { x, y }; row.push('.'); }
      else if (char === '@') { player = { x, y }; row.push('.'); }
      else if (char === 'O') { boxes.push({ x, y }); row.push('.'); }
      else row.push('.');
    }
    grid.push(row);
  }
  drawLevel();
}

function move(dx, dy) {
  let moved = false;
  let all = [player, ...boxes].sort((a, b) => dx ? (b.x - a.x) * dx : (b.y - a.y) * dy);
  let searching = true;
  while (searching) {
    searching = false;
    all.forEach(e => {
      let tx = e.x + dx, ty = e.y + dy;
      if (tx < 0 || tx >= cols || ty < 0 || ty >= rows || grid[ty][tx] === '#') return;
      if ([player, ...boxes].some(o => o !== e && o.x === tx && o.y === ty)) return;
      e.x = tx; e.y = ty; searching = true; moved = true;
    });
  }
  if (moved) {
    movesCount++;
    if (movesElem) movesElem.innerText = movesCount;
    drawLevel();
    if (player.x === exitPos.x && player.y === exitPos.y) {
      setTimeout(() => {
        alert("Level Complete!");
        currentLevelIdx++;
        loadLevel(currentLevelIdx);
      }, 100);
    }
  }
}

window.onkeydown = (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') move(0, -1);
  if (e.key === 'ArrowDown' || e.key === 's') move(0, 1);
  if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0);
  if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0);
  if (e.key === ' ') loadLevel(currentLevelIdx);
};

// Start the game immediately
loadLevel(0);
console.log("Game Loaded Successfully!");
