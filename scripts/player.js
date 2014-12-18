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
        G.STAGE.addChild(shape);
        this.movement_speed = 10; //HERE  pixel per tick
        this.shape = shape;
        this.width = width;
        this.height = height;
    }
    Player.prototype.moveLeft = function () {
        var nextX = this.shape.x - this.movement_speed;
        if (nextX < 0) {
            nextX = 0;
        }
        this.shape.x = nextX;
    };
    Player.prototype.moveRight = function () {
        var nextX = this.shape.x + this.movement_speed;
        var canvasWidth = G.STAGE.canvas.width;
        var limit = canvasWidth - this.width;
        if (nextX > limit) {
            nextX = limit;
        }
        this.shape.x = nextX;
    };
    Player.prototype.tick = function (event) {
    };
    return Player;
})();
