const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progress-text');
const score = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');
const loader = document.getElementById('loader');
const quiz = document.getElementById('quiz');

let currentQuestion = {};
let acceptAnswer = false;
let currentScore = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

fetch(
    'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
    });

    startQuiz();
})
.catch((err) => {
    console.error(err);
});

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startQuiz = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', currentScore);
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = Question `${questionCounter}/${MAX_QUESTIONS}}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptAnswer = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptAnswer) return;

        acceptAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const appliedClass = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        
        if (appliedClass === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(appliedClass);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(appliedClass);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    currentScore += num;
    score.innerText = currentScore;
};