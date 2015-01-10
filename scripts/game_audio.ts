module GameAudio
{
var AUDIO_CONTEXT;
var BUFFER;
var SOURCE;
var SONG_TEMPO = 100;   // tempo of the song (before changing the playback rate)

export function init()
    {
    AUDIO_CONTEXT = new AudioContext();
    BUFFER = G.PRELOAD.getResult( 'music' );
    SOURCE = null;
    }


export function playSong( tempo )
    {
    stop();

    SOURCE = AUDIO_CONTEXT.createBufferSource();
    SOURCE.buffer = BUFFER;
    SOURCE.loop = true;
    SOURCE.connect( AUDIO_CONTEXT.destination );

    setTempo( tempo );
    SOURCE.start();
    }

export function setTempo( tempo )
    {
    SOURCE.playbackRate.value = tempo / SONG_TEMPO;
    }

export function stop()
    {
    if ( SOURCE !== null )
        {
        SOURCE.stop();
        SOURCE = null;
        }
    }
}