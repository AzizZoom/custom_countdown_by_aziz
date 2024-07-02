const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate= '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Attribute Min With Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        // Retrive Coundown Data
        const countdownDays = Math.floor(distance / day);
        const countdownHours = Math.floor((distance % day) / hour);
        const countdownMinutes = Math.floor((distance % hour) / minute);
        const countdownSeconds = Math.floor((distance % minute) / second);
        // Hide Input Screen
        inputContainer.hidden = true;
        // If Countdown Is Complete, Show Complete Page
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} Completed On ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${countdownDays}`;
            timeElements[1].textContent = `${countdownHours}`;
            timeElements[2].textContent = `${countdownMinutes}`;
            timeElements[3].textContent = `${countdownSeconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Take Values From Form Input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // Get Number Version Of Current Date, Update DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// Reset Countdown
function reset(e) {
    // Hide Countdown and Show Input Screen
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop Countdown
    clearInterval(countdownActive);
    // Reset Values
    countdownTitle = '';
    countdownDate= '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get Countdown From localStorage If Available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, Check localStorage
restorePreviousCountdown();
