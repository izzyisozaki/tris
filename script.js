const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false; // inizializza il gioco come falso quando il giocatore non ha ancora scelto X o O

const chooseX = document.getElementById('chooseX');
const chooseO = document.getElementById('chooseO');
let playerSymbol = '';
let aiSymbol = '';
let vsComputer = false;

chooseX.addEventListener('click', () => startGameAs('X'));
chooseO.addEventListener('click', () => startGameAs('O'));

function startGameAs(symbol) {
    playerSymbol = symbol;
    aiSymbol = symbol === 'X' ? 'O' : 'X';
    currentPlayer = 'X'; // X always starts
    vsComputer = true;
    gameActive = true; // il gioco è attivo ora che il giocatore ha scelto un simbolo

    chooseX.disabled = true;
    chooseO.disabled = true;

    updateGameStatus(`Turno del giocatore ${currentPlayer}`);

    // se l'IA si avvia (l'IA si avvia se il giocatore ha scelto O poiché X va per primo)
    if (currentPlayer !== playerSymbol) {
        setTimeout(aiMove, 500);
    }
}

function handleCellClick(event) {
    // se il gioco non è attivo o non è stato scelto un simbolo, non fare nulla
    if (!gameActive) {
        updateGameStatus("Scegli X o O per iniziare");
        return;
    }
    
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
         return;
    }

    if (vsComputer || currentPlayer === playerSymbol) {
        makeMove(clickedCellIndex, currentPlayer);

        if (gameActive && vsComputer && currentPlayer === aiSymbol) {
            setTimeout(aiMove, 500);
        }
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    checkResult();

    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameStatus(`Turno del giocatore ${currentPlayer}`);
    }
}

function aiMove() {
    let emptyIndexes = gameState
        .map((val, idx) => (val === '' ? idx : null))
        .filter(idx => idx !== null);

    if (emptyIndexes.length === 0 || !gameActive) return;

    // simple random AI
    let aiIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    makeMove(aiIndex, aiSymbol);
}

function handleReset() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    currentPlayer = 'X';
    playerSymbol = '';
    aiSymbol = '';
    
    updateGameStatus("Scegli X o O per iniziare");
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner-cell');
    });

    chooseX.disabled = false;
    chooseO.disabled = false;
    vsComputer = false;
}

//asd lol
//Hello world
//scherzavo sul fatto dell'ultimo commento

let puntiUno = 0;
let puntiDue = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function updateGameStatus(message) {
    statusDisplay.textContent = message + ` | Punteggio: X = ${puntiUno}, O = ${puntiDue}`;
}

function highlightWinningCells(a, b, c) {
    cells.forEach((cell, index) => {
        if (index == a || index == b || index == c) {
            cell.classList.add('winner-cell');
        }
    });
}

function checkResult() {
    let roundWon = false;
    let winningLine = null;

    // controlla le combinazioni vincenti
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        // assicurati che le posizioni non siano vuote e che tutte corrispondano
        if (gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]) {
            
                roundWon = true;
                winningLine = [a, b, c];
                break;
        }
    }

    // gestire la vittoria
    if (roundWon) {
        highlightWinningCells(
            winningLine[0],
            winningLine[1],
            winningLine[2]
        );

        // aggiornamento punteggio
        if (currentPlayer === 'X') {
            puntiUno++;
        } else {
            puntiDue++;
        }

        updateGameStatus(`Giocatore ${currentPlayer} ha vinto!`);

        gameActive = false;
        return;
    }

    // gestire il pareggio
    if (!gameState.includes('')) {
        statusDisplay.textContent = 'Pareggio!';
        gameActive = false;
        return;
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleReset);

// inizializza la visualizzazione dello status
updateGameStatus("Scegli X o O per iniziare");