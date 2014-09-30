angular.module('ziaxgazapp.providers', [])
.provider('GPS', function() {
  var _rootScopeName, _intervalMilli;
  
  this.rootScopeVariable = function(name) {
    _rootScopeName = name;
  },
  this.intervalVariable = function(value) {
    _intervalMilli = value;
  },

  this.$get = ['$rootScope', '$interval', function($rootScope, $interval) {
    var watchId,
        intervalId,
        updated = false,
        oldCoords;


    function startGps() {
      console.log('Starting GPS');
      if (watchId) return;
      $rootScope[_rootScopeName] = { hasFix: false };
      intervalId = $interval(function() { updated = false; }, _intervalMilli || 5000);

      watchId = navigator.geolocation.watchPosition(function(position) {
        update(position.coords);
      }, function(err) {
        console.log('GPS err', err);
        // alert(err);
      }, {
        maximumAge: 10,
        timeout: 90000,
        enableHighAccuracy: true
      });
      console.log('GPS started', watchId);
    }

    function stopGps() {
      console.log('Stopping GPS');
      if (!watchId) return;
      navigator.geolocation.clearWatch(watchId);
      watchId = undefined;
      $interval.cancel(intervalId);
      intervalId = undefined;
    }

    function update(coords) {
      if (updated || (oldCoords && oldCoords.latitude == coords.latitude && oldCoords.longitude == coords.longitude)) return;
      console.log('Updated', coords);
      angular.extend($rootScope[_rootScopeName], coords, { hasFix: true });
      $rootScope.$apply();
      updated = true;
      oldCoords = coords;
    }

    function reset() {
      updated = false;
    }

    return {
      startGps: startGps,
      stopGps: stopGps,
      reset: reset
    };
  }];
});
