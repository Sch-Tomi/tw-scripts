class Footer {

    constructor(runFunction) {
        this._addLink(runFunction)
    }

    _addLink(fun) {
        $("#linkContainer").append(' - <a id="TWU-Settings" href="#" class="footer-link">TW-Ultiamte Beállítások</a>')

        $("#TWU-Settings").on('click', fun)
    }

}
