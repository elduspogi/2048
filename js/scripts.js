let board;
let score = 0;
let rows = 4;
let columns = 4;
let message;
let countdown = 5;
const messageElement = document.getElementById("message");
messageElement.style.display = "none";
let is2048Exist = false;

function setGame() {
    board = [
        // [2, 4, 2, 4],
        // [4, 2, 4, 2],
        // [2, 4, 2, 4],
        // [4, 2, 4, 2]
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");

            tile.id = r.toString() + "-" + c.toString();

            let num = board[r][c];

            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();

        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function () {
    setGame();
}

function handleSlide(e) {
    e.preventDefault();

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        e.preventDefault;
        
        if (e.code == "ArrowLeft" && canMoveLeft() == true) {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowDown" && canMoveDown() == true) {
            slideDown();
            setTwo();
        } else if (e.code == "ArrowRight" && canMoveRight() == true) {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp" && canMoveUp() == true) {
            slideUp();
            setTwo();
        }
    }

    document.getElementById("score").textContent = score;
    checkWin();

    if (hasLost() == true) {
        messageElement.style.display = "block";
        messageElement.innerText = `Game Over! You Lost The Game! The Game Will Reload in ${countdown}.`;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                reload();
            } else {
                messageElement.innerText = `Game Over! You Lost The Game! The Game Will Reload in ${countdown}.`;
            }
        }, 1000);
    }
}

document.addEventListener("keydown", handleSlide);

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice();
        col.reverse();
        col = slide(col);
        col.reverse();

        changeIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changeIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if (changeIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = col.slice();
        col = slide(col);

        let changeIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changeIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if (changeIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}


function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;

    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048 && is2048Exist == false) {
                const messageElement = document.getElementById("message");
                messageElement.style.display = "block";
                messageElement.innerText = `You Win! Congratulations! The Game Will Reload in ${countdown}`;

                const countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        reload();
                    } else {
                        messageElement.innerText = `You Win! Congratulations! The Game Will Reload in ${countdown}`;
                    }
                }, 1000);
                is2048Exist = true;
            }
        }
    }
}

function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                return false;
            }
        }
    }
    return true;
}

function restartGame() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
        }
    }

    setTwo();
}

function reload() {
    location.reload();
}

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if(!e.target.className.includes("tile")) {
        return;
    };

    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    if(Math.abs(diffX) > Math.abs(diffY)) {
        if(diffX > 0) {
            slideLeft();
            setTwo();
        } else if(diffX < 0) {
            slideRight();
            setTwo();
        }
    } else {
        if(diffY > 0 ) {
            slideUp();
            setTwo();
        } else if(diffY < 0) {
            slideDown();
            setTwo();
        }
    };

    document.getElementById("score").textContent = score;
    checkWin();

    if (hasLost() == true) {
        const messageElement = document.getElementById("message");
        messageElement.style.display = "block";
        messageElement.innerText = `Game Over! You Lost The Game! The Game Will Reload in ${countdown} seconds`;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                reload();
            } else {
                messageElement.innerText = `Game Over! You Lost The Game! The Game Will Reload in ${countdown} seconds`;
            }
        }, 1000);
    }
});

document.addEventListener('touchmove', (e)=> {
	if(!e.target.className.includes('tile')) {
		return;
	}

	e.preventDefault();
}, {passive: false});


function canMoveLeft() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] !== 0) {
                if(board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            if(board[r][c] !== 0) {
                if(board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp() {
    for(let c = 0; c < columns; c++) {
        for(let r = 1; r<rows; r++) {
            if(board[r][c] !== 0) {
                if(board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown() {
    for(let c = 0; c < columns; c++) {
        for(let r = 0; r < rows; r++) {
            if(board[r][c] !== 0) {
                if(board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}