var GameMenu;
(function (GameMenu) {
    // reference to html elements
    var GAME_MENU;
    var SCORE;
    var LIVES;
    function init() {
        GAME_MENU = document.querySelector('#GameMenu');
        var restart = GAME_MENU.querySelector('#Restart');
        restart.onclick = function () {
            Game.restart();
        };
        SCORE = GAME_MENU.querySelector('#Score');
        LIVES = GAME_MENU.querySelector('#Lives');
    }
    GameMenu.init = init;
    function updateScore(score) {
        SCORE.innerHTML = score;
    }
    GameMenu.updateScore = updateScore;
    function updateLives(lives) {
        LIVES.innerHTML = lives;
    }
    GameMenu.updateLives = updateLives;
    function show() {
        GAME_MENU.style.visibility = 'visible';
    }
    GameMenu.show = show;
    function hide() {
        GAME_MENU.style.visibility = 'hidden';
    }
    GameMenu.hide = hide;
})(GameMenu || (GameMenu = {}));
