// $(document).ready(function () {
//     var CurrentTime;
//     if (Middleware.CANDLES.lenght === 0) {
//         $("body").on('DOMSubtreeModified', ".value__val:first", function(){
//             console.log('chang');
//             CurrentTime = $(this).text();
//             if (CurrentTime === "00:01" || CurrentTime === "00:02" || CurrentTime === "00:03" || CurrentTime === "00:04" || CurrentTime === "00:05" || CurrentTime === "00:06" || CurrentTime === "00:07" || CurrentTime === "00:08" || CurrentTime === "00:09" || CurrentTime === "00:10" ||
//                 CurrentTime === "00:11" || CurrentTime === "00:12" || CurrentTime === "00:13" || CurrentTime === "00:14" || CurrentTime === "00:15" || CurrentTime === "00:16" || CurrentTime === "00:17" || CurrentTime === "00:18" || CurrentTime === "00:19" || CurrentTime === "00:20" ||
//                 CurrentTime === "00:21" || CurrentTime === "00:22" || CurrentTime === "00:23" || CurrentTime === "00:24" || CurrentTime === "00:25" || CurrentTime === "00:26" || CurrentTime === "00:27" || CurrentTime === "00:28" || CurrentTime === "00:29" || CurrentTime === "00:31" ||
//                 CurrentTime === "00:32" || CurrentTime === "00:33" || CurrentTime === "00:34" || CurrentTime === "00:35" || CurrentTime === "00:36" || CurrentTime === "00:37" || CurrentTime === "00:38" || CurrentTime === "00:39" || CurrentTime === "00:40" ||
//                 CurrentTime === "00:41" || CurrentTime === "00:42" || CurrentTime === "00:43" || CurrentTime === "00:44" || CurrentTime === "00:45" || CurrentTime === "00:46" || CurrentTime === "00:47" || CurrentTime === "00:48" || CurrentTime === "00:49" || CurrentTime === "00:50" ||
//                 CurrentTime === "00:51" || CurrentTime === "00:52" || CurrentTime === "00:53" || CurrentTime === "00:54" || CurrentTime === "00:55" || CurrentTime === "00:56" || CurrentTime === "00:57" || CurrentTime === "00:58" || CurrentTime === "00:59") {
//                 Middleware.ReadyToPricing = false;
//             } else if ( CurrentTime === "01:00" || CurrentTime === "00:30") {
//                 Middleware.ReadyToPricing = true;
//             }
//         });
//     }
// });