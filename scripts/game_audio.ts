import * as Engine from "@drk4/game-engine";

// the music's tempo is changed by adjusting the playback rate, which the engine's
// `Sound` module doesn't expose, so the song is played through the web audio api directly
let AUDIO_CONTEXT: AudioContext | null = null;
let BUFFER: AudioBuffer | null = null;
let SOURCE: AudioBufferSourceNode | null = null;
let GAIN: GainNode | null = null;

const SONG_TEMPO = 100; // tempo of the song (before changing the playback rate)
let GAIN_VALUE = 1;

/**
 * Call it after an interaction with the page (a key press or click), otherwise the browser
 * doesn't let the audio play.
 */
export function init() {
    try {
        AUDIO_CONTEXT = new AudioContext();
    } catch {
        AUDIO_CONTEXT = null;
    }

    BUFFER = Engine.Preload.get("music") as AudioBuffer;
}

export function playSong(tempo: number) {
    if (!AUDIO_CONTEXT || !BUFFER) {
        return;
    }

    stop();

    // the audio context starts suspended until there's a user interaction
    if (AUDIO_CONTEXT.state === "suspended") {
        AUDIO_CONTEXT.resume();
    }

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

export function setTempo(tempo: number) {
    if (!SOURCE) {
        return;
    }

    SOURCE.playbackRate.value = tempo / SONG_TEMPO;
}

export function setGain(gain: number) {
    GAIN_VALUE = gain;

    if (GAIN !== null) {
        GAIN.gain.value = gain;
    }
}

export function stop() {
    if (SOURCE !== null) {
        SOURCE.stop();
        SOURCE = null;
        GAIN = null;
    }
}
