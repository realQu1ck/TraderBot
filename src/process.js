!$(document).ready(function () {
    var CurrentPrice;
    var CurrentStock;
    var Prices = [];
    var Candles = [];
    var CurrentTime;
    var StartPrice = 0;
    var HighPrice = 0;
    var LowPrice = 0;
    var SMA = [];
    var EMA = [];
    var MomentumR = [];
    var CCIR = [];
    var TypicalPriceResults = [];
    var LsatHandleTime = "";
    var StandardPriceLenght = 0;
    var Opration = [];


    //ColorState True = Green
    //ColorState False = Red

    function standard(price, lenght) {
        let pr = price;
        let p = pr.toString();
        var res = p.substring(0, lenght);
        return parseFloat(res);
    }

    //Init 
    function startProcess() {
        readytoprice();
        getstockName();
    }

    function update() {
        $('#ccl').html('Candles : ' + Middleware.CANDLES.length);
        $('#ccltitle').html('Candles : ' + Middleware.CANDLES.length);
        $(Middleware.CallButtonClassName).attr("id", Middleware.CalButtonId);
        $(Middleware.PUTButtonClassName).attr("id", Middleware.PutButtonId);
    }

    function Validator() {
        if (Middleware.EMARESULTS.length > 1 &&
            Middleware.CCIRESULTS.length > 1 &&
            Middleware.MOMENTUMRESULTS.length > 1) {
            return true;
        } else {
            return false;
        }
    }

    //initProcess For Start Bot Opration
    function initProcessor() {
        if (Opration.length === 0) {
            Opration.push({
                Id: Opration.length + 1,
                CandleId: Candles[Candles.length - 1].Id
            });
            if (Middleware.Processiong) {
                Processesor();
            }
        } else if (Opration[Opration.length - 1].CandleId < Candles[Candles.length - 1].Id) {
            Opration.push({
                Id: Opration.length + 1,
                CandleId: Candles[Candles.length - 1].Id
            });
            if (Middleware.Processiong) {
                Processesor();
            }
        }
    }

    //Sync To Middleware
    //Run Inicator Opration -> EMA, SMA, Momentum, CCI
    function Sync() {
        Middleware.CANDLES = Candles;
        getstockName();
        TypicalPrice();
        ContentSync();
        Middleware.STOCKNAME = CurrentStock;

        if (Candles.length >= Middleware.PERIOD)
            SMAProcess();

        if (Candles.length > Middleware.MOMENTUMPERIOD)
            MomentumProcess();

        if (TypicalPriceResults.length >= Middleware.CCIPERIOD)
            CCISMA();

        if (TypicalPriceResults.length > Middleware.CCIPERIOD)
            CCI();
        update();

        if (Middleware.AutoStart === true)
            Middleware.Processiong = true;
        else
            Middleware.Processiong = false;

        if (Validator() === true) {
            initProcessor();
        }
    }
    //Return Price And Timer
    function readytoprice() {
        let time;
        $("body").on('DOMSubtreeModified', $(".value__val").eq(2), function () {
            let price = $(".value__val").eq(2).text();
            price = price.replace(/\s/g, '');
            StandardPriceLenght = price.length;
            setCandle(price);
        });
        $("body").on('DOMSubtreeModified', ".value__val:first", function () {
            time = $(".value__val").eq(0).text();
            CurrentTime = time.replace(/\s/g, '');
        });
    }

    //Set Candle in 00:30 and 01:00 -> M1
    async function setCandle(price) {
        if (price != undefined && price != '' && price != "") {
            if (CurrentTime === "00:30") {
                if (LsatHandleTime != CurrentTime) {
                    CandleHandler(parseFloat(price));
                    StartPrice = parseFloat(price);
                }
            }
            else if (CurrentTime === "01:00") {
                if (LsatHandleTime != CurrentTime) {
                    CandleHandler(parseFloat(price));
                    StartPrice = parseFloat(price);
                }
            }
            else if (CurrentTime !== "01:00" || CurrentTime !== "00:30") {
                LsatHandleTime = "00:00";
            }
            if (StartPrice === 0)
                StartPrice = parseFloat(price);
            if (HighPrice === 0)
                HighPrice = parseFloat(price);
            if (LowPrice === 0)
                LowPrice = parseFloat(price);

            if (price >= StartPrice && price >= HighPrice)
                HighPrice = parseFloat(price);
            else if (price <= LowPrice && price <= StartPrice)
                LowPrice = parseFloat(price);
        }
    }

    //Set Candle To List
    async function CandleHandler(price) {
        LsatHandleTime = CurrentTime;
        if (parseFloat(price) > parseFloat(StartPrice))
            await Candles.push({
                Id: Candles.length + 1,
                Price: parseFloat(price),
                StartPrice: StartPrice, ColorState: true,
                HighPrice: HighPrice, LowPrice: LowPrice
            });
        else
            await Candles.push({
                Id: Candles.length + 1,
                Price: parseFloat(price), StartPrice: StartPrice, ColorState: false,
                HighPrice: HighPrice, LowPrice: LowPrice
            });
        Sync();
    }

    //Return Stock Name
    function getstockName() {
        var text = $('.current-symbol').text();
        CurrentStock = text;
    }

    startProcess();

    function ContentSync() {
        Middleware.EMARESULTS = EMA;
        Middleware.MOMENTUMRESULTS = MomentumR;
    }

    function SMAPEMA(){
        var sum = 0;
        var result;
        for (let index = 1; index <= Middleware.PERIOD; index++) {
            var element = Candles[Candles.length - index].Price;
            sum = sum + element;
        }
        result = sum / Middleware.PERIOD;
        var SMAResult = { id: SMA.length + 1, Result: result, TPId: Candles[Candles.length - 1].Id };
        SMA.push(SMAResult);
        ContentSync();
        EMAProcess();
    }

    function SMAProcess() {
        if (SMA.length === 0)
            SMAPEMA();
        else if (SMA[SMA.length - 1].TPId < Candles[Candles.length - 1].Id)
            SMAPEMA();
    }

    function EMAP(){
        var EMAResult;
        var SumPrices;
        for (let index = 1; index <= Middleware.PERIOD; index++) {
            var element = Candles[Candles.length - index].Price;
            SumPrices += element;
        }
        var lsatSMA = SMA[SMA.length - 1].Result;
        var LastCandle = Candles[Candles.length - 1].Price;
        var a = (Middleware.PERIOD + 1);
        a = 2 / a;
        var firstHalf = LastCandle * a;
        var lastHalf = lsatSMA * (1 - a);
        EMAResult = firstHalf + lastHalf;
        EMA.push({ Id: EMA.length + 1, Result: EMAResult, TPId : Candles[Candles.length -1].Id });
    }

    //EMA Moving Avarage Algorithm (Worked With SMA Avarage | SMA Important)
    function EMAProcess() {
        if (EMA.length === 0) {
            EMAP();
        } else if(EMA[EMA.length -1].TPId < Candles[Candles.length -1].Id){
            EMAP();
        }
        ContentSync();
    }

    function Momentum() {
        var LastCandle = Candles[Candles.length - 1];
        var StartPriceLastCandle = LastCandle.Price;
        var ClosingPrice_n_Period_Ago = Candles[Candles.length - Middleware.MOMENTUMPERIOD].Price;
        var Result = StartPriceLastCandle - ClosingPrice_n_Period_Ago;
        if (Result >= 0)
            MomentumR.push({ Id: MomentumR.length + 1, Result: Result, ColorState: true, TPId: LastCandle.Id });
        else
            MomentumR.push({ Id: MomentumR.length + 1, Result: Result, ColorState: false, TPId: LastCandle.Id });
        ContentSync();
    }

    //Momentum Algorithm
    //Momentum = Price today - Price n periods ago
    function MomentumProcess() {
        if (MomentumR.length === 0) {
            Momentum();
        } else if (MomentumR[MomentumR.length - 1].TPId < Candles[Candles.length - 1].Id) {
            Momentum();
        }
    }

    function TypicalProcess() {
        var lastCandle = Candles[Candles.length - 1];
        var sum = lastCandle.Price + lastCandle.LowPrice + lastCandle.HighPrice;
        var std = sum / 3;
        TypicalPriceResults.push({
            Id: TypicalPriceResults.length + 1,
            Result: std,
            CandleId: lastCandle.Id
        });
    }

    function TypicalPrice() {
        if (TypicalPriceResults.length === 0)
            TypicalProcess();
        else if (TypicalPriceResults[TypicalPriceResults.length - 1].CandleId <
            Candles[Candles.length - 1].Id)
            TypicalProcess();
    }

    function CCISMAP() {
        var sum = 0;
        var res = 0;
        for (let index = 1; index <= Middleware.CCIPERIOD; index++) {
            var element = TypicalPriceResults[TypicalPriceResults.length - index].Result;
            sum += element;
        }
        res = sum / Middleware.CCIPERIOD;
        var std = res;
        Middleware.CCISMAResualts.push({
            Id: Middleware.CCISMAResualts.length + 1,
            TPId: TypicalPriceResults[TypicalPriceResults.length - 1].Id,
            Result: std,
        });
    }

    //SMA Avrage n Period Ago =(High + Low + Close / 3)
    function CCISMA() {
        if (Middleware.CCISMAResualts.length === 0)
            CCISMAP();
        else if (Middleware.CCISMAResualts.slice(-1).TPId < TypicalPriceResults.slice(-1).Id)
            CCISMAP();
    }

    function CCIProcess() {
        var TP = TypicalPriceResults[TypicalPriceResults.length - 1];
        var MA = Middleware.CCISMAResualts[Middleware.CCISMAResualts.length - 1].Result;
        var MD = 0;
        for (let index = 1; index <= Middleware.CCIPERIOD; index++) {
            var TPR = TypicalPriceResults[TypicalPriceResults.length - index].Result;
            MD += Math.abs(TPR - MA);
        }
        MD = MD / Middleware.CCIPERIOD;
        var Result = (TP.Result - MA) / (0.018 * MD);
        Middleware.CCIRESULTS.push({
            Id: Middleware.CCIRESULTS.length + 1,
            TPId: TP.Id,
            Result: Result
        });
        Middleware.CCISMAResualts = [];
    }

    function CCI() {
        var TP = TypicalPriceResults[TypicalPriceResults.length - 1];
        if (Middleware.CCIRESULTS.length === 0) {
            CCIProcess();
        } else if (Middleware.CCIRESULTS[Middleware.CCIRESULTS.length - 1].TPId < TP.Id) {
            CCIProcess();
        }
    }
});