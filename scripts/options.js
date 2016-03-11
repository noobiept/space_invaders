var Options;
(function (Options) {
    var OPTIONS = {
        muted: false
    };
    function init(options) {
        if (options) {
            OPTIONS = options;
        }
    }
    Options.init = init;
    function get(key) {
        return OPTIONS[key];
    }
    Options.get = get;
    function set(key, value) {
        OPTIONS[key] = value;
        save();
    }
    Options.set = set;
    function save() {
        AppStorage.setData({ 'space_invaders_options': OPTIONS });
    }
})(Options || (Options = {}));
