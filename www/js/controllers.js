angular.module('ziaxgazapp.controllers', ['ziaxgazapp.services'])

.controller('LoginCtrl', function($rootScope, $scope, $location, $state, $ionicViewService, $timeout, User, Rest) {
  // console.log('enter LoginCtrl');
  $scope.user = {};
  $scope.signIn = function (user) {
    Rest.authorize(user.email, user.password)
      .success(function(theUser) {
        User.store(theUser);
        $rootScope.user = theUser;
        $state.go('app.new', {}, { notify: true });
      });
  };
})

.controller('NewCtrl', function($rootScope, $scope, $ionicModal, $filter, Rest, Hardware, User) {
  console.log('enter NewCtrl');
  init();
  // console.log(User.get());
  // Rest.vehicles().success(function(data) {
  //   $scope.vehicles = data.hits.hits;
  //   $scope.form.vehicle = $scope.vehicles[0].id;
  // }).error(function(err) { throw err; });

  $scope.vehicles = User.get().vehicles;
  $scope.form.vehicle = $scope.vehicles[0].id;
  angular.forEach($scope.vehicles, function(v) {
    if (v.id === User.get().vehicleDefault) {
      $scope.form.vehicle = v.id;
    }
  });

  $rootScope.$watch('position', function(v) {
    if (v.hasFix) {
      Rest.stationsNear(v.latitude, v.longitude)
        .success(function(data) {
          $scope.stations = data.hits.hits;
          if ($scope.stations.length !== 0) {
            $scope.form.station = $scope.stations[0].id;
            angular.forEach($scope.stations, function(v) {
              v.display = v.source.name + ' (' + v.sort[0].toFixed(2) + ')';
            });
          }
          $scope.stations.push({ id: 'new', display: 'new...'});
        });
    }
  }, true);

  // console.log( angular.element($scope.theForm) );

  $scope.submit = function() {
    // console.log('submit', $scope);
    // return;
    $scope.created = false;
    $scope.failed = false;
    if (!$scope.theForm.$valid) return;
    angular.extend($scope.form, { type: 'gaz', tags: [], onlyAuth: false });

    // console.log($scope.form, $scope.theForm);
    Rest.store($scope.form).then(function() {
      Hardware.vibrate(500);
      $scope.created = true;
      init();
      setDefaults();
      $scope.theForm.$setPristine();
    }, function() { $scope.failed = true; });
  };

  function init() {
    $scope.form = {
      purchaseDateUtc: $filter("date")(Date.now(), 'yyyy-MM-dd')
    };
  }
  function setDefaults() {
    if ($scope.vehicles) $scope.form.vehicle = $scope.vehicles[0].id;
    if ($scope.stations) $scope.form.station = $scope.stations[0].id;
  }
})

.controller('LogoutCtrl', function($rootScope, $scope, $state, User) {
  console.log('Logout');
  delete $rootScope.user;
  // // $rootScope.user = null;
  User.remove();
  $state.go('login');
})

.controller('HistoryCtrl', function($rootScope, $scope, User, Data, Rest) {
  var offset = 0;
  $scope.data = Data.data.hits.hits;
  $scope.total = Data.data.hits.total;
  // console.log(Data);

  $scope.loadMore = function() {
    offset += 10;
    // console.log('offset now', offset);
    Rest.list(offset).then(function(data) {
      $scope.data = $scope.data.concat(data.data.hits.hits);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      // console.log('offset', offset, 'scope data', $scope.data.length, 'data', data.data.hits.hits);
    }, function(err) {
      console.log('err', err);
    });
  };
})

.controller('SettingsCtrl', function($rootScope, $scope, User) {
});
