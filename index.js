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
        if (activeBalls == 0) {
            select.classList.toggle('select-clicked');
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        } else {
            alert("cannot modify multiplier");
        }
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

const gameAutoCheck = document.getElementById('check');

//mostra l'opzione number of games
gameAutoCheck.addEventListener('change', function () {
    const numbercontainer = document.getElementById('number');

    if (this.checked) {
        numbercontainer.style.display = 'block';
    } else {
        numbercontainer.style.display = 'none';
    }
});

const walletBalance = document.getElementById("walletBalance"); //soldi nel saldo
const walletBalance2 = document.getElementById("walletBalance2Txt");
let balance = parseFloat(walletBalance.textContent);

const betInput = document.getElementById("betInput"); //import della bet dal html
const gamesInput = document.getElementById("gamesInput"); //import del numero di giochi

const historyDivs = document.querySelectorAll('.historycontent .historydiv'); //import del testo x storia
// come modificare sfondo = historyDivs[0].style.backgroundColor = "#0c4407";
const historyText = document.querySelectorAll('.historycontent .historydiv h4'); //import del testo x storia
// come modificare testo historyText[0].textContent = "2000";

function halfBet() {
    betInput.value = (parseFloat(betInput.value) / 2).toFixed(2);
    if (betInput.value < 0.1) betInput.value = 0;
}

function doubleBet() {
    betInput.value = (parseFloat(betInput.value) * 2).toFixed(2);
    if (betInput.value < 0.1) betInput.value = 0;
}

function allIn() {
    betInput.value = balance;
}

function betFixed() { //max e min per le bet
    betInput.value = Number(betInput.value).toFixed(2);
    if (betInput.value < 0.1) betInput.value = 0;
    else if (betInput.value > 1000) betInput.value = 1000;
}

const riskSelectLow = document.getElementById("riskSelectLow");
const riskSelectMedium = document.getElementById("riskSelectMedium");
const riskSelectHigh = document.getElementById("riskSelectHigh");
const multipliers = document.querySelectorAll(".multiplier");
const multiplierLow = ["25", "18", "10x", "4x", "2x", "1x", "0.5x", "0.5x", "0.5x", "0.5x", "0.5x", "1x", "2x", "4x", "10x", "18", "25", "1x"];
const multiplierMedium = ["100", "43", "10x", "6x", "3x", "1.5x", "0.3x", "0.3x", "0.3x", "0.3x", "0.3x", "1.5x", "3x", "6x", "10x", "43", "100", "1x"];
const multiplierHigh = ["1000", "130", "26x", "9x", "4x", "2x", "0.2x", "0.2x", "0.2x", "0.2x", "0.2x", "2x", "4x", "9x", "26x", "130", "1000", "1x"];


//per ora la lasciamo stare =)
function changeMultipliers() {
    //multipliers.forEach(mul => mul.classList.add("winDisappearence"));
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
        /*multipliers.forEach(mul => {
            mul.classList.remove("winDisappearence");
            mul.classList.add("winAppearence");
        }); */
    }, 100);
    /*setTimeout(multipliers.forEach(mul => {
        mul.classList.remove("winAppearence");
    }), 100); */
}


//game physics

// Importa oggetti da Matter.js
const { Engine, Render, Runner, Bodies, Composite, Events, Body } = Matter;

// Crea un motore fisico
const engine = Engine.create();
const world = engine.world;

//diminuire la gravita //getty pc 0,35 others 0,55
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
const ground = Bodies.rectangle(482, 750, 3000, 1, { isStatic: true, render: { fillStyle: '#373c44' } });
const leftWall = Bodies.rectangle(0, 350, 0, 700, { isStatic: true, render: { fillStyle: '#373c44' } });
const rightWall = Bodies.rectangle(964, 350, 0, 700, { isStatic: true, render: { fillStyle: '#373c44' } });
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
        const peg = Bodies.circle(x, y, pegRadius, { isStatic: true, render: { fillStyle: '#F6E9E9' } });
        pegs.push(peg);
    }
    wallDistrance -= 28;
}

// Aggiungi i pioli al mondo
Composite.add(world, pegs);

let activeBalls = 0; //numero delle palle in gioco

// Funzione per creare una nuova pallina
//campo di caduta: 280-360
function createBall() {
    activeBalls++; //ogni volta che si aggiunge una pallina si aiumenta il counter
    balance -= betInput.value; //modifica del saldo
    walletBalance.textContent = (balance).toFixed(2);
    walletBalance2.textContent = (balance).toFixed(2);

    let randomX = Math.floor(Math.random() * (544 - 420 + 1)) + 420;
    if (randomX == 426 || randomX == 454 || randomX == 482 || randomX == 510 || randomX == 538) {
        randomX += 1; //slitta di 1px per non lasciarla droppare li
    }
    const ball = Bodies.circle(randomX, 0, 11, {
        restitution: 1,  // Rimbalzo
        render: { fillStyle: '#4ae745' },
        collisionFilter: {
            category: ballCategory,
            mask: pegCategory | wallCategory
        },
        value: betInput.value
    });
    Composite.add(world, ball);
}

// Aggiungi un nuovo evento per aggiungere una pallina cliccando
document.getElementById('playbutton').addEventListener('click', () => {
    if (betInput.value == 0) { //check in anticipo se il bet ammunt non e' stato riempito.
        alert("bet amount not valid");
        return;
    }

    if (gameAutoCheck.checked) {
        if (betInput.value * gamesInput.value <= balance) { //check se il totale giocato non sia piu alto del balance + se non ci siano ancora palline in gioco.
            repeatCreateBall(parseInt(gamesInput.value)); //creazione in ripetizione di tot palline
        } else {
            alert("Bet amount or number of games exceeds your balance");
        }
    } else {
        if (betInput.value <= balance) { //check se il totale giocato non sia piu alto del balance
            createBall(); // creazione di una pallina
        } else {
            alert("Bet amount exceeds your balance");
        }
    }
});

function repeatCreateBall(times) { //ripete creazione pallina
    if (times > 0) {
        createBall();
        setTimeout(() => {
            repeatCreateBall(times - 1);
        }, 100); //ripeti creazione ogni 300 millisecondi
    }
}

// Avvia il motore
Matter.Runner.run(engine);
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
            activeBalls--; //ogni volta che una pallina scompare dal gioco si diminuisce il counter
            win(ballX, ball);
        }
    });
});

function win(ballX, ball) {
    // casi di caduta
    if (ballX > 12 && ballX < 56) {
        winReward(0, ball);
    } else if (ballX > 68 && ballX < 112) {
        winReward(1, ball);
    } else if (ballX > 124 && ballX < 168) {
        winReward(2, ball);
    } else if (ballX > 180 && ballX < 224) {
        winReward(3, ball);
    } else if (ballX > 236 && ballX < 280) {
        winReward(4, ball);
    } else if (ballX > 292 && ballX < 336) {
        winReward(5, ball);
    } else if (ballX > 348 && ballX < 392) {
        winReward(6, ball);
    } else if (ballX > 404 && ballX < 448) {
        winReward(7, ball);
    } else if (ballX > 460 && ballX < 504) {
        winReward(8, ball);
    } else if (ballX > 516 && ballX < 560) {
        winReward(9, ball);
    } else if (ballX > 572 && ballX < 616) {
        winReward(10, ball);
    } else if (ballX > 628 && ballX < 672) {
        winReward(11, ball);
    } else if (ballX > 684 && ballX < 728) {
        winReward(12, ball);
    } else if (ballX > 740 && ballX < 784) {
        winReward(13, ball);
    } else if (ballX > 796 && ballX < 840) {
        winReward(14, ball);
    } else if (ballX > 852 && ballX < 896) {
        winReward(15, ball);
    } else if (ballX > 908 && ballX < 952) {
        winReward(16, ball);
    } else { //se la pallina cade al suolo fuori dalle vincite
        winReward(17, ball); //17 non da nulla e assegna multiplier a 1;
    }

    setTimeout(() => {
        multipliers.forEach(mul => {
            if (mul.classList.contains('animateWin')) {
                mul.classList.remove('animateWin');
            }
        });
    }, 150); // Durata dell'animazione in millisecondi
}

function winReward(typeDiv, ball) {
    if (typeDiv != 17) {
        multipliers[typeDiv].classList.add('animateWin'); //animazione della vincita
    }
    // assegnazione della vincita
    if (riskSelectLow.classList.contains("active"))
        balance += ball.value * parseFloat(multiplierLow[typeDiv]);

    else if (riskSelectMedium.classList.contains("active"))
        balance += ball.value * parseFloat(multiplierMedium[typeDiv]);

    else if (riskSelectHigh.classList.contains("active"))
        balance += ball.value * parseFloat(multiplierHigh[typeDiv]);
    balance = parseFloat(balance.toFixed(2));
    walletBalance.textContent = (balance).toFixed(2);
    walletBalance2.textContent = (balance).toFixed(2);

    historyChange(typeDiv);
}

const backrounds = ["#0c4407", "#084f09", "#09580b", "#036704", "#157811", "#168118", "#359b2c",
    "#359b2c", "#359b2c", "#359b2c", "#359b2c", "#168118", "#157811", "#036704", "#09580b", "#0c4407", "#084f09"]; //array dei colori per ogni casella

function historyChange(typeDiv) {
    if (typeDiv == 17) {
        return;
    }

    let container = document.createElement("div");
    container.classList.add("superHistoryDiv");
    container.innerHTML = `
    <div class="historyDiv" style="background: ${backrounds[typeDiv]}">
        <h4 id="history">${changeHistoryText(typeDiv)}</h4>
    </div>
    `;
    document.querySelectorAll(".superHistoryDiv").forEach(A => {
        A.style.animation = "none !important";
    })
    setTimeout(() => {
        document.querySelectorAll(".superHistoryDiv").forEach(A => {
            A.classList.add("histMoveAnim");
        })
    }, 10);
    setTimeout(() => {
        historyContainer.appendChild(container);
        // Remove the oldest container if there are more than 7
        if (historyContainer.children.length > 6) {
            historyContainer.removeChild(historyContainer.firstChild);
        }
        document.querySelectorAll(".olds").forEach(A => {
            A.classList.remove("histMoveAnim");
            A.style.transform = "translateY(0)";
            A.style.animation = "none";
        })
    }, 150);
    document.querySelectorAll(".superHistoryDiv").forEach(A => A.classList.add("olds"));
}

function changeHistoryText(typediv) {
    if (riskSelectLow.classList.contains("active")) {
        return multiplierLow[typediv];
    }
    else if (riskSelectMedium.classList.contains("active")) {
        return multiplierMedium[typediv];
    }
    else if (riskSelectHigh.classList.contains("active")) {
        return multiplierHigh[typediv];
    }
}


const blurOverlay = document.getElementById("blurOverlay");
const walletBox = document.getElementById("walletBox");
const amounts = document.querySelectorAll(".amountBtn");
const buyInBtn = document.getElementById("buyInBtn");
let buyAmo = 0;

function toggleWalletBox() {
    if (walletBox.classList.contains("HIDDEN")) {
        // SHOW WALLETBOX
        walletBox.classList.remove("HIDDEN");
        blurOverlay.classList.remove("HIDDEN");
    }
    else {
        // HIDE WALLETBOX
        walletBox.style.animation = "none";
        setTimeout(() => {
            walletBox.style.animation = "walletBoxEnter 0.4s reverse";
        }, 1);
        setTimeout(() => {
            walletBox.classList.add("HIDDEN");
            blurOverlay.classList.add("HIDDEN");
            amounts.forEach(amo => amo.classList.remove("selectedAmount")); // deselect recharge amount
            buyInBtn.classList.add("disabledBuyBtn"); // disable buy btn as there's no amount selected now
            walletBox.style.animation = "walletBoxEnter 0.4s ease forwards";
        }, 410);
    }
}

function selectAmount(idx, amount) {
    amounts.forEach(amo => amo.classList.remove("selectedAmount"));
    amounts[idx].classList.add("selectedAmount");
    buyAmo = amount;
    if (buyAmo != 0) {
        buyInBtn.classList.remove("disabledBuyBtn");
    }
    else {
        buyInBtn.classList.add("buyInBtn");
    }
}

function buyIn() {
    event.preventDefault();
    if (buyInBtn.classList.contains("disabledBuyBtn") || !document.getElementById("cardOwner").value || !document.getElementById("cardNumber").value || !document.getElementById("expMonth").value || !document.getElementById("expYear").value || !document.getElementById("CVC").value)
        return;
    else {
        balance += buyAmo;
        walletBalance.textContent = balance.toFixed(2);
        walletBalance2.textContent = balance.toFixed(2);
    }
}