(function() {
  'use strict';

  var pairs = 6;
  var cards = [];

  var flipCount = 0;
  var firstCard = null;
  var secondCard = null;

  var startTime;
  var isRunning = false;
  var correctCount = 0;
  var timeoutId;
  var lastTime = 0;

  function init() {
    var i;
    var card;
    for (i = 1; i <= pairs; i++) {
      cards.push(createCard(i));
      cards.push(createCard(i));
      // document.getElementById('stage').appendChild(createCard(i));
      // document.getElementById('stage').appendChild(createCard(i));
    }
    while (cards.length) {
      card = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
      document.getElementById('stage').appendChild(card);
    }
  }

  function createCard(num) {
    var container;
    var card;
    var inner;
    inner = '<div class="card-front">' + num + '</div><div class="card-back">?</div>';
    card = document.createElement('div');
    card.innerHTML = inner;
    card.className = 'card';
    card.addEventListener('click', function() {
      flipCard(this);
      if (isRunning === true) {
        return;
      }
      isRunning = true;
      startTime = Date.now();
      runTimer();
      document.getElementById('restart').className = '';
    });
    container = document.createElement('div');
    container.className = 'card-container';
    container.appendChild(card);
    return container;
  }

  function flipCard(card) {
    if (firstCard !== null && secondCard !== null) {
      return;
    }
    if (card.className.indexOf('open') !== -1) {
      return;
    }
    card.className = 'card open';
    flipCount++;
    if (flipCount % 2 === 1) {
      firstCard = card;
    } else {
      secondCard = card;
      secondCard.addEventListener('transitionend', check);
    }
  }

  function check() {
    if (
      firstCard.children[0].textContent !==
      secondCard.children[0].textContent
    ) {
      firstCard.className = 'card';
      secondCard.className = 'card';
    } else {
      
    // ★ 揃ったとき
      firstCard.className = 'card open matched';
      secondCard.className = 'card open matched';


      correctCount++;
      if (correctCount === pairs) {
        clearTimeout(timeoutId);
        
        
        document.getElementById('resultTime').textContent =
        lastTime.toFixed(2) + '秒でクリア！';

        setTimeout(() => {
            document.getElementById('clear').classList.add('show');
          }, 300);


      }
    }
    secondCard.removeEventListener('transitionend', check);
    firstCard = null;
    secondCard = null;
  }

  function runTimer() {
    lastTime = ((Date.now() - startTime) / 1000);
    document.getElementById('score').textContent = lastTime.toFixed(2);

    timeoutId = setTimeout(function() {
      runTimer();
    }, 10);

  }

  document.getElementById('playAgain').addEventListener('click', function() {

  // CLEAR画面を閉じる
  document.getElementById('clear').classList.remove('show');

  // カード消す
  document.getElementById('stage').innerHTML = '';

  // 変数リセット
  cards = [];
  flipCount = 0;
  firstCard = null;
  secondCard = null;
  correctCount = 0;
  isRunning = false;

  document.getElementById('score').textContent = '0.00';

  clearTimeout(timeoutId);

  // 再スタート
  init();
});

window.setLevel = function(num,event) {
  pairs = num;

  const stage = document.getElementById('stage');

  // まず全部リセット
  stage.classList.remove('grid-4', 'grid-5', 'grid-7');

  // 難易度ごとに設定
  if (num === 6) {
    stage.classList.add('grid-4');
  } else if (num === 10) {
    stage.classList.add('grid-5');
  } else if (num === 14) {
    stage.classList.add('grid-7');
  }

  
  document.querySelectorAll('#levelSelect button')
  .forEach(btn => btn.classList.remove('active'));

  
    if (event && event.target) {
      event.target.classList.add('active');
    }

  // リセット
  document.getElementById('stage').innerHTML = '';
  cards = [];
  flipCount = 0;
  firstCard = null;
  secondCard = null;
  correctCount = 0;
  isRunning = false;

  document.getElementById('score').textContent = '0.00';
  clearTimeout(timeoutId);

  // CLEAR画面閉じる
  document.getElementById('clear').classList.remove('show');

  init();
}

  
setLevel(10, {
  target: document.querySelector('#levelSelect button:nth-child(2)')
});
})();
