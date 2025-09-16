(function () {
  function decodeCards(element) {
    try {
      return JSON.parse(decodeURIComponent(element.dataset.loteriaCards || '[]'));
    } catch (error) {
      console.error('No se pudieron cargar las cartas de la lotería.', error);
      return [];
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('[data-loteria-cards]');
    if (!container) {
      return;
    }

    const cards = decodeCards(container);
    if (!cards.length) {
      return;
    }

    const startButton = document.getElementById('start');
    const nextButton = document.getElementById('next');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');
    const delayInput = document.getElementById('delay');
    const manualCheckbox = document.getElementById('modoManual');
    const currentCardElement = document.getElementById('currentCard');
    const calledList = document.getElementById('calledCards');
    const progressBar = document.getElementById('loteriaProgress');
    const calledCountElement = document.getElementById('calledCount');
    const totalCountElement = document.getElementById('totalCount');

    let deck = [];
    let index = 0;
    let intervalId = null;

    totalCountElement.textContent = cards.length;

    function shuffleDeck() {
      deck = [...cards].sort(() => Math.random() - 0.5);
      index = 0;
    }

    function updateProgress() {
      if (!progressBar) {
        return;
      }
      const totalCards = deck.length || cards.length || 1;
      const clampedIndex = Math.min(index, totalCards);
      const percentage = totalCards ? Math.round((clampedIndex / totalCards) * 100) : 0;
      progressBar.max = totalCards;
      progressBar.value = clampedIndex;
      progressBar.title = `${clampedIndex} de ${totalCards} cartas (${percentage}%)`;
      progressBar.setAttribute('aria-valuetext', `${clampedIndex} de ${totalCards} cartas (${percentage}%)`);
      progressBar.setAttribute('aria-label', 'Progreso de cartas cantadas');
      calledCountElement.textContent = clampedIndex;
    }

    function appendCardToHistory(card) {
      const item = document.createElement('li');
      item.textContent = card;
      calledList.prepend(item);
      while (calledList.children.length > 18) {
        calledList.removeChild(calledList.lastChild);
      }
    }

    function endRound(exhausted) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      startButton.disabled = false;
      stopButton.disabled = true;
      manualCheckbox.disabled = false;
      nextButton.disabled = !manualCheckbox.checked;
      if (exhausted) {
        currentCardElement.textContent = '¡Se cantaron todas las cartas!';
        nextButton.disabled = true;
      }
    }

    function showNextCard() {
      if (index >= deck.length) {
        endRound(true);
        return;
      }
      const card = deck[index];
      index += 1;
      currentCardElement.textContent = card;
      appendCardToHistory(card);
      updateProgress();
      if (index >= deck.length) {
        endRound(true);
      }
    }

    function startRound() {
      if (intervalId) {
        return;
      }

      if (index >= deck.length) {
        shuffleDeck();
        calledList.innerHTML = '';
        currentCardElement.textContent = '-';
        updateProgress();
      }

      const manualMode = manualCheckbox.checked;
      startButton.disabled = true;
      manualCheckbox.disabled = true;
      resetButton.disabled = false;
      nextButton.disabled = !manualMode;
      stopButton.disabled = manualMode;

      if (manualMode) {
        showNextCard();
        return;
      }

      const delaySeconds = Number.parseInt(delayInput.value, 10);
      if (Number.isNaN(delaySeconds) || delaySeconds < 1) {
        alert('Ingresa un intervalo válido de al menos 1 segundo.');
        startButton.disabled = false;
        manualCheckbox.disabled = false;
        return;
      }

      showNextCard();
      stopButton.disabled = false;
      intervalId = setInterval(() => {
        showNextCard();
        if (index >= deck.length) {
          endRound(true);
        }
      }, delaySeconds * 1000);
    }

    function stopRound() {
      if (!intervalId) {
        return;
      }
      clearInterval(intervalId);
      intervalId = null;
      startButton.disabled = false;
      stopButton.disabled = true;
      manualCheckbox.disabled = false;
      nextButton.disabled = true;
    }

    function resetRound() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      shuffleDeck();
      calledList.innerHTML = '';
      currentCardElement.textContent = '-';
      updateProgress();
      startButton.disabled = false;
      stopButton.disabled = true;
      nextButton.disabled = true;
      resetButton.disabled = true;
      manualCheckbox.disabled = false;
    }

    function handleNextButton() {
      if (intervalId || index >= deck.length) {
        return;
      }
      showNextCard();
    }

    manualCheckbox.addEventListener('change', () => {
      if (intervalId) {
        manualCheckbox.checked = !manualCheckbox.checked;
        return;
      }
      nextButton.disabled = !manualCheckbox.checked || index >= deck.length || index === 0;
    });

    startButton.addEventListener('click', startRound);
    stopButton.addEventListener('click', stopRound);
    resetButton.addEventListener('click', resetRound);
    nextButton.addEventListener('click', handleNextButton);

    shuffleDeck();
    updateProgress();
    resetButton.disabled = true;
    stopButton.disabled = true;
    nextButton.disabled = true;
  });
})();
