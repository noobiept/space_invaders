var ShipType;
(function (ShipType) {
    ShipType[ShipType["one"] = 0] = "one";
    ShipType[ShipType["two"] = 1] = "two";
    ShipType[ShipType["three"] = 2] = "three";
})(ShipType || (ShipType = {}));
var Ship = (function () {
    function Ship(x, y, type) {
        var typeName = ShipType[type];
        var typeInfo = Ship.types[typeName];
        this.width = typeInfo.width;
        this.score = typeInfo.score;
        this.images = [
            G.PRELOAD.getResult('ship_' + typeName + '_1'),
            G.PRELOAD.getResult('ship_' + typeName + '_2')
        ];
        this.current_image = 0;
        var shape = new createjs.Bitmap(this.images[this.current_image]);
        shape.x = x;
        shape.y = y;
        this.shape = shape;
        Ship._container.addChild(shape);
        Ship.all.push(this);
    }
    Ship.init = function (stage) {
        Ship._container = new createjs.Container();
        stage.addChild(Ship._container);
    };
    Ship.prototype.tookDamage = function () {
        this.remove();
        Game.increaseTempo();
        Game.addScore(this.score);
        Ship.findLeftRight();
        if (Ship.all.length === 0) {
            Game.victory();
        }
    };
    Ship.prototype.remove = function () {
        var index = Ship.all.indexOf(this);
        Ship.all.splice(index, 1);
        Ship._container.removeChild(this.shape);
    };
    Ship.prototype.fire = function () {
        var bulletX = this.shape.x + this.width / 2 - Bullet.width / 2;
        var bulletY = this.shape.y + Ship.height / 2 - Bullet.height / 2;
        new Bullet(bulletX, bulletY, false);
    };
    Ship.prototype.getX = function () {
        return this.shape.x;
    };
    Ship.prototype.getY = function () {
        return this.shape.y;
    };
    Ship.prototype.getWidth = function () {
        return this.width;
    };
    Ship.prototype.getHeight = function () {
        return Ship.height;
    };
    Ship.prototype.tick = function (tickMove) {
        if (Ship.moving_right) {
            this.shape.x += tickMove;
        }
        else {
            this.shape.x -= tickMove;
        }
        this.current_image++;
        if (this.current_image >= this.images.length) {
            this.current_image = 0;
        }
        this.shape.image = this.images[this.current_image];
    };
    /*
        Find the enemy that is most to the right, and the one that is most to the left
     */
    Ship.findLeftRight = function () {
        var all = Ship.all;
        var furthestLeft = all[0];
        var furthestRight = furthestLeft;
        var length = all.length;
        for (var a = 1; a < length; a++) {
            var enemy = all[a];
            if (enemy.shape.x < furthestLeft.shape.x) {
                furthestLeft = enemy;
            }
            if (enemy.shape.x > furthestRight.shape.x) {
                furthestRight = enemy;
            }
        }
        Ship.furthest_left = furthestLeft;
        Ship.furthest_right = furthestRight;
    };
    /*
        Moves all ships one line down (called when we reach an extremity of the canvas)
     */
    Ship.moveOneLineDown = function () {
        var highestY = 0;
        var y = 0;
        var ship;
        for (var a = Ship.all.length - 1; a >= 0; a--) {
            ship = Ship.all[a];
            y = ship.shape.y + Ship.height;
            ship.shape.y = y;
            if (y > highestY) {
                highestY = y;
            }
        }
        // determine if the alien invasion is successful (reached the player)
        if (highestY > G.CANVAS_HEIGHT - 100) {
            Game.defeat();
        }
    };
    Ship.tick = function (event) {
        // determine if we reach the extremes of the canvas, and if so, need to change direction
        var limit = 10;
        if (Ship.moving_right) {
            if (Ship.furthest_right.shape.x > G.CANVAS_WIDTH - Ship.highest_width - limit) {
                Ship.moving_right = false;
                Ship.moveOneLineDown();
                return;
            }
        }
        else {
            if (Ship.furthest_left.shape.x < limit) {
                Ship.moving_right = true;
                Ship.moveOneLineDown();
                return;
            }
        }
        var tickMove = Ship.movement_speed * event.delta / 1000;
        for (var a = Ship.all.length - 1; a >= 0; a--) {
            Ship.all[a].tick(tickMove);
        }
    };
    Ship.clear = function () {
        for (var a = Ship.all.length - 1; a >= 0; a--) {
            Ship.all[a].remove();
        }
        Ship.moving_right = true;
    };
    Ship.all = [];
    Ship.movement_speed = 100;
    Ship.moving_right = true;
    Ship.types = {
        one: {
            score: 40,
            width: 16
        },
        two: {
            score: 20,
            width: 22
        },
        three: {
            score: 10,
            width: 24
        }
    };
    Ship.highest_width = 24; // the width is different for all ship types, this has the highest
    Ship.height = 16; // height is the same for all the ships, but not width
    return Ship;
})();
