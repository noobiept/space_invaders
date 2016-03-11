var HighScore;
(function (HighScore) {
    var HTML_ELEMENT;
    var BEST_SCORE;
    function init(data) {
        HTML_ELEMENT = document.querySelector('#HighScore');
        BEST_SCORE = 0;
        load(data);
        updateHtmlElement();
    }
    HighScore.init = init;
    function add(score) {
        if (score > BEST_SCORE) {
            BEST_SCORE = score;
        }
        save();
        updateHtmlElement();
    }
    HighScore.add = add;
    function load(score) {
        if (score) {
            BEST_SCORE = score;
        }
    }
    function save() {
        AppStorage.setData({ space_invaders_high_score: BEST_SCORE });
    }
    function updateHtmlElement() {
        HTML_ELEMENT.innerHTML = BEST_SCORE.toString();
    }
    function clear() {
        BEST_SCORE = 0;
        save();
    }
    HighScore.clear = clear;
})(HighScore || (HighScore = {}));
