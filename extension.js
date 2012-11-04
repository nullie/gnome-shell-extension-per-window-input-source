const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Shell = imports.gi.Shell;
const Gio = imports.gi.Gio;

let defaultSource = 0;

let display, focus_connection, source_connection, settings;

function restoreWindowInputSource() {

    let window = display.focus_window;

    if(window) {

        let source = window._inputSource;

        if(source === undefined)
            source = defaultSource;

        settings.set_uint('current', source);

    }

}

function saveWindowInputSource() {

    let current = settings.get_uint('current'),
        window = display.focus_window;

    if(window) {
        window._inputSource = current;
    }

}

function init() {

    display = global.display;
    settings = new Gio.Settings({ schema: 'org.gnome.desktop.input-sources' });

}

function enable() {

    focus_connection = display.connect('notify::focus-window', restoreWindowInputSource);
    source_connection = settings.connect('changed::current', saveWindowInputSource);

    restoreWindowInputSource();

}

function disable() {

    display.disconnect(focus_connection);
    settings.disconnect(source_connection);

    saveWindowInputSource();

    settings.set_uint('current', defaultSource);

}
