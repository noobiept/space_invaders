var GameAudio;
(function (GameAudio) {
    var AUDIO_CONTEXT;
    var BUFFER;
    var SOURCE = null;
    var GAIN = null;
    var SONG_TEMPO = 100; // tempo of the song (before changing the playback rate)
    var GAIN_VALUE = 1;
    function init() {
        AUDIO_CONTEXT = new AudioContext();
        BUFFER = G.PRELOAD.getResult('music');
    }
    GameAudio.init = init;
    function playSong(tempo) {
        stop();
        SOURCE = AUDIO_CONTEXT.createBufferSource();
        SOURCE.buffer = BUFFER;
        SOURCE.loop = true;
        GAIN = AUDIO_CONTEXT.createGain();
        GAIN.gain.value = GAIN_VALUE;
        SOURCE.connect(GAIN);
        GAIN.connect(AUDIO_CONTEXT.destination);
        setTempo(tempo);
        SOURCE.start();
    }
    GameAudio.playSong = playSong;
    function setTempo(tempo) {
        SOURCE.playbackRate.value = tempo / SONG_TEMPO;
    }
    GameAudio.setTempo = setTempo;
    function setGain(gain) {
        if (GAIN !== null) {
            GAIN_VALUE = gain;
            GAIN.gain.value = gain;
        }
    }
    GameAudio.setGain = setGain;
    function stop() {
        if (SOURCE !== null) {
            SOURCE.stop();
            SOURCE = null;
            GAIN = null;
        }
    }
    GameAudio.stop = stop;
})(GameAudio || (GameAudio = {}));
