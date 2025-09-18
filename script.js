const browserLang = (navigator.languages && navigator.languages.length)
  ? navigator.languages[0]
  : navigator.language || navigator.userLanguage;

const windowLang = browserLang.startsWith('ar') ? 'ar' : 'en';

const translations = {
    ar: {
        "title": "متعقب سكور سكرو — لتتبع نتائج لعبة Screw وتحديد الفائز",
        "subtitle": "تطبيق ويب بسيط لتتبع نتائج لعبة Screw، مقارنة النقاط، وتحديد الفائز بسهولة.",
        "gameTitle": "سكرو",
        "playersLabel": "عدد اللاعبين",
        "roundsLabel": "عدد الجولات",
        "doubleRoundLabel": "جولة مزدوجة في النهاية",
        "startButton": "ابدأ اللعبة",
        "restartButton": "إعادة تشغيل اللعبة",
        "newGameButton": "ابدأ لعبة جديدة",
        "playerNamePlaceholder": "أدخل اسم اللاعب",
        "roundLabel": "الجولة",
        "doubleRoundLabelShort": "جولة مضاعفة",
        "totalLabel": "المجموع",
        "errorTitle": "خطأ",
        "errorInvalidPlayers": "عدد لاعبين غير صالح. الرجاء إدخال رقم صحيح بين ٣ و ١٦.",
        "errorInvalidRounds": "عدد جولات غير صالح. الرجاء إدخال رقم صحيح بين ٤ و ٨.",
        "offlineMessage": "أنت غير متصل بالإنترنت. لا تقلق، لا يزال بإمكانك اللعب.",
        "backOnlineMessage": "تم الاتصال بالإنترنت مرة أخرى",
        "closeDialogBtn": "حسناً",
        "dialogTitle": "خطأ"
    },
    en: {
        "title": "Screw Score — Track, Compare & Crown the Winner",
        "subtitle": "A simple web app to track scores in the game of Screw, compare points, and easily crown the winner.",
        "gameTitle": "Screw",
        "playersLabel": "Number of Players",
        "roundsLabel": "Number of Rounds",
        "doubleRoundLabel": "Double Round at the End",
        "startButton": "Start Game",
        "restartButton": "Restart Game",
        "newGameButton": "Start New Game",
        "playerNamePlaceholder": "Enter Player Name",
        "roundLabel": "Round",
        "doubleRoundLabelShort": "Double Round",
        "totalLabel": "Total",
        "errorTitle": "Error",
        "errorInvalidPlayers": "Invalid number of players. Please enter a whole number between 3 and 16.",
        "errorInvalidRounds": "Invalid number of rounds. Please enter a whole number between 4 and 8.",
        "offlineMessage": "You are Offline. No worries still can play",
        "backOnlineMessage": "Back Online Again",
        "closeDialogBtn" : "Ok",
        "dialogTitle": "Error"
    }
};

const numbersInArabic = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
}

const arabicToLatinMap = { 
    '٠':'0',
    '١':'1',
    '٢':'2',
    '٣':'3',
    '٤':'4',
    '٥':'5',
    '٦':'6',
    '٧':'7',
    '٨':'8',
    '٩':'9' 
};

function changeArNumbersToEn(s) {
    return String(s || '').replace(/[٠-٩]/g, d => arabicToLatinMap[d] || d);
}

function changeEnNumbersToAr(s) {
    return String(s || '').replace(/[0-9]/g, d => numbersInArabic[d] || d);
}

function translatePage(lang = 'en') {
    const texts = translations[lang];
    if (!texts) return;

    document.title = texts.title;

    const elementsToTranslate = [
        { selector: '.title', text: texts.gameTitle},
        { selector: '.start', text: texts.startButton },
        { selector: '.restart', text: texts.restartButton },
        { selector: '.players-count-label', text: texts.playersLabel },
        { selector: '.rounds-count-label', text: texts.roundsLabel },
        { selector: '.double-round-label', text: texts.doubleRoundLabelShort },
        { selector: '.player-name', text: texts.playerNamePlaceholder },
        { selector: '.player-total-score-container label', text: texts.totalLabel },
        { selector: '.new-game', text: texts.newGameButton },
        { selector: '.close-dialog-btn', text: texts.closeDialogBtn },

    ];

    elementsToTranslate.forEach(({ selector, text }) => {
        document.querySelectorAll(selector).forEach (element => 
        {
            const tag = element.tagName.toUpperCase();

            if (tag === 'INPUT' || tag === 'TEXTAREA') {
                const type = (element.getAttribute('type') || '').toLowerCase();
                if (type === 'button' || type === 'submit' || type === 'reset') {
                    element.value = text;
                } else {
                    element.placeholder = text;
                }
                return;
            }

            element.textContent = text;
        });
    });

    if (document.styleSheets && document.styleSheets[1]) {
        document.styleSheets[1].disabled = (lang === 'en');
    }
}

function increaseDecreaseInput(e) {
    const input = e.currentTarget || e.target;
    if (!input) return;

    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    e.preventDefault();

    const current = parseInt(changeArNumbersToEn(input.value), 10) || 0;
    const next = e.key === 'ArrowUp' ? current + 1 : Math.max(0, current - 1);

    let clamped = next;
    if (input.id === "players-count") {
        clamped = Math.min(16, Math.max(0, next));
    } else if (input.id === "rounds-count") {
        clamped = Math.min(8, Math.max(4, next));
    }

    input.value = (windowLang === 'ar') ? changeEnNumbersToAr(clamped) : String(clamped);
}

function createDialog(message) {
    let dialog = document.createElement('dialog');
    let header = document.createElement('h2');
    let paragraph = document.createElement('p');
    let closeButton = document.createElement('button');
    let errorIcon1 = document.createElement('i');
    let errorIcon2 = document.createElement('i');

    dialog.classList.add("error-dialog");
    closeButton.classList.add('close-dialog-btn');

    header.textContent = windowLang === 'ar' ? translations.ar.dialogTitle : translations.en.dialogTitle;
    errorIcon1.className = "fa-solid fa-triangle-exclamation";
    errorIcon2.className = "fa-solid fa-triangle-exclamation";

    header.prepend(errorIcon1);
    header.appendChild(errorIcon2);
    dialog.appendChild(header);

    paragraph.textContent = message;
    dialog.appendChild(paragraph);

    closeButton.innerText = windowLang === 'ar' ? translations.ar.closeDialogBtn : translations.en.closeDialogBtn;
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

function buildPlayersScreen(pCount, rCount) {
    const sessionStorage = window.sessionStorage;
    const doubleRoundExist = sessionStorage.getItem('doubleRoundExist');
    const playersArr = JSON.parse(sessionStorage.getItem('players') || '[]');    
    const players = document.querySelector('.players');
    
    players.innerHTML = '';

    document.querySelector('.beginning').style.display = 'none';

    for (let i = 0; i < pCount; i++) {
        let player = document.createElement('div');
        let playerName = document.createElement('input');
        let playerScores = [];

        playerName.placeholder = 'Enter Player Name';
        player.classList.add('player');
        playerName.classList.add('player-name');
        player.appendChild(playerName);

        const playerObj = playersArr[i] || {name: '', scores: Array(parseInt(rCount)).fill(0), total: 0};
        playerName.value = playerObj.name;
        playerName.addEventListener('input', () => {
            playerObj.name = playerName.value;
            sessionStorage.setItem('players', JSON.stringify(playersArr));
        });

        for (let j = 0; j < rCount; j++) {
            let playerScoreContainer = document.createElement('div');
            let playerScoreLabel = document.createElement('label');
            let playerScore = document.createElement('input');

            playerScoreLabel.innerHTML = windowLang === "ar" ? `${translations.ar.roundLabel} ${numbersInArabic[j + 1]}` : `${translations.en.roundLabel} ${j + 1}`;
            playerScoreContainer.classList.add('player-score-container');
            playerScoreLabel.classList.add('player-score-label');
            
            if (j == rCount - 1 && doubleRoundExist === 'true') {
                playerScoreLabel.innerHTML = windowLang === "ar" ? translations.ar.doubleRoundLabel : translations.en.doubleRoundLabel;
                playerScoreLabel.classList.add('double-round-label');
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
                    const isDouble = (idx === rCount - 1 && doubleRoundExist === 'true');
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

        playerTotal.value = windowLang === "ar" ? changeEnNumbersToAr(playerObj.total) || numbersInArabic[0] : playerObj.total;

        playerScores.forEach(scoreField => {
            scoreField.addEventListener('keydown', increaseDecreaseInput);
            scoreField.addEventListener('input', () => {
                const scoreValue = changeArNumbersToEn(scoreField.value).replace(/\D+/g, '');
                scoreField.value = windowLang === "ar" ? changeEnNumbersToAr(scoreValue) : scoreValue;

                let total = 0;
                playerScores.forEach((field, idx) => {
                    const val = parseInt(changeArNumbersToEn(field.value).replace(/\D+/g, ''), 10) || 0;
                    playerObj.scores[idx] = val;
                    total += field.classList.contains('double-round') ? val * 2 : val;
                });

                playerTotal.value = windowLang === "ar" ? changeEnNumbersToAr(total) : String(total);
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
            player.scores = Array(parseInt(rCount)).fill(0);
            player.total = 0;
        });
        sessionStorage.setItem('players', JSON.stringify(playersArr));

        buildPlayersScreen(pCount, rCount);
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
    translatePage(windowLang);
}

function updateOfflineUI() {
    let offlineModeDiv = document.getElementById('offline-mode');
    let offlineSpan = offlineModeDiv.querySelector('#offline-mode span');

    if (window._offlineTimeout) {
        clearTimeout(window._offlineTimeout);
        window._offlineTimeout = null;
    }

    if (navigator.onLine) {
        offlineSpan.innerText = windowLang === "ar" ? translations.ar.backOnlineMessage : translations.en.backOnlineMessage;
        offlineModeDiv.style.backgroundColor = '#4caf50';
        offlineModeDiv.style.display = 'flex';

        window._offlineTimeout = setTimeout(() => {
            offlineModeDiv.style.display = 'none';
        }, 3000);
        return;
    }

    offlineSpan.innerText = windowLang === "ar" ? "أنت غير متصل بالإنترنت. لا تقلق، لا يزال بإمكانك اللعب." : "You are Offline. No worries still can play";
    offlineModeDiv.style.backgroundColor = '#f44336';
    offlineModeDiv.style.display = 'flex';
}

window.onload = () => {
    let playersCount = document.querySelector('#players-count');
    let roundsCount = document.querySelector('#rounds-count');
    let doubleRoundExist = document.querySelector('.double-round-exist');
    
    translatePage(windowLang);
    if (windowLang === 'ar')
    {
        playersCount.value = changeEnNumbersToAr(playersCount.value);
        roundsCount.value = changeEnNumbersToAr(roundsCount.value);
    }

    // when up arrow pressed increase input value with 1
    document.querySelectorAll('#players-count, #rounds-count').forEach(input => {
        input.addEventListener('keydown', increaseDecreaseInput);
        input.addEventListener('input', _ => {
            const inpValue = changeArNumbersToEn(input.value).replace(/\D+/g, '').slice(0, 2);
            input.value = windowLang === "ar" ? changeEnNumbersToAr(inpValue) : inpValue;
        });
    });

    window.addEventListener('offline', updateOfflineUI);
    window.addEventListener('online', updateOfflineUI);
    
    if (!navigator.onLine) {
        updateOfflineUI();
    }
    const sessionStorage = window.sessionStorage;
    
    const savedP = parseInt(sessionStorage.getItem('playersCount'), 10);
    const savedR = parseInt(sessionStorage.getItem('roundsCount'), 10);
    if (!isNaN(savedP) && !isNaN(savedR)) {
        if (playersCount) playersCount.value = windowLang === 'ar' ? changeEnNumbersToAr(savedP) : String(savedP);
        if (roundsCount) roundsCount.value = windowLang === 'ar' ? changeEnNumbersToAr(savedR) : String(savedR);
        buildPlayersScreen(savedP, savedR);
    }
    
    let start = document.querySelector('.start');

    start.onclick = () => {
        let pCount = changeArNumbersToEn(playersCount.value);
        let rCount = changeArNumbersToEn(roundsCount.value);
        if (isNaN(pCount) || pCount < 3 || pCount > 16) {
            let msg = windowLang === 'ar' ? translations.ar.errorInvalidPlayers : translations.en.errorInvalidPlayers;
            createDialog(msg);
            return;
        }

        if (isNaN(rCount) || rCount < 4 || rCount > 8) {
            let msg = windowLang === 'ar' ? translations.ar.errorInvalidRounds : translations.en.errorInvalidRounds;
            createDialog(msg);
            return;
        }

        let playersArr = Array.from({length: pCount}, () =>
            ({name: '', scores: Array(rCount).fill(0), total: 0})
        );

        sessionStorage.setItem('playersCount', pCount);
        sessionStorage.setItem('roundsCount', rCount);
        sessionStorage.setItem('doubleRoundExist', doubleRoundExist.checked);
        sessionStorage.setItem('players', JSON.stringify(playersArr));

        buildPlayersScreen(pCount, rCount);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            start.click();
        }
    });
}