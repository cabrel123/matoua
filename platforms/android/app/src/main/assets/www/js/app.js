"use strict";
var $ = Dom7;

var app = new Framework7({
  name: "MATOUA", // App name
  theme: "auto", // Automatic theme detection

  el: "#app", // App root element
  buttonCancel: "Annuler",
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
      const userId = localStorage.getItem("userId");
      const FCM_token = localStorage.getItem("FCM_token");
      if (token == null || token == undefined || token == "") {
        $(".without-login").show();
        $(".with-login").hide();
      } else {
        $(".without-login").hide();
        $(".with-login").show();
      }
      //update user fcm token
      if (
        userId == null ||
        userId == undefined ||
        userId == "" ||
        FCM_token == null ||
        FCM_token == "" ||
        FCM_token == "undefined"
      ) {
        console.log("no user logged or no token generated");
      } else {
        setFcmToken();
      }
      document.addEventListener("offline", onOffline, false);
      document.addEventListener("online", onOnline, false);
      navigator.globalization.getPreferredLanguage(
        function (language) {
          localStorage.setItem("lang", language.value);
          console.log("language: " + language.value + "\n");
        },
        function () {
          console.log("Error getting language\n");
        }
      );

      console.log("Page initialized");
    },
  },
});

function onOffline() {
  // Handle the offline event
  let toastTop = app.toast.create({
    text: "Nous détectons un problème de connexion internet !",
    position: "top",
    closeTimeout: 2000,
  });
  // Open it
  toastTop.open();
  //app.dialog.alert("Nous détectons un problème de connexion internet !");
  var networkState = navigator.connection.type;
  if (networkState !== Connection.NONE) {
    let toastTop = app.toast.create({
      text: "Nous détectons un problème de connexion internet !",
      position: "top",
      closeTimeout: 2000,
    });
    // Open it
    toastTop.open();
  }
}
function onOnline() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN] = "Unknown connection";
  states[Connection.ETHERNET] = "Ethernet connection";
  states[Connection.WIFI] = "WiFi connection";
  states[Connection.CELL_2G] = "Cell 2G connection";
  states[Connection.CELL_3G] = "Cell 3G connection";
  states[Connection.CELL_4G] = "Cell 4G connection";
  states[Connection.CELL] = "Cell generic connection";
  states[Connection.NONE] = "No network connection";

  // Handle the online
  let toastTop = app.toast.create({
    text: "Votre connexion: " + states[networkState],
    position: "top",
    closeTimeout: 2000,
  });
  // Open it
  toastTop.open();
}

// Device ready
function formatNow() {
  var now = new Date();
  return (
    now.getHours() +
    ":" +
    now.getMinutes() +
    ":" +
    now.getSeconds() +
    "." +
    now.getMilliseconds()
  );
}

function addToLog(log) {
  console.log("log ", log);
  // document.getElementById("notification-logs").innerHTML =
  //   "<hr>" +
  //   "<p>Received at " +
  //   formatNow() +
  //   "</p>" +
  //   log +
  //   document.getElementById("notification-logs").innerHTML;
}

function trySomeTimes(asyncFunc, onSuccess, onFailure, customTries) {
  var tries = typeof customTries === "undefined" ? 100 : customTries;
  var interval = setTimeout(function () {
    if (typeof asyncFunc !== "function") {
      onSuccess("Unavailable");
      return;
    }
    asyncFunc()
      .then(function (result) {
        if ((result !== null && result !== "") || tries < 0) {
          onSuccess(result);
        } else {
          trySomeTimes(asyncFunc, onSuccess, onFailure, tries - 1);
        }
      })
      .catch(function (e) {
        clearInterval(interval);
        onFailure(e);
      });
  }, 100);
}

function setupOnTokenRefresh() {
  FCM.eventTarget.addEventListener(
    "tokenRefresh",
    function (data) {
      addToLog("<p>FCM Token refreshed to " + data.detail + "</p>");
    },
    false
  );
}

function setupOnNotification() {
  FCM.eventTarget.addEventListener(
    "notification",
    function (data) {
      app.dialog.alert(data.detail.body);
      addToLog("<pre>" + JSON.stringify(data.detail, null, 2) + "</pre>");
    },
    false
  );
  FCM.getInitialPushPayload()
    .then((payload) => {
      addToLog(
        "<p>Initial Payload</p><pre>" +
          JSON.stringify(payload, null, 2) +
          "</pre>"
      );
    })
    .catch((error) => {
      addToLog(
        "<p>Initial Payload Error</p><pre>" +
          JSON.stringify(error, null, 2) +
          "</pre>"
      );
    });
}

function logFCMToken() {
  trySomeTimes(
    FCM.getToken,
    function (token) {
      localStorage.setItem("FCM_token", token);
      addToLog("<p>Started listening FCM as " + token + "</p>");
    },
    function (error) {
      addToLog("<p>Error on listening for FCM token: " + error + "</p>");
    }
  );
}

function logAPNSToken() {
  if (cordova.platformId !== "ios") {
    return;
  }
  FCM.getAPNSToken(
    function (token) {
      addToLog("<p>Started listening APNS as " + token + "</p>");
    },
    function (error) {
      addToLog("<p>Error on listening for APNS token: " + error + "</p>");
    }
  );
}

function setupClearAllNotificationsButton() {
  document.getElementById("clear-all-notifications").addEventListener(
    "click",
    function () {
      FCM.clearAllNotifications();
    },
    false
  );
}

function setupClearAllNotificationsButton() {
  document.getElementById("delete-instance-id").addEventListener(
    "click",
    function () {
      FCM.deleteInstanceId().catch(function (error) {
        alert(error);
      });
    },
    false
  );
}

function waitForPermission(callback) {
  FCM.requestPushPermission()
    .then(function (didIt) {
      if (didIt) {
        callback();
      } else {
        addToLog("<p>Push permission was not given to this application</p>");
      }
    })
    .catch(function (error) {
      addToLog("<p>Error on checking permission: " + error + "</p>");
    });
}

function logHasPermissionOnStart() {
  FCM.hasPermission().then(function (hasIt) {
    addToLog("<p>Started with permission: " + JSON.stringify(hasIt) + "</p>");
  });
}

function setupListeners() {
  console.log("device ready");
  logHasPermissionOnStart();
  waitForPermission(function () {
    FCM.createNotificationChannel({
      id: "sound_alert6",
      name: "Sound Alert6",
      // description: "Useless",
      importance: "high",
      // visibility: "public",
      sound: "elet_mp3",
      // lights: false,
      // vibration: false,
    });
    logFCMToken();
    logAPNSToken();
    setupOnTokenRefresh();
    setupOnNotification();
    setupClearAllNotificationsButton();
  });

  document.addEventListener(
    "backbutton",
    function (e) {
      let currentPage = app.views.main.router.currentRoute.path;
      console.log("currentPage", currentPage);

      if (currentPage == "/home/") {
        e.preventDefault();
        app.dialog.confirm(
          "Voulez-vous vraiment quitter l'application ?",
          function () {
            navigator.app.exitApp();
          }
        );
      } else {
        history.go(-1);
        navigator.app.backHistory();
      }
    },
    false
  );
}

function setFcmToken() {
  const userId = localStorage.getItem("userId");
  const fcm_token = localStorage.getItem("FCM_token");
  // API endpoint for creating a new user
  const apiUrl3 = "https://matoua.com/api/fcm";

  // Form data to be sent in the request body
  const formData = {
    fcm_token: fcm_token,
    userId: userId,
  };

  fetch(apiUrl3, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Process the newly created user data
      console.log("fcm token updated !");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("deviceready", setupListeners, false);

var view = app.views.create(".view-main");
const token = localStorage.getItem("token");
setTimeout(function () {
  if (token == null || token == undefined || token == "") {
    app.views.main.router.navigate("/walkthrough/");
  } else {
    app.views.main.router.navigate("/home/");
  }
}, 2000);
