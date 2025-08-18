window.onload = () => {
    let start = document.querySelector('.start');
    let players = document.querySelector('.players');

    let minScore = Number.MAX_SAFE_INTEGER;

    start.onclick = () => {
        let playersCount = document.querySelector('#players-count');
        let roundsCount = document.querySelector('#rounds-count');
        let doubleRoundExist = document.querySelector('.double-round-exist');

        for (let i = 0; i < playersCount.value; i++) {
            let player = document.createElement('div');
            //let playerLabel = document.createElement('label');
            let playerName = document.createElement('input');
            let playerScores = [];

            playerName.placeholder = 'Enter Player Name';
            //playerLabel.innerHTML = `Player ${i + 1} Name`;

            player.classList.add('player');
            playerName.classList.add('player-name');

            //player.appendChild(playerLabel);
            player.appendChild(playerName);

            for (let j = 0; j < roundsCount.value; j++) {
                let playerScoreContainer = document.createElement('div');
                let playerScoreLabel = document.createElement('label');
                let playerScore = document.createElement('input');
                playerScore.type = 'number';
                playerScore.min = 0;
                playerScore.max = 999;

                playerScoreLabel.innerHTML = `Round ${j + 1}`;
                
                playerScoreContainer.classList.add('player-score-container');
                playerScoreLabel.classList.add('player-score-label');
                if (j == roundsCount.value - 1 && doubleRoundExist.checked) {
                    playerScoreLabel.innerHTML = 'Double Round';
                    playerScore.classList.add('double-round');
                }
                playerScore.classList.add('player-score');
                playerScore.id = `player-score ${i + 1} ${j + 1}`;
                playerScoreLabel.htmlFor = playerScore.id;

                playerScoreContainer.appendChild(playerScoreLabel);
                playerScoreContainer.appendChild(playerScore);
                player.appendChild(playerScoreContainer);

                playerScores.push(playerScore);
            }

            let playerTotalScoreContainer = document.createElement('div');
            let playerTotalLabel = document.createElement('label');
            let playerTotal = document.createElement('input');
            // playerTotal.type = 'number';
            playerTotal.readOnly = true;

            playerTotalScoreContainer.classList.add('player-total-score-container');
            playerTotal.classList.add('player-total');

            playerTotalLabel.innerHTML = 'Total';
            playerTotalLabel.style.cursor = 'default';

            playerTotalScoreContainer.appendChild(playerTotalLabel);
            playerTotalScoreContainer.appendChild(playerTotal);
            player.appendChild(playerTotalScoreContainer);
            players.appendChild(player);

            let scoreFilds = document.querySelectorAll('.player-score');

            playerScores.forEach(scoreField => {
                scoreField.addEventListener('input', () => {
                    let total = playerScores.reduce((sum, field) => {
                        let value = parseInt(field.value) || 0;
                        return sum + (field.classList.contains('double-round') ? value * 2 : value);
                    }, 0);
                    playerTotal.value = total;

                    updateWinners();
                });
            });
        }
        document.querySelector('.begining').remove();


        function updateWinners() {
            let allPlayers = document.querySelectorAll('.player');
            let scores = Array.from(allPlayers)
                .map(p => parseInt(p.querySelector('.player-total').value))
                .filter(score => !isNaN(score));

            if (scores.length > 0) {
                minScore = Math.min(...scores);
            } else {
                minScore = 0;
            }

            allPlayers.forEach(player => {
                let totalField = player.querySelector('.player-total');
                let total = parseInt(totalField.value);
                let crownIcon = player.querySelector('.fa-crown');

                if (total === minScore) {
                    player.classList.add('winner');
                    if (!crownIcon) {
                        crownIcon = document.createElement('i');
                        crownIcon.classList.add('fa-solid', 'fa-crown');
                        player.prepend(crownIcon);
                    }
                    player.style.border = '5px solid gold';
                } else {
                    player.classList.remove('winner');
                    if (crownIcon) crownIcon.remove();
                    player.style.border = 'none';
                }
            });
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            start.click();
        }
    });
}
