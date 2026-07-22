(() => {
  const STORAGE_KEY = 'simple-alarm.alarms';
  const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

  const clockEl = document.getElementById('clock');
  const timeInput = document.getElementById('alarmTime');
  const labelInput = document.getElementById('alarmLabel');
  const dayButtons = Array.from(document.querySelectorAll('.day-btn'));
  const addBtn = document.getElementById('addBtn');
  const listEl = document.getElementById('alarmList');
  const emptyMsg = document.getElementById('emptyMsg');

  const overlay = document.getElementById('ringingOverlay');
  const ringingTime = document.getElementById('ringingTime');
  const ringingLabel = document.getElementById('ringingLabel');
  const snoozeBtn = document.getElementById('snoozeBtn');
  const stopBtn = document.getElementById('stopBtn');

  let selectedDays = new Set();
  let alarms = loadAlarms();
  let ringingAlarm = null;
  let lastCheckedMinute = null;

  let audioCtx = null;
  let beepTimer = null;

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  function loadAlarms() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAlarms() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }

  function uid() {
    return 'a' + Math.random().toString(36).slice(2, 10);
  }

  dayButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const day = Number(btn.dataset.day);
      if (selectedDays.has(day)) {
        selectedDays.delete(day);
        btn.classList.remove('active');
      } else {
        selectedDays.add(day);
        btn.classList.add('active');
      }
    });
  });

  addBtn.addEventListener('click', () => {
    if (!timeInput.value) {
      timeInput.focus();
      return;
    }
    const alarm = {
      id: uid(),
      time: timeInput.value,
      label: labelInput.value.trim(),
      days: Array.from(selectedDays).sort(),
      enabled: true,
      lastTriggeredKey: null,
    };
    alarms.push(alarm);
    sortAlarms();
    saveAlarms();
    renderAlarms();

    timeInput.value = '';
    labelInput.value = '';
    selectedDays.clear();
    dayButtons.forEach((b) => b.classList.remove('active'));
  });

  function sortAlarms() {
    alarms.sort((a, b) => a.time.localeCompare(b.time));
  }

  function formatMeta(alarm) {
    if (alarm.days.length === 0) {
      return alarm.label ? `${alarm.label} · 한 번만` : '한 번만';
    }
    const days = alarm.days.map((d) => DAY_LABELS[d]).join(' ');
    return alarm.label ? `${alarm.label} · ${days}` : days;
  }

  function renderAlarms() {
    listEl.innerHTML = '';
    emptyMsg.classList.toggle('show', alarms.length === 0);

    alarms.forEach((alarm) => {
      const li = document.createElement('li');
      li.className = 'alarm-item' + (alarm.enabled ? '' : ' disabled');

      const main = document.createElement('div');
      main.className = 'alarm-main';

      const timeEl = document.createElement('div');
      timeEl.className = 'alarm-time';
      timeEl.textContent = alarm.time;

      const metaEl = document.createElement('div');
      metaEl.className = 'alarm-meta';
      metaEl.textContent = formatMeta(alarm);

      main.appendChild(timeEl);
      main.appendChild(metaEl);

      const actions = document.createElement('div');
      actions.className = 'alarm-actions';

      const switchLabel = document.createElement('label');
      switchLabel.className = 'switch';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = alarm.enabled;
      checkbox.addEventListener('change', () => {
        alarm.enabled = checkbox.checked;
        saveAlarms();
        renderAlarms();
      });
      const slider = document.createElement('span');
      slider.className = 'slider';
      switchLabel.appendChild(checkbox);
      switchLabel.appendChild(slider);

      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = '삭제';
      delBtn.addEventListener('click', () => {
        alarms = alarms.filter((a) => a.id !== alarm.id);
        saveAlarms();
        renderAlarms();
      });

      actions.appendChild(switchLabel);
      actions.appendChild(delBtn);

      li.appendChild(main);
      li.appendChild(actions);
      listEl.appendChild(li);
    });
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tickClock() {
    const now = new Date();
    clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    checkAlarms(now);
  }

  function checkAlarms(now) {
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const currentTime = `${hh}:${mm}`;
    const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${hh}-${mm}`;

    if (minuteKey === lastCheckedMinute) return;
    lastCheckedMinute = minuteKey;

    if (ringingAlarm) return;

    for (const alarm of alarms) {
      if (!alarm.enabled) continue;
      if (alarm.time !== currentTime) continue;
      if (alarm.days.length > 0 && !alarm.days.includes(now.getDay())) continue;
      if (alarm.lastTriggeredKey === minuteKey) continue;

      alarm.lastTriggeredKey = minuteKey;
      if (alarm.days.length === 0) {
        alarm.enabled = false;
      }
      saveAlarms();
      renderAlarms();
      triggerAlarm(alarm);
      break;
    }
  }

  function triggerAlarm(alarm) {
    ringingAlarm = alarm;
    ringingTime.textContent = alarm.time;
    ringingLabel.textContent = alarm.label || '';
    overlay.classList.remove('hidden');
    startBeep();

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('알람', { body: alarm.label || `${alarm.time} 알람이 울리고 있습니다.` });
      } catch (e) {
        /* ignore */
      }
    }
  }

  function startBeep() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const playBeep = () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const t = audioCtx.currentTime;
      gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
      gain.gain.linearRampToValueAtTime(0.0001, t + 0.35);

      osc.start(t);
      osc.stop(t + 0.4);
    };

    playBeep();
    beepTimer = setInterval(playBeep, 700);
  }

  function stopBeep() {
    if (beepTimer) {
      clearInterval(beepTimer);
      beepTimer = null;
    }
  }

  stopBtn.addEventListener('click', () => {
    stopBeep();
    overlay.classList.add('hidden');
    ringingAlarm = null;
    renderAlarms();
  });

  snoozeBtn.addEventListener('click', () => {
    stopBeep();
    overlay.classList.add('hidden');
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    const snoozed = {
      id: uid(),
      time: `${pad(snoozeTime.getHours())}:${pad(snoozeTime.getMinutes())}`,
      label: ringingAlarm ? (ringingAlarm.label ? `${ringingAlarm.label} (스누즈)` : '스누즈') : '스누즈',
      days: [],
      enabled: true,
      lastTriggeredKey: null,
    };
    alarms.push(snoozed);
    sortAlarms();
    saveAlarms();
    renderAlarms();
    ringingAlarm = null;
  });

  renderAlarms();
  tickClock();
  setInterval(tickClock, 1000);
})();
