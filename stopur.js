let startTime;
let interval;
let elapsedTime = 0;

const emneInput = document.getElementById("emneInput");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const latestTime = document.getElementById("latestTime");
const timesList = document.getElementById("timesList");
const sumTime = document.getElementById("sumTime");

function secondsToTimeFormat(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(0)}`;
}

function updateDisplay() {
    let allTimes = JSON.parse(localStorage.getItem("allTimes") || "[]");
    latestTime.textContent = secondsToTimeFormat(parseFloat(localStorage.getItem("latestTime") || "0"));

    let total = 0;
    timesList.innerHTML = '';
    for (let timeObj of allTimes) {
        let listItem = document.createElement('li');
        listItem.textContent = `${timeObj.topic}: ${secondsToTimeFormat(timeObj.time)} (Startede: ${new Date(timeObj.date).toLocaleString()})`;
        timesList.appendChild(listItem);
        total += timeObj.time;
    }
    sumTime.textContent = secondsToTimeFormat(total);
}

function startOrStopTimer() {
    if (startStopBtn.textContent === "Start") {
        startTime = Date.now() - (elapsedTime || 0);
        interval = setInterval(() => {
            elapsedTime = (Date.now() - startTime) / 1000;
            latestTime.textContent = secondsToTimeFormat(elapsedTime);
        }, 100);

        startStopBtn.textContent = "Stop";
    } else {
        clearInterval(interval);
        let allTimes = JSON.parse(localStorage.getItem("allTimes") || "[]");
        allTimes.push({ topic: emneInput.value, time: parseFloat(elapsedTime.toFixed(1)), date: Date.now() });
        localStorage.setItem("allTimes", JSON.stringify(allTimes));
        localStorage.setItem("latestTime", elapsedTime.toFixed(1));
        updateDisplay();
        startStopBtn.textContent = "Start";
    }
}

// Event listeners
startStopBtn.addEventListener("click", startOrStopTimer);
emneInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        startOrStopTimer();
    }
});
resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    elapsedTime = 0;
    latestTime.textContent = '0:00';
    startStopBtn.textContent = "Start";
});

// Init display
updateDisplay();
