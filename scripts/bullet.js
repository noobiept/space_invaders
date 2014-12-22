var BulletDirection;
(function (BulletDirection) {
    BulletDirection[BulletDirection["top"] = 0] = "top";
    BulletDirection[BulletDirection["bottom"] = 1] = "bottom";
})(BulletDirection || (BulletDirection = {}));
var Bullet = (function () {
    function Bullet(x, y, direction) {
        var shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginFill('blue');
        g.drawRect(0, 0, Bullet.width, Bullet.height);
        g.endFill();
        shape.x = x;
        shape.y = y;
        this.direction = direction;
        this.shape = shape;
        Bullet._container.addChild(shape);
        Bullet.all.push(this);
    }
    Bullet.init = function (stage) {
        Bullet._container = new createjs.Container();
        stage.addChild(Bullet._container);
    };
    Bullet.prototype.remove = function () {
        var index = Bullet.all.indexOf(this);
        Bullet.all.splice(index, 1);
        Bullet._container.removeChild(this.shape);
    };
    Bullet.prototype.tick = function (tickMove) {
        if (this.direction === 0 /* top */) {
            this.shape.y -= tickMove;
            if (this.shape.y < 0) {
                this.remove();
            }
        }
        else {
            this.shape.y += tickMove;
            if (this.shape.y > G.CANVAS_HEIGHT) {
                this.remove();
            }
        }
    };
    Bullet.tick = function (event) {
        // how much each bullet moves per tick
        var tickMove = Bullet.movement_speed * event.delta / 1000;
        for (var a = Bullet.all.length - 1; a >= 0; a--) {
            Bullet.all[a].tick(tickMove);
        }
    };
    Bullet.width = 2;
    Bullet.height = 6;
    Bullet.all = [];
    Bullet.movement_speed = 100;
    return Bullet;
})();
