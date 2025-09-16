(function () {
  function escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatVotes(count) {
    const votos = Number(count) || 0;
    return `${votos} voto${votos === 1 ? '' : 's'}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const rankingList = document.querySelector('[data-grito-list]');
    const totalVotesElement = document.querySelector('[data-total-votes]');
    const topTitle = document.querySelector('[data-top-grito]');
    const topDescription = document.querySelector('[data-top-descripcion]');
    const topRegion = document.querySelector('[data-top-region]');
    const topAportado = document.querySelector('[data-top-aportado]');
    const topVotes = document.querySelector('[data-top-votos]');
    const secondaryContainer = document.querySelector('[data-secondary-container]');
    const secondaryList = document.querySelector('[data-secondary-list]');
    const addForm = document.getElementById('nuevoGritoForm');
    const feedbackElement = document.getElementById('gritoFeedback');

    if (!rankingList) {
      return;
    }

    function updateTotals(totalVotes) {
      if (totalVotesElement) {
        totalVotesElement.textContent = totalVotes;
      }
    }

    function updateTop(highlight, secondaryHighlights) {
      if (!highlight || !topTitle) {
        return;
      }
      if (topTitle) {
        topTitle.textContent = highlight.texto;
      }
      if (topDescription) {
        topDescription.textContent = highlight.descripcion;
      }
      if (topRegion) {
        topRegion.textContent = highlight.region;
      }
      if (topAportado) {
        topAportado.textContent = highlight.aportadoPor;
      }
      if (topVotes) {
        topVotes.textContent = highlight.votos;
      }
      if (secondaryContainer && secondaryList) {
        secondaryList.innerHTML = '';
        if (secondaryHighlights && secondaryHighlights.length) {
          secondaryHighlights.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="badge">#${index + 2}</span><span>${escapeHtml(item.texto)}</span><span class="mini-list__meta">${formatVotes(item.votos)}</span>`;
            secondaryList.appendChild(li);
          });
          secondaryContainer.classList.remove('is-hidden');
        } else {
          secondaryContainer.classList.add('is-hidden');
        }
      }
    }

    function buildGritoMarkup(grito, index, maxVotes) {
      const votosActuales = Math.max(Number(grito.votos) || 0, 0);
      const safeMax = Math.max(Number(maxVotes) || 0, 1);
      const clampedValue = Math.min(votosActuales, safeMax);
      const percent = safeMax ? Math.round((clampedValue / safeMax) * 100) : 0;
      return `
        <div class="grito-card__header">
          <span class="badge">#${index + 1}</span>
          <div>
            <h3>${escapeHtml(grito.texto)}</h3>
            <p class="grito-card__meta">Aportado por <strong>${escapeHtml(grito.aportadoPor)}</strong> · <span>${escapeHtml(grito.region)}</span></p>
          </div>
        </div>
        <p class="grito-card__description">${escapeHtml(grito.descripcion)}</p>
        <div class="grito-card__stats">
          <progress
            class="progress"
            value="${clampedValue}"
            max="${safeMax}"
            title="${percent}% del máximo de votos"
            aria-label="Participación: ${formatVotes(grito.votos)}"
            aria-valuetext="${percent}% del máximo de votos"
          ></progress>
          <span class="grito-card__votes"><span class="grito-card__votes-value">${grito.votos}</span> ${formatVotes(grito.votos).replace(/^[0-9]+\s/, '')}</span>
        </div>
        <form class="vote-form" action="/gritos/votar/${grito.id}" method="POST">
          <button type="submit" class="button button--secondary">Dar mi voto</button>
        </form>
      `;
    }

    function rebuildList(ranking, maxVotes) {
      rankingList.innerHTML = '';
      ranking.forEach((grito, index) => {
        const item = document.createElement('li');
        item.className = 'grito-card';
        item.dataset.gritoId = String(grito.id);
        item.innerHTML = buildGritoMarkup(grito, index, maxVotes);
        rankingList.appendChild(item);
      });
      attachVoteHandlers();
    }

    function updateFromPayload(payload, options = {}) {
      if (!payload || !payload.ranking) {
        return;
      }
      updateTotals(payload.totalVotes ?? 0);
      rebuildList(payload.ranking, payload.maxVotes ?? 0);
      updateTop(payload.highlight, payload.secondaryHighlights);
      if (feedbackElement && options.message) {
        feedbackElement.textContent = options.message;
        feedbackElement.classList.toggle('is-error', Boolean(options.isError));
        if (!options.isError) {
          setTimeout(() => {
            feedbackElement.textContent = '';
          }, 3500);
        }
      }
    }

    function handleVote(event) {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form || !form.action) {
        return;
      }
      fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se pudo registrar tu voto.');
          }
          return response.json();
        })
        .then((payload) => {
          if (!payload.success) {
            throw new Error('No se encontró el grito a votar.');
          }
          updateFromPayload(payload, { message: '¡Gracias por tu voto!' });
        })
        .catch(() => {
          form.submit();
        });
    }

    function handleAdd(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const params = new URLSearchParams(formData);
      fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: params.toString()
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || 'No se pudo agregar el grito.');
            });
          }
          return response.json();
        })
        .then((payload) => {
          if (!payload.success) {
            throw new Error('No se pudo agregar el grito.');
          }
          form.reset();
          updateFromPayload(payload, { message: '¡Tu grito se agregó al ranking!' });
        })
        .catch((error) => {
          if (feedbackElement) {
            feedbackElement.textContent = error.message || 'No se pudo agregar el grito.';
            feedbackElement.classList.add('is-error');
          }
        });
    }

    function attachVoteHandlers() {
      document.querySelectorAll('.vote-form').forEach((form) => {
        if (form.dataset.enhanced === 'true') {
          return;
        }
        form.dataset.enhanced = 'true';
        form.addEventListener('submit', handleVote);
      });
    }

    attachVoteHandlers();

    if (addForm && addForm.dataset.enhanced !== 'true') {
      addForm.dataset.enhanced = 'true';
      addForm.addEventListener('submit', handleAdd);
    }
  });
})();
