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
