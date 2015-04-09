angular.module('App').factory('Profiles', function($q) {
  return {
    getAll: function() {
      var deferred = $q.defer();
      chrome.storage.local.get('profiles', function(res) {
        if (res.profiles) {
          var resArr = [];
          for (var i in res.profiles) {
            resArr.push(res.profiles[i]);
          }
          deferred.resolve(resArr);
        } else {
          deferred.reject('no-profiles');
        }
      });
      return deferred.promise;
    },

    setProfiles: function(profiles) {
      var deferred = $q.defer();
      chrome.storage.local.set({
        profiles: profiles
      }, function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    }
  };
});
