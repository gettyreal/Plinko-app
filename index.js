//prende tutti i menu a tendina
const dropdowns = document.querySelectorAll('.dropdown');

//loop di tutti gli elementi
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    //event listner per select
    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    // Loop di tutte le opzioni del menu
    options.forEach(option => {
        option.addEventListener('click', () => {
            // cambia il sesto di select
            selected.innerText = option.innerText;

            // rimuove i "clicked"
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            // rimuove active da tutte le opzioni
            options.forEach(option => {
                option.classList.remove('active');
            });

            // aggiunge active alla selezionata
            option.classList.add('active');
            changeMultipliers();
        });
    });
});

//mostra l'opzione number of games
document.getElementById('check').addEventListener('change', function () {
    const numbercontainer = document.getElementById('number');

    if (this.checked) {
        numbercontainer.style.display = 'block';
    } else {
        numbercontainer.style.display = 'none';
    }
});


function play() {

    let randomWin = Math.floor(Math.random() * 10000) + 1;
    console.log(randomWin);

    if (randomWin < 10) { //scelta migliore
        console.log("1000 X");
    } else if (randomWin < 70) {
        console.log("130 X");
    } else if (randomWin < 300) {
        console.log("26 X");
    } else if (randomWin < 900) {
        console.log("9 X");
    } else if (randomWin < 2000) {
        console.log("4 X");
    } else if (randomWin < 5000) {
        console.log("2 X");
    } else { //scelta peggiore
        console.log("0.2 X");
    }
}

const betInput = document.getElementById("betInput");

function halfBet() {
    betInput.value = (parseFloat(betInput.value) / 2).toFixed(2);
    if (betInput.value < 0.1) betInput.value = 0;
}

function doubleBet() {
    betInput.value = (parseFloat(betInput.value) * 2).toFixed(2);
    if (betInput.value < 0.1) betInput.value = 0;
}

function betFixed() {
    betInput.value = Number(betInput.value).toFixed(2);
    if (betInput.value < 0.1) betInput.value = 0;
    else if (betInput.value > 1000) betInput.value = 1000;
}

const riskSelectLow = document.getElementById("riskSelectLow");
const riskSelectMedium = document.getElementById("riskSelectMedium");
const riskSelectHigh = document.getElementById("riskSelectHigh");
const multipliers = document.querySelectorAll(".multiplier");
const multiplierLow = ["25", "18", "10x", "4x", "2x", "1x", "0.5x", "0.5x", "0.5x", "0.5x", "0.5x", "1x", "2x", "4x", "10x", "18", "25"];
const multiplierMedium = ["100", "43", "10x", "6x", "3x", "1.5x", "0.3x", "0.3x", "0.3x", "0.3x", "0.3x", "1.5x", "3x", "6x", "10x", "43", "100"];
const multiplierHigh = ["1000", "130", "26x", "9x", "4x", "2x", "0.2x", "0.2x", "0.2x", "0.2x", "0.2x", "2x", "4x", "9x", "26x", "130", "1000"];

function changeMultipliers() {
    multipliers.forEach(mul => mul.style.animation = "disappearDown 0.1s ease forwards");
    setTimeout(() => {
        if (riskSelectLow.classList.contains("active")) {
            for (let i = 0; i < 17; i++)
                multipliers[i].textContent = multiplierLow[i];
        }
        else if (riskSelectMedium.classList.contains("active")) {
            for (let i = 0; i < 17; i++)
                multipliers[i].textContent = multiplierMedium[i];
        }
        else if (riskSelectHigh.classList.contains("active")) {
            for (let i = 0; i < 17; i++)
                multipliers[i].textContent = multiplierHigh[i];
        }
        multipliers.forEach(mul => mul.style.animation = "enterUp 0.4s ease forwards");
    }, 100);
}