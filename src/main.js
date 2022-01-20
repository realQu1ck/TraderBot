$(function () {
    $(".logo")
        .after('<button style="margin-left: 20px" type="button" class="bel_btn bel_btn-outline-secondary" id="belobot_po" data-toggle="modal" data-target="#exampleModal"><div class="spinner-grow text-info" role="status"><span class="sr-only">Loading...</span></div></button><p class="ml-3 sm" id="ccltitle">Candles : ' + Middleware.CANDLES.length + '</p><p class="ml-2" id="pautoid">| Auto</p>');
    var Start_Stop = "Start";
    function Validator() {
        if (Middleware.EMARESULTS.length >= 1 &&
            Middleware.CCIRESULTS.length >= 1 &&
            Middleware.MOMENTUMRESULTS.length >= 1) {
            return true;
        } else {
            return false;
        }
    }
    function getstockName() {
        var text = $('.current-symbol').text();
        Middleware.STOCKNAME = text;
    }

    function mainUpdate() {
        if (Middleware.AutoStart === true) {
            $('#pautoid').html('| Auto');
        } else {
            $('#pautoid').html('| Manual');
        }
    }

    function idUpdateor() {
        $(Middleware.CallButtonClassName).attr("id", Middleware.CalButtonId);
        $(Middleware.PUTButtonClassName).attr("id", Middleware.PutButtonId);
    }
    setTimeout(function () {
        getstockName();
        $("#belobot_po")
            .html("Trader Robot"), $("body")
                .prepend('<small><div class="modal" tabindex="-1" role="dialog" id="exampleModal" style="color:#000">' +
                    '<div class="modal-dialog modal-md" role="document"><div class="modal-content">' +
                    '<div class="modal-header"><h3 class="modal-title" id="md-title">Trader Bot</h3><button type="button" ' +
                    ' class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">' +
                    '&times;</span></button></div><div class="modal-body"><div class="container-fluid">' +
                    '<div class="row"><div class="overflow-auto" style="max-height: 100px;">' +
                    '</div><div class="container" id="info"></div></div><p>Current Opration on : ' + Middleware.STOCKNAME +
                    '</p><p>Moving Avrage (EMA) Period : ' + Middleware.PERIOD + '</p>' +
                    '<p>CCI Period : ' + Middleware.CCIPERIOD + '</p><p>Momentum Period : ' + Middleware.MOMENTUMPERIOD + '</p>' +
                    '<p id="ccl">Candles : ' + Middleware.CANDLES.length + '</p><hr><div class="form-check"><input class="form-check-input" type="radio" name="exampleRadios" value="true" checked id="AutoSel">' +
                    '<label class="form-check-label" for="exampleRadios1">Auto Start</label></div><div class="form-check"><input class="form-check-input" type="radio" name="exampleRadios" value="false" id="AutoSel2">' +
                    '<label class="form-check-label" for="exampleRadios2">Manual Start</label></div></div></div>' +
                    '<div class="modal-footer"><button type="button" class="bel_btn bel_btn-success"' +
                    ' id="start_stop">' + Start_Stop + '</button><button type="button" class="bel_btn bel_btn-danger" data-dismiss="modal">' +
                    'Close</button></div></div></div></div>'), $("#info")
                        .append('<div class="alert alert-danger" role="alert" id="bel_mes">Please After See Result Close Modal.</div>'), $("#info")
                            .append('<div class="alert alert-success" role="alert" id="bel_mes">Bot deploy successfully.</div>'), $("#info")
                                .append('<div class="container-fluid" id="settings"></div>'), $("#settings")
                                    .val(Middleware.STOCKNAME),
            $('.current-symbol').change(function () {
                getstockName();
                ("#md-title").text(Middleware.STOCKNAME);
            }), $('.btn.btn-cal').append('Id="Tets"'),
            $('#start_stop').click(function () {
                idUpdateor();
                if (Middleware.Processiong === false) {
                    if (Validator() === true) {
                        Start_Stop = "Stop";
                        Middleware.Processiong = true;
                    } else {
                        window.alert("Robot In Process, Please Wait For Retrive Candles");
                    }
                } else if (Middleware.Processiong === false) {
                    Start_Stop = "Start";
                    Middleware.Processiong = false;
                }
                $('#start_stop').text(Start_Stop);
            }), $('#AutoSel').change(function () {
                Middleware.AutoStart = true;
                mainUpdate();
            }), $('#AutoSel2').change(function () {
                Middleware.AutoStart = false;
                mainUpdate();
            });
    }, 5e3);
});