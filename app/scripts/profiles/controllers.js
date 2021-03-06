angular.module('App').controller('ProfilesCtrl', function($scope, Profiles, $filter, $window) {
  $scope.profiles = [];
  $scope.searchText = "";

  var filtr = $filter('filter');

  function filterProfiles() {
    var parts = $scope.searchText.split(' ');

    var people = parts.map(function(part) {
      return filtr($scope.profiles, part);
    });

    $scope.filteredProfiles = _.intersection.apply(_, people);
  }

  $scope.$watch('searchText', filterProfiles);
  $scope.$watch('profiles', filterProfiles);


  Profiles.getAll().then(function(profiles) {
    $scope.profiles = profiles;
  });


  $scope.backup = {};

  $scope.restore = function() {
    try {
      Profiles.setProfiles(JSON.parse($scope.backup.data)).then(function(){
        $window.alert('Restored!');
        $window.location.reload();
      });
    } catch (e) {
      $window.alert(e);
    }
  };
  $scope.backupContent = function() {

    var blob = new Blob([JSON.stringify(angular.copy($scope.profiles), null, 2)], {
      type: 'application/json'
    });

    var downloadLink = document.createElement("a");
    downloadLink.download = 'people.json';
    downloadLink.innerHTML = "Download File";
    downloadLink.href = URL.createObjectURL(blob);

    document.body.appendChild(downloadLink);
    downloadLink.click();
  };
});
