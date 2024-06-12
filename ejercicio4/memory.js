class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }
    
    //metodos agregados
    //Para cambiar el estado del volteo de la carta
    toggleFlip() { 
        this.isFlipped = !this.isFlipped;
        this.isFlipped ? this.#flip() : this.#unflip();
    }
    //para verificar si la carta actual coincide con otra carta
    matches(otherCard) {
        return this.name === otherCard.name;
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }

    //metodos agregados
    //Para mezclar las cartas del tablero
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    //Para colocar todas las cartas en su estado inicial de no volteadas u ocultas
    flipDownAllCards() {
        this.cards.forEach(card => card.isFlipped && card.toggleFlip());
    }

    //Para reiniciar el tablero
    reset() {
        this.shuffleCards();
        this.flipDownAllCards();
        this.render();
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;//agregado
        this.startTime = null;//agregado
        this.endTime = null;//agregado
        this.timerInterval = null;//agregado
        this.score = 0;//agregado
        this.timerStarted = false; // Para controla si el temporizador ya empezo

        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
        this.movesElement = document.getElementById("moves-counter");//agregado
        this.timerElement = document.getElementById("timer");//agregado
        this.scoreElement = document.getElementById("score");//agregado

    }

    #handleCardClick(card) {
        //iniciamos el contador de tiempo
        if (!this.timerStarted) {
            this.startTimer();
            this.timerStarted = true;
        }

        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
            this.moves++; //agregado
            this.movesElement.textContent = this.moves;//agregado

        }
    }

    //metodos agregados
    //Para verificar si las cartas volteadas o selleccionadas coinciden
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        if (card1.matches(card2)) {
            this.matchedCards.push(card1, card2);
            this.flippedCards = [];
            if (this.matchedCards.length === this.board.cards.length) {//agregado
                this.endGame();//agregado
            }

        } else {
            setTimeout(() => {
                card1.toggleFlip();
                card2.toggleFlip();
                this.flippedCards = [];
            }, this.flipDuration);
        }
    }
    //agregado
    async startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.startTime;
            this.timerElement.textContent = this.formatTime(elapsedTime);
        }, 1000);
    }
    //agregado
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    //agregado
    stopTimer() {
        clearInterval(this.timerInterval);
        this.endTime = Date.now();
    }
    //agregado
    calculateScore() {
        const elapsedTime = this.endTime - this.startTime;
        const timeScore = Math.max(1, Math.floor(10000 / (elapsedTime / 1000))); // More points for faster times
        const movesScore = Math.max(1, 100 - this.moves); // More points for fewer moves
        this.score = timeScore + movesScore;
        this.scoreElement.textContent = this.score;
    }
    //agregado
    async endGame() {
        this.stopTimer();
        this.calculateScore();

        const winnerMessage = document.createElement("div");
        winnerMessage.className = "winner-message";
        winnerMessage.innerHTML = `
            <p>¡Felicidades, has ganado el juego!</p>
            <p>Tu puntuación es: ${this.score}</p>
        `;
        document.body.appendChild(winnerMessage);



    }
    //para reiniciar el juego
    resetGame() {
        this.board.reset();
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.score = 0;
        this.movesElement.textContent = this.moves;
        this.scoreElement.textContent = this.score;
        clearInterval(this.timerInterval);
        this.timerElement.textContent = "0:00";
        this.timerStarted = false; // Reinicia el temporizador
        const winnerMessage = document.querySelector(".winner-message");
           if (winnerMessage) {
               winnerMessage.remove();
           }

    }

}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        //{ name: "Python", img: "./img/Python.svg" },
        //{ name: "JavaScript", img: "./img/JS.svg" },
        //{ name: "Java", img: "./img/Java.svg" },
        //{ name: "CSharp", img: "./img/CSharp.svg" },
        //{ name: "Go", img: "./img/Go.svg" },
        //{ name: "Ruby", img: "./img/Ruby.svg" },
        { name: "afa", img: "./img/afa.png" },
       // { name: "messi-logo", img: "./img/messi-logo.png" },
       // { name: "messi", img: "./img/messi.png" },
       // { name: "pelota", img: "./img/pelota.png" },
        //{ name: "river", img: "./img/river.png" },
        { name: "river2", img: "./img/river2.png" },
        //{ name: "river3", img: "./img/river3.png" },
        { name: "guerrero", img: "./img/guerrero.png" },
        { name: "cap", img: "./img/cap.png" },

    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
       
    });

    //agregado
    //memoryGame.startTimer();
});
