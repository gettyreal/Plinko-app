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


//game physics

// Importa oggetti da Matter.js
const { Engine, Render, Runner, Bodies, Composite, Events, Body } = Matter;

// Crea un motore fisico
const engine = Engine.create();
const world = engine.world;

//diminuire la gravita
engine.world.gravity.y = 0.55;

// Crea il rendering della scena
const canvas = document.getElementById('plinkoCanvas');
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 964,
        height: 750,
        wireframes: false, // Disegna oggetti con riempimento solido
        background: '#373c44'
    }
});

//categorie
let pegCategory = 0x0002;
let wallCategory = 0x0003;
let ballCategory = 0x004;

// Aggiungi il terreno e i bordi laterali
const ground = Bodies.rectangle(482, 750, 964, 1, { isStatic: true, render: { fillStyle: '#373c44' }});
const leftWall = Bodies.rectangle(0, 350, 1, 700, { isStatic: true, render: { fillStyle: '#373c44' }});
const rightWall = Bodies.rectangle(964, 350, 1, 700, { isStatic: true, render: { fillStyle: '#373c44'}});
Composite.add(world, [ground, leftWall, rightWall]);

// Crea un array di pioli
const pegRadius = 6;
const pegs = [];

// Definisci la piramide di pioli con 14 righe, partendo da 3 e finendo con 18
const startCols = 3; // Numero di pioli nella prima riga
const rows = 16; // Numero totale di righe
const rowSpacing = 45; // Spaziatura verticale tra le righe
let wallDistrance = 420;
// Genera i pioli in un layout piramidale centrato
for (let row = 0; row < rows; row++) {
    const numCols = startCols + row; // Aggiungi un piolo in più per ogni riga
    xSpacing = 56; // Spaziatura uniforme tra i pioli

    for (let col = 0; col < numCols; col++) {
        const x = - 50 + wallDistrance + xSpacing * (col + 1); // Posiziona i pioli in modo centrato
        const y = 50 + row * rowSpacing; // Posiziona i pioli verticalmente con spaziatura uniforme
        const peg = Bodies.circle(x, y, pegRadius, { isStatic: true, render: { fillStyle: '#F6E9E9' }});
        pegs.push(peg);
    }
    wallDistrance -= 28;
}

// Aggiungi i pioli al mondo
Composite.add(world, pegs);

// Funzione per creare una nuova pallina
//campo di caduta: 280-360
function createBall() {
    const randomX = Math.floor(Math.random() * (544 - 420 + 1)) + 420;
    if (randomX == 426 || randomX == 454|| randomX == 482 || randomX == 510|| randomX == 538) {
        randomX += 1; //slitta di 1px per non lasciarla droppare li
    }
    const ball = Bodies.circle(randomX, 0, 11, {
        restitution: 0.9,  // Rimbalzo
        render: { fillStyle: '#D7263D' },
        collisionFilter: {
            category: ballCategory,
            mask: pegCategory | wallCategory
        }
    });
    Composite.add(world, ball);
    return ball;
}

// Aggiungi un nuovo evento per aggiungere una pallina cliccando
document.getElementById('playbutton').addEventListener('click', () => {
    createBall();
});

// Avvia il motore
Engine.run(engine);
Render.run(render);

// Avvia il loop di aggiornamento fisico
const runner = Runner.create();
Runner.run(runner, engine);

// Controllo delle collisioni e interazione con il terreno
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        // Se una pallina colpisce il terreno, la rimuoviamo
        if (bodyA === ground || bodyB === ground) {
            const ball = bodyA === ground ? bodyB : bodyA;
            Composite.remove(world, ball); //rimuovi pallina
            const ballX = ball.position.x;
            animateDiv(ballX);
        }
    });
});

function animateDiv(ballX) {
    if (ballX > 12 && ballX < 62) {
        multipliers[0].classList.add('animate');
    } else if (ballX > 74 && ballX < 124) 

    //finire animazioni alla caduta

    setTimeout(() => {
        multipliers.forEach(mul => {
            if (mul.classList.contains('animate')) {
                mul.classList.remove('animate');
            }
        });
    }, 250); // Durata dell'animazione in millisecondi
}
