angular.module('ziaxgazapp.services', ['ziaxgazapp.constants'])

.service('User', function($window) {
  this.get = function() {
    var user;
    if (user) return user;
    var json = $window.localStorage.getItem('user');
    if (!json) return;
    user = JSON.parse(json);
    return user;
  };

  this.create = function(user) {
    if (!user) throw new Error("no user");
    angular.extend(user, { settings: { } });
    return user;
  };
  this.store = function(user) {
    $window.localStorage.setItem('user', JSON.stringify(user));
  };
  this.remove = function() {
    $window.localStorage.removeItem('user');
  };
})

.service('Rest', ['$http', 'User', 'Hardware', 'FINALS', function($http, User, Hardware, FINALS) {
  var _host = FINALS.host;

  function feel(res) {
    Hardware.vibrate(500);
    return res;
  }

  this.testv4 = function() {
    return $http.post(_host + 'v4', { x: 1, y: 2 });
    // var u = User.get();
    // return $http.get('http://localhost:8081/v4', { params: { uid: u.id, hid: u.hid }});
  };
  this.vehicles = function() {
    return $http.post(_host + 'api/vehicle/list');
  };
  this.authorize = function(uid, lastname) {
    return $http.post(_host + 'api/appauth', { uid: uid, lastname: lastname });
    // return $http.post('http://host.ziax.dk:8081/api/appauth', { uid: uid, lastname: lastname });
  };
  this.stationsNear = function(lat, lon) {
    // alert(lat + ',' + lon);
    return $http.post(_host + 'api/stations_near', { lat: lat, lon: lon });
  };
  this.store = function(gaz) {
    return $http.post(_host + 'api/document2', gaz).success(feel);
  };
  this.list = function(offset) {
    return $http.get(_host + 'api/gaz/list', { params: { offset: offset } });
  };
  this.gaz = function(id) {
    return $http.get(_host + 'api/gaz', { params: { id: id } });
  };
  this.remove = function(es) {
    return $http.delete(_host + 'api/gaz', { params: es }).success(feel);
  };
}])

// .service('RestOffline', ['$q', function($q) {
//   this.list = function() {
//     var defer = $q();
//     defer.reject('RestOffline');
//     return defer.promise;
//   };
// }])

.service('Hardware', [function() {
  this.vibrate = function(timeMs) {
    alert(navigator);
    alert(navigator.vibrate);
    if (navigator && navigator.vibrate) {
      navigator.vibrate(200);
    } else {
      // alert('vibrate');
      console.log('vibrating for', timeMs);
    }
  };
  this.isOnline = function() {
    return false;
    if (!window.navigator || !window.navigator.connection) return true;
    var networkState = navigator.connection.type;
    return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
  };
}]);
