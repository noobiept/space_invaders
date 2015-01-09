var Bunker = (function () {
    function Bunker(x, y) {
        this.health = 4;
        var shape = new createjs.Bitmap(G.PRELOAD.getResult('bunker_' + this.health));
        shape.x = x;
        shape.y = y;
        this.shape = shape;
        Bunker._container.addChild(shape);
        Bunker.all.push(this);
    }
    Bunker.init = function (stage) {
        Bunker._container = new createjs.Container();
        stage.addChild(Bunker._container);
    };
    Bunker.prototype.tookDamage = function () {
        this.health -= 1;
        if (this.health <= 0) {
            this.remove();
        }
        else {
            this.shape.image = G.PRELOAD.getResult('bunker_' + this.health);
        }
    };
    Bunker.prototype.remove = function () {
        var index = Bunker.all.indexOf(this);
        Bunker.all.splice(index, 1);
        Bunker._container.removeChild(this.shape);
    };
    Bunker.prototype.getX = function () {
        return this.shape.x;
    };
    Bunker.prototype.getY = function () {
        return this.shape.y;
    };
    Bunker.prototype.getWidth = function () {
        return Bunker.width;
    };
    Bunker.prototype.getHeight = function () {
        return Bunker.height;
    };
    Bunker.clear = function () {
        for (var a = Bunker.all.length - 1; a >= 0; a--) {
            Bunker.all[a].remove();
        }
    };
    Bunker.width = 12;
    Bunker.height = 12;
    Bunker.all = [];
    return Bunker;
})();
