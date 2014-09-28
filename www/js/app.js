angular.module('ziaxgazapp', [
  'ionic',
  'ziaxgazapp.providers',
  'ziaxgazapp.controllers',
  'ziaxgazapp.services',
  'ziaxgazapp.directives',
  'ziaxgazapp.constants'])

.run(['$ionicPlatform', '$rootScope', '$state', '$timeout', 'User', 'Hardware', 'GPS', 'FINALS',
  function($ionicPlatform, $rootScope, $state, $timeout, User, Hardware, GPS, FINALS) {

  $ionicPlatform.ready(function() {
    GPS.reset();
    GPS.startGps();

    $rootScope.user = User.get();
    console.log('ionicPlatform ready.');
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    console.log('Using host', FINALS.host);
    Hardware.vibrate(200);
    
    document.addEventListener("pause", function () {
      console.log('Pause');
      GPS.stopGps();
    }, false);
    document.addEventListener("resume", function () {
      console.log('Resume');
      GPS.reset();
      GPS.startGps();
    }, false);
    document.addEventListener("backbutton", function () {
      console.log('backbutton');
    }, false);
  });

  // $rootScope.$on('$stateChangeError', function() {
  //   console.log('$stateChangeError', arguments);
  // });

  $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromstate, fromParams) {
    // console.log('toState', toState, toParams);
    // When unauthorized...
    if (!$rootScope.user && "login logout".indexOf(toState.name) == -1) {
      evt.preventDefault();
      $state.go('login', {}, { notify: true });
      return;
    }

    // When authorized...
    if ($rootScope.user && toState.name == 'login') {
      evt.preventDefault();
      // console.log('auth');
      $state.go('app.new', {}, { notify: true });
      return;
    }

    // if ($rootScope.user && toState.name == 'login') {
    //   console.log('$stateChangeStart-1', toState);
    //   evt.preventDefault();
    //   // $timeout(function() {
    //   //   $state.go('app.new', {}, { notify: true });
    //   // }, 1);
    //   $state.go('app.new', {}, { notify: true });
    //   return;
    // }

    // if (!$rootScope.user && "login logout".indexOf($state.current.name) != -1) {
    //   console.log('$stateChangeStart-2', $state.current.name);
    //   evt.preventDefault();
    //   $state.go('login', {}, { notify: true });
    //   // $state.go('login');
    //   // $timeout(function() {
    //   //   // $state.go('login', {}, { notify: true });
    //   // }, 1);
    //   return;
    // }
  });

  Array.prototype.spliceRem = function(cb) {
    for (var i = this.length - 1; i >= 0; i--) {
      if (cb(this[i]))
        this.splice(i, 1);
      // if (this[i].id == item.id) {
      //   this.splice(i, 1);
      // }
    }
  };
}])

.config(['$stateProvider', '$urlRouterProvider', 'GPSProvider', '$httpProvider', '$provide',
  function($stateProvider, $urlRouterProvider, GPSProvider, $httpProvider , $provide) {

    GPSProvider.rootScopeVariable('position');
    GPSProvider.intervalVariable(10000);

    // $provide.decorator('Rest', function($delegate, $timeout, Hardware, RestOffline) {
    //   // var rejectedPromise = function() {
    //   //   console.log('rejectedPromise');
    //   //   var defer = $q();
    //   //   // $timeout(function() {
    //   //     defer.reject('offline');
    //   //   // }, 1000);
    //   //   return defer.promise;
    //   // };

    //   // console.log(_.functions($delegate));
    //   // var dummy = {
    //   //   list: function() {
    //   //     // var defer = $q();
    //   //     // console.log(rejectedPromise());
    //   //     return { data: { hits: { hits: '' } } };
    //   //   }
    //   // };

    //   // return $delegate;
    //   // return RestOffline;
    //   // return rejectedPromise();
    //   // return RestOffline;
    //   return $delegate;
    // });

    $httpProvider.interceptors.push(function($q, User) {
      return {
        request: function(config) {
          var u = User.get(),
              url = config.url;
          if (u && (url.indexOf('/v4') !== -1 || url.indexOf('/api') !== -1)) {
            // console.log('YUP', config);
            // console.log('YUP', { uid: u.id, hid: u.hid });
            config.params = angular.extend({}, config.params, { uid: u.id, hid: u.hid });
          }
          return config;
        }
      };
    });

  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: "tmpl/login.html",
      controller: 'LoginCtrl'
    })

    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
      // resolve: {
      //   logout: function(User) {
      //     console.log('resolve', User);
      //   }
      // }
    })

    .state('app', {
      data: { protected: true },
      url: "/app",
      abstract: true,
      templateUrl: "tmpl/menu.html"
      // controller: 'AppCtrl'
    })

    .state('app.new', {
      url: "/new",
      views: {
        'menuContent' :{
          templateUrl: "tmpl/new.html",
          // controller: 'NewCtrl'
        }
      }
    })

    .state('app.history', {
      url: "/history",
      views: {
        'menuContent' :{
          templateUrl: "tmpl/history.html",
          controller: 'HistoryCtrl',
          resolve: {
            Data: function(Rest) { /*return Rest.list();*/ var list = Rest.list(); console.log('listapp', list); return list; }
          }
        }
      }
    })
    .state('app.historydetail', {
      url: "/history/:id",
      views: {
        'menuContent' :{
          templateUrl: "tmpl/historydetail.html",
          controller: 'HistoryDetailCtrl',
          resolve: {
            Gaz: function($stateParams, Rest) { return Rest.gaz($stateParams.id); }
          }
        }
      }
    })


    .state('app.place', {
      url: "/place",
      views: {
        'menuContent' :{
          templateUrl: "tmpl/place.html",
          controller: 'PlaceCtrl',
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "tmpl/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/login');
}]);

// document.addEventListener('deviceready', function () {
//   angular.bootstrap(document.body, [ 'detkoeberjeg' ]);
// }, false);