var ProcessOP = [];

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function content() {
    console.log("Robot in Process ...");
    var FConf = false;
    var SConf = false;
    var TConf = false;
    
    var key = 1;
    var LastCandleId = Middleware.CANDLES[Middleware.CANDLES.length - 1];
    var LastCandle = Middleware.CANDLES[Middleware.CANDLES.length - 1].Price;
    var LastEMA = Middleware.EMARESULTS[Middleware.EMARESULTS.length - 1].Result;
    var LastCCI = Middleware.CCIRESULTS[Middleware.CCIRESULTS.length - 1].Result;
    var LastMomentum = Middleware.MOMENTUMRESULTS[Middleware.MOMENTUMRESULTS.length - 1];
    var IsHorizotalMovingAvrageEMAIndictor = false;

    var CheckEMA = Middleware.EMARESULTS[Middleware.EMARESULTS.length - 2].Result;
    if (LastEMA > CheckEMA)
        IsHorizotalMovingAvrageEMAIndictor = true;
    else
        IsHorizotalMovingAvrageEMAIndictor = false;
    console.log(CheckEMA, LastEMA, LastCandle);
    switch (key) {
        case 1:
            if (LastCandle >= LastEMA && IsHorizotalMovingAvrageEMAIndictor)
                FConf = true;
            else
                FConf = false;
            key++;
        // break;
        case 2:
            if (-100 >= LastCCI)
                SConf = false;
            else
                SConf = true;
            key++;
        // break;
        case 3:
            if (LastMomentum.ColorState === false)
                TConf = false;
            else
                TConf = true;
            break;
        default:
            alert("Oprations Failed !!!");
            break;
    }
    Determiner(FConf, SConf, TConf);
    ProcessOP.push({
        CId: LastCandleId.Id,
        Id: ProcessOP.length + 1
    });
}

function Processesor() {
    if (ProcessOP.length === 0) {
        content();
    } else if (ProcessOP[ProcessOP.length - 1].CId < Middleware.CANDLES[Middleware.CANDLES.length - 1].Id) {
        content();
    }
}

function idUpdateorContent() {
    $(Middleware.CallButtonClassName).attr("id", Middleware.CalButtonId);
    $(Middleware.PUTButtonClassName).attr("id", Middleware.PutButtonId);
    $(Middleware.DIVTOCloseCLassName).attr("id", Middleware.CloseButtonID);
}

function Determiner(FConf, SConf, TConf) {
    console.log("Robot Deciding ...");
    if (FConf === true && SConf === true && TConf === true) {
        if ((Middleware.CANDLES[Middleware.CANDLES - 1].Id - Middleware.LastTrade[0].LastCandle) >= 2) {
            CALL();            
        }
    } else if (FConf === false && SConf === false && TConf === false) {
        if ((Middleware.CANDLES[Middleware.CANDLES - 1].Id - Middleware.LastTrade[0].LastCandle) >= 2) {
            PUT();            
        }
    }
}

function CALL() {
    console.log('Calling');
    document.getElementById(Middleware.CalButtonId).click();
    Middleware.LastTrade.push({LsatCandle : Middleware.CANDLES[Middleware.CANDLES].Id});
}

function Close() {
    idUpdateorContent();
}

function PUT() {
    console.log('Putting');
    document.getElementById(Middleware.PutButtonId).click();
}