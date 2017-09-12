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
