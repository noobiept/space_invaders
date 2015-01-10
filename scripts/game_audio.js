var GameAudio;
(function (GameAudio) {
    var AUDIO_CONTEXT;
    var BUFFER;
    var SOURCE;
    var SONG_TEMPO = 100; // tempo of the song (before changing the playback rate)
    function init() {
        AUDIO_CONTEXT = new AudioContext();
        BUFFER = G.PRELOAD.getResult('music');
        SOURCE = null;
    }
    GameAudio.init = init;
    function playSong(tempo) {
        stop();
        SOURCE = AUDIO_CONTEXT.createBufferSource();
        SOURCE.buffer = BUFFER;
        SOURCE.loop = true;
        SOURCE.connect(AUDIO_CONTEXT.destination);
        setTempo(tempo);
        SOURCE.start();
    }
    GameAudio.playSong = playSong;
    function setTempo(tempo) {
        SOURCE.playbackRate.value = tempo / SONG_TEMPO;
    }
    GameAudio.setTempo = setTempo;
    function stop() {
        if (SOURCE !== null) {
            SOURCE.stop();
            SOURCE = null;
        }
    }
    GameAudio.stop = stop;
})(GameAudio || (GameAudio = {}));
