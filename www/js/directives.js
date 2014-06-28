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
  })

  .directive('ngxSubmit', ['$parse', function ($parse) {
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
  }])

  .directive('station', [function() {
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      scope: {}, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<span ng-show="station">{{station.name}}</span>',
      // templateUrl: '',
      replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {
        $scope.station = false;
        iAttrs.$observe('station', function(v) {
          if (!v || !angular.isDefined(v)) return;
          $scope.station = $scope.$eval(v);
        });
      }
    };
  }])

  .directive('zMap', [function () {
    return {
      restrict: 'A',
      // scope: {},
      // priority: 1000,
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var t = this,
            map = L.map($element[0], { center: [0, 0], zoom: 12, zoomControl: false, attributionControl: false }),
            base0 = L.tileLayer('https://{s}.tiles.mapbox.com/v3/ziaxdk.h6efc5a4/{z}/{x}/{y}.png', { attribution: '' }).addTo(map),
            base2 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '' }),
            // base3 = L.bingLayer("Alv2HutsIUPb_D2Jz0KdN37XixBdCph40lz8uMUNyUM2yp3IPg0oaiHn-J0ieMU4");
            chooser = L.control.layers({ 'Mapbox': base0, 'Basic': base2/*, 'Bing': base3*/ }, {}, { position: 'bottomleft' }).addTo(map);

        t.map = map;
        t.chooser = chooser;
        t.layers = { 'Mapbox': base0, 'Basic': base2/*, 'Bing': base3*/ }, {}, { position: 'bottomleft' };

        $scope.$on('$destroy', function() {
          map.remove();
        });
      }]
    };
  }])

  .directive('zMapShowMarker', [function(){
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      // scope: {}, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      require: 'zMap', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      // templateUrl: '',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, zmap) {
        var map = zmap.map,
            marker = L.marker([0,0]).addTo(map);

        iAttrs.$observe('zMapShowMarker', function(v) {
          if (!angular.isDefined(v)) return;
          var point = angular.fromJson(v);
          marker.setLatLng(point);
          // map.panTo(point);
          map.setView(point, 17);
        });
      }
    };
  }]);
}());