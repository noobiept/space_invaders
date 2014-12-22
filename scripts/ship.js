var Ship = (function () {
    function Ship(x, y) {
        var shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginFill('red');
        g.drawRect(0, 0, Ship.width, Ship.height);
        g.endFill();
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
    Ship.prototype.remove = function () {
        var index = Ship.all.indexOf(this);
        Ship.all.splice(index, 1);
        Ship._container.removeChild(this.shape);
    };
    Ship.prototype.fire = function () {
        var bulletX = this.shape.x + Ship.width / 2 - Bullet.width / 2;
        var bulletY = this.shape.y + Ship.height / 2 - Bullet.height / 2;
        new Bullet(bulletX, bulletY, 1 /* bottom */);
    };
    Ship.prototype.tick = function (tickMove) {
        if (Ship.moving_right) {
            this.shape.x += tickMove;
        }
        else {
            this.shape.x -= tickMove;
        }
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
        for (var a = Ship.all.length - 1; a >= 0; a--) {
            Ship.all[a].shape.y += Ship.height;
        }
    };
    Ship.tick = function (event) {
        // determine if we reach the extremes of the canvas, and if so, need to change direction
        var limit = 10;
        if (Ship.moving_right) {
            if (Ship.furthest_right.shape.x > G.CANVAS_WIDTH - Ship.width - limit) {
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
    Ship.width = 20;
    Ship.height = 20;
    Ship.all = [];
    Ship.movement_speed = 100;
    Ship.moving_right = true;
    return Ship;
})();
