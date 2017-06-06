var app = angular.module('myApp', ['ngMap']);
app.controller('tourMapCtrl', ['$scope', 'NgMap', function ($scope, NgMap) {

  $scope.tours = [];

  let markers = [];

  let toursCount = 0;

  let markerCount = 1;

  let oldLat = null;
  let oldLng = null;

  let tourMap = null;
  NgMap.getMap().then(function (map) {
    tourMap = map;
  });

  let wayPoints = [];

  $scope.placeMarker = function (e) {
    let marker = new google.maps.Marker({
      position: e.latLng,
      map: tourMap,
      animation: google.maps.Animation.DROP,
      draggable: true,
      label: String(markerCount)
    });

    markers.push(marker);

    markerCount++;

    marker.addListener('click', function (e) {
      console.log('MArkerrr');
      console.log(e);
      wayPoints = wayPoints.filter(wayPoint => wayPoint.location.lat !== e.latLng.lat() && wayPoint.location.lng !== e.latLng.lng());
      marker.setMap(null);
      marker = null;
    });

    marker.addListener('dragend', function (e) {
      console.log(e.latLng.lat());
      console.log(e.latLng.lng());
      wayPoints.forEach((wayPoint) => {
        if (wayPoint.location.lat == oldLat && wayPoint.location.lng == oldLng) {
          wayPoint.location.lat = e.latLng.lat();
          wayPoint.location.lng = e.latLng.lng();
        }
      });
      oldLat = oldLng = null;
    });

    marker.addListener('dragstart', function (e) {
      oldLat = e.latLng.lat();
      oldLng = e.latLng.lng();
    });

    // var marker = new google.maps.Marker({ position: e.latLng});
    console.log(marker.position.lat());
    console.log(marker.position.lng());
    // vm.map.panTo(e.latLng);
    wayPoints.push({ location: { lat: marker.position.lat(), lng: marker.position.lng() }, stopover: true });
    // $scope.origin = "64.9983981 25.49817";
    // $scope.destination = "65.0365146, 25.4974512";
  };

  $scope.getCoordinateOf = function (wayPoint) {
    // console.log(`${wayPoint.location.lat}, ${wayPoint.location.lng}`);
    return `${wayPoint.location.lat}, ${wayPoint.location.lng}`;
  };

  $scope.displayTour = function (e) {
    toursCount++;
    let origin = $scope.getCoordinateOf(wayPoints.shift());
    let destination = $scope.getCoordinateOf(wayPoints.pop());
    $scope.tours.push({ origin, destination, wayPoints, tourNumber: toursCount });
    wayPoints = [];
    markerCount = 1;
    removeMarkersOnMap(markers);
  };

  function removeMarkersOnMap(markers) {
    markers.forEach(marker => marker.setMap(null));
  }

}]);