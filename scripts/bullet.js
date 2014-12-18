var Bullet = (function () {
    function Bullet(x, y) {
        var shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginFill('blue');
        g.drawRect(0, 0, Bullet.width, Bullet.height);
        g.endFill();
        shape.x = x;
        shape.y = y;
        this.shape = shape;
        this.movement_speed = 20; //HERE
        Bullet._container.addChild(shape);
        Bullet.all_bullets.push(this);
    }
    Bullet.init = function (stage) {
        Bullet._container = new createjs.Container();
        stage.addChild(Bullet._container);
    };
    Bullet.prototype.remove = function () {
        var index = Bullet.all_bullets.indexOf(this);
        Bullet.all_bullets.splice(index, 1);
        Bullet._container.removeChild(this.shape);
    };
    Bullet.prototype.tick = function (event) {
        this.shape.y -= this.movement_speed;
        if (this.shape.y < 0) {
            this.remove();
        }
    };
    Bullet.tick = function (event) {
        for (var a = Bullet.all_bullets.length - 1; a >= 0; a--) {
            Bullet.all_bullets[a].tick(event);
        }
    };
    Bullet.width = 2;
    Bullet.height = 6;
    Bullet.all_bullets = [];
    return Bullet;
})();
