class Middleware {
    static STOCKNAME = "";
    static MOMENTUMPERIOD = 13; // Defualt = 13
    static CCIPERIOD = 18; // Defualt = 18
    static TradeTime = 60; // Defulat 60s
    static PERIOD = 28; //EMA Defualt 28
    static CANDLES = [];
    static EMARESULTS = [];
    static CCIRESULTS = [];
    static CCISMAResualts = [];
    static MOMENTUMRESULTS = [];
    static Processiong = false;
    static ReadyToPricing = false;
    static CalButtonId = "btnCall";
    static PutButtonId = "btnPut";
    static CallButtonClassName = ".btn.btn-call";
    static PUTButtonClassName = ".btn.btn-put";
    static CloseButtonClassName = ".btn.btn-green-light";
    static DivCancleName = ".cancel";
    static DIVTOCloseCLassName = this.DivCancleName + this.CloseButtonClassName;
    static CloseButtonID = "btnClose";
    static AutoStart = true;
    static LastTrade = [];
}