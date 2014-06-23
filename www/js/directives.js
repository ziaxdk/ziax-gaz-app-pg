(function() {
  var m = angular.module('ziaxgazapp.directives', []);

  "SwipeRight SwipeLeft".split(' ').forEach(function(action) {
    var ngName = 'z' + action;
    m.directive(ngName, function($ionicGesture) {
      return {
        link: function($scope, $element, $attrs) {
          $ionicGesture.on(action.toLowerCase(), function(e) {
            $scope.$apply($attrs[ngName]);
          }, $element);
        }
      };
    });
  });

  m.directive('zTouchRelease', function($ionicGesture, $animate) {
    // console.log($animate)
    return function($scope, $element, $attrs) {
      $ionicGesture.on('touch', function(e) {
        $element.addClass('zTouchRelease');
      }, $element);
      $ionicGesture.on('release', function(e) {
        $element.removeClass('zTouchRelease');
      }, $element);
    };
  });



  m.directive('ngxSubmit', ['$parse', function ($parse) {
    return function (scope, element, attr) {
      attr.$observe('ngxSubmitClear', function(v) {
        // console.log('v', v, '!', !v, '!!', !!v, typeof v, v == 'true');
        if (v == 'true') {
          element.removeClass('ngx-attempt');
        }
      });

      var fn = $parse(attr.ngxSubmit);
      element.on('submit', function (event) {
        element.addClass('ngx-attempt');
        scope.$apply(function () {
          fn(scope, { $event: event });
        });
      });
    };
  }]);

}());


