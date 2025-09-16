(function () {
  const normalize = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  document.addEventListener('DOMContentLoaded', () => {
    const triviaPanel = document.querySelector('.trivia-panel');
    if (!triviaPanel) {
      return;
    }

    const rawData = triviaPanel.dataset.trivia;
    let questions = [];
    try {
      questions = rawData ? JSON.parse(decodeURIComponent(rawData)) : [];
    } catch (error) {
      console.error('No se pudieron cargar las preguntas de trivia.', error);
      return;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return;
    }

    const questionElement = document.getElementById('triviaQuestion');
    const categoryElement = document.getElementById('triviaCategory');
    const difficultyElement = document.getElementById('triviaDifficulty');
    const clueElement = document.getElementById('triviaClue');
    const funFactElement = document.getElementById('triviaFunFact');
    const answersList = document.getElementById('triviaAnswers');
    const guessForm = document.getElementById('triviaGuessForm');
    const guessInput = document.getElementById('triviaGuess');
    const feedbackElement = document.getElementById('triviaFeedback');
    const showHintButton = document.getElementById('showHint');
    const revealButton = document.getElementById('revealAnswers');
    const nextButton = document.getElementById('nextQuestion');
    const resetButton = document.getElementById('resetProgress');

    const scoreElement = document.getElementById('triviaScore');
    const bestScoreElement = document.getElementById('triviaBestScore');
    const streakElement = document.getElementById('triviaStreak');
    const bestStreakElement = document.getElementById('triviaBestStreak');

    const storageKeys = {
      score: 'triviaScore',
      bestScore: 'triviaBestScore',
      streak: 'triviaStreak',
      bestStreak: 'triviaBestStreak'
    };

    let score = Number.parseInt(localStorage.getItem(storageKeys.score), 10) || 0;
    let bestScore = Number.parseInt(localStorage.getItem(storageKeys.bestScore), 10) || 0;
    let streak = Number.parseInt(localStorage.getItem(storageKeys.streak), 10) || 0;
    let bestStreak = Number.parseInt(localStorage.getItem(storageKeys.bestStreak), 10) || 0;

    let availableQuestions = [...questions];
    let currentQuestion = null;
    let revealed = false;
    let hintShown = false;

    function saveProgress() {
      localStorage.setItem(storageKeys.score, String(score));
      localStorage.setItem(storageKeys.bestScore, String(bestScore));
      localStorage.setItem(storageKeys.streak, String(streak));
      localStorage.setItem(storageKeys.bestStreak, String(bestStreak));
    }

    function updateScoreboard() {
      scoreElement.textContent = score;
      bestScoreElement.textContent = bestScore;
      streakElement.textContent = streak;
      bestStreakElement.textContent = bestStreak;
    }

    function setFeedback(message, type) {
      feedbackElement.textContent = message;
      feedbackElement.classList.toggle('is-correct', type === 'correct');
      feedbackElement.classList.toggle('is-incorrect', type === 'incorrect');
    }

    function populateAnswers(matchedAnswer) {
      answersList.innerHTML = '';
      const sortedAnswers = [...currentQuestion.answers].sort((a, b) => b.points - a.points);
      sortedAnswers.forEach((answer) => {
        const item = document.createElement('li');
        const title = document.createElement('span');
        title.textContent = answer.text;
        const points = document.createElement('span');
        points.textContent = `${answer.points} pts`;
        item.append(title, points);
        if (matchedAnswer && normalize(matchedAnswer.text) === normalize(answer.text)) {
          item.classList.add('is-highlighted');
        }
        answersList.appendChild(item);
      });
      answersList.hidden = false;
      funFactElement.hidden = false;
      revealed = true;
    }

    function renderQuestion() {
      if (!currentQuestion) {
        return;
      }
      questionElement.textContent = currentQuestion.question;
      categoryElement.textContent = currentQuestion.category;
      difficultyElement.textContent = currentQuestion.difficulty;
      clueElement.textContent = currentQuestion.clue;
      clueElement.hidden = true;
      funFactElement.textContent = currentQuestion.funFact;
      funFactElement.hidden = true;
      answersList.hidden = true;
      answersList.innerHTML = '';
      guessInput.value = '';
      guessInput.focus();
      revealed = false;
      hintShown = false;
      showHintButton.disabled = false;
      revealButton.disabled = false;
      setFeedback('', null);
    }

    function pickQuestion() {
      if (availableQuestions.length === 0) {
        availableQuestions = [...questions];
      }
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      currentQuestion = availableQuestions.splice(randomIndex, 1)[0];
      renderQuestion();
    }

    function handleGuess(event) {
      event.preventDefault();
      if (!currentQuestion) {
        return;
      }
      const guess = guessInput.value.trim();
      if (!guess) {
        return;
      }
      const normalizedGuess = normalize(guess);
      const matchedAnswer = currentQuestion.answers.find((answer) => {
        if (normalize(answer.text) === normalizedGuess) {
          return true;
        }
        if (Array.isArray(answer.aliases)) {
          return answer.aliases.some((alias) => normalize(alias) === normalizedGuess);
        }
        return false;
      });

      if (matchedAnswer) {
        const points = Number(matchedAnswer.points) || 0;
        score += points;
        streak += 1;
        bestScore = Math.max(bestScore, score);
        bestStreak = Math.max(bestStreak, streak);
        saveProgress();
        updateScoreboard();
        populateAnswers(matchedAnswer);
        setFeedback(`¡Correcto! ${matchedAnswer.text} suma ${points} puntos.`, 'correct');
        revealButton.disabled = true;
      } else {
        streak = 0;
        saveProgress();
        updateScoreboard();
        setFeedback('Casi... intenta otra respuesta o revela las más populares.', 'incorrect');
      }
      guessInput.value = '';
      guessInput.focus();
    }

    function handleShowHint() {
      if (hintShown || !currentQuestion) {
        return;
      }
      clueElement.hidden = false;
      hintShown = true;
      showHintButton.disabled = true;
    }

    function handleReveal() {
      if (!currentQuestion || revealed) {
        return;
      }
      populateAnswers(null);
      revealButton.disabled = true;
      showHintButton.disabled = true;
      streak = 0;
      saveProgress();
      updateScoreboard();
      setFeedback('Aquí están las respuestas más populares. ¡Vamos con otra pregunta!', 'incorrect');
    }

    function handleNextQuestion() {
      pickQuestion();
    }

    function handleReset() {
      score = 0;
      bestScore = 0;
      streak = 0;
      bestStreak = 0;
      saveProgress();
      updateScoreboard();
      setFeedback('Progreso reiniciado. ¡A empezar de nuevo!', 'correct');
    }

    guessForm.addEventListener('submit', handleGuess);
    showHintButton.addEventListener('click', handleShowHint);
    revealButton.addEventListener('click', handleReveal);
    nextButton.addEventListener('click', handleNextQuestion);
    resetButton.addEventListener('click', handleReset);

    updateScoreboard();
    pickQuestion();
  });
})();
