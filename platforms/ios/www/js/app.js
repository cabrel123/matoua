"use strict";
var $ = Dom7;

var app = new Framework7({
  name: "MATOUA", // App name
  theme: "auto", // Automatic theme detection

  el: "#app", // App root element

  // App store
  store: store,
  // App routes
  routes: routes,
  on: {
    init: function () {
      console.log("App initialized");
    },
    pageInit: function () {
      const token = localStorage.getItem("token");
      if (token == null || token == undefined || token == "") {
        $(".without-login").show();
        $(".with-login").hide();
      } else {
        $(".without-login").hide();
        $(".with-login").show();
      }
      console.log("Page initialized");
    },
  },
});
// Device ready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("device ready");
  FCMPlugin.getToken(function (token) {
    //this is the FCM token which can be used
    //to send notification to specific device
    console.log("George here is the token", token);
    alert(token);

    //FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
    //Here you define your application behaviour based on the notification data.
    FCMPlugin.onNotification(function (data) {
      console.log(data);
      //data.wasTapped == true means in Background :  Notification was received on device tray and tapped by the user.
      //data.wasTapped == false means in foreground :  Notification was received in foreground. Maybe the user needs to be notified.
      if (data.wasTapped) {
        //Notification was received on device tray and tapped by the user.
        alert(JSON.stringify(data));
      } else {
        //Notification was received in foreground. Maybe the user needs to be notified.
        alert(JSON.stringify(data));
      }
    });
  });
}

var view = app.views.create(".view-main");
const token = localStorage.getItem("token");
setTimeout(function () {
  if (token == null || token == undefined || token == "") {
    app.views.main.router.navigate("/walkthrough/");
  } else {
    app.views.main.router.navigate("/home/");
  }
}, 2000);
