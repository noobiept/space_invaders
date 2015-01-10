module GameAudio
{
var AUDIO_CONTEXT;
var BUFFER;
var SOURCE = null;
var GAIN = null;
var SONG_TEMPO = 100;   // tempo of the song (before changing the playback rate)
var GAIN_VALUE = 1;

export function init()
    {
    AUDIO_CONTEXT = new AudioContext();
    BUFFER = G.PRELOAD.getResult( 'music' );
    }


export function playSong( tempo )
    {
    stop();

    SOURCE = AUDIO_CONTEXT.createBufferSource();
    SOURCE.buffer = BUFFER;
    SOURCE.loop = true;

    GAIN = AUDIO_CONTEXT.createGain();
    GAIN.gain.value = GAIN_VALUE;

    SOURCE.connect( GAIN );
    GAIN.connect( AUDIO_CONTEXT.destination );

    setTempo( tempo );
    SOURCE.start();
    }

export function setTempo( tempo )
    {
    SOURCE.playbackRate.value = tempo / SONG_TEMPO;
    }


export function setGain( gain )
    {
    if ( GAIN !== null )
        {
        GAIN_VALUE = gain;
        GAIN.gain.value = gain;
        }
    }


export function stop()
    {
    if ( SOURCE !== null )
        {
        SOURCE.stop();
        SOURCE = null;
        GAIN = null;
        }
    }
}