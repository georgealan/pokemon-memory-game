function createCards() { // will be in the function initGame()
    const randomNumbers = generateRandomNumbers(904, 15);

    for(var i = 0; i < 15; i++) {
        const card = document.createElement('div');
        const imgFront = document.createElement('img');
        const imgBack = document.createElement('img');
    
        card.setAttribute('id', 'card-'+i);
        card.setAttribute('class', 'card');
    
        // imgFront.setAttribute('id', 'front-face-'+i);
        imgFront.setAttribute('class', 'front-face');
        imgFront.setAttribute('src', 'assets/images/pokemons/pokemon-' + randomNumbers[i] + '.png');
        imgFront.setAttribute('alt', 'Image card front view');
        
        // imgBack.setAttribute('id', 'back-face-'+i);
        imgBack.setAttribute('class', 'back-face');
        imgBack.setAttribute('src', 'assets/images/Back-Card.jpg');
        imgBack.setAttribute('alt', 'Image card back view');
    
        // Insert html elements in the DOM
        document.getElementById('board-game').append(card);
        document.getElementById('card-'+i).append(imgFront);
        document.getElementById('card-'+i).append(imgBack);
    
        // Cloning the div element for duplicate the deck, with that will have 2 equal cards.
        const node = document.getElementById('card-'+i);
        const clone = node.cloneNode(card);
        document.getElementById('board-game').appendChild(clone);
    }

    const cards = document.querySelectorAll('.card'); // Selecting all divs with class name .card
    cards.forEach(card => card.addEventListener('click', flipCard)); // Event listener that know when one of all divs receive an click
    flipCardSound(cards); // When click in a card play the flipcard sound effect.
    shuffleCards(cards); // Sort all cards in an aleatory way
}

createCards();

let hasFlippedCard = false;
let firstCard, secondCard;
let disableDecks = false;
let matchedCard = 0;

// Generate unique ramdom numbers, without repeat any number, using Set().
function generateRandomNumbers(limit, expectedNumbers) {
    const uniqueNumbers = new Set();

    do {
        uniqueNumbers.add(Math.floor(Math.random() * limit));
    } while (uniqueNumbers.size < expectedNumbers);

    return Array.from(uniqueNumbers);
}

function flipCard() {
    if (disableDecks) return; // Lock the board for nothing alow many clicks.
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // First Click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // Second click
    secondCard = this;
    matchCards(firstCard.id, secondCard.id);
}

function matchCards(firstCardId, secondCardId) {
    if(firstCardId === secondCardId) {
        matchedCard++;

        if(matchedCard == 15) {
            setTimeout(() => {
                replaceAllCards();
            }, 1500);
        }

        disableCards();

    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    disableDecks = true;

    setTimeout(() => {
        wrongMatchSound(); // Play sound wrong effect.
        firstCard.classList.add('shake'); 
        secondCard.classList.add('shake');
    }, 400);

    setTimeout(() => {
        firstCard.classList.remove('shake', 'flip');
        secondCard.classList.remove('shake', 'flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, disableDecks] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffleCards(cards) {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 15);
        card.style.order = randomPos;
    });
}

function replaceAllCards() {
    const parentNode = document.getElementById('board-game');
    let child = parentNode.lastElementChild;

    while (child) {
        parentNode.removeChild(child);
        child = parentNode.lastElementChild;
    }

    matchedCard = 0;
    createCards();
}

// Sound Effects
function flipCardSound(cards) {
    const audio = new Audio('assets/sounds/sound-effects/cardflip-sound.mp3');
    cards.forEach(card => card.addEventListener('click', () => {
        audio.play();
    }));
}

function wrongMatchSound() {
    const audio = new Audio('assets/sounds/sound-effects/wrong-sound.mp3');
    audio.play();
}

function setSound() {
    const randomNumbers = generateRandomNumbers(26, 26);
    const audio = document.createElement('audio');

    let path = 'assets/sounds/game-soundtrack/soundtrack-' + 
        randomNumbers[Math.floor(Math.random() * randomNumbers.length)] + '.mp3';
    
    audio.setAttribute('src', path);
    audio.setAttribute('type', 'audio/mp3');
    audio.setAttribute('id', 'soundtrack');

    document.body.append(audio);
    audio.autoplay = true;
    audio.controls = false;
    audio.volume = 0.4;

    waitSoundEnd(audio);
}

function removeSound() {
    const oldAudio = document.getElementById('soundtrack');
    oldAudio.remove();

    setSound();
}

function waitSoundEnd(audio) {
    audio.addEventListener('ended', removeSound, false);
}

// Here is where the soundtrack starts playing.
setSound();
