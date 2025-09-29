 <h1>Minimax Algorithm in AI</h1>

  <p>The <strong>Minimax Algorithm</strong> in AI is a <strong>backtracking algorithm</strong> used in <em>decision-making, game theory, and artificial intelligence</em>. 
  It is mainly applied in <strong>two-player turn-based games</strong> such as Chess, Tic-Tac-Toe, Checkers, and Go. 
  The goal of minimax is to determine the <strong>optimal move</strong> for a player, assuming that the opponent also plays <strong>optimally</strong>.</p>

  <h2>Backtracking Concept</h2>
  <p>A <strong>backtracking algorithm</strong> works by building a solution <em>incrementally, step by step</em>. 
  If a candidate step cannot lead to a valid solution, it is <strong>abandoned immediately</strong>, and the algorithm backtracks to try other possibilities.</p>

  <h2>How Minimax Works</h2>
  <ul>
    <li>There are two players: <strong>Max</strong> (trying to maximize the score) and <strong>Min</strong> (trying to minimize Max’s score).</li>
    <li>The algorithm constructs a <strong>game tree</strong> where each node represents a possible state of the game.</li>
    <li>Minimax evaluates all possible moves, assuming both players play optimally, and chooses the move with the <strong>best guaranteed outcome</strong> for Max.</li>
  </ul>

  <h2>Example: Tic-Tac-Toe</h2>
  <p>Consider the current board (X = Max, O = Min):</p>
  <pre>
 X | O | X
 O | X |  
   |   | O
  </pre>

  <p>Minimax evaluates all empty positions to determine the best move for Max.</p>

  <h3>Game Tree Representation</h3>
  <pre>
           Max
         /  |  \
       O    O    O
      / \       / \
    X     X   X     X
   / \   / \ / \   / \
  +1  0 0 -1 +1 0 0 -1
  </pre>

  <p>Explanation of Scores:</p>
  <ul>
    <li><strong>+1</strong> → Max wins</li>
    <li><strong>-1</strong> → Min wins</li>
    <li><strong>0</strong> → Draw</li>
  </ul>

  <p>Max chooses the path with the highest score (+1 if possible), while Min tries to choose paths that minimize Max’s advantage. 
  This ensures Max plays <strong>optimally</strong>, even against a perfect opponent.</p>
