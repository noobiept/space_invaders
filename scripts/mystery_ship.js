var MysteryShip = (function () {
    function MysteryShip() {
        var shape = new createjs.Bitmap(G.PRELOAD.getResult('mystery_ship'));
        // starts outside the left side of the canvas, and moves towards the right side
        shape.x = -MysteryShip.width;
        shape.y = MysteryShip.height;
        this.shape = shape;
        this.score = 100;
        MysteryShip._container.addChild(shape);
        MysteryShip.all.push(this);
    }
    MysteryShip.init = function (stage) {
        MysteryShip._container = new createjs.Container();
        stage.addChild(MysteryShip._container);
    };
    MysteryShip.prototype.tookDamage = function () {
        this.remove();
        Game.addScore(this.score);
    };
    MysteryShip.prototype.remove = function () {
        var index = MysteryShip.all.indexOf(this);
        MysteryShip.all.splice(index, 1);
        MysteryShip._container.removeChild(this.shape);
    };
    MysteryShip.prototype.getX = function () {
        return this.shape.x;
    };
    MysteryShip.prototype.getY = function () {
        return this.shape.y;
    };
    MysteryShip.prototype.getWidth = function () {
        return MysteryShip.width;
    };
    MysteryShip.prototype.getHeight = function () {
        return MysteryShip.height;
    };
    MysteryShip.prototype.tick = function (tickMove) {
        var nextX = this.shape.x + tickMove;
        this.shape.x = nextX;
        if (nextX > G.CANVAS_WIDTH) {
            this.remove();
        }
    };
    MysteryShip.tick = function (event) {
        var tickMove = MysteryShip.movement_speed * event.delta / 1000;
        for (var a = MysteryShip.all.length - 1; a >= 0; a--) {
            MysteryShip.all[a].tick(tickMove);
        }
    };
    MysteryShip.clear = function () {
        for (var a = MysteryShip.all.length - 1; a >= 0; a--) {
            MysteryShip.all[a].remove();
        }
    };
    MysteryShip.width = 32;
    MysteryShip.height = 14;
    MysteryShip.all = [];
    MysteryShip.movement_speed = 70;
    return MysteryShip;
})();
