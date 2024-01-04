var routes = [
  {
    path: "/",
    url: "./index.html",
  },
  {
    path: "/about/",
    url: "./pages/about.html",
  },
  {
    path: "/form/",
    url: "./pages/form.html",
  },
  {
    path: "/walkthrough/",
    url: "./pages/walkthrough.html",
    name: "walkthrough",
  },
  {
    path: "/find-a-ride/",
    componentUrl: "./pages/find-a-ride.html",
  },
  {
    path: "/rider-list/",
    componentUrl: "./pages/rider-list.html",
  },
  {
    path: "/ride-history/",
    componentUrl: "./pages/ride-history.html",
  },
  {
    path: "/publish-ride/",
    componentUrl: "./pages/publish-ride.html",
  },
  {
    path: "/passenger-history/:bookrideId/",
    componentUrl: "./pages/passenger-history.html",
  },
  {
    path: "/home/",
    componentUrl: "./pages/home.html",
  },
  {
    path: "/signin/",
    componentUrl: "./pages/signin.html",
  },
  {
    path: "/signup/",
    componentUrl: "./pages/signup.html",
  },
  {
    path: "/user-profile/",
    componentUrl: "./pages/user-profile.html",
  },
  {
    path: "/my-ride/",
    componentUrl: "./pages/my-ride.html",
  },
  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    componentUrl: "./pages/dynamic-route.html",
  },
  {
    path: "/request-and-load/user/:userId/",
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io",
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io",
            },
          ],
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: "./pages/request-and-load.html",
          },
          {
            props: {
              user: user,
            },
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: "(.*)",
    url: "./pages/404.html",
  },
];
