/////////////////////////////////////
// DOM ELEMENTS
const sessionLength = document.getElementById('session-length');
const breakLength = document.getElementById('break-length');
const startStopButton = document.getElementById('start_stop');
const resetButton = document.getElementById('reset');
const timeLeftDisplay = document.getElementById('time-left');
const timerLabel = document.getElementById('timer-label');
const audio = document.querySelector('audio');

// VARIABLES
let countdown;
let isPaused = true;
const state = {
  sessionMinutes: 25,
  breakMinutes: 5
};

// FUNCTIONS

const init = () => {
  state.sessionMinutes = 25;
  state.breakMinutes = 5;
  sessionLength.textContent = state.sessionMinutes;
  breakLength.textContent = state.breakMinutes;
  timerLabel.textContent = 'Session';
  timeLeftDisplay.textContent = displayTimeLeft(state.sessionMinutes * 60);
};

const updateTimeLengths = (label, operator) => {
  if (label === 'break') {
    if (operator === '+') {
      state.breakMinutes < 60 ? (state.breakMinutes += 1) : state.breakMinutes;
    } else if (operator === '-') {
      state.breakMinutes > 1 ? (state.breakMinutes -= 1) : state.breakMinutes;
    }
  } else {
    if (operator === '+') {
      state.sessionMinutes < 60
        ? (state.sessionMinutes += 1)
        : state.sessionMinutes;
    } else {
      state.sessionMinutes > 1
        ? (state.sessionMinutes -= 1)
        : state.sessionMinutes;
    }
  }
};

const formatTime = time => `${time < 10 ? '0' : ''}${time}`;

const displayTimeLeft = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${formatTime(minutes)}:${formatTime(seconds)}`;
};

const timer = sec => {
  clearInterval(countdown);
  // called not to wait 1s to invoke setInterval
  timeLeftDisplay.textContent = displayTimeLeft(sec);

  const now = Date.now();
  const past = now + sec * 1000;

  countdown = setInterval(() => {
    const secLeft = Math.round((past - Date.now()) / 1000);

    if (secLeft <= 0) {
      clearInterval(countdown);
      audio.currentTime = 0;
      audio.play();
    }
    timeLeftDisplay.textContent = displayTimeLeft(secLeft);
    // if (timeLeftDisplay.textContent === "00:00") {
    //   audio.currentTime = 0;
    //   audio.play();
    // }
  }, 1000);
};

// EVENT LISTENERS

document.addEventListener('click', e => {
  if (!e.target.dataset.change) return;

  const label = e.target.id.split('-')[0];
  const operator = e.target.dataset.change;

  updateTimeLengths(label, operator);
  sessionLength.textContent = state.sessionMinutes;
  breakLength.textContent = state.breakMinutes;
});

startStopButton.addEventListener('click', () => {
  isPaused = !isPaused;
  timer(state.sessionMinutes * 60);
});

resetButton.addEventListener('click', () => {
  // stop the timer
  clearInterval(countdown);
  // give break-length,session-length and time-left default values
  init();
  // play audio
  audio.currentTime = 0;
  audio.pause();
});
