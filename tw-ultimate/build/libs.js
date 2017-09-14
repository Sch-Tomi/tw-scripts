function getUserName() {
    return game_data.player.name;
}

class Linker {

    constructor() {

    }

    static
    import () {
        let link = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/siimple/2.0/siimple.min.css">
        <link rel="stylesheet" href="https://raw.githubusercontent.com/Sch-Tomi/tw-scripts/master/tw-ultimate/assets/css/flexboxgrid.css" type="text/css" >`

        $('head').append(link)
    }

}

// getValue as GM_getValue of GM functions
function getValue(name) {
    name = preparePreName() + name;
    var value = localStorage.getItem(name);
    if (!value || (value === undefined)) {
        return (null);
    }
    return (JSON.parse(value));
}

// setValue as GM_setValue of GM functions
function setValue(name, value) {
    name = preparePreName() + name;
    localStorage.setItem(name, JSON.stringify(value));
}

function preparePreName() {
    return getServer() + ":" + getUserName() + ":";
}

function getServer() {
    return new UrlManipulator().getServer()
}

class UrlManipulator {

    constructor(url = window.location) {

        this.url = new URL(url);

    }

    getServer() {
        return this.url.host.split('.')[0];
    }

    getDomain() {
        return this.url.host.split('.')[1];
    }

    getLanguage() {
        return this.url.host.split('.')[2];
    }

    getOrigin() {
        return this.url.origin;
    }

    getPath() {
        return this.url.pathname;
    }

    getParam(name) {
        return this.url.searchParams.get(name)
    }

    hasParam(name) {
        return this.url.searchParams.get(name) !== null;
    }

    setParam(name, value) {

        let copy = new URL(this.url.href);
        copy.searchParams.set(name, value);
        return copy.href;
    }

}
