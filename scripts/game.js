var Game;
(function (Game) {
    // tells if we need to move the player to the left or right (if the key is being pressed)
    var MOVE_LEFT = false;
    var MOVE_RIGHT = false;
    var PLAYER;
    function init() {
        document.body.addEventListener('keydown', function (event) {
            var key = event.keyCode;
            if (key === Utilities.KEY_CODE.leftArrow || key === Utilities.KEY_CODE.a) {
                MOVE_LEFT = true;
            }
            else if (key === Utilities.KEY_CODE.rightArrow || key === Utilities.KEY_CODE.d) {
                MOVE_RIGHT = true;
            }
        });
        document.body.addEventListener('keyup', function (event) {
            var key = event.keyCode;
            if (key === Utilities.KEY_CODE.leftArrow || key === Utilities.KEY_CODE.a) {
                MOVE_LEFT = false;
            }
            else if (key === Utilities.KEY_CODE.rightArrow || key === Utilities.KEY_CODE.d) {
                MOVE_RIGHT = false;
            }
        });
        document.body.addEventListener('click', function (event) {
            var button = event.button;
            if (button === Utilities.MOUSE_CODE.left) {
                var bulletX = PLAYER.getCenterX() - Bullet.width / 2;
                var bulletY = PLAYER.getCenterY() - Bullet.height / 2;
                new Bullet(bulletX, bulletY);
            }
        });
        PLAYER = new Player();
        createjs.Ticker.on('tick', function (event) {
            if (MOVE_LEFT) {
                PLAYER.moveLeft(event);
            }
            else if (MOVE_RIGHT) {
                PLAYER.moveRight(event);
            }
            PLAYER.tick(event);
            Bullet.tick(event);
            Enemy.tick(event);
            G.STAGE.update();
        });
    }
    Game.init = init;
    function start() {
        var numberOfLines = 5;
        var numberOfColumns = 11;
        var spaceBetween = 10;
        var canvasWidth = G.STAGE.canvas.width;
        var enemiesSpace = numberOfColumns * Enemy.width + (numberOfColumns - 1) * spaceBetween;
        // start position
        var startX = canvasWidth / 2 - enemiesSpace / 2;
        var x = startX;
        var y = 20;
        for (var line = 0; line < numberOfLines; line++) {
            for (var column = 0; column < numberOfColumns; column++) {
                new Enemy(x, y);
                x += Enemy.width + spaceBetween;
            }
            x = startX;
            y += Enemy.height + spaceBetween;
        }
        Enemy.findLeftRight();
    }
    Game.start = start;
})(Game || (Game = {}));
