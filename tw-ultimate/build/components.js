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
        var toolBarCode = `<div id='ToolBar' class="fbox-row middle-md center-md content-border" style='padding: 7px 0 7px 0px;margin: 0 0 10px 0;width: auto;' ></div>`
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

class PremiumMap {

    constructor(mapConfig) {

        this.config = mapConfig

        this._premiumMapPanel = `
        <tr>
            <td class="center" colspan="3">
                <a href="javascript:void(0);" id="Full_Map">Teljes képernyõ</a>
            </td>
        </tr>
        <tr>
            <td>
                <label for="map_size">Térkép Méret:</label>
            </td>
            <td class="center">
                <select id="map_size">
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
            </td>
            <td width="18">
            </td>
        </tr>
        <tr>
            <td>
                <label for="minimap_size">Mini Térkép Méret:</label>
            </td>
            <td class="center"> 
                <select id="minimap_size">
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
            </td>
            <td width="18">
            </td>
        </tr>
        <tr>
            <td>
                <input type="checkbox" id="politicalmap" onclick="TWMap.politicalMap.toggle(true);" name="politicalmap">
            </td>
            <td>
                <label for="politicalmap"> Politikai térkép megjelenítése </label>
            </td>
            <td width="18">
                <img class="pmap_options_toggler" src="https://dshu.innogamescdn.com/8.97/34483/graphic//icons/slide_down.png">
            </td>
        </tr>
        <tr id="pmap_options" style="display: none;">
            <td style="padding-left:8px;" colspan="3">
                <label> 
                        <input type="radio" id="pmap_filter1" value="1" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter"> 
                        Minden megjelenítése 
                    </label>
                <br>
                <label>
                        <input type="radio" id="pmap_filter2" value="2" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter" checked="checked">
                        Minden klán megjelenítése 
                    </label>
                <br>
                <label>
                        <input type="radio" id="pmap_filter3" value="3" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter">
                        Csak a saját klán megjelenítése 
                    </label>
                <br>
                <label>
                    <input type="radio" id="pmap_filter4" value="4" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter"> Saját falvak megjelenítése </label><br> <br> <label><input type="checkbox" id="pmap_show_topo" onclick="TWMap.politicalMap.toggle(false);"> Megjelenítés a minitérképen </label><br> <label><input type="checkbox" checked="checked" id="pmap_show_map" onclick="TWMap.politicalMap.toggle(false);"> Megjelenítés térképen </label> </td>
        </tr>
        <tr>
            <td> <input type="checkbox" id="show_popup" checked="checked"> </td>
            <td> <label for="show_popup">Mutasd a felugró ablakot</label> </td>
            <td width="18"> <img src="https://dshu.innogamescdn.com/8.97/34483/graphic//icons/slide_down.png" class="popup_options_toggler"> </td>
        </tr>
        <tr id="popup_options" style="display: none;">
            <td style="padding-left:8px" colspan="3">
                <form id="form_map_popup">
                    <table>
                        <tbody>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_attack" id="map_popup_attack"> </td>
                                <td> <label for="map_popup_attack">Utolsó támadás megjelenítése</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_attack_intel" id="map_popup_attack_intel"> </td>
                                <td> <label for="map_popup_attack_intel">Info megjelenítése</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" name="map_popup_moral" id="map_popup_moral"> </td>
                                <td> <label for="map_popup_moral">Mutasd a morált</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_res" id="map_popup_res"> </td>
                                <td> <label for="map_popup_res">Mutasd a nyersanyagokat</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_pop" id="map_popup_pop"> </td>
                                <td> <label for="map_popup_pop">Mutasd a népességet</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" name="map_popup_trader" id="map_popup_trader"> </td>
                                <td> <label for="map_popup_trader">Mutasd a kereskedőket</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_reservation" id="map_popup_reservation"> </td>
                                <td> <label for="map_popup_reservation">Nemesi igények megjelenítése</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" onclick="$(\'#map_popup_units_home\').prop(\'disabled\', this.checked ? \'\' : \'disabled\').attr(\'checked\', \'\')" name="map_popup_units" id="map_popup_units"> </td>
                                <td> <label for="map_popup_units">Mutasd a csapatokat</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_units_home" id="map_popup_units_home"> </td>
                                <td> <label for="map_popup_units_home">Helyi csapatok megjelenítése</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_units_times" id="map_popup_units_times"> </td>
                                <td> <label for="map_popup_units_times">Mutasd a csapatok menetidejét</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" name="map_popup_flag" id="map_popup_flag"> </td>
                                <td> <label for="map_popup_flag">Mutasd a zászlót</label> </td>
                            </tr>
                            <tr>
                                <td> <input type="checkbox" checked="checked" name="map_popup_notes" id="map_popup_notes"> </td>
                                <td> <label for="map_popup_notes">Falu-jegyzetek megtekintése</label> </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </td>
        </tr>`


        this._preventTW()
        this._inject()
        this._connectFunctions()
        this._setDefaults()
        this._checkBeacon()
    }

    _preventTW() {
        TWMap.mobile = true
        TWMap.premium = true;
    }

    _inject() {
        $("#map_config  table:eq(1) tr:gt(3)").remove()
        $("#map_config  table:eq(1)").append(this._premiumMapPanel)
    }

    _connectFunctions() {
        $(".pmap_options_toggler").click(function() {
            $("#pmap_options").toggle()
        })
        $(".popup_options_toggler").click(function() {
            $("#popup_options").toggle()
        })


        $("#Full_Map").click(function() {
            TWMap.goFullscreen();
        })
        $("#map_size").change(function() {
            TWMap.resize(parseInt($("#map_size").val()))
        })
        $("#minimap_size").change(function() {
            TWMap.resizeMinimap(parseInt($("#minimap_size").val()))
        })
    }

    _setDefaults() {

        console.log(this.config)

        TWMap.resize(parseInt(this.config.map))
        TWMap.resizeMinimap(parseInt(this.config.miniMap))


        $('#minimap_size option[value="' + this.config.miniMap + '"]').prop('selected', true)
        $('#map_size option[value="' + this.config.map + '"]').prop('selected', true)
    }

    _checkBeacon() {
        var url = new UrlManipulator();

        if (url.getParam("beacon") == 1) {

            let hash = url.getHash().replace("#", "")

            let x = parseInt(hash.split(";")[0] - 1)
            let y = parseInt(hash.split(";")[1] - 1)

            console.log(x + ";" + y)

            $("div.center_beacon").hide()

            if (!isNaN(x) && !isNaN(y)) {
                TWMap.focusUserSpecified(x, y)
            } else {
                setTimeout(this._checkBeacon, 700)
            }

        }
    }

}


//**** Extra Info ****//

/* console.log("TEST")
last_pos = ""

c1 = $("#mapx").val() + "|" + $("#mapy").val()


$("#map_popup").bind("DOMSubtreeModified", function() {

    cur_pos = $("#info_content  th").text()


    if (cur_pos != last_pos) {
        //console.log(last_pos+"  -  "+cur_pos);
        last_pos = cur_pos

        c2 = $("#info_content  th").text().match(/\d{3}\|\d{3}/g)[0]
        //console.log(Calc_Distance(c1,c2))

        distance = Calc_Distance(c1, c2)

        $("#info_content  tr:last").after("<tr><td>Távolság:</td><td>" + Math.round(distance) + "</td></tr>")
        $("#info_content  tr:last").after("<tr><td colspan='2'>" + GetSpeedTable(distance) + "</td></tr>")

    }

}); */

class VillageDB {

    constructor(config) {

        this._config = config
        this._villages = config.getVillages()

        this._url = new UrlManipulator()

        this._currentVillage = null
        this._prevVillage = null
        this._nextVillage = null

        this._init()

    }

    getVillages() {

        let villages = []

        $("#production_table tr.nowrap").each(function() {
            let name = $(this).text().trim()
            let id = $(this).find(".quickedit-vn").attr("data-id")
            let realname = name.substring(0, name.lastIndexOf("(")).trim()
            let cont = name.substring(name.lastIndexOf("("), name.length).trim().match(/K\d\d/)[0]
            let coord = $(this).text().trim().match(/\d{3}\|\d{3}/)[0]
            let nameHtml = $(this).find("td:eq(0)").html().trim()
            let pointHtml = $(this).find("td:eq(1)").text()

            villages[villages.length] = {
                "name": realname,
                "point": pointHtml,
                "nameHtml": nameHtml,
                "id": id,
                "coord": coord,
                "continent": cont
            };
        })

        this._config.setVillages(villages)

        this._config.save()
    }

    includeNavigator() {

        let prevURL = this._url.setParam("village", this._prevVillage)
        let nextURL = this._url.setParam("village", this._nextVillage)

        let html = `<a href="` + this.prevURL + `">
                    <img src="">
                </a>
                <a href="` + this.nextURL + `">
                    <img src="' + IMG_Next + '">
                </a>
                <a id="villListButt" href="#"><img src="' + IMG_Down + '"></a>`

        $("#menu_row2 > td:eq(1)").append(html)
    }

    _init() {

        this._currentVillage = this._url.getParam("village")

        for (let i = 0; i < this._villages.length; i++) {

            if (this._villages[i].id == this._currentVillage) {

                //previous
                if (i - 1 >= 0) {
                    this._prevVillage = this._villages[i - 1].id
                } else {
                    this._prevVillage = this._villages[this._villages.length - 1].id
                }

                //Next
                if (i + 1 < this._villages.length) {
                    this._nextVillage = this._villages[i + 1].id
                } else {
                    this._nextVillage = this._villages[0].id
                }

            }

        }


    }

}
