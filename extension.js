const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Shell = imports.gi.Shell;
const Gio = imports.gi.Gio;

let defaultSource = 0;

let display, focus_connection, source_connection, settings;

function update() {

    let window = display.focus_window;

    if(window) {

        let source = window._inputSource;

        if(source === undefined)
            source = defaultSource;

        settings.set_uint('current', source);

    }

}

function inputSourceChanged() {

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

    focus_connection = display.connect('notify::focus-window', update);
    source_connection = settings.connect('changed::current', inputSourceChanged);

}

function disable() {

    display.disconnect(focus_connection);
    settings.disconnect(source_connection);

}
