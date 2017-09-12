class Footer {

    constructor(runFunction) {
        this._addLink(runFunction)
    }

    _addLink(fun) {
        $("#linkContainer").append(' - <a id="TWU-Settings" href="#" class="footer-link">TW-Ultiamte Beállítások</a>')

        $("#TWU-Settings").on('click', fun)
    }

}

class LinkBar {

    constructor(links) {

        console.log(links)

        this.url = new UrlManipulator()

        this._createBar()

        this._fillBar(links)


    }

    _createBar() {
        var toolBarCode = `<div id='ToolBar' class="row middle-md center-md" style='padding: 7px 0 7px 0px;margin: 0 0 10px 0;width: auto;' class='content-border'>   </div>`
        $("#header_info").before(toolBarCode)
    }

    _fillBar(links) {
        for (var link of links) {
            if (link.icon != "" || link.text != "") this._addItem(link)
        }
    }

    _addItem(item) {

        var item_html = `<div class="col-md">
                            <a style="line-height:20px" href="` + this.url.setParam('screen', item.link) + `">
                                <img style="padding-right:10px; margin: auto;vertical-align: middle; display: inline-block;" src="` + item.icon + `">` + item.text + `
                            </a>
                        </div>`

        $("#ToolBar").append(item_html)
    }


}

class Options {

    constructor(config) {

        this.config = config
        this._lastOpenned

        this.actions = {
            TWU_O_LinkBar: {
                open: this._openLinkBar,
                close: this._saveLinkBar
            }
        }

        this._addPopUp()
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
                                <div id="TWU-Options-Menu" class="siimple-grid-col siimple-grid-col--2"></div>
                                <div id="TWU-Options-Content" class="siimple-grid-col siimple-grid-col--10" style="overflow: auto; max-height: 70vh;"></div>
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

    _addMenu() {
        var menu = '<table class="vis modemenu" style="width:125px">\
                        <tr><td class="" style="min-width: 80px"><a href="#">LinkBar</a></td></tr>\
                    </table > '

        $("#TWU-Options-Menu").append(menu)
    }

    _registerMenu() {

        $("#TWU-Options-Menu table a").on('click', (e) => {
            this._menuItemClicked(e)
        })
    }

    _menuItemClicked(element) {
        var itemClicked = element.target.innerText

        this.actions["TWU_O_" + itemClicked].open.bind(this)()




    }

    _openLinkBar() {

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
        this._lastOpenned = "TWU_O_LinkBar"

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
}

class playerStats {

    constructor() {
        this.url = new UrlManipulator()

        this.addStats()
    }

    addStats() {

        var server = this.url.getServer()
        var player = this.url.getParam('id')

        var content = '\
        <div class="vis">\
            <h4>Statisztika</h4>\
            <div id="btwPStats">\
                <div id="btw-Tab-pont" style="padding-top:20px;">\
                <h4>Pontok</h4>\
                    <img style="display:block; margin: 0 auto" src="http://hu.twstats.com/image.php?type=playerssgraph&amp;graph=points&amp;id=' + player + '&amp;s=' + server + '">\
                </div>\
                <hr>\
                <div id="btw-Tab-falu">\
                    <h4>Falvak</h4>\
                    <img style="display:block; margin: 0 auto" src="http://hu.twstats.com/image.php?type=playerssgraph&amp;graph=villages&amp;id=' + player + '&amp;s=' + server + '">\
                </div>\
                <hr>\
                <div id="btw-Tab-le">\
                    <h4>LE</h4>\
                    <img style="display:block; margin: 0 auto" src="http://hu.twstats.com/image.php?type=playerssgraph&amp;graph=od&amp;id=' + player + '&amp;s=' + server + '">\
                </div>\
                <hr>\
                <div id="btw-Tab-let">\
                    <h4>LET</h4>\
                    <img style="display:block; margin: 0 auto" src="http://hu.twstats.com/image.php?type=playerssgraph&amp;graph=oda&amp;id=' + player + '&amp;s=' + server + '">\
                </div>\
                <hr>\
                <div id="btw-Tab-lev">\
                    <h4>LEV</h4>\
                    <img style="display:block; margin: 0 auto" src="http://hu.twstats.com/image.php?type=playerssgraph&amp;graph=odd&amp;id=' + player + '&amp;s=' + server + '">\
                </div>\
                <hr>\
                <div id="btw-Tab-rang">\
                    <h4>Rang</h4>\
                    <img style="display:block; margin: 0 auto" src="http://hu.twstats.com/image.php?type=playerssgraph&amp;graph=rank&amp;id=' + player + '&amp;s=' + server + '">\
                </div>\
            </div>\
        </div>'

        if (player !== null) {
            $(content).insertBefore("#villages_list")
        }

    }



}
