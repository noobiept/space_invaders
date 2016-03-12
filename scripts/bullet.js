var BulletDirection;
(function (BulletDirection) {
    BulletDirection[BulletDirection["top"] = 0] = "top";
    BulletDirection[BulletDirection["bottom"] = 1] = "bottom";
})(BulletDirection || (BulletDirection = {}));
var Bullet = (function () {
    function Bullet(x, y, fromPlayer) {
        var shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginFill('blue');
        g.drawRect(0, 0, Bullet.width, Bullet.height);
        g.endFill();
        shape.x = x;
        shape.y = y;
        this.shape = shape;
        this.from_player = fromPlayer;
        Bullet._container.addChild(shape);
        if (fromPlayer === true) {
            this.direction = BulletDirection.top;
            Bullet.all_player.push(this);
            Game.addScore(-5);
        }
        else {
            this.direction = BulletDirection.bottom;
            Bullet.all_ship.push(this);
        }
    }
    Bullet.init = function (stage) {
        Bullet._container = new createjs.Container();
        stage.addChild(Bullet._container);
    };
    Bullet.prototype.tookDamage = function () {
        this.remove();
    };
    Bullet.prototype.remove = function () {
        var all;
        if (this.from_player === true) {
            all = Bullet.all_player;
        }
        else {
            all = Bullet.all_ship;
        }
        var index = all.indexOf(this);
        all.splice(index, 1);
        Bullet._container.removeChild(this.shape);
    };
    Bullet.prototype.getX = function () {
        return this.shape.x;
    };
    Bullet.prototype.getY = function () {
        return this.shape.y;
    };
    Bullet.prototype.getWidth = function () {
        return Bullet.width;
    };
    Bullet.prototype.getHeight = function () {
        return Bullet.height;
    };
    Bullet.prototype.tick = function (tickMove) {
        if (this.direction === BulletDirection.top) {
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
        var a;
        for (a = Bullet.all_player.length - 1; a >= 0; a--) {
            Bullet.all_player[a].tick(tickMove);
        }
        for (a = Bullet.all_ship.length - 1; a >= 0; a--) {
            Bullet.all_ship[a].tick(tickMove);
        }
    };
    Bullet.clear = function () {
        var a;
        for (a = Bullet.all_player.length - 1; a >= 0; a--) {
            Bullet.all_player[a].remove();
        }
        for (a = Bullet.all_ship.length - 1; a >= 0; a--) {
            Bullet.all_ship[a].remove();
        }
    };
    Bullet.width = 2;
    Bullet.height = 6;
    Bullet.all_player = []; // all the bullets fired by the player
    Bullet.all_ship = []; // all the bullets fired by an enemy ship
    Bullet.movement_speed = 200;
    return Bullet;
}());
