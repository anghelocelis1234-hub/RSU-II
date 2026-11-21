(() => {
  const STORAGE_SCENES = 'ecd_scenes_v4';
  const SESSION_START_MS = 'ecd_timer_start_ms';
  const PHASE_SECONDS = 10 * 60;
  const TOTAL_SECONDS = 20 * 60;

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const loadScenes = () => {
    try {
      const raw = localStorage.getItem(STORAGE_SCENES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === window.DEFAULT_SCENES.length) return parsed;
      }
    } catch (_) {}
    return deepClone(window.DEFAULT_SCENES);
  };

  const state = {
    started: false,
    scenes: loadScenes(),
    stepIndex: 0,
    visited: new Set([0]),
    selectedHotspotId: null,
    drawerOpen: false,
    calibrating: false,
    draggingId: null,
    dragMoved: false,
    startEpochMs: null,
    lastAlarmPhase: 1,
    audioCtx: null
  };

  const $ = (id) => document.getElementById(id);
  const el = {
    topbar: $('topbar'),
    startView: $('startView'),
    storyView: $('storyView'),
    startCaseBtn: $('startCaseBtn'),
    startClockDisplay: $('startClockDisplay'),
    syncScheduleChk: $('syncScheduleChk'),
    syncTimeRow: $('syncTimeRow'),
    syncStartInput: $('syncStartInput'),

    centerTimerPill: $('centerTimerPill'),
    phaseBadge: $('phaseBadge'),
    phaseTimerDisplay: $('phaseTimerDisplay'),
    totalTimerDisplay: $('totalTimerDisplay'),
    clockDisplay: $('clockDisplay'),

    alarmBanner: $('alarmBanner'),
    alarmBannerText: $('alarmBannerText'),
    dismissAlarmBtn: $('dismissAlarmBtn'),

    calibrateToggleBtn: $('calibrateToggleBtn'),
    sceneFrame: $('sceneFrame'),
    sceneImg: $('sceneImg'),
    sceneFallback: $('sceneFallback'),
    fallbackTitle: $('fallbackTitle'),
    sceneTimeOverlay: $('sceneTimeOverlay'),
    sceneStepOverlay: $('sceneStepOverlay'),
    hotspotsLayer: $('hotspotsLayer'),
    sceneHint: $('sceneHint'),

    hotspotDrawer: $('hotspotDrawer'),
    hotspotCatBadge: $('hotspotCatBadge'),
    hotspotCoordTag: $('hotspotCoordTag'),
    closeDrawerBtn: $('closeDrawerBtn'),
    hotspotTitle: $('hotspotTitle'),
    hotspotNote: $('hotspotNote'),
    hotspotShelfList: $('hotspotShelfList'),
    hotspotPromptBox: $('hotspotPromptBox'),
    hotspotPromptText: $('hotspotPromptText'),

    calibratorPanel: $('calibratorPanel'),
    calibratorForm: $('calibratorForm'),
    clickAddsNewChk: $('clickAddsNewChk'),
    calX: $('calX'),
    calY: $('calY'),
    calCat: $('calCat'),
    calTitle: $('calTitle'),
    calNote: $('calNote'),
    calPrompt: $('calPrompt'),
    addHotspotBtn: $('addHotspotBtn'),
    deleteHotspotBtn: $('deleteHotspotBtn'),
    copyJsonBtn: $('copyJsonBtn'),
    resetHotspotsBtn: $('resetHotspotsBtn'),

    prevBtn: $('prevBtn'),
    nextBtn: $('nextBtn'),
    stepDots: $('stepDots'),
    toast: $('toast')
  };

  let toastTimer = null;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.add('hidden'), 2400);
  }

  function saveScenes() {
    localStorage.setItem(STORAGE_SCENES, JSON.stringify(state.scenes));
  }

  function currentScene() {
    return state.scenes[state.stepIndex];
  }

  function currentHotspot() {
    const sc = currentScene();
    if (!sc.hotspots.length) return null;
    return sc.hotspots.find((h) => h.id === state.selectedHotspotId) || sc.hotspots[0];
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Audio chime for 10-min and 20-min alerts
  function unlockAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!state.audioCtx) state.audioCtx = new AudioCtx();
      if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
    } catch (_) {}
  }

  function playAlarmChime(repeat = 2) {
    try {
      unlockAudio();
      const ctx = state.audioCtx;
      if (!ctx) return;
      const now = ctx.currentTime;
      for (let i = 0; i < repeat; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(i % 2 === 0 ? 660 : 880, now + i * 0.28);
        gain.gain.setValueAtTime(0.001, now + i * 0.28);
        gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.28 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.28 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.28);
        osc.stop(now + i * 0.28 + 0.26);
      }
    } catch (_) {}
  }

  // Clock & 20-minute (2 x 10-min) synchronized timer
  function formatMMSS(totalSec) {
    const clamped = Math.max(0, Math.floor(totalSec));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatClock(date) {
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  function parseTimeToTodayMs(hhmm) {
    const [hh, mm] = (hhmm || '09:50').split(':').map(Number);
    const d = new Date();
    d.setHours(hh || 0, mm || 0, 0, 0);
    return d.getTime();
  }

  function isInsideDefaultWorkshopWindow(nowDate) {
    const mins = nowDate.getHours() * 60 + nowDate.getMinutes();
    return mins >= 9 * 60 + 50 && mins <= 10 * 60 + 10;
  }

  function tickClockAndTimer() {
    const now = new Date();
    el.startClockDisplay.textContent = formatClock(now);
    el.clockDisplay.textContent = now.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (!state.started || state.startEpochMs == null) return;

    const elapsedSec = Math.max(0, Math.floor((Date.now() - state.startEpochMs) / 1000));
    const totalRemaining = Math.max(0, TOTAL_SECONDS - elapsedSec);

    if (elapsedSec < PHASE_SECONDS) {
      const phaseRem = PHASE_SECONDS - elapsedSec;
      el.centerTimerPill.dataset.phase = '1';
      el.phaseBadge.textContent = '1/2 Análisis';
      el.phaseTimerDisplay.textContent = formatMMSS(phaseRem);
      el.totalTimerDisplay.textContent = `Total ${formatMMSS(totalRemaining)}`;
    } else if (elapsedSec < TOTAL_SECONDS) {
      const phaseRem = TOTAL_SECONDS - elapsedSec;
      el.centerTimerPill.dataset.phase = '2';
      el.phaseBadge.textContent = '2/2 Conclusiones';
      el.phaseTimerDisplay.textContent = formatMMSS(phaseRem);
      el.totalTimerDisplay.textContent = `Total ${formatMMSS(totalRemaining)}`;

      if (state.lastAlarmPhase < 2) {
        state.lastAlarmPhase = 2;
        playAlarmChime(3);
        el.alarmBannerText.textContent =
          '¡10 minutos cumplidos! Ahora es momento de empezar a compartir las conclusiones en equipo (10 min restantes).';
        el.alarmBanner.classList.remove('hidden');
      }
    } else {
      el.centerTimerPill.dataset.phase = 'done';
      el.phaseBadge.textContent = 'Fin';
      el.phaseTimerDisplay.textContent = '00:00';
      el.totalTimerDisplay.textContent = 'Total 00:00';

      if (state.lastAlarmPhase < 3) {
        state.lastAlarmPhase = 3;
        playAlarmChime(4);
        el.alarmBannerText.textContent =
          '¡Tiempo completado (20 minutos)! Cierre de la actividad.';
        el.alarmBanner.classList.remove('hidden');
      }
    }
  }

  function startActivity(customStartMs) {
    unlockAudio();
    state.started = true;

    if (customStartMs != null) {
      state.startEpochMs = customStartMs;
    } else if (el.syncScheduleChk.checked) {
      state.startEpochMs = parseTimeToTodayMs(el.syncStartInput.value);
    } else if (isInsideDefaultWorkshopWindow(new Date())) {
      state.startEpochMs = parseTimeToTodayMs('09:50');
    } else {
      state.startEpochMs = Date.now();
    }

    sessionStorage.setItem(SESSION_START_MS, String(state.startEpochMs));

    const elapsedSec = Math.max(0, Math.floor((Date.now() - state.startEpochMs) / 1000));
    state.lastAlarmPhase = elapsedSec >= TOTAL_SECONDS ? 3 : elapsedSec >= PHASE_SECONDS ? 2 : 1;

    el.startView.classList.add('hidden');
    el.topbar.classList.remove('hidden');
    el.storyView.classList.remove('hidden');

    tickClockAndTimer();
    renderStory();
  }

  // Story rendering
  function renderStory() {
    const sc = currentScene();
    state.visited.add(state.stepIndex);

    if (!sc.hotspots.some((h) => h.id === state.selectedHotspotId)) {
      state.selectedHotspotId = sc.hotspots[0] ? sc.hotspots[0].id : null;
    }

    el.sceneFallback.classList.add('hidden');
    el.sceneImg.classList.remove('hidden');
    el.sceneImg.src = sc.image;
    el.sceneImg.alt = `${sc.time} — ${sc.title}`;
    el.fallbackTitle.textContent = `${sc.time} — ${sc.title}`;
    el.sceneImg.onerror = () => {
      el.sceneImg.classList.add('hidden');
      el.sceneFallback.classList.remove('hidden');
    };

    el.sceneTimeOverlay.textContent = `${sc.time} · ${sc.stage}`;
    el.sceneStepOverlay.textContent = `${state.stepIndex + 1} / ${state.scenes.length}`;
    el.sceneFrame.classList.toggle('calibrating', state.calibrating);

    el.calibrateToggleBtn.classList.toggle('calibrate-active', state.calibrating);
    el.calibratorPanel.classList.toggle('hidden', !state.calibrating);
    el.sceneHint.textContent = state.calibrating
      ? 'Modo calibrar: arrastra un punto o haz clic sobre el lienzo 9:16 para ajustar coordenadas (x%, y%).'
      : 'Toca los puntos sobre la escena para abrir cada pista.';

    renderHotspots();
    renderHotspotDrawer();
    renderCalibratorFields();
    renderStepNav();
  }

  function renderHotspots() {
    const sc = currentScene();
    const active = currentHotspot();
    el.hotspotsLayer.innerHTML = '';

    sc.hotspots.forEach((hs, idx) => {
      const meta = window.CATEGORY_META[hs.category] || window.CATEGORY_META.decision;
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = active && active.id === hs.id && (state.drawerOpen || state.calibrating);
      btn.className = 'hotspot' + (isSelected ? ' active' : '');
      btn.dataset.cat = hs.category;
      if (hs.theme) btn.dataset.theme = hs.theme;
      btn.dataset.id = hs.id;
      btn.style.left = `${hs.x}%`;
      btn.style.top = `${hs.y}%`;
      btn.title = `${meta.label}: ${hs.title}`;
      btn.setAttribute('aria-label', `${meta.label}: ${hs.title}`);
      btn.textContent = state.calibrating ? String(idx + 1) : (hs.customIcon || meta.icon);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.dragMoved) {
          state.dragMoved = false;
          return;
        }
        if (state.selectedHotspotId === hs.id && state.drawerOpen && !state.calibrating) {
          state.drawerOpen = false;
        } else {
          state.selectedHotspotId = hs.id;
          state.drawerOpen = true;
        }
        renderHotspots();
        renderHotspotDrawer();
        renderCalibratorFields();
      });

      if (state.calibrating) {
        btn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          state.draggingId = hs.id;
          state.dragMoved = false;
          state.selectedHotspotId = hs.id;
          btn.setPointerCapture(e.pointerId);
        });

        btn.addEventListener('pointermove', (e) => {
          if (state.draggingId !== hs.id) return;
          state.dragMoved = true;
          const coords = eventToPercent(e);
          hs.x = coords.x;
          hs.y = coords.y;
          btn.style.left = `${hs.x}%`;
          btn.style.top = `${hs.y}%`;
          renderCalibratorFields();
          renderHotspotDrawer();
        });

        btn.addEventListener('pointerup', (e) => {
          if (state.draggingId === hs.id) {
            state.draggingId = null;
            saveScenes();
            if (btn.hasPointerCapture(e.pointerId)) {
              btn.releasePointerCapture(e.pointerId);
            }
          }
        });
      }

      el.hotspotsLayer.appendChild(btn);
    });
  }

  function renderHotspotDrawer() {
    const hs = currentHotspot();
    if (!state.drawerOpen || !hs) {
      el.hotspotDrawer.classList.add('hidden');
      return;
    }

    const meta = window.CATEGORY_META[hs.category] || window.CATEGORY_META.decision;
    el.hotspotDrawer.dataset.cat = hs.category;
    if (hs.theme) {
      el.hotspotDrawer.dataset.theme = hs.theme;
    } else {
      delete el.hotspotDrawer.dataset.theme;
    }
    el.hotspotCatBadge.textContent = hs.theme === 'yape' ? 'Yape · Presupuesto' : `${meta.icon} ${meta.label}`;
    el.hotspotCoordTag.textContent = `(${hs.x}%, ${hs.y}%)`;
    el.hotspotCoordTag.classList.toggle('hidden', !state.calibrating);
    el.hotspotTitle.textContent = hs.title;
    el.hotspotNote.textContent = hs.note;

    if (Array.isArray(hs.items) && hs.items.length) {
      el.hotspotShelfList.innerHTML = hs.items
        .map(
          (item) =>
            `<div class="shelf-item"><span>${escapeHtml(item.name)}</span><span class="shelf-item-price">${escapeHtml(item.price)}</span></div>`
        )
        .join('');
      el.hotspotShelfList.classList.remove('hidden');
    } else {
      el.hotspotShelfList.innerHTML = '';
      el.hotspotShelfList.classList.add('hidden');
    }

    const hasPrompt = Boolean(hs.prompt && hs.prompt.trim());
    el.hotspotPromptBox.classList.toggle('hidden', !hasPrompt);
    if (hasPrompt) el.hotspotPromptText.textContent = hs.prompt;

    el.hotspotDrawer.classList.remove('hidden');
  }

  function renderCalibratorFields() {
    if (!state.calibrating) return;
    const hs = currentHotspot();
    const hasHs = Boolean(hs);
    el.calibratorForm.classList.toggle('hidden', !hasHs);
    el.deleteHotspotBtn.disabled = !hasHs;
    if (!hs) return;

    el.calX.value = hs.x;
    el.calY.value = hs.y;
    el.calCat.value = hs.category;
    el.calTitle.value = hs.title;
    el.calNote.value = hs.note;
    el.calPrompt.value = hs.prompt || '';
  }

  function renderStepNav() {
    el.prevBtn.disabled = state.stepIndex === 0;
    const isLast = state.stepIndex === state.scenes.length - 1;
    el.nextBtn.disabled = isLast;
    el.nextBtn.textContent = isLast ? 'Fin ✓' : 'Siguiente →';

    el.stepDots.innerHTML = '';
    state.scenes.forEach((sc, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'step-dot';
      if (idx === state.stepIndex) dot.classList.add('active');
      else if (state.visited.has(idx)) dot.classList.add('visited');
      dot.textContent = String(idx + 1);
      dot.title = `${sc.time} — ${sc.title}`;
      dot.addEventListener('click', () => {
        state.stepIndex = idx;
        state.drawerOpen = false;
        renderStory();
      });
      el.stepDots.appendChild(dot);
    });
  }

  function eventToPercent(e) {
    const rect = el.sceneFrame.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.round(Math.min(96, Math.max(4, rawX)) * 10) / 10,
      y: Math.round(Math.min(96, Math.max(4, rawY)) * 10) / 10
    };
  }

  // Event listeners
  el.startCaseBtn.addEventListener('click', () => startActivity(null));

  el.syncScheduleChk.addEventListener('change', () => {
    el.syncTimeRow.classList.toggle('hidden', !el.syncScheduleChk.checked);
  });

  el.dismissAlarmBtn.addEventListener('click', () => {
    el.alarmBanner.classList.add('hidden');
  });

  el.closeDrawerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.drawerOpen = false;
    renderHotspots();
    renderHotspotDrawer();
  });

  el.hotspotDrawer.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  el.sceneFrame.addEventListener('click', (e) => {
    if (!state.calibrating) {
      if (state.drawerOpen) {
        state.drawerOpen = false;
        renderHotspots();
        renderHotspotDrawer();
      }
      return;
    }

    const coords = eventToPercent(e);
    const sc = currentScene();

    if (el.clickAddsNewChk.checked || sc.hotspots.length === 0) {
      const newHs = {
        id: `s${sc.id}-h${Date.now()}`,
        x: coords.x,
        y: coords.y,
        category: 'decision',
        title: 'Nueva pista',
        note: 'Contexto e impacto en el tiempo, presupuesto o rutina de Mateo.',
        prompt: '¿Qué dificultad o alternativa realista identifica el equipo aquí?'
      };
      sc.hotspots.push(newHs);
      state.selectedHotspotId = newHs.id;
      showToast(`Punto creado en (${coords.x}%, ${coords.y}%)`);
    } else {
      const hs = currentHotspot();
      if (hs) {
        hs.x = coords.x;
        hs.y = coords.y;
        showToast(`Coordenadas actualizadas: (${coords.x}%, ${coords.y}%)`);
      }
    }

    saveScenes();
    renderHotspots();
    renderHotspotDrawer();
    renderCalibratorFields();
  });

  const updateSelectedHotspot = (updater) => {
    const hs = currentHotspot();
    if (!hs) return;
    updater(hs);
    saveScenes();
    renderHotspots();
    renderHotspotDrawer();
  };

  el.calX.addEventListener('input', () => {
    const val = parseFloat(el.calX.value);
    if (!Number.isNaN(val)) {
      updateSelectedHotspot((h) => { h.x = Math.min(100, Math.max(0, val)); });
    }
  });

  el.calY.addEventListener('input', () => {
    const val = parseFloat(el.calY.value);
    if (!Number.isNaN(val)) {
      updateSelectedHotspot((h) => { h.y = Math.min(100, Math.max(0, val)); });
    }
  });

  el.calCat.addEventListener('change', () => {
    updateSelectedHotspot((h) => { h.category = el.calCat.value; });
  });

  el.calTitle.addEventListener('input', () => {
    updateSelectedHotspot((h) => { h.title = el.calTitle.value; });
  });

  el.calNote.addEventListener('input', () => {
    updateSelectedHotspot((h) => { h.note = el.calNote.value; });
  });

  el.calPrompt.addEventListener('input', () => {
    updateSelectedHotspot((h) => { h.prompt = el.calPrompt.value; });
  });

  el.addHotspotBtn.addEventListener('click', () => {
    const sc = currentScene();
    const newHs = {
      id: `s${sc.id}-h${Date.now()}`,
      x: 50,
      y: 50,
      category: 'tiempo',
      title: 'Nueva pista',
      note: 'Describe el contexto y el impacto en Mateo.',
      prompt: 'Pregunta breve para el debate en equipo.'
    };
    sc.hotspots.push(newHs);
    state.selectedHotspotId = newHs.id;
    saveScenes();
    renderHotspots();
    renderHotspotDrawer();
    renderCalibratorFields();
    showToast('Punto agregado al centro (50%, 50%)');
  });

  el.deleteHotspotBtn.addEventListener('click', () => {
    const sc = currentScene();
    const hs = currentHotspot();
    if (!hs) return;
    sc.hotspots = sc.hotspots.filter((item) => item.id !== hs.id);
    state.selectedHotspotId = sc.hotspots[0] ? sc.hotspots[0].id : null;
    saveScenes();
    renderHotspots();
    renderHotspotDrawer();
    renderCalibratorFields();
    showToast('Punto eliminado');
  });

  el.copyJsonBtn.addEventListener('click', async () => {
    const json = JSON.stringify(state.scenes, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      showToast('JSON de viñetas y coordenadas copiado');
    } catch (_) {
      showToast('No se pudo copiar automáticamente');
    }
  });

  el.resetHotspotsBtn.addEventListener('click', () => {
    state.scenes = deepClone(window.DEFAULT_SCENES);
    state.selectedHotspotId = null;
    saveScenes();
    renderStory();
    showToast('Coordenadas restauradas a valores base');
  });

  el.prevBtn.addEventListener('click', () => {
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
      state.drawerOpen = false;
      renderStory();
    }
  });

  el.nextBtn.addEventListener('click', () => {
    if (state.stepIndex < state.scenes.length - 1) {
      state.stepIndex += 1;
      state.drawerOpen = false;
      renderStory();
    }
  });

  el.calibrateToggleBtn.addEventListener('click', () => {
    state.calibrating = !state.calibrating;
    renderStory();
  });

  document.addEventListener('keydown', (e) => {
    if (!state.started) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowRight' && state.stepIndex < state.scenes.length - 1) {
      state.stepIndex += 1;
      state.drawerOpen = false;
      renderStory();
    } else if (e.key === 'ArrowLeft' && state.stepIndex > 0) {
      state.stepIndex -= 1;
      state.drawerOpen = false;
      renderStory();
    } else if (e.key === 'Escape' && state.drawerOpen) {
      state.drawerOpen = false;
      renderHotspots();
      renderHotspotDrawer();
    }
  });

  // Init: support ?inicio=HH:MM URL parameter for instant clock sync across devices
  const params = new URLSearchParams(window.location.search);
  const urlStart = params.get('inicio');
  if (urlStart && /^\d{1,2}:\d{2}$/.test(urlStart)) {
    el.syncScheduleChk.checked = true;
    el.syncStartInput.value = urlStart.padStart(5, '0');
    el.syncTimeRow.classList.remove('hidden');
  } else if (isInsideDefaultWorkshopWindow(new Date())) {
    el.syncScheduleChk.checked = true;
    el.syncStartInput.value = '09:50';
    el.syncTimeRow.classList.remove('hidden');
  }

  tickClockAndTimer();
  setInterval(tickClockAndTimer, 1000);
})();
