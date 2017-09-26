class Options {

    constructor(config) {

        this.config = config
        this._lastOpenned
        this._nextOpen

        this.actions = {
            TWU_O_LinkBar: {
                open: this._openLinkBar,
                close: this._saveLinkBar
            },
            TWU_O_PremiumMap: {
                open: this._openPremiumMap,
                close: this._savePremiumMap,
            }
        }

        this._addPopUp()
        this._addConfirmationPopUp()
        this._addMenu()
        this._registerMenu()

    }

    open() {
        $("#TWU-Options").show()
    }

    close() {
        $("#TWU-Options").hide()
    }

    _save() {
        this.actions[this._lastOpenned].close.bind(this)()
        this.config.save()
    }

    _addPopUp() {
        var optionPage =
            `<div id="TWU-Options">
                <div class="popup_box show" id="" style="width: 40vw;z-index: 13000;">
                    <div class="popup_box_content">
                        <a class="popup_box_close tooltip-delayed TWU-Options-Close" href="#">&nbsp;</a>
                        <h3>Beállítások</h3>
                        <div class="siimple-grid">
                            <div class="siimple-grid-row">
                                <div id="TWU-Options-Menu" class="siimple-grid-col siimple-grid-col--3"></div>
                                <div id="TWU-Options-Content" class="siimple-grid-col siimple-grid-col--9" style="overflow: auto; max-height: 70vh;"></div>
                            </div>
                            <div class="siimple-grid-row">
                                <div class="siimple-grid-col "><div id="TWU-Options-Save" class="siimple-btn siimple-btn--green">Mentés</div></div>
                                <div class="siimple-grid-col "><div class="siimple-btn siimple-btn--red TWU-Options-Close">Kilépés</div></div>
                            </div>
                        </div>
                    </div>    
                </div>    
                <div class="fader"></div>
            </div>`


        $("body").append(optionPage)
        $(".TWU-Options-Close").on('click', this.close)
        $("#TWU-Options-Save").on('click', () => {
            this._save()
        })
        $("#TWU-Options").hide()
    }

    _addConfirmationPopUp() {
        let confirmation_box = `<div class="confirmation-box" id="TWU_O_confirmation_box" >
                                    <div>
                                        <p class="confirmation-msg">Ha elkapcsolsz az oldalról, nem mentődnek a beállítások. Szeretnéd menteni?</p>
                                        <div class="confirmation-buttons">
                                            <button id="TWU_O_confirmation_box_YES" class="btn evt-confirm-btn btn-confirm-yes">Igen</button>
                                            <button id="TWU_O_confirmation_box_NO" class="btn evt-cancel-btn btn-confirm-no">Nem</button>
                                        </div>
                                    </div>
                                </div>`

        $("body").append(confirmation_box)
        $("#TWU_O_confirmation_box_YES").on('click', () => {
            this._save()
            this._hideConfirmationBox()
            this._openMenuItemClicked()
        })

        $("#TWU_O_confirmation_box_NO").on('click', () => {
            this._hideConfirmationBox()
            this._openMenuItemClicked()
        })

        $("#TWU_O_confirmation_box").hide()
    }

    _addMenu() {
        var menu = `<table class="vis modemenu" style="width:125px">\
                        <tr><td class="" style="min-width: 80px" ><a openMenu="LinkBar" href="#">Link Bar</a></td></tr>
                        <tr><td class="" style="min-width: 80px" ><a openMenu="PremiumMap" href="#">Premium Map</a></td></tr>
                    </table > `

        $("#TWU-Options-Menu").append(menu)
    }

    _registerMenu() {

        $("#TWU-Options-Menu table a").on('click', (e) => {
            this._menuItemClicked(e)
        })
    }

    _menuItemClicked(element) {

        var itemClicked = element.target.getAttribute("openMenu")

        console.log(itemClicked)

        if (this._lastOpenned != null) {
            this._nextOpen = itemClicked
            this._askForSave.bind(this)()
        } else {
            this.actions["TWU_O_" + itemClicked].open.bind(this)()
        }


    }

    _askForSave() {
        $("#TWU_O_confirmation_box").show()
    }

    _hideConfirmationBox() {
        $("#TWU_O_confirmation_box").hide()
    }

    _openMenuItemClicked() {
        this.actions["TWU_O_" + this._nextOpen].open.bind(this)()
    }

    _openLinkBar() {

        this._lastOpenned = "TWU_O_LinkBar"

        $("#TWU-Options-Content").html("")
        for (let i = 0; i < 8; i++) {
            var content = `
                <h4>` + (i + 1) + `. Gomb</h4>
                <div id="TWU-Options-LinkBar-` + i + `" class="siimple-grid">
                    <div class="siimple-grid-row">
                        <div class="siimple-grid-col siimple-grid-col--2"><label class="siimple-label">Text:</label></div>
                        <div class="siimple-grid-col siimple-grid-col--10"><input class="siimple-input" type="text" name="text" style="width:20vw"></div>
                    </div>
                    <div class="siimple-grid-row">
                        <div class="siimple-grid-col siimple-grid-col--2"><label class="siimple-label">Screen:</label></div>
                        <div class="siimple-grid-col siimple-grid-col--10"><input class="siimple-input" type="text" name="screen" style="width:20vw"></div>
                    </div>
                    <div class="siimple-grid-row">
                        <div class="siimple-grid-col siimple-grid-col--2"><label class="siimple-label">Icon:</label></div>
                        <div class="siimple-grid-col siimple-grid-col--10"><input class="siimple-input" type="text" name="icon" style="width:20vw"></div>
                    </div>
                </div>
                <hr>
                `

            $("#TWU-Options-Content").append(content)


        }


        let links = this.config.getLinks()

        console.log(links)

        for (let i = 0; i < 8; i++) {
            if (links[i].icon != "" || links[i].text != "") {
                $("#TWU-Options-LinkBar-" + i + " input[name='icon']").val(links[i].icon)
                $("#TWU-Options-LinkBar-" + i + " input[name='text']").val(links[i].text)
                $("#TWU-Options-LinkBar-" + i + " input[name='screen']").val(links[i].link)
            }
        }

    }

    _saveLinkBar() {

        let newLinks = []

        for (let i = 0; i < 8; i++) {
            newLinks.push({
                icon: $("#TWU-Options-LinkBar-" + i + " input[name='icon']").val(),
                text: $("#TWU-Options-LinkBar-" + i + " input[name='text']").val(),
                link: $("#TWU-Options-LinkBar-" + i + " input[name='screen']").val()

            })
        }

        this.config.setLinks(newLinks)
    }

    _openPremiumMap() {

        this._lastOpenned = "TWU_O_PremiumMap"

        var content = `
        <div class="siimple-grid-row">
            <div class="siimple-grid-col siimple-grid-col--4"><label class="siimple-label">MiniMap Size:</label></div>
            <div class="siimple-grid-col siimple-grid-col--8">
                <select id="TWU-Options-PremiumMap-Minimap-size">
                    <option label="20x20" value="20x20">20x20</option>
                    <option label="30x30" value="30x30">30x30</option>
                    <option label="40x40" value="40x40">40x40</option>
                    <option label="50x50" value="50x50">50x50</option>
                    <option label="60x60" value="60x60">60x60</option>
                    <option label="70x70" value="70x70">70x70</option>
                    <option label="80x80" value="80x80">80x80</option>
                    <option label="90x90" value="90x90">90x90</option>
                    <option label="100x100" value="100x100">100x100</option>
                    <option label="110x110" value="110x110">110x110</option>
                    <option label="120x120" value="120x120">120x120</option>
                </select>
            </div>
        </div>
        <div class="siimple-grid-row">
            <div class="siimple-grid-col siimple-grid-col--4"><label class="siimple-label">Map Size:</label></div>
            <div class="siimple-grid-col siimple-grid-col--8">
                <select id="TWU-Options-PremiumMap-Map-size">
                    <option label="4x4" value="4">4x4</option>
                    <option label="5x5" value="5">5x5</option>
                    <option label="7x7" value="7">7x7</option>
                    <option label="9x9" value="9">9x9</option>
                    <option label="11x11" value="11">11x11</option>
                    <option label="13x13" value="13">13x13</option>
                    <option label="15x15" value="15">15x15</option>
                    <option label="20x20" value="20">20x20</option>
                    <option label="30x30" value="30">30x30</option>
                </select>
            </div>
        </div>`

        $("#TWU-Options-Content").html(content)

        var mapConfig = this.config.getPremiumMapConfig();

        $('#TWU-Options-PremiumMap-Minimap-size option[value="' + mapConfig.miniMap + '"]').prop('selected', true)
        $('#TWU-Options-PremiumMap-Map-size option[value="' + mapConfig.map + '"]').prop('selected', true)


    }

    _savePremiumMap() {

        var newMapConfig = {
            miniMap: $('#TWU-Options-PremiumMap-Minimap-size ').val(),
            map: $('#TWU-Options-PremiumMap-Map-size ').val()
        }

        this.config.setPremiumMapConfig(newMapConfig)

    }

}
