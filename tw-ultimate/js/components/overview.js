class OverView {

    constructor(config) {

        this.config = config
        this.OVO = {}

        this.urlMan = new UrlManipulator()

        this.run()

    }

    run() {
        //MASK
        $("#content_value").children().each(function() {
            $(this).hide()
        })
        $("#content_value").append('<img style="display: block; margin: 0 auto;" src="http://fc04.deviantart.net/fs70/f/2013/094/8/d/loading_logofinal_by_zegerdon-d60eb1v.gif">')


        //Make Object
        this.makeOverviewOBJ();

        //save Product table
        let prodTable = $("#production_table").prop('outerHTML')

        //RESET
        $("#content_value").html("")

        //Add menu
        this.addOverview_menu()

        //Select And Run
        $("#content_value img").remove()

        $("#overview_menu > td:first").attr("class", "selected")
        Overview_Combined();
        $("#content_value").children().each(function() {
            $(this).show()
        })

        VillNumPerPages()

    }

    makeOverviewOBJ() {

        let villages = this.config.villages
        this.OVO.len = $("#production_table  tr.nowrap").length
        this.OVO.VDB = {}

        console.log("asd")

        $.each(villages, function(k, v) {

            let id = v.id
            let cont = v.continent

            let faluHtml = v.nameHtml

            let pointHtml = v.pointHtml


            console.log(this)
            console.log(this.urlMan.getOrigin() + "/game.php?village=" + id + "&screen=place&mode=units")

            // Troops and Buildings and other info
            $.ajax({
                url: this.urlMan.getOrigin() + "/game.php?village=" + id + "&screen=place&mode=units",
                async: false,
                context: this
            }).done(function(html) {

                let gd = html.match(/var game_data = {(.*)};/g);
                gd = gd[0].replace('var game_data = ', '')
                gd = gd.replace("};", "}")

                let permOBj = JSON.parse(gd)

                let troops = []

                $(html).find("#units_home  tr:last > th").each(function() {

                    if ($(this).index() != 0) {
                        troops.push($(this).text())
                    }

                })

                this.OVO.VDB[id] = {
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

            });

            // trader info
            $.ajax({
                url: this.urlMan.getOrigin() + "/game.php?village=" + id + "&screen=market&mode=traders",
                async: false
            }).done(function(html) {

                this.OVO.VDB[id].trader = $(html).find("#content_value").text().match(/\d+\/\d+/g)[0]

            });


            //Get Barrack Stable Workshop
            $.ajax({
                url: this.urlMan.getOrigin() + "/game.php?village=" + id + "&screen=train",
                async: false
            }).done(function(html) {

                let military = [false, false, false]

                if ($(html).find("#trainqueue_wrap_barracks").length > 0) {

                    military[0] = true;

                }

                if ($(html).find("#trainqueue_wrap_stable").length > 0) {

                    military[1] = true;

                }

                if ($(html).find("#trainqueue_wrap_garage").length > 0) {

                    military[2] = true;

                }

                this.OVO.VDB[id].militaryRec = military

            });


        })

        console.log(OVO)
    }

    addOverview_menu() {

        OmHtml = '<table width="100%" id="overview_menu" class="vis modemenu"><tbody><tr>\
            <td style="text-align:center"><a mymode="Combined" href="#">Kombinált </a></td>\
            <td style="text-align:center"><a mymode="Prod" href="#">Termelés </a></td>\
            <td style="text-align:center"><a mymode="Build" href="#">Épületek </a></td>\
            </tr></tbody></table><div id="CONTENT"></div>'

        $("#content_value").prepend(OmHtml)

        $("#overview_menu  a").each(function() {

            $(this).click(function() {

                SwitchSelected($(this).attr("mymode"))

            })

        })

    }

}
