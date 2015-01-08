var Message;
(function (Message) {
    var TEXT;
    var TIMEOUT;
    function init(stage) {
        TIMEOUT = new Utilities.Timeout();
        TEXT = new createjs.Text('', '30px monospace', 'white');
        TEXT.textAlign = 'center';
        TEXT.textBaseline = 'middle';
        TEXT.x = G.CANVAS_WIDTH / 2;
        TEXT.y = G.CANVAS_HEIGHT / 2;
        TEXT.visible = false;
        stage.addChild(TEXT);
    }
    Message.init = init;
    function show(text, timeout, callback) {
        TEXT.text = text;
        TEXT.visible = true;
        TIMEOUT.start(function () {
            TEXT.visible = false;
            if (callback) {
                callback();
            }
        }, timeout);
    }
    Message.show = show;
    function hide() {
        TIMEOUT.clear();
        TEXT.visible = false;
    }
    Message.hide = hide;
})(Message || (Message = {}));
