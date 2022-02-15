let selectors = {
    playground: document.getElementById('playground'),
    restartButton: document.getElementById('restart'),
    currentTurn: document.getElementById('current-turn'),
    bestScore: document.getElementById('best-score'),
    title: document.getElementById('title'),
    scoreHistory: document.getElementById('score-history'),
    resultBoard: document.getElementById('result-board'),
}

let cardFlipped = false;
let firstCard, secondCard;
let cards;
let lockPlayground = false;
let complexity = 12;
let turn = 1;
let scoreHistory = getScoreHistory() ? getScoreHistory() : [
    ['Score', 'No']
];

localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory))

startGame(complexity);
showScoreHistory();

selectors.restartButton.addEventListener('click', () => {
    startGame(complexity);
})


function startGame(complexity) {

    if (complexity > 16) {
        document.querySelector(':root').style.setProperty('--max-width', '700px');
    }
    setBestScore(getBestScore());
    clearPlayground();
    setPlayground(complexity);
    showAll();
}

function clearPlayground() {

    if (cards) {
        cards.forEach(element => {
            element.remove();
        })
        selectors.resultBoard.classList.add('hide');
        cards = null;
        resetBoard();
        turn = 1;
        setTurn(1);
        selectors.title.innerText = `Flip Cards!`;
        selectors.title.classList.remove('win');
    }
}

function setPlayground(complexity) {

    for (let i = 1; i <= complexity / 2; i++) {

        let color = getRandomColor();

        selectors.playground.append(setCard(i, color));
        selectors.playground.append(setCard(i, color));

    }

    cards = document.querySelectorAll('.memory-card');

    cards.forEach(card => {
        card.addEventListener('click', cardFlip)
    })

    shuffle(complexity);
}

function setCard(id, color) {
    let card = document.createElement("div");
    card.className = "memory-card";
    card.innerHTML = `<div class="front-face" style="background:${color};"></div>` +
        `<div class="back-face"></div>`;
    card.dataset.id = `${id}`

    return card;
}

function cardFlip() {

    if (lockPlayground) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!cardFlipped) {
        cardFlipped = true;
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();

}

function checkForMatch() {

    setTurn();

    if (firstCard.dataset.id === secondCard.dataset.id) {
        disableCards();

        if (checkWin() == true) {
            setWinner(turn);
        }

        return;
    }

    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', cardFlip);
    secondCard.removeEventListener('click', cardFlip);
    resetBoard();
}

function unflipCards() {
    lockPlayground = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 500);
}

function shuffle(complexity) {

    cards.forEach(card => {
        let ramdomPos = Math.floor(Math.random() * complexity);
        card.style.order = ramdomPos;
    });
}

function resetBoard() {
    [cardFlipped, lockPlayground] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showAll() {
    cards.forEach(card => {
        card.classList.add('flip');
    })

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flip');
        })
    }, 1000);

}

function setTurn(value) {
    if (value) {
        selectors.currentTurn.innerText = `Total turns: ${value}`;
    } else {
        selectors.currentTurn.innerText = `Total turns: ${++turn}`;
    }
}

function setScoreHistory(value) {

    let score = JSON.parse(localStorage.getItem('scoreHistory'));
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed);
    let time = today.toLocaleTimeString();
    let flag = false;

    score.forEach((element, index) => {

        if (value != 'No') {
            if (element[1] == 'No' && !flag) {
                score[index] = [`${time}`, value];
                flag = true;
            } else if (!flag) {
                score.splice(9, 10);
                score.unshift([`${time}`, value])
                flag = true;
            }
        }

    })

    createHistoryItem(time, value);

    localStorage.setItem('scoreHistory', JSON.stringify(score));
}

function showScoreHistory() {

    let score = JSON.parse(localStorage.getItem('scoreHistory'));

    score.forEach(element => {

        let time = element[0];
        let value = element[1];

        createHistoryItem(time, value);
    })
}

function createHistoryItem(time, value) {

    let historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML =
        `<div class="history-score">Score: ${value}</div>` +
        `<div class="history-time">Time:    ${time}</div>`;
    selectors.scoreHistory.append(historyItem);

    if (document.querySelectorAll('.history-item').length > 10) {
        document.querySelectorAll('.history-item')[0].remove();
    }
}

function setBestScore(value) {

    if (getBestScore() == 'No') {
        localStorage.setItem('bestScore', value);
    } else {
        if (getBestScore() > value) {
            localStorage.setItem('bestScore', value);
        }
    }

    selectors.bestScore.innerText = `Best Score: ${getBestScore()}`;

}

function getBestScore() {

    if (localStorage.getItem('bestScore')) {
        return localStorage.getItem('bestScore')
    } else {
        return 'No'
    }
}

function getScoreHistory() {

    if (localStorage.getItem('scoreHistory')) {
        return JSON.parse(localStorage.getItem('scoreHistory'))
    } else {
        return [
            ['Score', 'No']
        ];
    }
}

function clearScoreHistory() {
    localStorage.removeItem('scoreHistory');

    document.querySelectorAll('.history-item').forEach(element => {
        element.remove();
    })

}

function setWinner(value) {
    selectors.title.innerText = `You win!`;
    selectors.title.classList.add('win');
    setBestScore(value);
    setScoreHistory(value);
    selectors.resultBoard.classList.remove('hide');
}

function checkWin() {

    let count = 0;

    cards.forEach(element => {
        if (element.classList.contains('flip')) {
            count++;
        }
    });

    if (complexity == count) {
        return true;
    } else {
        return false;
    }
}