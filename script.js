function createDialog(message) {
    let dialog = document.createElement('dialog');
    let header = document.createElement('h2');
    let paragraph = document.createElement('p');
    let closeButton = document.createElement('button');
    let errorIcon1 = document.createElement('i');
    let errorIcon2 = document.createElement('i');

    header.textContent = "Error";
    errorIcon1.className = "fa-solid fa-triangle-exclamation";
    errorIcon2.className = "fa-solid fa-triangle-exclamation";

    header.prepend(errorIcon1);
    header.appendChild(errorIcon2);
    dialog.appendChild(header);

    paragraph.textContent = message;
    dialog.appendChild(paragraph);

    closeButton.innerText = "OK";
    closeButton.onclick = () => dialog.close();
    dialog.appendChild(closeButton);

    document.body.appendChild(dialog);
    dialog.showModal();
}

function updateWinners() {
    let allPlayers = document.querySelectorAll('.player');
    let scores = Array.from(allPlayers)
        .map(p => {
            const totalField = p.querySelector('.player-total');
            return totalField ? parseInt(totalField.value) || 0 : 0;
        });

    const anyScored = scores.some(s => s > 0);
    if (!anyScored) {
        allPlayers.forEach(player => {
            player.classList.remove('winner');
            const crownIcon = player.querySelector('.fa-crown');
            if (crownIcon) crownIcon.remove();
            player.style.border = 'none';
        });
        minScore = Number.MAX_SAFE_INTEGER;
        return;
    }

    const validScores = scores.filter(s => !isNaN(s));
    minScore = Math.min(...validScores);

    allPlayers.forEach(player => {
        let totalField = player.querySelector('.player-total');
        if (!totalField) return;
        
        let total = parseInt(totalField.value) || 0;
        let crownIcon = player.querySelector('.fa-crown');

        if (total === minScore) {
            player.classList.add('winner');
            if (!crownIcon) {
                crownIcon = document.createElement('i');
                crownIcon.classList.add('fa-solid', 'fa-crown');
                player.appendChild(crownIcon);
            }
            player.style.border = '5px solid gold';
        } else {
            player.classList.remove('winner');
            if (crownIcon) crownIcon.remove();
            player.style.border = 'none';
        }
    });
}

function buildPlayersScreen() {
    const sessionStorage = window.sessionStorage;
    const playersCount = sessionStorage.getItem('playersCount');
    const roundsCount = sessionStorage.getItem('roundsCount');
    const doubleRoundExist = sessionStorage.getItem('doubleRoundExist');
    const playersArr = JSON.parse(sessionStorage.getItem('players') || '[]');    
    const players = document.querySelector('.players');
    
    players.innerHTML = '';

    document.querySelector('.beginning').style.display = 'none';

    for (let i = 0; i < playersCount; i++) {
        let player = document.createElement('div');
        let playerName = document.createElement('input');
        let playerScores = [];

        playerName.placeholder = 'Enter Player Name';
        player.classList.add('player');
        playerName.classList.add('player-name');
        player.appendChild(playerName);

        const playerObj = playersArr[i] || {name: '', scores: Array(parseInt(roundsCount)).fill(0), total: 0};
        playerName.value = playerObj.name;
        playerName.addEventListener('input', () => {
            playerObj.name = playerName.value;
            sessionStorage.setItem('players', JSON.stringify(playersArr));
        });

        for (let j = 0; j < roundsCount; j++) {
            let playerScoreContainer = document.createElement('div');
            let playerScoreLabel = document.createElement('label');
            let playerScore = document.createElement('input');
            playerScore.type = 'number';
            playerScore.min = 0;
            playerScore.max = 999;

            playerScoreLabel.innerHTML = `Round ${j + 1}`;
            playerScoreContainer.classList.add('player-score-container');
            playerScoreLabel.classList.add('player-score-label');
            
            if (j == roundsCount - 1 && doubleRoundExist === 'true') {
                playerScoreLabel.innerHTML = 'Double Round';
                playerScore.classList.add('double-round');
            }

            playerScore.classList.add('player-score');
            playerScore.id = `player-score ${i + 1} ${j + 1}`;
            playerScoreLabel.htmlFor = playerScore.id;

            const initial = (playerObj.scores && playerObj.scores[j]) || 0;
            playerScore.value = initial || '';

            playerScoreContainer.appendChild(playerScoreLabel);
            playerScoreContainer.appendChild(playerScore);
            player.appendChild(playerScoreContainer);

            playerScores.push(playerScore);

            playerScore.addEventListener('input', () => {
                const val = parseInt(playerScore.value, 10);
                playerObj.scores[j] = isNaN(val) ? 0 : val;

                playerObj.total = playerObj.scores.reduce((sum, v, idx) => {
                    const isDouble = (idx === roundsCount - 1 && doubleRoundExist === 'true');
                    return sum + (isDouble ? (v * 2) : v);
                }, 0);

                const totalField = player.querySelector('.player-total');
                if (totalField) totalField.value = playerObj.total;

                sessionStorage.setItem('players', JSON.stringify(playersArr));
                updateWinners();
            });
        }

        let playerTotalScoreContainer = document.createElement('div');
        let playerTotalLabel = document.createElement('label');
        let playerTotal = document.createElement('input');
        playerTotal.readOnly = true;

        playerTotalScoreContainer.classList.add('player-total-score-container');
        playerTotal.classList.add('player-total');

        playerTotalLabel.innerHTML = 'Total';
        playerTotalLabel.style.cursor = 'default';

        playerTotalScoreContainer.appendChild(playerTotalLabel);
        playerTotalScoreContainer.appendChild(playerTotal);
        player.appendChild(playerTotalScoreContainer);
        players.appendChild(player);

        playerTotal.value = playerObj.total || 0;

        playerScores.forEach(scoreField => {
            scoreField.addEventListener('input', () => {
                let total = playerScores.reduce((sum, field) => {
                    let value = parseInt(field.value) || 0;
                    return sum + (field.classList.contains('double-round') ? value * 2 : value);
                }, 0);
                playerTotal.value = total;
                playerObj.total = total;
                sessionStorage.setItem('players', JSON.stringify(playersArr));
                updateWinners();
            });
        });
    }
    
    const allBtns = document.querySelectorAll('.buttons-container');
    if (allBtns.length > 1) {
        for (let i = 1; i < allBtns.length; i++)
            allBtns[i].remove();
    }

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    let restartGameButton = document.createElement('button');
    restartGameButton.innerHTML = 'Restart Game';
    restartGameButton.classList.add('new-game', 'btn');
    restartGameButton.onclick = () => {
        const playersArr = JSON.parse(sessionStorage.getItem('players') || '[]');
        playersArr.forEach(player => {
            player.scores = Array(parseInt(roundsCount)).fill(0);
            player.total = 0;
        });
        sessionStorage.setItem('players', JSON.stringify(playersArr));
        
        buildPlayersScreen();
    };

    let startNewGameButton = document.createElement('button');
    startNewGameButton.innerHTML = 'Start New Game';
    startNewGameButton.classList.add('restart', 'btn');
    startNewGameButton.onclick = () => {
        sessionStorage.clear();
        location.reload();
    };

    const existingButtonsContainer = document.querySelector('.buttons-container');
    if (existingButtonsContainer) {
        existingButtonsContainer.innerHTML = '';
        existingButtonsContainer.appendChild(restartGameButton);
        existingButtonsContainer.appendChild(startNewGameButton);
    } else {
        buttonsContainer.appendChild(restartGameButton);
        buttonsContainer.appendChild(startNewGameButton);
        document.querySelector('.container').appendChild(buttonsContainer);
    }

    updateWinners();
}

function updateOfflineUI() {
    let offlineModeDiv = document.getElementById('offline-mode');
    let offlineSpan = offlineModeDiv.querySelector('#offline-mode span');

    if (window._offlineTimeout) {
        clearTimeout(window._offlineTimeout);
        window._offlineTimeout = null;
    }

    if (navigator.onLine) {
        offlineSpan.innerText = "Back Online Again";
        offlineModeDiv.style.backgroundColor = '#4caf50';
        offlineModeDiv.style.display = 'flex';

        window._offlineTimeout = setTimeout(() => {
            offlineModeDiv.style.display = 'none';
        }, 3000);
        return;
    }

    offlineSpan.innerText = "You are Offline. No worries still can play";
    offlineModeDiv.style.backgroundColor = '#f44336';
    offlineModeDiv.style.display = 'flex';
}

window.onload = () => {
    window.addEventListener('offline', updateOfflineUI);
    window.addEventListener('online', updateOfflineUI);
    
    if (!navigator.onLine) {
        updateOfflineUI();
    }
    const sessionStorage = window.sessionStorage;
    
    if (sessionStorage.getItem('playersCount')) {
        buildPlayersScreen();
    }
    
    let start = document.querySelector('.start');

    start.onclick = () => {
        let playersCount = document.querySelector('#players-count');
        let roundsCount = document.querySelector('#rounds-count');
        let doubleRoundExist = document.querySelector('.double-round-exist');

        if (isNaN(playersCount.value) || playersCount.value < 3 || playersCount.value > 16) {
            createDialog(`Invalid number of players: "${playersCount.value}". Please enter a whole number between 3 and 16.`);
            return;
        }

        if (isNaN(roundsCount.value) || roundsCount.value < 4 || roundsCount.value > 8) {
            createDialog(`Invalid number of rounds: "${roundsCount.value}". Please enter a whole number between 4 and 8.`);
            return;
        }

        let playersArr = Array.from({length: playersCount.value}, () =>
            ({name: '', scores: Array(roundsCount.value).fill(0), total: 0})
        );
        
        sessionStorage.setItem('playersCount', playersCount.value);
        sessionStorage.setItem('roundsCount', roundsCount.value);
        sessionStorage.setItem('doubleRoundExist', doubleRoundExist.checked);
        sessionStorage.setItem('players', JSON.stringify(playersArr));

        buildPlayersScreen();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            start.click();
        }
    });
}
