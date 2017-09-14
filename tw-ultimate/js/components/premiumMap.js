class PremiumMap {

    constructor() {

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
                    <option selected="selected" label="13x13" value="13">13x13</option>
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
                    <option selected="selected" label="120x120" value="120x120">120x120</option>
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
