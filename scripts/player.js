var Player = (function () {
    function Player() {
        var shape = new createjs.Bitmap(G.PRELOAD.getResult('cannon'));
        shape.x = G.CANVAS_WIDTH / 2 - Player.width / 2;
        shape.y = G.CANVAS_HEIGHT - Player.height;
        Player._container.addChild(shape);
        this.shape = shape;
        this.lives = 3;
    }
    Player.init = function (stage) {
        Player._container = new createjs.Container();
        stage.addChild(Player._container);
    };
    Player.prototype.tookDamage = function () {
        this.lives--;
        GameMenu.updateLives(this.lives);
        if (this.lives <= 0) {
            Game.defeat();
        }
        else {
            Message.show('Took damage!', 1000);
        }
    };
    Player.prototype.remove = function () {
        Player._container.removeChild(this.shape);
    };
    Player.prototype.fire = function () {
        var bulletX = this.getCenterX() - Bullet.width / 2;
        var bulletY = this.getCenterY() - Bullet.height / 2;
        new Bullet(bulletX, bulletY, true);
    };
    Player.prototype.moveLeft = function (event) {
        var nextX = this.shape.x - Player.movement_speed * event.delta / 1000;
        if (nextX < 0) {
            nextX = 0;
        }
        this.shape.x = nextX;
    };
    Player.prototype.moveRight = function (event) {
        var nextX = this.shape.x + Player.movement_speed * event.delta / 1000;
        var canvasWidth = G.STAGE.canvas.width;
        var limit = canvasWidth - Player.width;
        if (nextX > limit) {
            nextX = limit;
        }
        this.shape.x = nextX;
    };
    /*
        top/left origin
     */
    Player.prototype.getX = function () {
        return this.shape.x;
    };
    /*
        top/left origin
     */
    Player.prototype.getY = function () {
        return this.shape.y;
    };
    Player.prototype.getCenterX = function () {
        return this.shape.x + Player.width / 2;
    };
    Player.prototype.getCenterY = function () {
        return this.shape.y + Player.height / 2;
    };
    Player.prototype.tick = function (event) {
    };
    Player.width = 30;
    Player.height = 16;
    Player.movement_speed = 90;
    return Player;
}());
