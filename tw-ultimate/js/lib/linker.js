class Linker {

    constructor() {

    }

    static
    import () {
        let link = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/siimple/2.0/siimple.min.css">
        <link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/Sch-Tomi/tw-scripts/master/tw-ultimate/assets/css/flexboxgrid.css">`

        $('head').append(link)
    }

}
