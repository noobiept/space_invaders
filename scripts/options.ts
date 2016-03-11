module Options
{
export interface OptionsData {
        muted: boolean;
    }

var OPTIONS: OptionsData = {
    muted: false
}


export function init( options: OptionsData )
    {
    if ( options )
        {
        OPTIONS = options;
        }
    }


export function get( key: string )
    {
    return OPTIONS[ key ];
    }


export function set( key: string, value )
    {
    OPTIONS[ key ] = value;

    save();
    }


function save()
    {
    AppStorage.setData({ 'space_invaders_options': OPTIONS });
    }
}