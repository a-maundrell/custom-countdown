'use strict';

const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const titleEl = document.getElementById('title');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// SET DATE INPUT MIN WITH TODAY'S DATE
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);
// dateEl.value = today;

function updateDOM() {
  countdownActive = setInterval(() => {
  const now = new Date().getTime();
  const distance = countdownValue - now;

  const days = Math.floor(distance / day);
  const hours = Math.floor((distance % day) / hour);
  const minutes = Math.floor((distance % hour) / minute);
  const seconds = Math.floor((distance % minute) / second);

  inputContainer.hidden = true;

  if (distance < 0) {
    countdownEl.hidden = true;
    clearInterval(countdownActive);
    completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
    completeEl.hidden = false;
  } else {
    countdownElTitle.textContent = `${countdownTitle}`;
    timeElements[0].textContent = `${days}`;
    timeElements[1].textContent = `${hours}`;
    timeElements[2].textContent = String(minutes).padStart(2, '0');
    timeElements[3].textContent = String(seconds).padStart(2, '0');
    completeEl.hidden = true;
    countdownEl.hidden = false;
  }
  }, 1000);
}

function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));
  if (countdownDate === '') {
    alert('Please select a date for the countdown.');
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

function reset() {
  clearInterval(countdownActive);
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  countdownTitle = '';
  countdownDate = '';
  dateEl.value = '';
  titleEl.value = '';
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// ON LOAD
restorePreviousCountdown();