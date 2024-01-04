"use strict";
var $ = Dom7;

var app = new Framework7({
  name: "cardigos", // App name
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
