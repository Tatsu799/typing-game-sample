import anime from 'animejs';
// import { Stage, Shape, Ticker } from '@createjs/easeljs';

// プレイヤーと敵の初期ステータス
let playerHealth = 100;
let enemyHealth = 100;
const words = ['attack', 'defend', 'charge', 'strike', 'block'];
let currentWord = '';

// HTML 要素を取得
const wordDisplay = document.getElementById('word-display') as HTMLElement;
const inputField = document.getElementById('input-field') as HTMLInputElement;
const playerHealthDisplay = document.getElementById('player-health') as HTMLElement;
const enemyHealthDisplay = document.getElementById('enemy-health') as HTMLElement;

// CreateJS のステージとオブジェクト設定
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const stage = new createjs.Stage(canvas);

// 敵の円形キャラクターを作成
const enemyShape = new createjs.Shape();
enemyShape.graphics.beginFill('red').drawCircle(0, 0, 30);
enemyShape.x = canvas.width - 50;
enemyShape.y = canvas.height / 2;
stage.addChild(enemyShape);

// プレイヤーのダメージ表示アニメーション
function playerDamageAnimation() {
  anime({
    targets: '#player-health',
    color: ['#000', '#f00'],
    duration: 500,
    easing: 'easeInOutQuad',
  });
}

// 敵のダメージ表示アニメーション
function enemyDamageAnimation() {
  anime({
    targets: enemyShape,
    scale: [1, 1.2, 1],
    duration: 500,
    easing: 'easeInOutQuad',
  });
}

// ランダムに単語を表示
function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDisplay.textContent = currentWord;

  anime({
    targets: '#word-display',
    opacity: [0, 1],
    scale: [0.5, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .5)',
  });
}

// 入力をチェックして正しければ敵にダメージ
function checkInput() {
  if (inputField.value === currentWord) {
    enemyHealth -= 10;
    enemyHealthDisplay.textContent = `Enemy Health: ${enemyHealth}`;
    inputField.value = '';
    setNewWord();
    enemyDamageAnimation();

    if (enemyHealth <= 0) {
      alert('You defeated the enemy!');
      resetGame();
    }
  }
}

// 一定間隔で敵がプレイヤーにダメージを与える
function enemyAttack() {
  playerHealth -= 5;
  playerHealthDisplay.textContent = `Player Health: ${playerHealth}`;
  playerDamageAnimation();

  if (playerHealth <= 0) {
    alert('You were defeated by the enemy!');
    resetGame();
  }
}

// ゲームのリセット
function resetGame() {
  playerHealth = 100;
  enemyHealth = 100;
  playerHealthDisplay.textContent = `Player Health: ${playerHealth}`;
  enemyHealthDisplay.textContent = `Enemy Health: ${enemyHealth}`;
  setNewWord();
}

// ゲームの開始
function startGame() {
  resetGame();
  setNewWord();
  createjs.Ticker.framerate = 0.5; // 1 秒ごとに敵の攻撃
  createjs.Ticker.addEventListener('tick', () => {
    enemyAttack();
    stage.update();
  });
}

// イベントリスナーを設定
inputField.addEventListener('input', checkInput);
window.addEventListener('load', startGame);
