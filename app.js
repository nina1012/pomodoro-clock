// DOM ELEMENTS
const sessionLength = document.getElementById('session-length');
const breakLength = document.getElementById('break-length');
const startStopButton = document.getElementById('start_stop');
const resetButton = document.getElementById('reset');
const timeLeft = document.getElementById('time-left');
const timerLabel = document.getElementById('timer-label');
const audio = document.querySelector('audio');

// VARIABLES
let countdown;
let isPaused = true;
let sessionMinutes = 25;
let breakMinutes = 5;
let resumeTime;
timeLeft.textContent = `${sessionMinutes}:00`;

// FUNCTIONS

// initial settings
const init = () => {
  sessionMinutes = 25;
  breakMinutes = 5;
  sessionLength.textContent = sessionMinutes;
  breakLength.textContent = breakMinutes;
  timerLabel.textContent = 'Session';
  timeLeft.textContent = `${sessionMinutes}:00`;
  isPaused = true;
  audio.currentTime = 0;
  resumeTime = null;
};

// change the length session or break with - and +
const updateTimeLengths = (label, operator) => {
  if (label === 'break') {
    if (operator === '+') {
      breakMinutes < 60 ? (breakMinutes += 1) : breakMinutes;
    } else if (operator === '-') {
      breakMinutes > 1 ? (breakMinutes -= 1) : breakMinutes;
    }
    timeLeft.textContent = `${breakMinutes}:00`;
  } else {
    if (operator === '+') {
      sessionMinutes < 60 ? (sessionMinutes += 1) : sessionMinutes;
    } else {
      sessionMinutes > 1 ? (sessionMinutes -= 1) : sessionMinutes;
    }
    timeLeft.textContent = `${sessionMinutes}:00`;
  }
};

const formatTime = time => `${time < 10 ? '0' : ''}${time}`;

const displayTimeLeft = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${formatTime(minutes)}:${formatTime(seconds)}`;
};

// resume timer from where it was stopped
const resume = (min, sec) => {
  min = +min;
  sec = +sec;
  timer(min * 60 + sec);
};

const timer = sec => {
  clearInterval(countdown);
  // called not to wait 1s to invoke setInterval
  timeLeft.textContent = displayTimeLeft(sec);

  const now = Date.now();
  const past = now + sec * 1000;

  countdown = setInterval(() => {
    const secLeft = Math.round((past - Date.now()) / 1000);

    if (secLeft === 0) {
      clearInterval(countdown);
      audio.currentTime = 0;
      audio.play();

      // when timer reaches 00:00, swap labels
      if (timerLabel.textContent === 'Session') {
        timerLabel.textContent = 'Break';
        timer(breakMinutes * 60);
      } else {
        timerLabel.textContent = 'Session';
        timer(sessionMinutes * 60);
      }
    }
    timeLeft.textContent = displayTimeLeft(secLeft);
  }, 1000);
};

const reset = () => {
  // stop the timer
  clearInterval(countdown);
  // give break-length,session-length and time-left default values
  init();
  // play audio
  audio.currentTime = 0;
  audio.pause();
  timerLabel.textContent = 'Session';
  resumeTime = null;
};
// EVENT LISTENERS

//  buttons for chaning lengths of session or break
document.addEventListener('click', e => {
  if (!e.target.dataset.change) return;

  const label = e.target.id.split('-')[0];
  const operator = e.target.dataset.change;
  updateTimeLengths(label, operator);
  sessionLength.textContent = sessionMinutes;
  breakLength.textContent = breakMinutes;
});

startStopButton.addEventListener('click', () => {
  // these keep track of paused timer
  let min, sec;
  isPaused = !isPaused;
  if (!isPaused) {
    timer(sessionMinutes * 60);
  } else if (resumeTime && isPaused) {
    resumeTime = timeLeft.textContent;
    [min, sec] = resumeTime.split(':');
    resume(min, sec);
  } else if (isPaused) {
    clearInterval(countdown);
    resumeTime = timeLeft.textContent;
    isPaused = false;
  }
});

resetButton.addEventListener('click', reset);
