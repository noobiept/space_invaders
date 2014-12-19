var Game;
(function (Game) {
    // tells if we need to move the player to the left or right (if the key is being pressed)
    var MOVE_LEFT = false;
    var MOVE_RIGHT = false;
    var PLAYER;
    function start() {
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
            G.STAGE.update();
        });
    }
    Game.start = start;
})(Game || (Game = {}));
