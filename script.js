(() => {
  const cells = Array.from(document.querySelectorAll(".cell"));
  const statusEl = document.getElementById("status");
  const resetRoundBtn = document.getElementById("resetRound");
  const resetAllBtn = document.getElementById("resetAll");

  const scoreEls = {
    X: document.getElementById("scoreX"),
    O: document.getElementById("scoreO"),
    D: document.getElementById("scoreD")
  };

  const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6] // diagonals
  ];

  let board = Array(9).fill(null);
  let current = "X";
  let running = true;

  // --- Score Persistence (localStorage) ---
  const loadScores = () => {
    const saved = JSON.parse(
      localStorage.getItem("ttt:scores") || '{"X":0,"O":0,"D":0}'
    );
    scoreEls.X.textContent = saved.X;
    scoreEls.O.textContent = saved.O;
    scoreEls.D.textContent = saved.D;
  };
  const saveScores = () => {
    const data = {
      X: Number(scoreEls.X.textContent),
      O: Number(scoreEls.O.textContent),
      D: Number(scoreEls.D.textContent)
    };
    localStorage.setItem("ttt:scores", JSON.stringify(data));
  };

  // --- Helpers ---
  const setStatus = (msg) => {
    statusEl.textContent = msg;
  };

  const drawMark = (index, player) => {
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
  };

  const highlightWin = (line) => {
    line.forEach((i) => cells[i].classList.add("win"));
  };

  const checkWinner = () => {
    for (const line of WINS) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  };

  const boardFull = () => board.every(Boolean);

  const nextPlayer = () => (current = current === "X" ? "O" : "X");

  const handleClick = (e) => {
    const idx = Number(e.currentTarget.dataset.index);
    if (!running || board[idx]) return;

    board[idx] = current;
    drawMark(idx, current);

    const winLine = checkWinner();
    if (winLine) {
      running = false;
      highlightWin(winLine);
      setStatus(`Player ${current} wins!`);
      scoreEls[current].textContent = Number(scoreEls[current].textContent) + 1;
      saveScores();
      return;
    }

    if (boardFull()) {
      running = false;
      setStatus("Draw!");
      scoreEls.D.textContent = Number(scoreEls.D.textContent) + 1;
      saveScores();
      return;
    }

    nextPlayer();
    setStatus(`Player ${current}’s turn`);
  };

  const resetRound = () => {
    board = Array(9).fill(null);
    running = true;
    current = "X";
    setStatus(`Player ${current}’s turn`);
    cells.forEach((c) => {
      c.textContent = "";
      c.classList.remove("x", "o", "win");
    });
  };

  const resetAll = () => {
    resetRound();
    scoreEls.X.textContent = "0";
    scoreEls.O.textContent = "0";
    scoreEls.D.textContent = "0";
    saveScores();
  };

  // --- Init ---
  const init = () => {
    loadScores();
    cells.forEach((btn) => btn.addEventListener("click", handleClick));
    resetRoundBtn.addEventListener("click", resetRound);
    resetAllBtn.addEventListener("click", resetAll);
    setStatus(`Player ${current}’s turn`);
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
(() => {
  const cells = Array.from(document.querySelectorAll(".cell"));
  const statusEl = document.getElementById("status");
  const resetRoundBtn = document.getElementById("resetRound");
  const resetAllBtn = document.getElementById("resetAll");
  const popupMessage = document.getElementById("popupMessage");
  const overlay = document.getElementById("overlay");
  const playAgainBtn = document.getElementById("playAgainBtn");

  const scoreEls = {
    X: document.getElementById("scoreX"),
    O: document.getElementById("scoreO"),
    D: document.getElementById("scoreD")
  };

  const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let board = Array(9).fill(null);
  let current = "X";
  let running = true;

  // --- Sounds ---
  const moveSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.wav"
  );
  const winSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.wav"
  );
  const drawSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.wav"
  );

  const loadScores = () => {
    const saved = JSON.parse(
      localStorage.getItem("ttt:scores") || '{"X":0,"O":0,"D":0}'
    );
    scoreEls.X.textContent = saved.X;
    scoreEls.O.textContent = saved.O;
    scoreEls.D.textContent = saved.D;
  };
  const saveScores = () => {
    const data = {
      X: Number(scoreEls.X.textContent),
      O: Number(scoreEls.O.textContent),
      D: Number(scoreEls.D.textContent)
    };
    localStorage.setItem("ttt:scores", JSON.stringify(data));
  };

  const setStatus = (msg) => {
    statusEl.textContent = msg;
  };

  const drawMark = (index, player) => {
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
  };

  const highlightWin = (line) => {
    line.forEach((i) => cells[i].classList.add("win"));
  };

  const checkWinner = () => {
    for (const line of WINS) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  };

  const boardFull = () => board.every(Boolean);

  const nextPlayer = () => (current = current === "X" ? "O" : "X");

  const showPopup = (msg) => {
    popupMessage.textContent = msg;
    overlay.classList.add("show");
  };

  const handleClick = (e) => {
    const idx = Number(e.currentTarget.dataset.index);
    if (!running || board[idx]) return;

    board[idx] = current;
    drawMark(idx, current);
    moveSound.play();

    const winLine = checkWinner();
    if (winLine) {
      running = false;
      highlightWin(winLine);
      setStatus(`Player ${current} wins!`);
      scoreEls[current].textContent = Number(scoreEls[current].textContent) + 1;
      saveScores();
      winSound.play();
      showPopup(`Player ${current} Wins!`);
      return;
    }

    if (boardFull()) {
      running = false;
      setStatus("Draw!");
      scoreEls.D.textContent = Number(scoreEls.D.textContent) + 1;
      saveScores();
      drawSound.play();
      showPopup("It's a Draw!");
      return;
    }

    nextPlayer();
    setStatus(`Player ${current}’s turn`);
  };

  const resetRound = () => {
    board = Array(9).fill(null);
    running = true;
    current = "X";
    setStatus(`Player ${current}’s turn`);
    cells.forEach((c) => {
      c.textContent = "";
      c.classList.remove("x", "o", "win");
    });
    overlay.classList.remove("show");
  };

  const resetAll = () => {
    resetRound();
    scoreEls.X.textContent = "0";
    scoreEls.O.textContent = "0";
    scoreEls.D.textContent = "0";
    saveScores();
  };

  const init = () => {
    loadScores();
    cells.forEach((btn) => btn.addEventListener("click", handleClick));
    resetRoundBtn.addEventListener("click", resetRound);
    resetAllBtn.addEventListener("click", resetAll);
    playAgainBtn.addEventListener("click", resetRound);
    setStatus(`Player ${current}’s turn`);
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();