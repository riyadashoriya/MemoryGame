'use strict';
let seconds = 0;
let stopTimer = false;

/*
 * Start the timer when window loads. Increase the count by 1 for each second.
 */
window.onload = function() {
  setInterval(() => {
    if (!stopTimer) {
      document.getElementById('timer').innerHTML = seconds++;
    }
  }, 1000);
};

/*
 * Create a list that holds all of your cards
 */
let cards = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube',
 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];
cards = cards.concat(cards);
cards = shuffle(cards); //Shuffle the cards.

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

let cardNumber = 0;

//Display cards on the page
[...document.getElementsByClassName('card')].forEach((element)=> {
  //Add click event listener, so that cards will show when clicked
  element.addEventListener('click', () => {
    cardIsClicked(element)
  });
  //Update the UI after shuffling of cards
  element.children[0].removeAttribute('class');
  element.children[0].setAttribute('class', cards[cardNumber++]);
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let moves = 0, starRating = 3;
let openCard = []; //Contains information about the last openend card, if any.
let matchedCards = []; //Contains a list of cards which matched.

function cardIsClicked(element) {

  //If the clicked element is already a matched one, don't do anything.
  if (element.classList.contains('match')) {
    return;
  }

  //Update the move counter and the display of number of moves.
  updateMoves();

  //Display the card.
  element.classList.add('show', 'open');

  if (openCard.length == 0) {
    openCard.push(element);
  } else {
    //If the previously opened card is same as the current card, add the class 'match'
    //Uses lodash.js to deep compare objects.
    if (_.isEqual(Object.values(openCard[0].children[0].classList), Object.values(element.children[0].classList))) {
      //Both open cards match, lock them in open position.
      cardsMatch(openCard, element);
      openCard = [];
    } else {
      //Else, both open cards don't match. Flip them!
      cardsDontMatch(openCard, element);
      openCard = [];
    }
  }

  //If all the cards have matched
  if (matchedCards.length === 16) {
    setTimeout(() => {
      allCardsMatched();
    }, 200);
  }
}

/*
 * This is called when both the open cards match. This locks the open cards by applying 'match' css class.
 * and adds the cards to matchedCards array.
 */
function cardsMatch(openCard, element) {
  openCard[0].classList.add('match');
  element.classList.add('match');
  openCard[0].classList.remove('show', 'open');
  element.classList.remove('show', 'open');
  matchedCards.push(openCard[0], element);
}

/*
 * This is called when both the open cards do not match.
 * This removes the cards from the "openCards" list and hide the card's symbol
 */
function cardsDontMatch(openCard, element) {
  setTimeout(function() {
    openCard[0].classList.remove('show', 'open');
    element.classList.remove('show', 'open');
  }, 200);
}

/*
 * This function is called when all the cards have matched.
 * A Congratulations modal window is displayed which tells the user how much time it took to win the game,
 * and what the star rating was, along with the number of moves it took.
 */
function allCardsMatched() {
  //Stops the timer once all the cards have matched.
  stopTimer = true;
  //Show the successful modal window.
  $('#modal').modal('toggle');
  document.getElementById('message').innerHTML =
    'Congratulations! You have successfully completed the memory game in ' + seconds + ' seconds with '
    + moves + ' moves. You have a rating of ' + starRating + ' stars.';
}

/*
 * Update the number of moves and change the rating of the star.
 * If number of moves is more than 20, two star rating
 * If number of moves is more than 35, one star rating
 */
function updateMoves() {
  moves++;
  let starElement = document.querySelectorAll('#stars li i');
  if (moves > 35) {
    starElement[1].classList.remove('fa-star');
    starElement[1].classList.add('fa-star-o');
    starRating = 1;
  } else if (moves > 20) {
    starElement[2].classList.remove('fa-star');
    starElement[2].classList.add('fa-star-o');
    starRating = 2;
  }
  //Update the UI with the number of moves.
  document.getElementById('moves').innerHTML = moves;
}

/*
 * Restart functionality.
 */
document.querySelectorAll('.restart').forEach((element) => {
  element.addEventListener('click', function() {
    location.reload();
  });
});
