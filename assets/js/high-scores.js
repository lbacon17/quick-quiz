const highScoresTable = document.getElementById('highScoresTable');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresTable.innerHTML = highScores
    .map(score => {
        return `<li class="high-score">${score.name} - ${score.score}</li>`;
    })
    .join("");