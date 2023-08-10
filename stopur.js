let startTime;
let interval;
let elapsedTime = 0;

const emneInput = document.getElementById("emneInput");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const latestTime = document.getElementById("latestTime");
const timesList = document.getElementById("timesList");
const sumTime = document.getElementById("sumTime");

const updateDisplay = () => {
    let allTimes = JSON.parse(localStorage.getItem("allTimes") || "[]");
    latestTime.textContent = (localStorage.getItem("latestTime") / 60).toFixed(2) || 0;

    // Vis alle tider og opdater sum
    let total = 0;
    timesList.innerHTML = '';
    for(let timeObj of allTimes) {
        let listItem = document.createElement('li');
        listItem.textContent = `${timeObj.topic}: ${timeObj.time} minutter (Startede: ${new Date(timeObj.date).toLocaleString()})`;
        timesList.appendChild(listItem);
        total += timeObj.time;
    }
    sumTime.textContent = (total / 60).toFixed(2);
};

startStopBtn.addEventListener("click", () => {
    if (startStopBtn.textContent === "Start") {
        startTime = Date.now() - (elapsedTime || 0);
        interval = setInterval(() => {
            elapsedTime = (Date.now() - startTime) / 1000;
            latestTime.textContent = (elapsedTime / 60).toFixed(2);
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
});

resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    elapsedTime = 0;
    latestTime.textContent = '0';
    startStopBtn.textContent = "Start";
});

// Init display
updateDisplay();
