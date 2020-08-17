const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winning-message')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector("[data-winning-message-text]")
const startButton = document.getElementById('start-button')
const circleRadio = document.getElementById('circle-choise')
const modeSelector = document.getElementById('mode-selector')
const checkBoxStartFisrt = document.getElementById('check-start-first')
let computerClass
let playerClass
let playerTurn 
let circleTurn
let boardHistory

$(document).ready(() => {
    startButton.addEventListener('click', () => {
        boardHistory = Array.from(Array(9).keys());
        circleTurn = circleRadio.checked
        computerClass = !circleTurn ? CIRCLE_CLASS : X_CLASS
        playerClass = circleTurn ? CIRCLE_CLASS : X_CLASS
        $('.start-menu').fadeOut('slow')
        let option = modeSelector.value;
        switch (option) {
            case "0" :
                startGamePvsP()
                break
            case "1":
                startGameEasyMode()
                break
            case "2":
                startGameNormalMode()
                break
            case "3":
                startGameImpossibleMode()
                break

        }

    })


})


restartButton.addEventListener('click', () => {
    $('.start-menu').fadeIn('slow')
})


function startGamePvsP() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.classList.remove('won')
        $(cell).off()
        cell.addEventListener('click', handleClickPvsP, {once: true})
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}


function handleClickPvsP(e) {
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        endGame(false, {currentClass: currentClass})
    } else if (isDraw()) {
        endGame(true, {currentClass: currentClass})
    } else {
        swapTurns()
        setBoardHoverClass()
    }

}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)

}

function swapTurns() {
    circleTurn = !circleTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function getWonCombination({PvsP = false, currentClass = ""}) {
    console.log(currentClass)
    if (PvsP)
        return WINNING_COMBINATIONS.filter(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(currentClass)
            })
        })
    else
        return WINNING_COMBINATIONS.filter(combination => {

            let playerScore = combination.every(index => {
                return cellElements[index].classList.contains(playerClass)
            })
            let cpuScore = combination.every(index => {
                return cellElements[index].classList.contains(computerClass)
            })
            return playerScore || cpuScore
        })
}

function endGame(draw, {currentClass = ""}) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
        cellElements.forEach(cell => {
            cell.classList.add("won")
        })
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's " : "X's"}Won!`
        console.log(getWonCombination({PvsP: true, currentClass: currentClass}))
        getWonCombination({PvsP: true, currentClass: currentClass})[0].forEach(index => {
            document.getElementById(`${index}`).classList.add("won")
        })
    }
    winningMessageElement.classList.add('show')

}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}


function startGameEasyMode() {
    playerTurn = true
    addEventListenersToCells(handlePlayerClickEasyMode)
    setBoardHoverClass()
    if (!checkBoxStartFisrt.checked) computerEasyMove()
}


function addEventListenersToCells(event) {
    winningMessageElement.classList.remove('show')
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.classList.remove('won')
        $(cell).off()
        cell.addEventListener('click', event, {once: true})
    })

}


function handlePlayerClickEasyMode(e) {

    const cell = e.target
    if (playerTurn) {
        playerMoveEasyMode(cell)
    }

}


function playerMoveEasyMode(cell) {
    cell.classList.add(playerClass)

    playerTurn = false
    removeBoardHoverClass()
    computerEasyMove();
}

function removeBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
}


function computerEasyMove() {
    if (checkWin(playerClass)) {
        endGameCpu({message: "Win"})
        return
    }
    if (isDraw()) {
        endGameCpu({draw: true})
        return
    }
    let currentFreeCells = getFreeCells()
    let numberOfMoves = currentFreeCells.length
    if (numberOfMoves === 0) return;
    let move = Math.floor(Math.random() * numberOfMoves) + 1
    makeMove(currentFreeCells, move)
    if (checkWin(computerClass)) {
        endGameCpu({message: "Lose"})
        return;
    } else if (isDraw()) {
        endGameCpu({draw: true})
    }
    playerTurn = true
    setBoardHoverClass()
}


function getFreeCells() {
    return [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)

    })
}

function endGameCpu({message = "", draw = false}) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
        cellElements.forEach(cell=>{
            cell.classList.add('won')
        })
    } else if (message !== "") {
        winningMessageTextElement.innerText = `You ${message}!`
       getWonCombination({})[0].forEach(index =>{
           document.getElementById(`${index}`).classList.add('won')
       })
    }
    winningMessageElement.classList.add('show')

}


function makeMove(availableCells, move) {
    availableCells.some((cell, index) => {
        if (index === move - 1) {
            //$(cell).addClass(computerClass)
            cell.classList.add(computerClass)
            cell.removeEventListener("click", handlePlayerClickEasyMode)
            cell.removeEventListener("click", handlePlayerClickNormalMode)
            return true
        }
        return false
    })
}

function makeMoveImposibleMode(move) {
    let currentCell = document.getElementById(`${move}`)
    currentCell.classList.add(computerClass)
    currentCell.removeEventListener("click", handlePlayerClickImpossibleMode)
    boardHistory[move] = computerClass;


}

function computerNormalMove() {
    if (checkWin(playerClass)) {
        endGameCpu({message: "Win"})
        return
    }
    if (isDraw()) {
        endGameCpu({draw: true})
        return
    }
    let availableCells
    let numberOfMoves
    let almoustWinningCombinations = getAlmoustWinningCombinations(computerClass)
    if (almoustWinningCombinations.length === 0) {
        almoustWinningCombinations = getAlmoustWinningCombinations(playerClass)

    }
    availableCells = getAvailableCells(almoustWinningCombinations)
    if (availableCells.length === 0) {
        availableCells = getFreeCells()
    }

    numberOfMoves = availableCells.length
    console.log("nr moves=" + numberOfMoves)
    if (numberOfMoves === 0) return;
    let move = Math.floor(Math.random() * numberOfMoves) + 1

    makeMove(availableCells, move)

    if (checkWin(computerClass)) {
        endGameCpu({message: "Lose"})
        return;
    } else if (isDraw()) {
        endGameCpu({draw: true})
    }
    playerTurn = true
    setBoardHoverClass()
}

function playerMoveNormalMode(cell) {
    cell.classList.add(playerClass)
    playerTurn = false
    removeBoardHoverClass()
    computerNormalMove()

}

function handlePlayerClickNormalMode(e) {
    const cell = e.target
    if (playerTurn) {
        playerMoveNormalMode(cell)
    }

}

function startGameNormalMode() {
    playerTurn = true
    addEventListenersToCells(handlePlayerClickNormalMode)
    setBoardHoverClass()
    if (!checkBoxStartFisrt.checked) computerNormalMove()

}

function getAlmoustWinningCombinations(playerClass) {
    return WINNING_COMBINATIONS.filter(combination => {
        return combination.reduce((nrFilledCells, index) => {

            if ($(cellElements[index]).hasClass(playerClass)) {
                return nrFilledCells + 1
            }
            return nrFilledCells
        }, 0) === 2 && !isCombinationFull(combination)
    })
}

function getAvailableCells(almoustWinningCombinations) {
    return getFreeCells().filter(cell => {
        let id = parseInt(cell.id)
        return almoustWinningCombinations.some(combination => {
            return !isCombinationFull(combination) && combination.includes(id)
        })
    })
}

function isCombinationFull(combination) {
    return combination.every(index => {
        return cellElements[index].classList.contains(playerClass) || cellElements[index].classList.contains(computerClass)
    })
}


function playerMoveImpossibleMode(cell) {
    cell.classList.add(playerClass)
    let id = parseInt($(cell).attr('id')) //parseInt(cell.id)
    boardHistory[id] = playerClass
    playerTurn = false
    removeBoardHoverClass()
    computerImpossibleMove()
}

function handlePlayerClickImpossibleMode(e) {
    const cell = e.target
    if (playerTurn) {
        playerMoveImpossibleMode(cell)
    }

}


function minimax(newBoard, player) {
    let availableSimulationSpots = getFreeSimulationIndexes()

    if (checkWinSimulation(newBoard, playerClass)) {
        return {score: -10}
    } else if (checkWinSimulation(newBoard, computerClass)) {
        return {score: 10}
    } else if (availableSimulationSpots.length === 0) {
        return {score: 0}
    }

    let moves = []
    for (let i = 0; i < availableSimulationSpots.length; i++) {
        let move = {}
        move.index = newBoard[availableSimulationSpots[i]]
        newBoard[availableSimulationSpots[i]] = player

        if (player === computerClass) {
            let result = minimax(newBoard, playerClass)
            move.score = result.score
        } else {
            let result = minimax(newBoard, computerClass)
            move.score = result.score
        }

        newBoard[availableSimulationSpots[i]] = move.index
        moves.push(move)
    }

    let bestMove
    if (player === computerClass) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score
                bestMove = i;
            }
        }

    }
    return moves[bestMove]
}


function computerImpossibleMove() {
    if (checkWin(playerClass)) {
        endGameCpu({message: "Win"})
        return
    }
    if (isDraw()) {
        endGameCpu({draw: true})
        return
    }
    let move
    if (boardHistory.length === getFreeSimulationIndexes().length) {
        move = Math.floor(Math.random() * 9) + 1
    } else move = minimax(boardHistory, computerClass).index
    console.log("move is:=" + move)
    makeMoveImposibleMode(move)
    if (checkWin(computerClass)) {
        endGameCpu({message: "Lose"})
        return;
    } else if (isDraw()) {
        endGameCpu({draw: true})
    }
    playerTurn = true
    setBoardHoverClass()

}

function startGameImpossibleMode() {
    playerTurn = true
    addEventListenersToCells(handlePlayerClickImpossibleMode)
    setBoardHoverClass()
    if (!checkBoxStartFisrt.checked) computerImpossibleMove()
}


function checkWinSimulation(simulationBoard, currentPlayer) {
    let plays = simulationBoard.reduce((total, item, index) =>
        (item === currentPlayer) ? total.concat(index) : total, [])

    let gameWon = null

    for (let [index, win] of WINNING_COMBINATIONS.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: currentPlayer}
            break
        }
    }
    return gameWon;
}


function getFreeSimulationIndexes() {

    return boardHistory.filter(s => typeof s == 'number');
}



