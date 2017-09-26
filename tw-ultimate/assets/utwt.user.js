// ==UserScript==
// @name         UTWT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ultimate Tribal Wars Tool
// @author       You
// @match        https://hu44.klanhaboru.hu/game.php?*
// @grant        none
// ==/UserScript==


(function () {

    //Variables
    
    //Org IMG
    OrgImgStore = "http://dshu.innogamescdn.com/" + game_data.version.trim().split(" ")[1] + "/" + game_data.version.trim().split(" ")[0] + "/graphic/";
    
    //IMG
    IMG_HQ = OrgImgStore + "buildings/main.png";
    IMG_Barrack = OrgImgStore + "buildings/barracks.png";
    IMG_Acad = OrgImgStore + "buildings/snob.png";
    IMG_Smith = OrgImgStore + "buildings/smith.png";
    IMG_RP = OrgImgStore + "buildings/place.png";
    IMG_Market = OrgImgStore + "buildings/market.png";

    IMG_Next = "https://icons.iconarchive.com/icons/taytel/orb/16/arrow-right-icon.png";
    IMG_Prev = "https://icons.iconarchive.com/icons/taytel/orb/16/arrow-left-icon.png";
    IMG_Down = "https://icons.iconarchive.com/icons/taytel/orb/16/arrow-down-icon.png";


    

    //Others
    version = "1.07.06";


    // VARS
    var cachedSettings = null; // GM friendly function

    //Check for first run
    if (!getValue("configFirstRun") || getValue("configVersion") != version) { loadDefConfig(); }

    //JQUERY Pluss FN

    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };


    //Indítás
    if ($(location).attr('pathname') == "/game.php") {
        switch (urlParam('screen')) {
            case "forum":
                if (getValue("configaddSmileBB") == "true") { addSmileBB(); }
                break;
            case "mail":
                if (urlParam('mode') == "new") addFav();
                break;
            case "map":
                if (getValue("configPremiumMap") == "true") { PremiumMap(); }
                if (getValue("configMapChurch") == "true") { MapChurch(); }
                break;
            case "report":
                if (urlParam('view') != null) {

                    if (getValue("configaddReportTool") == "true") {
                        addReportTool();
                        CopyToSimulator();
                    }
                }
                if (urlParam('view') == null) { if (getValue("configRablasEll") == "true") { /*RablasEll();*/ } }

                break;
            case "info_player":
                if (getValue("configAddStatToPlayer") == "true") { AddStatToPlayer(); }
                break;
            case "overview":
                if (getValue("configBeerkezonyersiGomb") == "true") { BeerkezonyersiGomb(); }
                break;
            case "am_farm":
                if (getValue("configNyersiOsszeado") == "true") { NyersiOsszeado(); }
                if (getValue("configfloatDiv") == "true") { floatDiv(); }
                break;
            case "overview_villages":
                getVillDB();
                changeOverview();
                break;
            case "market":
                addQuickSelectToMarket();
                addVillPreviewTiMarket();
                break;
            case "place":
                addQuickSelectToPlace();
                if (urlParam("mode") == "sim") { PasteToSimulator() }

                //speed
                if (getValue("configNeedSpeed") == "true") { GetSpeeds() }
                break;


            default:
            //alert(urlParam('screen'))
        }

        //Global
        if (getValue("configaddToolBar") == "true") { addToolBar(); }
        if (getValue("configVillageSwitch") == "true") { VillageSwitch(); }
        addSettings();
        addVersion();
    }

    function addVersion() {

        $("#linkContainer").append(" - <a href='#' >BTW Ultimate Tool <span id='checkVersion'>(" + version + ")</span></a>");

    }

    function GetVillageId() {

        return urlParam("village");

    }

    function changeOverview() {

        //MASK
        $("#content_value").children().each(function () { $(this).hide() })
        $("#content_value").append('<img style="display: block; margin: 0 auto;" src="http://fc04.deviantart.net/fs70/f/2013/094/8/d/loading_logofinal_by_zegerdon-d60eb1v.gif">')


        //Make Object
        makeOverviewOBJ();

        //save Product table
        prodTable = $("#production_table").prop('outerHTML')

        //RESET
        $("#content_value").html("")

        //Add menu
        addOverview_menu()

        //Select And Run
        $("#content_value img").remove()

        $("#overview_menu > td:first").attr("class", "selected")
        Overview_Combined();
        $("#content_value").children().each(function () { $(this).show() })

        VillNumPerPages()

    }

    function VillNumPerPages() {

        $("#content_value").append('<table class="vis">\
    <tbody><tr><th colspan="2">Falvak oldalanként:</th><td><input id="DefVillNum" type="text" value="'+ getValue("configDefVillNum") + '" style="width: 50px" name="page_size"></td><td><input id="ChangeDefVill" type="submit" value="OK" class="btn"></td></tr>\
    </tbody></table>')

        $("#ChangeDefVill").click(function () { setValue("configDefVillNum", $("#DefVillNum").val()); BTWNotify('BTW Ultimate Tool', 'Falvak alapszáma megváltozott!'); })

        pNum = Math.ceil(OVO.len / getValue("configDefVillNum"));

        //console.log(pNum)

        $("#overview_menu").after('<div id="PageNum" style="text-align:center" class="vis_item"></div>')

        for (i = 1; i <= pNum; i++) {

            $("#PageNum").append('<a class="paged-nav-item TurnMyPage" pagenum="' + i + '" id="TP-' + i + '" href="#"> [' + i + '] </a>')

        }

        $("#PageNum").append('<a pagenum="all" class="paged-nav-item TurnMyPage" id="TP-all" href="#"> [Összes] </a>')

        $("a.TurnMyPage").click(function () {

            TurnPage($(this).attr("pagenum"))

        })

        TurnToLastPage()

    }

    function TurnToLastPage() {

        $("a#TP-1").changeElementType("strong")
        $("#CONTENT  tr.nowrap").hide()

        min = 0 * getValue("configDefVillNum")
        max = 1 * getValue("configDefVillNum")

        for (i = min; i < max; i++) {

            $("#CONTENT tr.nowrap:eq(" + i + ")").show()

        }

    }

    function TurnPage(page) {

        if ($("#PageNum > strong").length > 0) {
            $("#PageNum > strong").changeElementType("a")
        }
        $("#CONTENT  tr.nowrap").hide()

        //Giveback click FN
        $("a.TurnMyPage").click(function () {

            TurnPage($(this).attr("pagenum"))

        })

        if (page == "all") {

            $("#CONTENT  tr.nowrap").show()
            $("#TP-all").changeElementType("strong")

        } else {

            pNum = Math.ceil(OVO.len / getValue("configDefVillNum"));

            min = (page - 1) * getValue("configDefVillNum")
            max = (page) * getValue("configDefVillNum")

            //console.log(min+" "+max)
            $("#TP-" + page).changeElementType("strong")

            for (i = min; i < max; i++) {

                $("#CONTENT tr.nowrap:eq(" + i + ")").show()

            }


        }

    }

    function addOverview_menu() {

        OmHtml = '<table width="100%" id="overview_menu" class="vis modemenu"><tbody><tr>\
    <td style="text-align:center"><a mymode="Combined" href="#">Kombinált </a></td>\
    <td style="text-align:center"><a mymode="Prod" href="#">Termelés </a></td>\
    <td style="text-align:center"><a mymode="Build" href="#">Épületek </a></td>\
    </tr></tbody></table><div id="CONTENT"></div>'

        $("#content_value").prepend(OmHtml)

        $("#overview_menu  a").each(function () {

            $(this).click(function () {


                SwitchSelected($(this).attr("mymode"))

            })

        })

    }

    function SwitchSelected(fnName) {

        // Selected váltás
        $("#overview_menu > td.selected").attr("class", "")
        $("#overview_menu > td > a[mymode='" + fnName + "']").parent().attr("class", "selected")

        // Reset
        $("#CONTENT").html("")


        // Funkció indítás
        switch (fnName) {

            case "Combined": Overview_Combined(); break;
            case "Prod": Overview_Prod(); break;
            case "Build": Overview_Build(); break;

        }

        TurnToLastPage()

    }

    function Overview_Combined() {

        if (getValue("configIsArcher") == "true") {

            tableHtml = '<table width="100%" style="white-space:nowrap;" class="vis overview_table" id="combined_table"><tbody><tr><th><span class="note-icon"></span></th><th style="text-align:left;"><a href="#">Village</a> (' + OVO.len + ')</th><th><img title="Headquarters" alt="" src="' + OrgImgStore + 'overview/main.png?8720a"></th><th><img title="Barracks" alt="" src="' + OrgImgStore + 'overview/barracks.png?86f55"></th><th><img title="Stable" alt="" src="' + OrgImgStore + 'overview/stable.png?cf624"></th><th><img title="Workshop" alt="" src="' + OrgImgStore + 'overview/garage.png?880ce"></th><th><img title="Smithy" alt="" src="' + OrgImgStore + 'overview/smith.png?6b182"></th><th><img title="Belief" alt="" src="' + OrgImgStore + 'buildings/church.png?55982"></th><th><a href="#"><img title="Farm" alt="" src="' + OrgImgStore + 'overview/farm.png?f726e"></a></th><th style="text-align:center"><a href="#"><img title="Spear fighter" alt="" src="' + OrgImgStore + 'unit/unit_spear.png?48b3b"></a></th><th style="text-align:center"><a href="#"><img title="Swordsman" alt="" src="' + OrgImgStore + 'unit/unit_sword.png?b389d"></a></th><th style="text-align:center"><a href="#"><img title="Axeman" alt="" src="' + OrgImgStore + 'unit/unit_axe.png?51d94"></a></th><th style="text-align:center"><a href="#"><img title="Archer" alt="" src="' + OrgImgStore + 'unit/unit_archer.png?db2c3"></a></th><th style="text-align:center"><a href="#"><img title="Scout" alt="" src="' + OrgImgStore + 'unit/unit_spy.png?eb866"></a></th><th style="text-align:center"><a href="#"><img title="Light cavalry" alt="" src="' + OrgImgStore + 'unit/unit_light.png?2d86d"></a></th><th style="text-align:center"><a href="#"><img title="Mounted archer" alt="" src="' + OrgImgStore + 'unit/unit_marcher.png?ad3be"></a></th><th style="text-align:center"><a href="#"><img title="Heavy cavalry" alt="" src="' + OrgImgStore + 'unit/unit_heavy.png?a83c9"></a></th><th style="text-align:center"><a href="#"><img title="Ram" alt="" src="' + OrgImgStore + 'unit/unit_ram.png?2003e"></a></th><th style="text-align:center"><a href="#"><img title="Catapult" alt="" src="' + OrgImgStore + 'unit/unit_catapult.png?5659c"></a></th><th style="text-align:center"><a href="#""><img title="Paladin" alt="" src="' + OrgImgStore + 'unit/unit_knight.png?58dd0"></a></th><th><a href="#"><img title="Nobleman" alt="" src="' + OrgImgStore + 'unit/unit_snob.png?0019c"></a></th><th><a href="#"><img title="Milicia" alt="" src="' + OrgImgStore + 'unit/unit_militia.png?"></a></th><th><a href="#"><img title="Merchants" alt="" src="' + OrgImgStore + 'overview/trader.png?4df99"></a></th></tr></tbody></table>'
        } else {

            tableHtml = '<table width="100%" style="white-space:nowrap;" class="vis overview_table" id="combined_table"><tbody><tr><th><span class="note-icon"></span></th><th style="text-align:left;"><a href="#">Village</a> (' + OVO.len + ')</th><th><img title="Headquarters" alt="" src="' + OrgImgStore + 'overview/main.png?8720a"></th><th><img title="Barracks" alt="" src="' + OrgImgStore + 'overview/barracks.png?86f55"></th><th><img title="Stable" alt="" src="' + OrgImgStore + 'overview/stable.png?cf624"></th><th><img title="Workshop" alt="" src="' + OrgImgStore + 'overview/garage.png?880ce"></th><th><img title="Smithy" alt="" src="' + OrgImgStore + 'overview/smith.png?6b182"></th><th><img title="Belief" alt="" src="' + OrgImgStore + 'buildings/church.png?55982"></th><th><a href="#"><img title="Farm" alt="" src="' + OrgImgStore + 'overview/farm.png?f726e"></a></th><th style="text-align:center"><a href="#"><img title="Spear fighter" alt="" src="' + OrgImgStore + 'unit/unit_spear.png?48b3b"></a></th><th style="text-align:center"><a href="#"><img title="Swordsman" alt="" src="' + OrgImgStore + 'unit/unit_sword.png?b389d"></a></th><th style="text-align:center"><a href="#"><img title="Axeman" alt="" src="' + OrgImgStore + 'unit/unit_axe.png?51d94"></a></th><th style="text-align:center"><a href="#"><img title="Scout" alt="" src="' + OrgImgStore + 'unit/unit_spy.png?eb866"></a></th><th style="text-align:center"><a href="#"><img title="Light cavalry" alt="" src="' + OrgImgStore + 'unit/unit_light.png?2d86d"></a></th><th style="text-align:center"><a href="#"><img title="Heavy cavalry" alt="" src="' + OrgImgStore + 'unit/unit_heavy.png?a83c9"></a></th><th style="text-align:center"><a href="#"><img title="Ram" alt="" src="' + OrgImgStore + 'unit/unit_ram.png?2003e"></a></th><th style="text-align:center"><a href="#"><img title="Catapult" alt="" src="' + OrgImgStore + 'unit/unit_catapult.png?5659c"></a></th><th style="text-align:center"><a href="#""><img title="Paladin" alt="" src="' + OrgImgStore + 'unit/unit_knight.png?58dd0"></a></th><th><a href="#"><img title="Nobleman" alt="" src="' + OrgImgStore + 'unit/unit_snob.png?0019c"></a></th><th><a href="#"><img title="Milicia" alt="" src="' + OrgImgStore + 'unit/unit_militia.png?"></a></th><th><a href="#"><img title="Merchants" alt="" src="' + OrgImgStore + 'overview/trader.png?4df99"></a></th></tr></tbody></table>'


        }

        $("#CONTENT").append(tableHtml)


        //FILL IT!!!


        $.each(OVO.VDB, function (key, value) {

            trHtml = '<tr class="nowrap">\
    <td></td>\
    <td>\
    \
    <span class="quickedit-vn">\
    <span class="quickedit-content">\
    <a href="/game.php?village='+ key + '&amp;screen=overview">\
    <span class="quickedit-label">'+ OVO.VDB[key].nameHtml + '</span>\
    </a>\
    \
    </span>\
    </span>\
    </td>'


            PTA = OVO.VDB[key].troops.split(",")
            troopsHTML = ""

            for (i = 0; i < PTA.length; i++) {

                if (PTA[i] != 0) {

                    troopsHTML += "<td class='unit-item'>" + PTA[i] + "</td>"

                } else {

                    troopsHTML += "<td class='hidden'>" + PTA[i] + "</td>"

                }

            }

            RecHTML = ""
            RECDB = OVO.VDB[key].militaryRec

            RECLink = ["barracks", "stable", "garage"]

            for (i = 0; i < 3; i++) {

                if (RECDB[i]) {

                    RecHTML += '<td><a href="/game.php?village=2243&amp;screen=' + RECLink[i] + '"><img class="status-icon" alt="" title="Recruitment" src="' + OrgImgStore + '/overview/prod_running.png"></a></td>'

                } else {

                    RecHTML += '<td><a href="/game.php?village=2243&amp;screen=' + RECLink[i] + '"><img class="status-icon" alt="" title="No recruitment" src="' + OrgImgStore + '/overview/prod_avail.png"></a></td>'

                }

            }

            MainHtml = '<td><a href="/game.php?village=2243&amp;screen=main"><img class="status-icon" alt="" title="No production" src="' + OrgImgStore + '/overview/prod_avail.png"></a></td>'

            OtherHtml = '<td><a href="/game.php?village=2243&amp;screen=smith"><img class="status-icon" alt="" title="Research possible" src="' + OrgImgStore + '/overview/prod_avail.png"></a></td>\
    <td><img class="status-icon" alt="" title="Religious" src="'+ OrgImgStore + '/overview/prod_running.png"></td>	\
    <td><a href="/game.php?village='+ OVO.VDB[key].id + '&amp;screen=farm">' + (OVO.VDB[key].pop_max - OVO.VDB[key].pop) + ' (' + OVO.VDB[key].buildings.farm + ')</a></td>'


            FinalHtml = trHtml + MainHtml + RecHTML + OtherHtml + troopsHTML + '<td><a href="/game.php?village=2243&amp;screen=market">' + OVO.VDB[key].trader + '</a></td></tr>'

            $("#combined_table").append(FinalHtml)

        });


    }

    function Overview_Prod() {

        $("#CONTENT").append(prodTable)

    }

    function Overview_Build() {

        BuildHtml = '<table width="100%" class="vis overview_table" id="buildings_table">\
    <thead >\
    <tr id="BuildHead">\
    <th><a href="#" class="hammer-icon" id="get_all_possible_build">\
    &nbsp;\
    </a></th>\
    <th><a href="#" class="destroy-icon" id="get_all_possible_destroy">\
    &nbsp;\
    </a></th>\
    <th style="text-align: left;"><a href="#">Village</a> ('+ OVO.len + ')</th>\
    <th style="text-align: left;"><a href="#">Points</a></th>\
    </tr>\
    </thead>\
    <tbody id="BuildVillages">\
    </tbody>\
    </table>'



        fv = Object.keys(OVO.VDB)[0];


        buildings = ""

        for (i = 0; i < Object.keys(OVO.VDB[Object.keys(OVO.VDB)[0]].buildings).length; i++) {

            if (Object.keys(OVO.VDB[Object.keys(OVO.VDB)[0]].buildings)[i] != "village") {

                buildings += '<th><img title="' + Object.keys(OVO.VDB[Object.keys(OVO.VDB)[0]].buildings)[i] + '" alt="" src="' + OrgImgStore + '/buildings/' + Object.keys(OVO.VDB[Object.keys(OVO.VDB)[0]].buildings)[i] + '.png"></th>'

            }

        }

        villTR = ""

        $.each(OVO.VDB, function (key, value) {

            villTR += '<tr class="nowrap">\
    <td class="build_icon">\
    <a href="/game.php?village='+ OVO.VDB[key].id + '&screen=main&mode=build" class="hammer-icon">&nbsp;</a>\
    </td>\
    <td class="destroy_icon translucent">\
    <a href="/game.php?village='+ OVO.VDB[key].id + '&screen=main&mode=destroy" class="destroy-icon">&nbsp;</a>\
    </td>\
    <td class="nowrap">\
    <span>\
    <a href="/game.php?village='+ OVO.VDB[key].id + '&amp;screen=main">\
    <span>'+ OVO.VDB[key].nameHtml + '</span>\
    </span>\
    </td>\
    <td>'+ OVO.VDB[key].points + '</td>'

            $.each(OVO.VDB[key].buildings, function (key, value) {

                if (key != "village") {

                    if (value == 0) {

                        villTR += '<td><span class="hidden">0</span></td>'

                    } else {

                        villTR += '<td>' + value + '</td>'

                    }

                }

            })

            villTR += '</tr>'





        })




        $("#CONTENT").append(BuildHtml)
        $("#BuildHead").append(buildings)
        $("#BuildVillages").append(villTR)

    }

    function makeOverviewOBJ() {

        villages = JSON.parse(getValue("villDB"))

        OVO = new Object();

        OVO.len = $("#production_table  tr.nowrap").length
        OVO.VDB = {}

        $.each(villages, function (k, v) {

            id = v.id
            cont = v.conti

            faluHtml = v.nameHtml

            pointHtml = v.pointHtml

            // Troops and Buildings and other info
            $.ajax({
                url: "http://" + getSubDomain() + ".klanhaboru.hu/game.php?village=" + id + "&screen=place&mode=units",
                async: false
            })
                .done(function (html) {

                    gd = html.match(/var game_data = {(.*)};/g);

                    gd = gd[0].replace('var game_data = ', '')

                    gd = gd.replace("};", "}")

                    permOBj = JSON.parse(gd)

                    troops = []

                    $(html).find("#units_home  tr:last > th").each(function () {

                        if ($(this).index() != 0) {
                            troops.push($(this).text())
                        }

                    })

                    OVO.VDB[id] = {
                        id: permOBj.village.id,
                        coord: permOBj.village.coord,
                        continent: cont,
                        name: permOBj.village.name,
                        pop: permOBj.village.pop,
                        pop_max: permOBj.village.pop_max,
                        storage_max: permOBj.village.storage,
                        wood: permOBj.village.wood,
                        stone: permOBj.village.stone,
                        iron: permOBj.village.iron,
                        trader_away: permOBj.village.trader_away,
                        buildings: permOBj.village.buildings,
                        troops: troops.toString(),
                        points: pointHtml,
                        nameHtml: faluHtml

                    }


                    //console.log(permJoinner)

                    //OVO.VDB[id]=permJoinner*/

                });

            // trader info
            $.ajax({
                url: "http://" + getSubDomain() + ".klanhaboru.hu/game.php?village=" + id + "&screen=market&mode=traders",
                async: false
            })
                .done(function (html) {

                    OVO.VDB[id].trader = $(html).find("#content_value").text().match(/\d+\/\d+/g)[0]

                });


            //Get Barrack Stable Workshop
            $.ajax({
                url: "http://" + getSubDomain() + ".klanhaboru.hu/game.php?village=" + id + "&screen=train",
                async: false
            })
                .done(function (html) {

                    military = [false, false, false]

                    if ($(html).find("#trainqueue_wrap_barracks").length > 0) {

                        military[0] = true;

                    }

                    if ($(html).find("#trainqueue_wrap_stable").length > 0) {

                        military[1] = true;

                    }

                    if ($(html).find("#trainqueue_wrap_garage").length > 0) {

                        military[2] = true;

                    }

                    OVO.VDB[id].militaryRec = military

                });


        })

        console.log(OVO)
    }


    function CheckSubs() {

        if (urlParam("t") != null) {

            return "t=" + urlParam("t") + "&";

        } else { return ""; }

    }

    function addIcon(where, img, title, screen) {

        icon_html = '<a href="/game.php?' + CheckSubs() + 'village=' + GetVillageId() + '&amp;screen=' + screen + '">\
    <img class="" alt="" title="" src="'+ img + '">' + title + '</a>'

        $("#" + where).append(icon_html)

    }

    function addToolBar() {
        ToolBarCode = "<div id='ToolBar' style='text-align:center;padding:5px;margin-bottom:10px' class='content-border'></div>"

        $("#header_info").before(ToolBarCode)

        addIcon("ToolBar", IMG_HQ, "Fõhadiszállás", "main")
        addIcon("ToolBar", IMG_Barrack, "Kiképzés", "train")
        addIcon("ToolBar", IMG_Acad, "Akadémia", "snob")
        addIcon("ToolBar", IMG_Smith, "Kovácsmûhely", "smith")
        addIcon("ToolBar", IMG_RP, "Gyülekezõhely", "place")
        addIcon("ToolBar", IMG_Market, "Piac", "market")

    }

    function getVillDB() {

        villages = new Object()
        i = 0;
        $.ajax({
            url: "http://" + getSubDomain() + ".klanhaboru.hu/game.php?village=" + GetVillageId() + "&mode=prod&page=-1&screen=overview_villages",
            async: false
        }).done(function (html) {
            $(html).find("#production_table").find("span.quickedit-vn").each(function () {

                name = $(this).text().trim()
                realname = name.substring(0, name.lastIndexOf("(")).trim()
                conti = name.substring(name.lastIndexOf("("), name.length).trim().match(/K\d\d/)
                nameHtml = $($(this).parents()[0]).html()
                pointHtml = $($(this).parents()[1]).find("td:eq(1)").html()



                villages[i] = { "name": realname, "pointHtml": pointHtml, "nameHtml": nameHtml, "id": $(this).attr("data-id"), "coord": $(this).text().trim().match(/\d{3}\|\d{3}/)[0], "continent": conti[0] };

                i++;
            })
            setValue("villDB", JSON.stringify(villages))
        });
    }

    function VillageSwitch() {

        villages = JSON.parse(getValue("villDB"))

        shortvs = []
        VillList = "";
        objLen = Object.keys(villages).length



        for (i = 0; i < objLen; i++) {
            //VillList+="<a href='/game.php?village="+villages[i].id+"&amp;screen=overview'><span style='padding:10px'><span class='icon header village'></span>"+villages[i].name+"</span></a><br/>"
            shortvs.push(villages[i].id)

            URL = setURLParameter("village", villages[i].id)

            VillList += '<tr>\
    <td>\
    <a href="/game.php'+ URL + '">' + villages[i].name + '</a>\
    </td>\
    <td class="selected" style="font-weight:bold; width:100px; text-align:right">'+ villages[i].coord + '</td>\
    </tr>'


        }

        VillEnc = new EnhancedArray(shortvs);

        VillEnc.setCounter(shortvs.indexOf(GetVillageId()))

        nextVill = setURLParameter("village", VillEnc.pnext())
        prevVill = setURLParameter("village", VillEnc.pprev())



        html = '<a href="http://' + getSubDomain() + '.klanhaboru.hu/game.php' + prevVill + '"><img src="' + IMG_Prev + '"></a>\
    <a href="http://'+ getSubDomain() + '.klanhaboru.hu/game.php' + nextVill + '"><img src="' + IMG_Next + '"></a>\
    <a id="villListButt" href="#"><img src="'+ IMG_Down + '"></a>'

        //console.log(html)

        $("#menu_row2 > td:eq(1)").append(html)

        // LENYÍLó

        //leHtml='<div id="villList" style="width:320px" class="content-border">'+VillList+'</div>'

        /*$("tr.newStyleOnly:first > td").append(leHtml)
        $("#villListButt").click(function(){$("#villList").toggle()})
        $("#villList").hide();*/



        le2Html = '<div id="group_popup" class="popup_style ui-draggable" style="width: 400px; position: fixed; top: 62px; left: 409px; display: block;"><div id="group_popup_menu" class="popup_menu">Falu csoportok<a href="#" id="closelink_group_popup">X</a></div><div id="group_popup_content" class="popup_content" style="height: 380px; overflow-y: auto;"><form id="select_group_box" action="/game.php?t=1319962&amp;village=7141&amp;ajax=load_villages_from_group&amp;mode=overview&amp;screen=groups" method="POST"><input type="hidden" name="mode" value="overview"><p style="margin: 0 0 10px 0; font-weight: bold;">Csoport:<select id="group_id" name="group_id" style="margin-left: 3px;"><option value="0" selected="selected">összes</option></select></p></form><div id="group_list_content" style="overflow: auto; height: 340px;"><table width="100%" cellspacing="0" cellpadding="5" class="vis" id="group_table">\
    <tbody>\
    <tr>\
    <th colspan="2" class="group_label">Falu</th>\
    </tr>\
    </tbody>\
    </table>\
    <div id="group_popup_content_container"><table width="100%" cellspacing="0" cellpadding="5" class="vis" id="group_table"><tbody>'+ VillList + '</tbody></table></div></div></div></div>'


        $("body").append(le2Html)
        $("#villListButt").click(function () { $("#group_popup").toggle() })
        $("#closelink_group_popup").click(function () { $("#group_popup").toggle() })
        $("#group_popup").hide();


        // KeyBoard shortCut

        $(document).bind('keypress', 'a', function () { window.location = '/game.php' + prevVill });
        $(document).bind('keypress', 'd', function () { window.location = '/game.php' + nextVill });
    }

    function EnhancedArray(a) {
        if (typeOf(a) != "array")
            throw ("Did not get an array");

        var counter = 0;
        var internalArray = a;

        this.next = function () {
            counter++;

            console.log("length: " + internalArray.length)

            if (counter > (internalArray.length - 1)) {
                counter = 0;
            }
            return internalArray[counter];
        }

        this.prev = function () {
            counter--;
            if (counter < 0) {
                counter = (internalArray.length - 1);
            }
            return internalArray[counter];
        }

        this.pprev = function () {
            pcounter = counter
            pcounter--;
            if (pcounter < 0) {
                pcounter = (internalArray.length - 1);
            }


            return internalArray[pcounter]

        }

        this.pnext = function () {

            pcounter = counter

            pcounter++;

            if (pcounter > (internalArray.length - 1)) {
                pcounter = 0;
            }


            return internalArray[pcounter]

        }

        this.current = function () {
            return internalArray[counter];
        }

        this.setCounter = function (NewCounter) {
            counter = NewCounter;
        }

        this.getCounter = function () {
            return counter;
        }
    }

    function typeOf(value) {
        var s = typeof value;
        if (s === 'object') {
            if (value) {
                if (value instanceof Array) {
                    s = 'array';
                }
            } else {
                s = 'null';
            }
        }
        return s;
    }

    function PasteToSimulator() {

        if (getValue("NeedPaste") == "true") {

            console.log(getValue("NeedPaste"))

            att = getValue("Paste_att").split(",")
            def = getValue("Paste_def").split(",")

            pasteData(att, def, getValue("Paste_Style"))

            setValue("NeedPaste", false)

        }

    }

    function pasteData(att, def, style) {

        ln = $(".unit_link").length

        for (i = 0; i < ln; i++) {
            if (style != "def") {
                $("#simulator_units_table > tbody > tr:eq(" + (i + 2) + ")>td:eq(1)>input").val((att[i] != 0) ? att[i] : "")
            }

            $("#simulator_units_table > tbody > tr:eq(" + (i + 2) + ")>td:eq(2)>input").val((def[i] != 0) ? def[i] : "")

        }

    }

    function CopyToSimulator() {

        cptsHtml = '<br/><a href="#copyall" id="copyall">» Csapatok másolása a szimulátorba</a><br/><a id="copydef" href="#copydef">» Védekezők másolása a szimulátorba</a><br/><a href="#copysurv" id="copysurv">» Túlélők másolása a szimulátorba</a>'

        $("#attack_info_def").parent().append(cptsHtml)

        //data
        att = GetUnitsToCopy("attack_info_att_units")
        def = GetUnitsToCopy("attack_info_def_units")

        att = att.split("||")
        def = def.split("||")

        $("#copyall").click(function () {

            setValue("NeedPaste", true)
            setValue("Paste_Style", "all")
            setValue("Paste_att", att[0])
            setValue("Paste_def", def[0])

            window.open(window.location.toString().split("/ga")[0] + "/game.php?village=" + urlParam("village") + "&screen=place&mode=sim")

        })

        $("#copydef").click(function () {

            setValue("NeedPaste", true)
            setValue("Paste_Style", "def")
            setValue("Paste_att", att[0])
            setValue("Paste_def", def[0])

            window.open(window.location.toString().split("/ga")[0] + "/game.php?village=" + urlParam("village") + "&screen=place&mode=sim")
        })


        $("#copysurv").click(function () {

            setValue("NeedPaste", true)
            setValue("Paste_Style", "surv")
            setValue("Paste_att", att[2])
            setValue("Paste_def", def[2])

            window.open(window.location.toString().split("/ga")[0] + "/game.php?village=" + urlParam("village") + "&screen=place&mode=sim")
        })



    }

    function GetUnitsToCopy(id) {

        sent = []
        lost = []
        surv = []

        ln = $("#" + id + " > tbody > tr:eq(1) > td ").length

        for (i = 1; i < ln; i++) {

            sent.push($("#" + id + " > tbody > tr:eq(1) > td:eq(" + i + ") ").text())
            lost.push($("#" + id + " > tbody > tr:eq(2) > td:eq(" + i + ") ").text())
            surv.push($("#" + id + " > tbody > tr:eq(1) > td:eq(" + i + ") ").text() - $("#" + id + " > tbody > tr:eq(2) > td:eq(" + i + ") ").text())
        }

        return sent.toString() + "||" + lost.toString() + "||" + surv.toString()

    }

    function addReportTool() {

        report_html = '<td valign="top"><form target="ReportFrame" method="post" id="ReportToolForm"><h2>Jelentés Konvertáló</h2><table><tr><td><fieldset style="width:200px;height: 30px;">\
    <legend>jelentés típusa</legend>\
    <label><input id="jel-spoil" type="checkbox"  name="opcje[spoiler]" style="margin-left: 10px;">[spoiler][/spoiler]</label><br />\
    </fieldset></td></tr>\
    <tr><td class="second">\
    <fieldset style="height: 65px;">\
    <legend>\hide attacker\'s data</legend>\
    <label style="display: inline">\
    <input type="checkbox" id ="t-name"  name="ukryj[agresor][nick]">\
    username								</label><br />\
    <label style="display: inline">\
    <input type="checkbox" id ="t-vill"  name="ukryj[agresor][wioska]">\
    village								</label><br />\
    <label style="display: inline">\
    <input type="checkbox" id ="t-unit"  name="ukryj[agresor][wojska]">\
    units								</label><br />\
    <br>\
    </fieldset>\
    <fieldset style="height: 85px;">\
    <legend>\hide defender\'s data</legend>\
    <label style="display: inline">\
    <input type="checkbox" id="v-name" name="ukryj[obronca][nick]">\
    username								</label><br />\
    <label style="display: inline">\
    <input type="checkbox" id="v-vill"  name="ukryj[obronca][wioska]">\
    village								</label><br />\
    <label style="display: inline">\
    <input type="checkbox" id="v-unit"  name="ukryj[obronca][wojska]">\
    units								</label><br />\
    <label style="display: inline">\
    <input type="checkbox" id="v-spy"  name="ukryj[obronca][szpiegostwo]">\
    kémkedés								</label><br />\
    </fieldset>\
    </td></tr>\
    <tr><td><button id="report_converter" type="button" >Konvertálás</button></td></tr>\
    </table>\
    <textarea cols="52" rows="12" name="query" id="query" style="display:none;"></textarea></form>\
    </td>'

        $("#content_value > table > tbody > tr:first").append(report_html)
        $("#report_converter").click(sendReport)

    }

    function sendReport() {


        report_text = GetReportText();

        console.debug(report_text)

        $("#ReportToolForm > table > tbody").append("<tr><td><textarea id='thereport' style='width:210px;height:230px' >" + report_text + "</textarea></td></tr>")

        $("#thereport").select()


    }

    function GetReportText() {


        returntext = ""

        tema = $("th[width=400] > span > span > span").text().trim() + "\n"

        date = $("#content_value > table > tbody > tr > td:eq(1) > table > tbody > tr > td > table:eq(1) > tbody > tr:eq(1) > td:first").text().trim() + ":\t"
        date += "[b]" + $("#content_value > table > tbody > tr > td:eq(1) > table > tbody > tr > td > table:eq(1) > tbody > tr:eq(1) > td:eq(1)").text().trim() + "[/b]\n"

        wintext = "[size=11][b]" + $("h3").text() + "[/b][/size]\n"

        luck = "Szerencse: [b][color=grey]" + $("#attack_luck").text().trim() + "[/color][/b]\n"


        moraleH = $("div.report_transparent_overlay > h4:eq(1)").text().split(" ")
        morale = moraleH[0] + " [b]" + moraleH[1] + "[/b]\n"

        //night
        nightbonus = "[color=darkblue][b]" + $("div.report_transparent_overlay > h4:eq(2)").text() + "[/b][/color]\n"

        //att
        attPH = $("#attack_info_att > tbody > tr:first > th").text().trim().split(":")
        attP = "[color=red][b]Támadó:[/b] [player]" + attPH[1] + "[/player] [/color]\n"
        attF = "[color=red]Falu: [coord]" + $("#attack_info_att > tbody > tr:eq(1) > td").text().trim().match(/\d{3}\|\d{3}/) + "[/coord][/color]\n"
        attU = GetReportUnits("attack_info_att_units") + "\n"

        //def
        defPH = $("#attack_info_def > tbody > tr:first > th").text().trim().split(":")
        defP = "[color=green][b]Védekező:[/b] [player]" + defPH[1] + "[/player][/color]\n"
        defF = "[color=green]Falu: [coord]" + $("#attack_info_def > tbody > tr:eq(1) > td").text().trim().match(/\d{3}\|\d{3}/) + "[/coord][/color]\n"
        defU = GetReportUnits("attack_info_def_units") + "\n"




        if ($("#t-name").prop('checked')) { attP = "[color=red][b]Védekező:[/b]A Jelentés Tulajdonosa által elrejtve[/color]\n" }
        if ($("#t-vill").prop('checked')) { attF = "[color=red]Falu:A Jelentés Tulajdonosa által elrejtve[/color]\n" }
        if ($("#t-unit").prop('checked')) { attU = "A Jelentés Tulajdonosa által elrejtve\n" }

        returntext += "\n\n"

        if ($("#v-name").prop('checked')) { defP = "[color=green][b]Védekező:[/b] A Jelentés Tulajdonosa által elrejtve[/color]\n" }
        if ($("#v-vill").prop('checked')) { defF = "[color=green]Falu: A Jelentés Tulajdonosa által elrejtve[/color]\n" }
        if ($("#v-unit").prop('checked')) { defU = "A Jelentés Tulajdonosa által elrejtve\n" }

        returntext = "[quote]" + wintext + "[quote]" + date + luck + morale + nightbonus + "[/quote]\n\n" + attP + attF + attU + "\n\n" + defP + defF + defU



        //spy
        if ($("#attack_spy").length) {

            if (!$("#v-spy").prop('checked')) {
                returntext += "\n\n" + GetSpyRepo()
            }
        }

        //attresult
        if ($("#attack_results").length) {

            returntext += "\n\n" + GetAttResRepo()

        }

        //quote lezárása
        returntext += "[/quote]"

        if ($("#jel-spoil").prop('checked')) {

            h = "[b][player]" + attPH[1] + "[/player] VS. [player]" + defPH[1] + "[/player][/b][spoiler]"
            returntext = h + returntext + "[/spoiler]"
        }


        return returntext;

    }

    function GetAttResRepo() {

        ln = $("#attack_results > tbody > tr").length

        nyersi = $("#attack_results > tbody > tr:first> td:first").text().split(" ")
        nyersitxt = "[img]http://www.extremetw.com/images/wood.png[/img]" + nyersi[1] + "[img]http://www.extremetw.com/images/clay.png[/img]" + nyersi[3] + "[img]http://www.extremetw.com/images/iron.png[/img]" + nyersi[5] + " " + $("#attack_results > tbody > tr:first> td:last").text().trim()

        artext = "[table][**]Zsákmány:[|]" + nyersitxt + "[/**]"

        for (ati = 1; ati < ln; ati++) {

            artext += "[**]" + $("#attack_results > tbody > tr:eq(" + ati + ")> th:first").text() + "[|]" + $("#attack_results > tbody > tr:eq(" + ati + ")> td:last").text().trim() + "[/**]"

        }

        return artext + "[/table]"

    }

    function GetSpyRepo() {

        ln = $("#attack_spy > tbody > tr").length

        spytext = "[size=11][b]Kémkedés[/b][/size][table]"

        nyersi = $("#attack_spy > tbody > tr:eq(0) > td").text().split(" ")
        nyersitxt = "[img]http://www.extremetw.com/images/wood.png[/img]" + nyersi[1] + "[img]http://www.extremetw.com/images/clay.png[/img]" + nyersi[3] + "[img]http://www.extremetw.com/images/iron.png[/img]" + nyersi[5]


        spytext += "[**]" + $("#attack_spy > tbody > tr:eq(0) > th").text() + "[|]" + nyersitxt + "[/**]"
        spytext += "[**]" + $("#attack_spy > tbody > tr:eq(1) > th").text() + "[|]" + $("#attack_spy > tbody > tr:eq(1) > td").text().replace(/\t/gi, "") + "[/**][/table]"

        if (ln == 4) {

            spytext += "[table][**][b]Egységek a falun kívül:[/b][/**][/table][table]"

            ln2 = $("#attack_spy > tbody > tr:last > td > table > tbody > tr:first>th").length
            tr1 = "[**]"
            tr2 = "[*]"
            for (ii = 0; ii < ln2; ii++) {

                tr1 += "[img]" + $("#attack_spy > tbody > tr:last > td > table > tbody > tr:first>th:eq(" + ii + ")>img").attr("src") + "[/img][||]"
                tr2 += $("#attack_spy > tbody > tr:last > td > table > tbody > tr:last>td:eq(" + ii + ")").text() + "[|]"
            }

            tr1 = tr1.slice(0, -4) + "[/**]"
            tr2 = tr2.slice(0, -3)
            spytext += tr1 + tr2 + "[/table]"

        }


        return spytext;

    }

    function GetReportUnits(id) {

        ln = $("#" + id + " > tbody > tr:eq(1) > td ").length

        console.log(ln)

        head = "[**][b]Egységek[/b][||]"
        sent = "[*]mennyiség[|]"
        lost = "[*]veszteségek[|]"
        surv = "[*]túlélők[|]"

        for (i = 1; i < ln; i++) {

            head += "[img]" + $("#" + id + " > tbody > tr:eq(0) > td:eq(" + i + ") > img ").attr("src") + "[/img][||]"
            sent += $("#" + id + " > tbody > tr:eq(1) > td:eq(" + i + ") ").text() + "[|]"
            lost += $("#" + id + " > tbody > tr:eq(2) > td:eq(" + i + ") ").text() + "[|]"
            surv += $("#" + id + " > tbody > tr:eq(1) > td:eq(" + i + ") ").text() - $("#" + id + " > tbody > tr:eq(2) > td:eq(" + i + ") ").text() + "[|]"
        }

        head = head.slice(0, -4)
        head += "[/**]"
        sent = sent.slice(0, -3)
        lost = lost.slice(0, -3)
        surv = surv.slice(0, -3)


        returntext = "[table]" + head + sent + lost + surv + "[/table]"


        return returntext;

    }

    function RablasEll() {

        for (i = 1; i < 13; i++) {

            if ($("#report_list > tbody > tr:eq(" + i + ") > td:eq(1) > img").attr("src") != null) {

                href = $("#report_list > tbody > tr:eq(" + i + ") > td:eq(1) > span > span > a").attr("href")

                $.ajax({
                    url: href,
                    async: false
                }).done(function (html) {
                    zsak = $(html).find("#attack_results> tbody > tr:first > td:eq(0)").html();
                    cap = $(html).find("#attack_results> tbody > tr:first > td:eq(1)").text();

                    if (zsak != null && cap != "") $("#report_list > tbody > tr:eq(" + i + ") > td:eq(1)").append("<br />" + zsak + "&nbsp;&nbsp;|&nbsp;&nbsp;" + cap);

                });

            }


        }


    }

    function BeerkezonyersiGomb() {

        $("#show_outgoing_units  div  table  tbody  tr  th:first").append("<img style='cursor:pointer' id='beerkezonyersi' src='" + OrgImgStore + "rename.png'>")

        $("#beerkezonyersi").click(()=>{Beerkezonyersi()})

    }

    function Beerkezonyersi() {

        num = $("#show_outgoing_units  div  table  tbody  tr").length
        hed = $("#show_outgoing_units  div  table  tbody  tr  th").length

        console.log(hed)

        if (hed == 4) {
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(0)').attr("width", "35%")
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(1)').attr("width", "23%")
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(2)').attr("width", "11%")
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(3)').attr("width", "30%")
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(3)').text("Zsákmány")
        } else {
            $('#show_outgoing_units > div > table > tbody > tr:first ').append('<th width="30%">Zsákmány</th>')
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(0)').attr("width", "35%")
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(1)').attr("width", "23%")
            $('#show_outgoing_units > div > table > tbody > tr:first > th:eq(2)').attr("width", "11%")

        }

        fa = 0;
        agyag = 0;
        vas = 0;
        hoz = 0;
        ossz = 0;


        for (i = 1; i < num; i++) {

            if (hed == 3) {
                $('#show_outgoing_units > div > table > tbody > tr:eq(' + i + ')').append('<td ><div class="center">-</div></td>')
            }
            if ($("#show_outgoing_units > div > table > tbody > tr:eq(" + i + ") > td:eq(0) > img").attr("src").indexOf("return.png") > -1) {



                href = $("#show_outgoing_units > div > table > tbody > tr:eq(" + i + ") > td:eq(0) > span > span > a").attr("href")


                $.ajax({
                    url: href,
                    async: false
                }).done(function (html) {

                    feldol = $(html).find("#content_value> table:eq(2)> tbody > tr:first > td:eq(1)").text().trim().replace(/\./gi, "").split("  ")

                    if (feldol.length == 3) {

                        fa += Number(feldol[0])
                        agyag += Number(feldol[1])

                        vas += Number(feldol[2].split(" ")[0])

                        teher = feldol[2].split(" ")[1]
                        teher = teher.replace(/\|/gi, "").trim().split("/")

                        hoz += Number(teher[0])
                        ossz += Number(teher[1])
                    }

                    zsak = $(html).find("#content_value> table:eq(2)> tbody > tr:first > td:eq(1)").html();
                    zsak = zsak.replace(/\|/gi, "<br>")
                    if (zsak != null) $("#show_outgoing_units > div > table > tbody > tr:eq(" + i + ") > td:eq(3)").html("<div class='center'>" + zsak + "</div>");

                });

            }


        }

        //SZUM

        szumtr = '<tr><td class="center"><strong>Összesen</strong></td><td class="center" colspan="2"><span class="icon header wood"> </span>' + number_format(fa) + ' <span class="icon header stone"> </span>' + number_format(agyag) + ' <span class="icon header iron"> </span>' + number_format(vas) + '</td><td class="center">' + number_format(hoz) + ' / ' + number_format(ossz) + '</td></tr>'

        $("#show_outgoing_units > div > table > tbody >tr:first").after(szumtr)


    }

    function MapChurch() {

        ChurchHtml = '<table width="100%" style="border-spacing:0px;border-collapse:collapse;" class="vis"><tbody><tr><th colspan="2">Templom Tervező</th></tr><tr><td colspan="2"  class="nowrap">x:&nbsp;<input type="text" style="width: 30px"  class="centercoord" id="Cx" > | y:&nbsp;<input type="text" style="width: 30px" class="centercoord" id="Cy" ></td></tr><tr><td>Templom Szint: </td><td ><select name="element_1" id="CLVL" class="element select medium"> <option value="4">1</option><option selected="selected" value="6">2 (Első templom)</option><option value="8">3</option></select></td></tr><tr><td colspan="2"><input id="AddChurch" type="button" value="Új templom" class="btn"><input id="clearC" type="button" value="Törlés" class="btn"> <input id="repair" type="button" value="Eredeti" class="btn"></td></tr></tbody></table>'



        $(document).ready(function () {
            originalChurchData = MapCanvas.churchData;
        });

        $("#map_topo").append(ChurchHtml)

        $("#clearC").click(ClearAllChurch)
        $("#AddChurch").click(AddNewChurch)
        $("#repair").click(function (originalChurchData) {

            console.log(originalChurchData)

            //MapCanvas.churchData=originalChurchData;

            //TWMap.church.toggle();

        })

    }

    function AddNewChurch() {



        newCx = $("#Cx").val()
        newCy = $("#Cy").val()
        rad = $("#CLVL").val();
        MapCanvas.churchData[MapCanvas.churchData.length] = new Array(newCx, newCy, rad * rad)
        TWMap.church.toggle();


    }

    function ClearAllChurch() {

        size = MapCanvas.churchData.length;

        for (i = 0; i < size; i++) {

            MapCanvas.churchData[i][2] = -1;

        }

        TWMap.church.toggle()

    }

    function PremiumMap() {

        TWMap.mobile = true
        TWMap.premium = true;

        PremiumMap_html = '<tr><td class="center" colspan="3"><a href="javascript:void(0);" id="Full_Map">Teljes képernyõ</a></td></tr>\
    <tr>\
    <td>\
    <label for="map_size">Térkép Méret:</label>\
    </td>\
    <td class="center">\
    <select id="map_size">\
    <option label="4x4" value="4">4x4</option>\
    <option label="5x5" value="5">5x5</option>\
    <option label="7x7" value="7">7x7</option>\
    <option label="9x9" value="9">9x9</option>\
    <option label="11x11" value="11">11x11</option>\
    <option selected="selected" label="13x13" value="13">13x13</option>\
    <option label="15x15" value="15">15x15</option>\
    <option label="20x20" value="20">20x20</option>\
    <option label="30x30" value="30">30x30</option>\
    </select>\
    </td>\
    <td width="18">\
    </td>\
    </tr>\
    <tr>\
    <td>\
    <label for="minimap_size">Mini Térkép Méret:</label>\
    </td>\
    <td class="center"> \
    <select id="minimap_size">\
    <option label="20x20" value="20x20">20x20</option>\
    <option label="30x30" value="30x30">30x30</option>\
    <option label="40x40" value="40x40">40x40</option>\
    <option label="50x50" value="50x50">50x50</option>\
    <option label="60x60" value="60x60">60x60</option>\
    <option label="70x70" value="70x70">70x70</option>\
    <option label="80x80" value="80x80">80x80</option>\
    <option label="90x90" value="90x90">90x90</option>\
    <option label="100x100" value="100x100">100x100</option>\
    <option label="110x110" value="110x110">110x110</option>\
    <option selected="selected" label="120x120" value="120x120">120x120</option>\
    </select>\
    </td>\
    <td width="18">\
    </td>\
    </tr>'

        //OriginHTML = '<table width="100%" style="border-spacing:0px;border-collapse:collapse;" class="vis"> <tbody><tr> <th colspan="3">Megjelenítési beállítások</th> </tr> <tr> <td> <input type="checkbox" checked="checked" id="belief_radius" onclick="TWMap.church.toggle();" name="belief_radius"> </td> <td> <label for="belief_radius">A vallás hatósugarának megjelenítése</label> </td> <td></td> </tr> <tr> <td> <input type="checkbox" id="politicalmap" onclick="TWMap.politicalMap.toggle(true);" name="politicalmap"> </td> <td> <label for="politicalmap"> Politikai térkép megjelenítése </label> </td> <td width="18"><img class="pmap_options_toggler" src="' + OrgImgStore + 'icons/slide_down.png"></td> </tr> <tr id="pmap_options" style="display: none;"> <td style="padding-left:8px;" colspan="3"> <label><input type="radio" id="pmap_filter1" value="1" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter"> Minden megjelenítése </label><br> <label><input type="radio" id="pmap_filter2" value="2" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter" checked="checked"> Minden klán megjelenítése </label><br> <label><input type="radio" id="pmap_filter3" value="3" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter"> Csak a saját klán megjelenítése </label><br> <label><input type="radio" id="pmap_filter4" value="4" onclick="TWMap.politicalMap.toggle(false);" name="pmap_filter"> Saját falvak megjelenítése </label><br> <br> <label><input type="checkbox" id="pmap_show_topo" onclick="TWMap.politicalMap.toggle(false);"> Megjelenítés a minitérképen </label><br> <label><input type="checkbox" checked="checked" id="pmap_show_map" onclick="TWMap.politicalMap.toggle(false);"> Megjelenítés térképen </label> </td> </tr><tr> <td> <input type="checkbox" id="show_popup" checked="checked"> </td> <td> <label for="show_popup">Mutasd a felugró ablakot</label> </td> <td width="18"> <img src="' + OrgImgStore + 'icons/slide_down.png" class="popup_options_toggler"> </td> </tr> <tr id="popup_options" style="display: none;"> <td style="padding-left:8px" colspan="3"> <form id="form_map_popup"> <table> <tbody><tr> <td> <input type="checkbox" checked="checked" name="map_popup_attack" id="map_popup_attack"> </td> <td> <label for="map_popup_attack">Utolsó támadás megjelenítése</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" name="map_popup_attack_intel" id="map_popup_attack_intel"> </td> <td> <label for="map_popup_attack_intel">Info megjelenítése</label> </td> </tr> <tr> <td> <input type="checkbox" name="map_popup_moral" id="map_popup_moral"> </td> <td> <label for="map_popup_moral">Mutasd a morált</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" name="map_popup_res" id="map_popup_res"> </td> <td> <label for="map_popup_res">Mutasd a nyersanyagokat</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" name="map_popup_pop" id="map_popup_pop"> </td> <td> <label for="map_popup_pop">Mutasd a népességet</label> </td> </tr> <tr> <td> <input type="checkbox" name="map_popup_trader" id="map_popup_trader"> </td> <td> <label for="map_popup_trader">Mutasd a kereskedőket</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" name="map_popup_reservation" id="map_popup_reservation"> </td> <td> <label for="map_popup_reservation">Nemesi igények megjelenítése</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" onclick="$(\'#map_popup_units_home\').prop(\'disabled\', this.checked ? \'\' : \'disabled\').attr(\'checked\', \'\')" name="map_popup_units" id="map_popup_units"> </td> <td> <label for="map_popup_units">Mutasd a csapatokat</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" name="map_popup_units_home" id="map_popup_units_home"> </td> <td> <label for="map_popup_units_home">Helyi csapatok megjelenítése</label> </td> </tr> <tr> <td> <input type="checkbox" checked="checked" name="map_popup_units_times" id="map_popup_units_times"> </td> <td> <label for="map_popup_units_times">Mutasd a csapatok menetidejét</label> </td> </tr> <tr> <td> <input type="checkbox"
        //name = "map_popup_flag" id= "map_popup_flag" > </td > <td> <label for="map_popup_flag">Mutasd a zászlót</label> </td> </tr > <tr> <td> <input type="checkbox" checked="checked" name="map_popup_notes" id="map_popup_notes"> </td> <td> <label for="map_popup_notes">Falu-jegyzetek megtekintése</label> </td> </tr> </tbody></table > </form > </td > </tr > </tbody ></table > '



        $("#map_config > table").html(OriginHTML)
        $(".pmap_options_toggler").click(function () { $("#pmap_options").toggle() })
        $(".popup_options_toggler").click(function () { $("#popup_options").toggle() })

        $("#map_config > table > tbody > tr:eq(1)").after(PremiumMap_html)
        $("#Full_Map").click(function () { TWMap.goFullscreen(); })
        $("#map_size").change(function () { TWMap.resize(parseInt($("#map_size").val())) })
        $("#minimap_size").change(function () { TWMap.resizeMinimap(parseInt($("#minimap_size").val())) })


        //**** Extra Info ****//

        console.log("TEST")
        last_pos = ""

        c1 = $("#mapx").val() + "|" + $("#mapy").val()


        $("#map_popup").bind("DOMSubtreeModified", function () {

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

        });


    }

    function Calc_Distance(c1, c2) {

        x = Math.abs(Number(c1.split('|')[0]) - Number(c2.split('|')[0]));
        y = Math.abs(Number(c1.split('|')[1]) - Number(c2.split('|')[1]));

        distancia = Math.sqrt((x * x) + (y * y));

        return distancia;

    }

    function GetSpeedTable(dist) {

        $("head").append("<style>\
    .TTT td{     text-align: center;	vertical-align: middle;}\
    #TravelSpeed td {font-size:10px}\
    .TTT {border: 1px solid #E8CDC4}\
    .TTT td:nth-of-type(even) {background:#E0D2B8}\
    .TTT td:nth-of-type(odd) {background:#FAF4E8}\
    </style>")


        table = $("<table class='TTT'><tr id='HeadPic'></tr><tr id='TravelSpeed'></tr></table>")


        unitNames = getValue("configUnitList").split(",")
        unitSpeeds = getValue("configUnitSpeeds").split(",")



        for (i = 0; i < unitNames.length; i++) {

            table.find("#HeadPic").append("<td><img src='" + OrgImgStore + "unit/unit_" + unitNames[i] + ".png'></td>")
            table.find("#TravelSpeed").append("<td>" + msToTime(dist * unitSpeeds[i]) + "</td>")

        }

        return table.prop('outerHTML')

    }

    function msToTime(s) {

        function addZ(n) {
            return (n < 10 ? '0' : '') + n;
        }

        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
    }

    function AddStatToPlayer() {
        $.ajaxSetup({ async: false });
        $.getScript("http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js", function () { $("#btwPStats").tabs().addClass("tabs-centre ui-tabs-nav") })

        server = getSubDomain()
        lan = getLanguage()
        playerId = urlParam("id")


        html_content = '<tr><td colspan="2">\
    <a target="_blank" href="http://'+ lan + '.twstats.com/' + server + '/index.php?page=player&id=' + playerId + '">» TW Stat - Player</a>\
    </td></tr>'

        $("#player_info > tbody > tr:last").after(html_content)

        tribeHref = $("#player_info > tbody > tr:eq(4)> td:last > a").attr("href")
        tribeId = urlParam("id", tribeHref);

        if (tribeId > 0) {

            clan_content = '<tr><td colspan="2">\
    <a target="_blank"  href="http://'+ lan + '.twstats.com/' + server + '/index.php?page=tribe&id=' + tribeId + '">» TW Stat - Tribe </a>\
    </td></tr>'

            $("#player_info > tbody > tr:last").after(clan_content)
        }

        //Add stat table

        alaphtml = '<div class="vis">\
    <h4>Sablon</h4>\
    <div id="btwPStats"><ul>\
    <li><a href="#btw-Tab-pont">Pontok</a></li>\
    <li><a href="#btw-Tab-falu">Falvak</a></li>\
    <li><a href="#btw-Tab-le">LE</a></li>\
    <li><a href="#btw-Tab-let">LET</a></li>\
    <li><a href="#btw-Tab-lev">LEV</a></li>\
    <li><a href="#btw-Tab-rang">Rang</a></li>\
    </ul>\
    <div id="btw-Tab-pont"><img src="http://hu.twstats.com/image.php?type=playerssgraph&graph=points&id='+ playerId + '&s=' + server + '"></div>\
    <div id="btw-Tab-falu"><img src="http://hu.twstats.com/image.php?type=playerssgraph&graph=villages&id='+ playerId + '&s=' + server + '"></div>\
    <div id="btw-Tab-le"><img src="http://hu.twstats.com/image.php?type=playerssgraph&graph=od&id='+ playerId + '&s=' + server + '"></div>\
    <div id="btw-Tab-let"><img src="http://hu.twstats.com/image.php?type=playerssgraph&graph=oda&id='+ playerId + '&s=' + server + '"></div>\
    <div id="btw-Tab-lev"><img src="http://hu.twstats.com/image.php?type=playerssgraph&graph=odd&id='+ playerId + '&s=' + server + '"></div>\
    <div id="btw-Tab-rang"><img src="http://hu.twstats.com/image.php?type=playerssgraph&graph=rank&id='+ playerId + '&s=' + server + '"></div>\
    </div></div>'

        $("head").append('<link rel="stylesheet" href="http://www.bellum-tw.tk/scripts/ultimate-tool/jquery-ui.min.css"> <style>\
    tabs-centre .ui-tabs-nav { \
    height: 2.35em; \
    text-align: center; \
    } \
    tabs-centre .ui-tabs-nav li { \
    display: inline-block; \
    float: none; \
    top: 0px; \
    margin: 0em; \
    }</style>')


        $("#player_info").after(alaphtml)




    }

    function addSmileBB() {

        // Leniyló
        $("#bb_bar").append('<a href="#" title="Smile" id="bb_button_smile">\
    <span style="display: inline-block; padding-left: 0px; padding-bottom: 0px; margin-right: 2px; margin-bottom: 3px; width: 20px; height: 20px; background: url(&quot;http://ipon.hu/forum/emotions/smile.gif&quot;) no-repeat scroll 0px center transparent;">&nbsp;</span>\
    </a>')


        $("#bb_bar").append('<a href="#" title="Smile" id="bb_button_ssmile">\
    <span style="display: inline-block; padding-left: 0px; padding-bottom: 0px; margin-right: 2px; margin-bottom: 3px; width: 20px; height: 20px; background: url(http://upload.wikimedia.org/wikipedia/commons/d/dc/Smiley---D.gif) no-repeat scroll 0px center transparent;">&nbsp;</span>\
    </a>')

        // HTML

        sa = [";^^.png", "=B.png", "angry.png", "boo!.png", "brains...!.png", "disappearing.png", "dizzy.png", "enjoying mah playlist.png", "evilish.png", "graffiti.png", "grin.png", "have a nice day.png", "hope my fake smile works again.png", "in love.png", "ka boom.png", "lll._..png", "meaw.png", "ninja.png", "omg.png", "on fire.png", "ouch...it hurts.png", "O_O.png", "pissed off.png", "serious business.png", "sick.png", "slow.png", "snooty.png", "that dood is up to something.png", "TT TT.png", "want.png", "we all gonna die.png", "wut.png", "XD.png", "x_x.png", "yaeh am not durnk.png", "yarr.png", "kidding.png", "yuush.png", "%C2%B2%20z%20Z.png"]

        html_content = '<div id="mytutidialog" title="Basic dialog">'

        for (i = 0; i < sa.length; i++) {

            html_content += "<img class='bbsmile' height='40' width='40' src='http://www.bellum-tw.tk/scripts/smile-big/img/" + sa[i] + "'/>"


        }

        html_content += "</div>"


        $("#bb_bar").append(html_content)
        $("#mytutidialog").hide()


        $("#bb_button_smile").click(function () { $("#mytutidialog").toggle() })
        $(".bbsmile").click(function () { insertSmile($(this).attr("src")); })

        // MINI SMILE :P

        ss = ["=D.gif", "aha-!.gif", "blank-stare.gif", "bomb.gif", "brb.gif", "confident.gif", "cool.gif", "dead.gif", "donttalktome.gif", "dumb.gif", "excited.gif", "facepalm.gif", "giving-up.gif", "hai-there.gif", "huh-.gif", "i-can-fly.gif", "kiss.gif", "lll-_-.gif", "music.gif", "nope.gif", "omg.gif", "paranoid.gif", "pirate.gif", "playing-video-games.gif", "rain-cloud.gif", "scared-(-nahh-).gif", "secret-laugh.gif", "shakefist.gif", "shrug.gif", "shy.gif", "sleep.gif", "sleepy.gif", "snooty.gif", "streaming-mad.gif", "thinking.gif", "thumb-up.gif", "wasnt-that-funny.gif", "whistle.gif", "XD.gif", "xp.gif"]

        html_content = '<div id="mystutidialog" title="Basic dialog">'

        for (i = 0; i < ss.length; i++) {

            html_content += "<img class='bbssmile' src='http://bellum-tw.tk/scripts/smile-small/img/" + ss[i] + "'/>"


        }

        html_content += "</div>"

        $("#bb_bar").append(html_content)
        $("#mystutidialog").hide()


        $("#bb_button_ssmile").click(function () { $("#mystutidialog").toggle() })
        $(".bbssmile").click(function () { insertSmile($(this).attr("src")); })

    }

    function insertSmile(txt) {

        var caretPos = document.getElementById("message").selectionStart;
        var textAreaTxt = jQuery("#message").val();
        var txtToAdd = "[img]" + txt + "[/img]";
        jQuery("#message").val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos));


    }

    function NyersiOsszeado() {

        num = $("#plunder_list > tbody> tr ").length

        for (i = 1; i < num; i++) {

            nyersiArr = $("#plunder_list > tbody > tr:eq(" + i + ") > td:eq(5) ").text().trim().replace(/\./gi, "").split(" ")

            ossz = Number(nyersiArr[0]) + Number(nyersiArr[1]) + Number(nyersiArr[2])


            $("#plunder_list tbody> tr:eq(" + i + ") > td:eq(5) ").append(" / " + ossz)

        }



    }

    function floatDiv() {

        $("#content_value > div:eq(2)").css("background", "url('" + OrgImgStore + "index/main_bg.jpg') repeat scroll right top #e3d5b3")
        $("#content_value > div:eq(2)").css("position", "fixed")
        $("#content_value > div:eq(2)").css("top", "80px")
        $("#content_value > div:eq(2)").css("left", "-5px")

        thArray = new Array();
        tdArray = new Array();


        $("#units_home > tbody > tr:eq(0) > th").each(function () {

            thArray.push($(this).prop('outerHTML'))

        })

        $("#units_home > tbody > tr:eq(1) > td").each(function () {

            tdArray.push($(this).prop('outerHTML'))

        })

        $("#units_home > tbody ").html("")


        for (tdi = 0; tdi < thArray.length; tdi++) {

            $("#units_home > tbody ").append("<tr>" + thArray[tdi] + tdArray[tdi] + "</tr>")

        }




    }

    function addVillPreviewTiMarket() {

        $("head").append('<style>.target-select-autocomplete {width:310px;border:1px solid #7d510f;border-top:0;position:absolute;background-color:#f4e4bc;overflow:auto;-moz-box-sizing:border-box;box-sizing:border-box;z-index:12001;}.village-item {border-bottom:1px solid #7d510f;background-color:#fff5da;cursor:pointer;overflow:hidden;}.village-item .village-picture {float:left;margin-right:5px;}.village-item .village-name {font-weight:700;font-size:12px;margin-top:0;}.village-item .village-info,.village-item .village-distance {display:block;margin-top:0;font-size:87%;line-height:11px;}</style>')

        $($("#inputx").parents()[2]).append('<tr id="preview"></tr>')

        $("#preview").append('<div class="target-select-autocomplete" style="display: block; margin-left:88px; max-height: 400px;"><div class="village-item"><img alt="" class="village-picture" src=""><span class="village-name"></span><span class="village-info"><strong>Tulajdonos: </strong> <strong>Pontok: </strong> </span><span class="village-distance"><strong>Távolság:</strong> </span></div></div>')

        $("#preview").hide();

        $("#inputx").on("keyup", function () { clearPreview(); getPreviewVill(); })
        $("#inputy").on("keyup", function () { clearPreview(); getPreviewVill(); })
    }

    function getPreviewVill() {

        x = $("#inputx").val()
        y = $("#inputy").val()

        if (x.length == 3 && y.length == 3) {

            $.ajax({
                url: "http://" + getSubDomain() + ".klanhaboru.hu/game.php?screen=api&ajax=target_selection&input=" + x + "|" + y + "&type=coord",
                cache: false
            })
                .done(function (html) {
                    json = JSON.parse(html)

                    console.log(json)


                    if (json.villages.length != 0) {

                        $("#preview > div > div > img").attr("src", json.villages[0].image)
                        $("#preview > div > div > span:eq(0)").append(json.villages[0].name + " (" + x + "|" + y + ")")
                        $("#preview > div > div > span:eq(2)").append(json.villages[0].distance)

                        if (json.villages[0].player_name != null) {

                            $("#preview > div > div > span:eq(1) > strong:eq(0)").after(json.villages[0].player_name)

                        } else {

                            $("#preview > div > div > span:eq(1) > strong:eq(0)").after("Barbár")


                        }

                        $("#preview > div > div > span:eq(1) > strong:eq(1)").after(json.villages[0].points)

                        $("#preview").show()

                    } else { $("#preview").hide() }

                });

        }

    }

    function clearPreview() {

        $("#preview").hide();

        $("#preview").html('<div class="target-select-autocomplete" style="display: block; margin-left:88px; max-height: 400px;"><div class="village-item"><img alt="" class="village-picture" src=""><span class="village-name"></span><span class="village-info"><strong>Tulajdonos: </strong> <strong>Pontok: </strong> </span><span class="village-distance"><strong>Távolság:</strong> </span></div></div>')

    }

    function addQuickSelectToMarket() {


        selecthtml = $('<select onchange="insertCoord(document.forms[\'market\'], this)" tabindex="78" size="1" name="target">\
    <option>-Falu kiválasztás-</option>\
    </select>')


        villages = JSON.parse(getValue("villDB"))


        VillList = "";
        objLen = Object.keys(villages).length

        for (i = 0; i < objLen; i++) {
            VillList += "<option value=" + villages[i].coord + ">" + villages[i].name + "</option>"
        }

        selecthtml.append(VillList)


        $("#inputy").after(selecthtml)


    }

    function addQuickSelectToPlace() {

        selecthtml = $('<select tabindex="78" size="1" name="target">\
    <option>-Falu kiválasztás-</option>\
    </select><br/>')


        villages = JSON.parse(getValue("villDB"))


        VillList = "";
        objLen = Object.keys(villages).length

        for (i = 0; i < objLen; i++) {
            VillList += "<option value=" + villages[i].coord + ">" + villages[i].name + "</option>"
        }

        selecthtml.append(VillList)
        selecthtml.on("change", function () {

            $("input[name=target_type][value=coord]").attr('checked', 'checked');
            $("#place_target > input").val($(this).val()).focus()

        })

        $(".target-select-links").html(selecthtml)

    }

    function addFav() {

        korzet = "todor gyorgy;pimba;Norbi33;annácska1;basuka;Norbika97;-Kleno-;kanizsa;=Fekete Péter=;Val Venosta;biraj;titusz59;magic8;kovcsa;MissSimson;Niki Boszi;kiscserkész;BABA 723;"

        $("#form table tr:first td:last > div:last").append(' | <a href="javascript:igm_to_insert_adresses(\'' + korzet + '\')">Körzet</a>')


    }


    function urlParam(name, loc) {

        loc = loc || window.location.href;

        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(loc);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    }

    function setURLParameter(name, value, loc) {

        loc = loc || window.location.href;

        var search;

        if (urlParam(name)) {
            search = location.search.replace(new RegExp('([?|&]' + name + '=)' + '(.+?)(&|$)'), "$1" + encodeURIComponent(value) + "$3");
        } else if (location.search.length) {
            search = location.search + '&' + name + '=' + encodeURIComponent(value);
        } else {
            search = '?' + name + '=' + encodeURIComponent(value);
        }

        return search
    }


    function getSubDomain() {

        return window.location.toString().split('.')[0].split('//')[1];

    }

    function getLanguage() {
        return location.host.toString().split('.')[2]
    }

    function number_format(number, decimals, dec_point, thousands_sep) {
        //  discuss at: http://phpjs.org/functions/number_format/
        // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: davook
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Theriault
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Michael White (http://getsprink.com)
        // bugfixed by: Benjamin Lupton
        // bugfixed by: Allan Jensen (http://www.winternet.no)
        // bugfixed by: Howard Yeend
        // bugfixed by: Diogo Resende
        // bugfixed by: Rival
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        //  revised by: Luke Smith (http://lucassmith.name)
        //    input by: Kheang Hok Chin (http://www.distantia.ca/)
        //    input by: Jay Klehr
        //    input by: Amir Habibi (http://www.residence-mixte.com/)
        //    input by: Amirouche
        //   example 1: number_format(1234.56);
        //   returns 1: '1,235'
        //   example 2: number_format(1234.56, 2, ',', ' ');
        //   returns 2: '1 234,56'
        //   example 3: number_format(1234.5678, 2, '.', '');
        //   returns 3: '1234.57'
        //   example 4: number_format(67, 2, ',', '.');
        //   returns 4: '67,00'
        //   example 5: number_format(1000);
        //   returns 5: '1,000'
        //   example 6: number_format(67.311, 2);
        //   returns 6: '67.31'
        //   example 7: number_format(1000.55, 1);
        //   returns 7: '1,000.6'
        //   example 8: number_format(67000, 5, ',', '.');
        //   returns 8: '67.000,00000'
        //   example 9: number_format(0.9, 0);
        //   returns 9: '1'
        //  example 10: number_format('1.20', 2);
        //  returns 10: '1.20'
        //  example 11: number_format('1.20', 4);
        //  returns 11: '1.2000'
        //  example 12: number_format('1.2000', 3);
        //  returns 12: '1.200'
        //  example 13: number_format('1 000,50', 2, '.', ' ');
        //  returns 13: '100 050.00'
        //  example 14: number_format(1e-8, 8, '.', '');
        //  returns 14: '0.00000001'

        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
            .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    }

    // getValue as GM_getValue of GM functions
    function getValue(name) {
        name = getSubDomain() + name;
        var value = (cachedSettings === null ? localStorage.getItem(name) : cachedSettings[name]);
        if (!value || (value === undefined)) { return (null); }
        return (value);
    }

    // setValue as GM_setValue of GM functions
    function setValue(name, value) {
        name = getSubDomain() + name;
        if (cachedSettings === null) {
            localStorage.setItem(name, value);
        } else {
            cachedSettings[name] = value;
            chrome.extension.sendRequest({ name: name, value: value });
        }
    }

    // Create checkbox and label
    function createCheckBox(label, configLabel) {
        var div = $("<div></div>");
        var checked = (getValue(configLabel) == "true") ? "checked='checked'" : "";
        div.append("<input class='configCheckbox' type='checkbox' " + checked + " />");
        div.children("input").bind("change", function () {
            setValue(configLabel, ($(this).is(':checked')));
        });
        div.append("<span class='configLabelCheckbox'>" + label + "</span>");
        div.children("span").bind("click", function () {
            div.children("input").click();
            div.children("input").change();
        });
        return (div);
    }

    function addSettings() {

        $.ajaxSetup({ async: false });
        $.getScript("http://malsup.github.io/jquery.blockUI.js")
        $.getScript("http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js")


        $("head").append(' <style>\
    .ui-tabs-vertical { width: 55em; }\
    .ui-tabs-vertical .ui-tabs-nav { padding: .2em .1em .2em .2em; float: left; width: 12em; }\
    .ui-tabs-vertical .ui-tabs-nav li { clear: left; width: 100%; border-bottom-width: 1px !important; border-right-width: 0 !important; margin: 0 -1px .2em 0; }\
    .ui-tabs-vertical .ui-tabs-nav li a { display:block; }\
    .ui-tabs-vertical .ui-tabs-nav li.ui-tabs-active { padding-bottom: 0; padding-right: .1em; border-right-width: 1px; border-right-width: 1px; }\
    .ui-tabs-vertical .ui-tabs-panel { padding: 1em; float: right; width: 40em;}\
    </style>')

        $("#menu_row >td.menu-item:last >table > tbody > tr:last").before('<tr><td class="menu-column-item"><a id="btw-Set" href="#">BTW - Ultimate Tool</a></td></tr>')

        btwconfigScript = $("<div role='dialog' style='cursor:default\;display: table; outline: 0px none; z-index: 1000; width:600px;left:25% ' class='popup_box show' id='btwconfigScript'><div class='popup_box_content'><h1>BTW Ultimate Tool - Settings</h1><a id='closebtw-Set' href='#' style='right:13px;top:11px;' class='popup_box_close'>&nbsp;</a><div id='btwtabs'></div></div></div>")

        $("body").append(btwconfigScript);
        $("#btwconfigScript").hide();
        $("#closebtw-Set").click(function () { $.unblockUI() })


        //add Contenct
        GetSettingsContent()

        $("#btw-Set").bind("click", function () { /* "#maskConfig" ).show(); $( "#btw-configScript" ).show();*/
            $.blockUI({
                message: $('#btwconfigScript'),
                css: {
                    top: "48px",
                    left: ($(window).width() - 600) / 2 + 'px',
                    width: '600px',
                    border: "0px",
                    position: "absolute",
                    textAlign: "left"

                }
            });
            //Make Tabs
            $("#btwtabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
            $("#btwtabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
        });










    }

    function GetSettingsContent() {

        alapUl = '<ul id="btw-setUl">\
    <li><a href="#btw-Tab-global">Általános</a></li>\
    <li><a href="#btw-Tab-villoverview">Falu áttekintés</a></li>\
    <li><a href="#btw-Tab-farmMan">Farm-kezelő</a></li>\
    <li><a href="#btw-Tab-player">Játékos profil</a></li>\
    <li><a href="#btw-Tab-report">Jelentések</a></li>\
    <li><a href="#btw-Tab-forum">Fórum</a></li>\
    <li><a href="#btw-Tab-map">Térkép</a></li>\
    </ul>'

        //global
        GlobalBlock = $('<div id="btw-Tab-global"><h2>Általános</h2></div>');

        var configaddToolBar = createCheckBox("Gyorsgombok", "configaddToolBar");
        GlobalBlock.append(configaddToolBar);

        var configVillageSwitch = createCheckBox("Falu váltó", "configVillageSwitch");
        GlobalBlock.append(configVillageSwitch);

        //villoverview
        villoverviewBlock = $('<div id="btw-Tab-villoverview"><h2>Falu áttekintés</h2></div>');

        var configBeerkezonyersiGomb = createCheckBox("Beérkező nyersi", "configBeerkezonyersiGomb");
        villoverviewBlock.append(configBeerkezonyersiGomb);

        //farm man
        farmManBlock = $('<div id="btw-Tab-farmMan"><h2>Farm-kezelő</h2></div>');

        var configNyersiOsszeado = createCheckBox("Nyersi összeadó", "configNyersiOsszeado");
        farmManBlock.append(configNyersiOsszeado);

        var configfloatDiv = createCheckBox("Egységek pozicionálása", "configfloatDiv");
        farmManBlock.append(configfloatDiv);

        //player
        playerBlock = $('<div id="btw-Tab-player"><h2>Játkos Profil</h2></div>');

        var configAddStatToPlayer = createCheckBox("Játkos statisztika - profilok", "configAddStatToPlayer");
        playerBlock.append(configAddStatToPlayer);

        //report

        reportBlock = $('<div id="btw-Tab-report"><h2>Jelentések</h2></div>');

        var configaddReportTool = createCheckBox("Jelentés Konvertáló", "configaddReportTool");
        reportBlock.append(configaddReportTool);

        var configRablasEll = createCheckBox("Gyors rablás ellenörzés", "configRablasEll");
        reportBlock.append(configRablasEll);

        //Map

        MapBlock = $('<div id="btw-Tab-map"><h2>Térkép</h2></div>');

        var configPremiumMap = createCheckBox("Prémium Térkép", "configPremiumMap");
        MapBlock.append(configPremiumMap);

        var configMapChurch = createCheckBox("Templom Tervező", "configMapChurch");
        MapBlock.append(configMapChurch);

        //forum
        forumBlock = $('<div id="btw-Tab-forum"><h2>Fórum</h2></div>');

        var configaddSmileBB = createCheckBox("Smile", "configaddSmileBB");
        forumBlock.append(configaddSmileBB);


        $("#btwtabs").append(alapUl)
        $("#btwtabs").append(GlobalBlock)
        $("#btwtabs").append(MapBlock)
        $("#btwtabs").append(forumBlock)
        $("#btwtabs").append(reportBlock)
        $("#btwtabs").append(playerBlock)
        $("#btwtabs").append(farmManBlock)
        $("#btwtabs").append(villoverviewBlock)



    }

    function loadDefConfig() {

        //Browser Notification
        Notification.requestPermission()
        BTWNotify('BTW Ultimate Tool', "Verzió Frissítés!\nFrissítés utáni verzió: " + version)


        //First Run
        setValue("configFirstRun", "false")
        setValue("configVersion", version)


        //Others
        //forum
        setValue("configaddSmileBB", "true")

        //Map
        setValue("configPremiumMap", "true")
        setValue("configMapChurch", "true")


        //report
        setValue("configaddReportTool", "true")
        setValue("configRablasEll", "true")

        //player
        setValue("configAddStatToPlayer", "true")

        //villoverview
        setValue("configBeerkezonyersiGomb", "true")

        //farm man
        setValue("configNyersiOsszeado", "true")
        setValue("configfloatDiv", "true")

        //Global
        setValue("configaddToolBar", "true")
        setValue("configVillageSwitch", "true")

        //FastLinks
        set = new Object()

        set[0] = { "name": "BTW HomePage", "imgurl": "http://bellum-tw.tk/css/images/favicon.ico", "url": "http://bellum-tw.tk", "newwin": "true" }

        setValue("TWSS-SET", JSON.stringify(set))

        //Villages
        villages = new Object()

        text = $("#menu_row2_village")


        villages[0] = { "name": $("#menu_row2_village").text().trim(), "id": urlParam("village"), "coord": $("#menu_row2> td:last").text().trim().match(/\d{3}\|\d{3}/)[0], "continent": $("#menu_row2> td:last").text().trim().match(/K\d\d/)[0] };
        setValue("villDB", JSON.stringify(villages))


        //get units speed
        setValue("configNeedSpeed", "true")


        //Overview
        setValue("configDefVillNum", "25")
    }


    function GetSpeeds() {

        setValue("configNeedSpeed", "false")

        if (Object.keys(UnitPopup.unit_data).length == 11) {

            setValue("configIsArcher", "false")

        } else {

            setValue("configIsArcher", "true")

        }

        //Unit List

        unitlist = Object.keys(UnitPopup.unit_data)
        unitlist.pop()
        setValue("configUnitList", unitlist.toString())

        //GetSpeeds
        speedArr = []
        for (i = 0; i < unitlist.length; i++) {

            curSpeed = Math.round((1 / (UnitPopup.unit_data[unitlist[i]].speed * 60)) * 60000)

            speedArr.push(curSpeed)

        }

        setValue("configUnitSpeeds", speedArr.toString())

    }


    function BTWNotify(title, msg) {

        var notification = new Notification(title, {
            body: msg,
            icon: 'http://bellum-tw.tk/css/images/favicon.ico'
        });

    }



    //end of main
})();