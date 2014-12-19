var Player = (function () {
    function Player() {
        var shape = new createjs.Shape();
        var width = 10;
        var height = 10;
        var g = shape.graphics;
        g.beginFill('green');
        g.drawRect(0, 0, width, height);
        g.endFill();
        var canvas = G.STAGE.canvas;
        shape.x = canvas.width / 2 - width / 2;
        shape.y = canvas.height - height;
        Player._container.addChild(shape);
        this.shape = shape;
        this.width = width;
        this.height = height;
    }
    Player.init = function (stage) {
        Player._container = new createjs.Container();
        stage.addChild(Player._container);
    };
    Player.prototype.remove = function () {
        Player._container.removeChild(this.shape);
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
        var limit = canvasWidth - this.width;
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
        return this.shape.x + this.width / 2;
    };
    Player.prototype.getCenterY = function () {
        return this.shape.y + this.height / 2;
    };
    Player.prototype.tick = function (event) {
    };
    Player.width = 10;
    Player.height = 10;
    Player.movement_speed = 80;
    return Player;
})();
