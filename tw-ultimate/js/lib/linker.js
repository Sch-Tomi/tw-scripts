class Linker {

    constructor() {

    }

    static
    import () {
        let link = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/siimple/2.0/siimple.min.css">
        <link rel="stylesheet" href="https://raw.githubusercontent.com/Sch-Tomi/tw-scripts/master/tw-ultimate/assets/css/flexboxgrid.css" type="text/css" >`

        $('head').append(link)
    }

}
