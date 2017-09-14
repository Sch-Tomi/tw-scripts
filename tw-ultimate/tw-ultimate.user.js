 // ==UserScript==
 // @name          	TribalWars Ultimate
 // @description     Bunch of scripts what will help you.
 // @icon            https://github.com/Sch-Tomi/tw-scripts/blob/master/images/icon.png?raw=true
 //
 // @author			Schronk Tamás <me@sepehr.ws>
 // @namespace       https://github.com/Sch-Tomi
 // @downloadURL		https://github.com/Sch-Tomi/tw-scripts/raw/master/scripts/tw-ultimate/tw-ultimate.user.js
 //
 // @license         GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
 // @copyright       Copyright (C) 2012, by Sepehr Lajevardi <me@sepehr.ws>
 //
 // @include         https://*.klanhaboru.hu/*
 //
 // @require         https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
 //
 // @version         1.0.1
 // @updateURL		https://github.com/Sch-Tomi/tw-scripts/raw/master/scripts/tw-ultimate/tw-ultimate.user.js
 // @run-at			document-start|document-end
 // @grant           GM_xmlhttpRequest
 // ==/UserScript==

 /**
  * This program is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program. If not, see <http://www.gnu.org/licenses/>.
  */

 /**
  * SCRIPT DESCRIPTION.
  *
  * @see http://wiki.greasespot.net/API_reference
  * @see http://wiki.greasespot.net/Metadata_Block
  */
 (function() {


     // Libs
     function getUserName() {
         return game_data.player.name;
     }

     class Linker {

         constructor() {

         }

         static
         import () {
             let link = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/siimple/2.0/siimple.min.css">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/flexboxgrid/6.3.1/flexboxgrid.min.css" type="text/css" >`

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


     // Components
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


     // config
     class Config {
         constructor() {
             this.config = {};

             if (!this._checkIsInstalled()) {
                 this._install();
             } else {
                 this._loadConfig();
             }
         }

         getLinks() {
             return this.config.links;
         }

         setLinks(newLinks) {
             this.config.links = newLinks
         }

         // True = Installed | False = not...
         _checkIsInstalled() {
             return getValue('config') !== null;
         }


         _install() {
             this.config.version = GM_info.script.version

             this.config.links = [{
                     icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/main.png",
                     text: "Fõhadiszállás",
                     link: "main"

                 },
                 {
                     icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/barracks.png",
                     text: "Kiképzés",
                     link: "train"
                 },
                 {
                     icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/snob.png",
                     text: "Akadémia",
                     link: "snob"
                 },
                 {
                     icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/smith.png",
                     text: "Kovácsműhely",
                     link: "smith"
                 },
                 {
                     icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/place.png",
                     text: "Gyülekező hely",
                     link: "place"
                 },
                 {
                     icon: "http://dshu.innogamescdn.com/8.97/34296/graphic/buildings/market.png",
                     text: "Piac",
                     link: "market"
                 },
                 {
                     icon: "",
                     text: "",
                     link: ""
                 },
                 {
                     icon: "",
                     text: "",
                     link: ""
                 }
             ];

             this.save()
         }

         _loadConfig() {
             this.config = getValue('config');
         }

         save() {
             console.log("Saving Config...")
             console.log(this.config)
             setValue('config', this.config)
         }
     }


     //script starter
     Linker.import()

     var url = new UrlManipulator();
     var isLogged = url.getPath() == "/game.php"

     if (isLogged) {
         var config = new Config();
         var options = new Options(config);


         switch (url.getParam('screen')) {
             case 'info_player':
                 new playerStats()
                 break;

         }

         // Always run!!
         new LinkBar(config.getLinks())
         new Footer(options.open)
     }


 })();
