class TroopStarter {

    constructor() {

        this._addArriveTimeInput()

    }

    _addArriveTimeInput() {

        let input = `<p>Format like 08:01:00:800
                    <br>
                    <input id="TWU_arrive" type="text">
                    <input id="TWU_arrive_submit" class="troop_confirm_go btn btn-attack" type="button" value="Automata Indítás">
                    </p>`

        $("#content_value").append(input)

        $("#TWU_arrive_submit").on('click', this._setStart.bind(this))

    }

    _setStart() {

        let ms = this._calcDelayMili();

        setTimeout(function() {
            $("#troop_confirm_go").click()
        }, ms);
        //13:24:22:300

        console.log("READY....")

    }

    _calcDelayMili() {

        let travelTime_text = $("#command-data-form table.vis:first tr:eq(2) td:eq(1)").text()
        let travelTime = moment(travelTime_text, "HH:mm:ss")
        let arriveTime_text = $("#TWU_arrive").val()
        let arriveTime = moment(arriveTime_text, "HH:mm:ss:SSS")

        let startTime = arriveTime.subtract({
            hours: travelTime.get("h"),
            minutes: travelTime.get("m"),
            seconds: travelTime.get("s"),
            milliseconds: travelTime.get("ms")
        })

        let now = moment()
        let msToStart = Math.abs(now.diff(startTime));

        return msToStart
    }



}
