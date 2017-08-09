// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){


  var app = angular.module('myreddit', ['ionic', 'ngStorage'])
    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('eventmenu', {
          url: "/event",
          abstract: true,
          templateUrl: "templates/event-menu.html"
        })

        .state('eventmenu.home', {
          url: "/home",
          views: {
            'menuContent' :{
              templateUrl: "templates/home.html"
            }
          }
        })

        .state('eventmenu.checkin', {
          url: "/check-in",
          views: {
            'menuContent' :{
              templateUrl: "templates/check-in.html",
              controller: "CheckinCtrl"
            }
          }
        })
        .state('eventmenu.claimDelivery', {
          url: "/claimDelivery",
          views: {
            'menuContent' :{
              templateUrl: "templates/claimDelivery.html",
              controller: "claimDeliveryCtrl"
            }
          }
        })

        .state('eventmenu.claimInfo',{
          url : "/claimDelivery/claimInfo",
          views:{
            'menuContent' :{
              templateUrl:"templates/claimDelivery/claimInfo.html",
              controller: "claimDeliveryCtrl"
            }
          }
        })

        .state('eventmenu.myAvailability', {
          url: "/myAvailability",
          views: {
            'menuContent' :{
              templateUrl: "templates/myAvailability.html",
              controller: "MyAvailabilityCtrl"
            }
          }
        })
        .state('eventmenu.myDeliveries', {
          url: "/myDeliveries",
          views: {
            'menuContent' :{
              templateUrl: "templates/myDeliveries.html",
              controller: "MyDeliveriesCtrl"
            }
          }
        })

        .state('eventmenu.myDeliveriesInfo',{
          url : "/claimDelivery/myDeliveriesInfo",
          params: {
            myDeliveryInfo: null
          },
          views:{
            'menuContent' :{
              templateUrl:"templates/claimDelivery/myDeliveriesInfo.html",
              controller: "myDeliveriesInfo"
            }
          }
        });

      $urlRouterProvider.otherwise("/event/home");

    });

  app.service('ShipbirdService', function($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function() {
      console.log("Making server request");
      return $http({
        method: 'GET',
        url: 'http://localhost:3001/',
      });
    }
  });

  app.service('MyDeliveries', function($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.getData = function() {
      console.log("Making server request");
      return $http({
        method: 'GET',
        url: 'http://localhost:3001/myDeliveries',
      });
    }
  });


  app.service('MyDeliveriesSave', function() {
    var myDeliveries = [];

    this.saveMyDeliveries = function(deliveries) {
      console.log("I am here");
      myDeliveries = deliveries;
    }

    this.getMyDeliveries = function() {
      return myDeliveries;
    }

  });


  app.controller('myDeliveriesInfo', function($scope, $stateParams, MyDeliveriesSave){
    console.log($stateParams.myDeliveryInfo);
    $scope.detailDeliveryInfo = $stateParams.myDeliveryInfo;

    function initialize() {
      var dropOffLatlng = new google.maps.LatLng($scope.detailDeliveryInfo.dropoff_lat, $scope.detailDeliveryInfo.dropoff_lng);
      var pickUpLatlng = new google.maps.LatLng($scope.detailDeliveryInfo.pickup_lat, $scope.detailDeliveryInfo.pickup_lng);

      var GLOBE_WIDTH = 256; // a constant in Google's map projection
      var dropOff = dropOffLatlng.lng();
      var pickUp = pickUpLatlng.lng();
      var angle = pickUp - dropOff;

      if (angle < 0) {
        angle += 360;
      }

      var mapOptions = {
        center: dropOffLatlng,
        zoom: Math.round(Math.log( 360 * 960000 / angle / GLOBE_WIDTH) / Math.LN2),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      console.log(map);


      var dropOffMarker = new google.maps.Marker({
        position: dropOffLatlng,
        map: map,
        //title: 'Uluru (Ayers Rock)'
        icon: '../img/Map-Marker-Ball-Pink-icon.png'
      });


      var pickupMarker = new google.maps.Marker({
        position: pickUpLatlng,
        map: map,
        //title: 'Uluru (Ayers Rock)'
        icon: '../img/Map-Marker-Ball-Azure-icon.png'
      });

      $scope.map = map;
    }

    $scope.$on('$ionicView.enter', function() {
      console.log("I am Here");
      initialize();
    });

  });


  app.controller('RedditCtrl', function($http, $scope, ShipbirdService) {
    $scope.fileDetails = [];
    ShipbirdService.getData().then(function(dataResponse) {
      console.log("Received server response");
      console.log(dataResponse.data);
      $scope.fileDetails = dataResponse.data;

    });
  });


  app.controller('MyAvailabilityCtrl', function($http, $scope, MyAvailability) {
    $scope.response = [];
    MyAvailability.getData().then(function(dataResponse) {
      console.log("Received server response");
      console.log(dataResponse.data);
      $scope.response = dataResponse.data;
    });
  });



  app.controller('claimDeliveryCtrl', function($http, $scope, claimDelivery) {

    $scope.response = [];
    claimDelivery.postData().then(function(dataResponse) {
      console.log("Received server response");
      console.log(dataResponse.data);
      $scope.response = dataResponse.data;
    });

    $scope.popme = function(){
      alert("I will deliver the package!");
    }
  });


  app.controller('confirmPickupCtrl', function($http, $scope, confirmPickup) {
    $scope.response = [];
    confirmPickup.postData().then(function(dataResponse) {
      console.log("Received server response");
      console.log(dataResponse.data);
      $scope.response = dataResponse.data;
    });

    $scope.popme = function(){
      alert("I will deliver the package!");
    }
  });


  app.controller('claimInfoCtrl', function($http, $scope, claimDelivery) {

    $scope.response = [];
    claimDelivery.postData().then(function(dataResponse) {
      console.log("Received claimInfo response");
      console.log(dataResponse.data);
      $scope.response = dataResponse.data;
    });
  });

  
  app.controller('popOverCtrl', function($scope, $ionicPopover) {

    $ionicPopover.fromTemplateUrl('templates/claimDelivery/popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
      // Execute action
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
      // Execute action
    });
  })

  
  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
}());

