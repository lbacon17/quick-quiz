const highScoresTable = document.getElementById('highScoresTable');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresTable.innerHTML = highScores
    .map(currentScore => {
        return `<li class="high-score">${currentScore.name} - ${currentScore.score}</li>`;
    })
    .join("");