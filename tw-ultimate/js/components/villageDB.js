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
