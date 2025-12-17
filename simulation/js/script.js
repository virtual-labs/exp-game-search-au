// --- Game State ---
let board = Array(9).fill(null); // 9 cells: 0..8
const HUMAN = "X";
const AI = "O";
let gameOver = false;
let highlightedCell = null;
let stepMode = false;
let awaitingStep = false;
let stepTrace = [];
let stepBestMove = null;
let stepRevealIndex = 0;
let lastTraceRecords = [];
let lastTraceLines = [];
const miniTreeList = document.getElementById("miniTreeList");

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("statusText");
const traceDiv = document.getElementById("trace");
const stepToggle = document.getElementById("stepToggle");
const showStepBtn = document.getElementById("showStepBtn");
const playMoveBtn = document.getElementById("playMoveBtn");
const winNoteDiv = document.getElementById("winNote");
const stepBanner = document.getElementById("stepBanner");

// --- Build UI Board ---
function createBoardUI() {
  boardDiv.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.id = "cell-" + i;
    btn.onclick = () => handleCellClick(i);
    boardDiv.appendChild(btn);
  }
  renderBoard();

  stepToggle.addEventListener("change", () => {
    stepMode = stepToggle.checked;
    if (!stepMode && awaitingStep) {
      awaitingStep = false;
      updateStepButtons();
      setStatus("AI thinking (O)...", "ai");
      setTimeout(() => aiMove(), 150);
    } else {
      resetStepState();
      updateStepButtons();
    }
    updateStepBanner();
  });
  showStepBtn.addEventListener("click", showNextStep);
  playMoveBtn.addEventListener("click", playFinalMove);
}

// --- Render Board from State ---
function renderBoard() {
  const locked = gameOver || awaitingStep;
  for (let i = 0; i < 9; i++) {
    const cellBtn = document.getElementById("cell-" + i);
    const hadWin = cellBtn.classList.contains("win");
    cellBtn.textContent = board[i] ? board[i] : "";
    cellBtn.disabled = !!board[i] || locked;
    cellBtn.className = "cell";
    if (board[i] === HUMAN) cellBtn.classList.add("cell-human");
    if (board[i] === AI) cellBtn.classList.add("cell-ai");
    if (hadWin) cellBtn.classList.add("win");
    cellBtn.onmouseenter = () => highlightTraceLinesForMove(i);
    cellBtn.onmouseleave = clearTraceHighlights;
  }
}

// --- Check Winner / Game Status ---
function getWinnerInfo(b) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let [a, bIdx, c] of lines) {
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
      return { winner: b[a], line: [a, bIdx, c] }; // 'X' or 'O'
    }
  }
  if (b.every((cell) => cell !== null)) return { winner: "draw", line: [] };
  return { winner: null, line: null }; // game not finished
}

function getAvailableMoves(b) {
  const moves = [];
  b.forEach((cell, i) => {
    if (cell === null) moves.push(i);
  });
  return moves;
}

function inferRole(playerLabel) {
  if (!playerLabel) return "root";
  const lower = playerLabel.toLowerCase();
  if (lower.includes("root")) return "root";
  if (lower.includes("max") || lower.includes("ai")) return "max";
  if (lower.includes("min") || lower.includes("human")) return "min";
  return "root";
}

// --- Minimax Implementation (AI = 'O') ---
function minimax(b, isMaximizing, depth, traceRecords) {
  const { winner } = getWinnerInfo(b);
  // Terminal evaluation
  if (winner === AI) {
    return 10 - depth;
  } else if (winner === HUMAN) {
    return depth - 10;
  } else if (winner === "draw") {
    return 0;
  }

  const moves = getAvailableMoves(b);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let move of moves) {
      b[move] = AI;
      const score = minimax(b, false, depth + 1, traceRecords);
      traceRecords.push({
        depth: depth,
        player: "MAX (AI)",
        move: move,
        score: score,
        role: "max",
        board: b.slice(),
      });
      b[move] = null; // undo move
      if (score > bestScore) {
        bestScore = score;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let move of moves) {
      b[move] = HUMAN;
      const score = minimax(b, true, depth + 1, traceRecords);
      traceRecords.push({
        depth: depth,
        player: "MIN (Human)",
        move: move,
        score: score,
        role: "min",
        board: b.slice(),
      });
      b[move] = null; // undo move
      if (score < bestScore) {
        bestScore = score;
      }
    }
    return bestScore;
  }
}

// --- Find Best Move for AI using Minimax ---
function findBestMove() {
  const moves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = null;
  let traceRecords = [];

  for (let move of moves) {
    board[move] = AI; // try move
    const score = minimax(board, false, 0, traceRecords);
    traceRecords.push({
      depth: 0,
      player: "ROOT (AI choice)",
      move: move,
      score: score,
      role: "root",
      board: board.slice(),
    });
    board[move] = null; // undo move

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return { bestMove, traceRecords };
}
// --- Extract only the chosen move's depth path (Principal Variation) ---
function extractFocusedTrace(traceRecords, chosenMove) {
  const path = [];

  // 1. root entry for chosen move
  const root = traceRecords.find(
    r => r.role === "root" && r.move === chosenMove
  );
  if (!root) return path;
  path.push(root);

  let prevBoard = root.board;

  // 2. follow depth-by-depth board evolution
  let depth = 1;
  while (true) {
    const next = traceRecords.find(
      r =>
        r.depth === depth &&
        r.board &&
        prevBoard &&
        r.board.every((v, i) => v === prevBoard[i])
    );
    if (!next) break;

    path.push(next);
    prevBoard = next.board;
    depth++;
  }

  return path;
}

// --- Trace Visualization ---
// Groups the trace into a root summary and depth-by-depth logs so students see
// who is thinking at each depth, which move was considered, and the score returned.
function showTrace(traceRecords, bestMove = null, limit = null) {
  traceDiv.innerHTML = "";
  lastTraceRecords = traceRecords;
  lastTraceLines = [];
  const subset = limit !== null ? traceRecords.slice(0, limit) : traceRecords;
  if (!subset.length) {
    const line = document.createElement("div");
    line.className = "trace-line";
    line.innerHTML = '<span class="trace-text"></span>';
    traceDiv.appendChild(line);
    return;
  }
  const rootWrapper = document.createElement("div");
  rootWrapper.className = "trace-root-section";
  renderRootSummary(rootWrapper, subset);
  traceDiv.appendChild(rootWrapper);

  if (bestMove !== null) {
    const focusedTraceContainer = document.createElement("div");
    focusedTraceContainer.className = "focused-trace";
    const path = extractFocusedTrace(subset, bestMove);
    if (path.length) {
      const title = document.createElement("div");
      title.className = "trace-guide";
      title.textContent = "Why the AI chose this move";
      focusedTraceContainer.appendChild(title);

      path.forEach((rec) => {
        const role = rec.role || inferRole(rec.player);
        const card = document.createElement("div");
        card.className = `trace-card trace-${role}`;
        card.dataset.move = rec.move;

        const header = document.createElement("div");
        header.className = "trace-card-header";
        header.textContent = `${rec.player} considers move ${rec.move}`;

        const score = document.createElement("div");
        score.className = "trace-card-score";
        score.innerHTML = `Score: <span class="score-badge">${rec.score}</span>`;

        const explanation = document.createElement("div");
        explanation.className = "trace-card-explanation";
        if (role === 'max' || role === 'root') {
          explanation.textContent = "AI's goal is to maximize its score. This move leads to a branch with a high score.";
        } else {
          explanation.textContent = "AI assumes the opponent will choose the move that minimizes the AI's score.";
        }
        
        card.appendChild(header);
        card.appendChild(score);
        card.appendChild(explanation);
        
        card.onmouseenter = () => {
          if (rec.move !== null && rec.move !== undefined)
            setHighlightedCell(rec.move);
        };
        card.onmouseleave = clearHighlightedCell;
        lastTraceLines.push(card);
        focusedTraceContainer.appendChild(card);
      });
      traceDiv.appendChild(focusedTraceContainer);
    }
  }

  renderMiniTree(subset);
  traceDiv.scrollTop = traceDiv.scrollHeight;
}

function renderRootSummary(container, traceRecords) {
  const roots = traceRecords.filter(
    (r) =>
      (r.role || "").toLowerCase() === "root" ||
      (r.depth === 0 && (r.player || "").toLowerCase().includes("root"))
  );
  if (!roots.length) return;
  let bestScore = -Infinity;
  roots.forEach((r) => {
    if (r.score > bestScore) bestScore = r.score;
  });
  const bar = document.createElement("div");
  bar.className = "root-summary";
  const title = document.createElement("div");
  title.className = "root-summary-title";
  title.textContent = "AI Move Options";
  bar.appendChild(title);

  const wrap = document.createElement("div");
  wrap.className = "root-moves";
  roots.forEach((r) => {
    const chip = document.createElement("div");
    chip.className = "root-chip";
    if (r.score === bestScore) chip.classList.add("best");
    chip.innerHTML = `Move <strong>${r.move}</strong> &rarr; Score: <strong>${r.score}</strong>`;
    const glyph = formatBoardGlyph(r.board);
    const tooltip = [
      `Player: ${r.player}`,
      `Move: ${r.move}`,
      `Score: ${r.score}`,

      glyph ? `Board:\n${glyph}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    chip.setAttribute("title", tooltip);

    wrap.appendChild(chip);
  });
  bar.appendChild(wrap);
  container.appendChild(bar);
}

// --- Human Move Handler ---
function handleCellClick(idx) {
  if (gameOver || board[idx] !== null || awaitingStep) return;

  board[idx] = HUMAN;
  renderBoard();
  const { winner, line } = getWinnerInfo(board);
  if (winner) {
    endGame(winner, line);
    return;
  }

  if (stepMode) {
    awaitingStep = true;
    setStatus("Step mode: explore AI reasoning", "ai");
    prepareStepSequence();
    updateStepButtons();
    updateStepBanner();
    return;
  }

  setStatus("AI thinking (O)...", "ai");
  setTimeout(() => {
    aiMove();
  }, 200);
}

// --- AI Move ---
function aiMove() {
  const { bestMove, traceRecords } = findBestMove();
  showCellScores(traceRecords);
  if (bestMove !== null && !gameOver) {
    executeAiMove(bestMove, traceRecords);
    return;
  }
  clearCellScores();
  setStatus("Your turn (X)", "human");
  updateStepBanner();
}

function executeAiMove(move, traceRecords = []) {
  clearCellScores();
  board[move] = AI;
  renderBoard();
  flashAIMove(move);
  const { winner, line } = getWinnerInfo(board);
  if (winner) {
    endGame(winner, line);
    return;
  }
  showTrace(traceRecords, move);
  setStatus("Your turn (X)", "human");
  updateStepBanner();
}

// --- Step-by-step helpers ---
function prepareStepSequence() {
  const { bestMove, traceRecords } = findBestMove();
  stepTrace = traceRecords;
  stepBestMove = bestMove;
  if (!stepTrace.length) {
    awaitingStep = false;
    updateStepButtons();
    return;
  }
  stepRevealIndex = Math.min(1, stepTrace.length); // show first entry immediately
  showTrace(stepTrace, null, stepRevealIndex);
  showCellScores(stepTrace);
  updateStepButtons();
  updateStepBanner();
}

function showNextStep() {
  if (!awaitingStep || stepRevealIndex >= stepTrace.length) return;
  stepRevealIndex = Math.min(stepRevealIndex + 1, stepTrace.length);
  showTrace(stepTrace, null, stepRevealIndex);
  updateStepButtons();
  updateStepBanner();
}

function playFinalMove() {
  if (!awaitingStep) return;
  awaitingStep = false;
  updateStepButtons();
  clearCellScores();
  if (stepBestMove !== null) {
    executeAiMove(stepBestMove, stepTrace);
  } else {
    showTrace(stepTrace, stepBestMove);
  }
  updateStepBanner();
}

function resetStepState() {
  awaitingStep = false;
  stepTrace = [];
  stepBestMove = null;
  stepRevealIndex = 0;
  showTrace([], null);
  renderMiniTree([]);
}

function updateStepButtons() {
  // Enable "Next step" only while there are hidden entries; "Play move" available once step mode is active.
  const total = stepTrace?.length || 0;
  const hasMoreSteps = awaitingStep && stepRevealIndex < total;
  showStepBtn.disabled = !hasMoreSteps;
  playMoveBtn.disabled = !awaitingStep || stepBestMove === null;
}

function flashAIMove(idx) {
  const cell = document.getElementById("cell-" + idx);
  if (!cell) return;
  cell.classList.add("ai-flash");
  setTimeout(() => cell.classList.remove("ai-flash"), 800);
}

function setHighlightedCell(idx) {
  clearHighlightedCell();
  const cell = document.getElementById("cell-" + idx);
  if (!cell) return;
  cell.classList.add("cell-hover");
  highlightedCell = cell;
}

function clearHighlightedCell() {
  if (highlightedCell) {
    highlightedCell.classList.remove("cell-hover");
    highlightedCell = null;
  }
}

function clearCellScores() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("cell-score");
    cell.removeAttribute("data-score");
  });
}

function showCellScores(traceRecords) {
  clearCellScores();
  const roots = traceRecords.filter(
    (r) => (r.role || "").toLowerCase() === "root" || r.depth === 0
  );
  roots.forEach((r) => {
    if (r.move === null || r.move === undefined) return;
    if (board[r.move] !== null) return;
    const cell = document.getElementById("cell-" + r.move);
    if (!cell) return;
    cell.dataset.score = r.score;
    cell.classList.add("cell-score");
  });
}

// --- Utility: format board snapshot as 3x3 glyph for tooltips ---
function formatBoardGlyph(arr) {
  if (!arr || !Array.isArray(arr) || arr.length !== 9) return "";
  const symbol = (v) => (v === null || v === undefined ? "·" : v);
  const rows = [
    `${symbol(arr[0])}${symbol(arr[1])}${symbol(arr[2])}`,
    `${symbol(arr[3])}${symbol(arr[4])}${symbol(arr[5])}`,
    `${symbol(arr[6])}${symbol(arr[7])}${symbol(arr[8])}`,
  ];
  return rows.join("\n");
}

function computeBestScoreForDepth(entries) {
  if (!entries || !entries.length) return "n/a";
  const depth = entries[0].rec.depth || 0;
  const maximizing = depth % 2 === 0; // AI turn assumed at even depths
  let best = maximizing ? -Infinity : Infinity;
  entries.forEach(({ rec }) => {
    if (maximizing && rec.score > best) best = rec.score;
    if (!maximizing && rec.score < best) best = rec.score;
  });
  if (!isFinite(best)) return "n/a";
  return best;
}

function buildWinningNote() {
  if (!lastTraceRecords || !lastTraceRecords.length) {
    return "Game ended; run again to inspect minimax reasoning.";
  }
  const deepest = lastTraceRecords.reduce(
    (acc, r) => (r.depth > acc.depth ? r : acc),
    lastTraceRecords[0]
  );
  const actor = deepest.player || (deepest.role || "").toUpperCase();
  const move =
    deepest.move !== null && deepest.move !== undefined ? deepest.move : "n/a";
  const score = deepest.score !== undefined ? deepest.score : "n/a";
  return `This line was sealed after depth ${deepest.depth} (${actor}) evaluated move ${move} -> score ${score}.`;
}

function updateStepBanner() {
  if (!stepBanner) return;
  if (gameOver) {
    stepBanner.classList.add("hidden");
    stepBanner.textContent = "";
    return;
  }
  if (!stepMode) {
    stepBanner.classList.add("hidden");
    stepBanner.textContent = "";
    return;
  }
  if (awaitingStep) {
    const done = stepRevealIndex >= (stepTrace?.length || 0);
    stepBanner.textContent = done
      ? 'Board locked: click "Play move" to let the AI commit its best choice.'
      : 'Board locked: click "Next step" to reveal the next minimax evaluation.';
    stepBanner.classList.remove("hidden");
  } else {
    stepBanner.classList.add("hidden");
    stepBanner.textContent = "";
  }
}

// Highlight trace lines that match a board cell hover
function highlightTraceLinesForMove(idx) {
  clearHighlightedCell();
  setHighlightedCell(idx);
  if (!lastTraceLines || !lastTraceLines.length) return;
  lastTraceLines.forEach((line) => {
    if (line.dataset.move !== "" && Number(line.dataset.move) === idx) {
      line.classList.add("trace-latest");
    }
  });
}

function clearTraceHighlights() {
  if (!lastTraceLines || !lastTraceLines.length) return;
  lastTraceLines.forEach((line) => {
    line.classList.remove("trace-latest");
  });
  clearHighlightedCell();
}

function renderMiniTree(traceRecords) {
  const miniTreeContainer = document.getElementById("miniTreeList");
  if (!miniTreeContainer) return;

  miniTreeContainer.innerHTML = "";

 

  // ---- Build nodes with parent/children ----
  const nodes = [];
  const depthLast = {};

  traceRecords.forEach((rec, index) => {
    const depth = rec.depth || 0;

    const node = {
      id: index,
      rec,
      depth,
      parent: depth > 0 ? depthLast[depth - 1]?.id ?? null : null,
      children: [],
    };

    if (node.parent !== null) {
      nodes[node.parent].children.push(node.id);
    }

    depthLast[depth] = node;
    nodes.push(node);
  });

  // ---- Recursive DOM builder ----
  const rootEls = document.createElement("div");
  rootEls.className = "tree-root";

  function build(nodeId) {
    const node = nodes[nodeId];
    const container = document.createElement("div");
    container.className = "tree-node-wrapper";

    const role = (node.rec.role || node.rec.player || "").toLowerCase();
    let roleClass = "tree-role-root";
    if (role.includes("max")) roleClass = "tree-role-max";
    if (role.includes("min")) roleClass = "tree-role-min";

    const nodeEl = document.createElement("div");
    nodeEl.className = "tree-node " + roleClass;

    nodeEl.innerHTML =
      `
      <div class="tree-bubble">${node.rec.score ?? "?"}</div>
      <div class="tree-tag">${node.rec.player}</div>
      <div class="tree-meta">Move ${node.rec.move ?? "–"} | d${
      node.rec.depth
    }</div>
    `

    nodeEl.onmouseenter = () => {
      if (node.rec.move !== null && node.rec.move !== undefined)
        setHighlightedCell(node.rec.move);
      nodeEl.classList.add("tree-highlight");
    };
    nodeEl.onmouseleave = () => {
      clearHighlightedCell();
      nodeEl.classList.remove("tree-highlight");
    };

    container.appendChild(nodeEl);

    // ---- Children ----
    if (node.children.length > 0) {
      const branch = document.createElement("div");
      branch.className = "tree-children";

      // --- Filter for only the best child move ---
      const isMax = role.includes("max") || role.includes("root");
      let bestScore = isMax ? -Infinity : Infinity;
      node.children.forEach(childId => {
        const childScore = nodes[childId].rec.score;
        if (isMax && childScore > bestScore) {
          bestScore = childScore;
        } else if (!isMax && childScore < bestScore) {
          bestScore = childScore;
        }
      });
      
      const bestChildren = node.children.filter(childId => nodes[childId].rec.score === bestScore);

      bestChildren.forEach((childId) => {
        const childDom = build(childId);
        branch.appendChild(childDom);
      });

      container.appendChild(branch);
    }

    return container;
  }

  const roots = nodes.filter((n) => n.parent === null);
  roots.forEach((r) => rootEls.appendChild(build(r.id)));

  miniTreeContainer.appendChild(rootEls);
}

// --- End Game ---
function endGame(winner, line) {
  gameOver = true;
  renderBoard();
  boardDiv.classList.add("board-finished");
  if (line && line.length) {
    line.forEach((idx) => {
      const cell = document.getElementById("cell-" + idx);
      if (cell) cell.classList.add("win");
    });
  }
  if (winner === "draw") {
    setStatus("Game over: Draw", "draw");
    if (winNoteDiv) {
      winNoteDiv.classList.add("hidden");
      winNoteDiv.textContent = "";
    }
  } else {
    setStatus("Game over: " + winner + " wins", "over");
    if (winNoteDiv) {
      const note = buildWinningNote();
      winNoteDiv.textContent = note;
      winNoteDiv.classList.remove("hidden");
    }
  }
  updateStepBanner();
}

// --- Reset Game ---
function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  boardDiv.classList.remove("board-finished");
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.classList.remove("win", "ai-flash"));
  setStatus("Your turn (X)", "human");
  showTrace([], null);
  clearCellScores();
  clearHighlightedCell();
  if (winNoteDiv) {
    winNoteDiv.classList.add("hidden");
    winNoteDiv.textContent = "";
  }
  resetStepState();
  updateStepButtons();
  updateStepBanner();
  renderBoard();
}

// --- Initialize ---
function setStatus(text, state) {
  statusText.textContent = text;
  statusText.className = `status status-${state}`;
}

createBoardUI();
setStatus("Your turn (X)", "human");
resetStepState();
updateStepButtons();

document.addEventListener("click", function (event) {
  if (event.target.matches(".info-btn, .info-close-btn")) {
    const infoId = event.target.dataset.info;
    const infoContent = document.getElementById(infoId);
    if (infoContent) {
      infoContent.classList.toggle("show-instructions");
    }
  }
});