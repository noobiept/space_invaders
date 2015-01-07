var Player = (function () {
    function Player() {
        var shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginFill('green');
        g.drawRect(0, 0, Player.width, Player.height);
        g.endFill();
        var canvas = G.STAGE.canvas;
        shape.x = canvas.width / 2 - Player.width / 2;
        shape.y = canvas.height - Player.height;
        Player._container.addChild(shape);
        this.shape = shape;
    }
    Player.init = function (stage) {
        Player._container = new createjs.Container();
        stage.addChild(Player._container);
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
    Player.width = 20;
    Player.height = 10;
    Player.movement_speed = 80;
    return Player;
})();
