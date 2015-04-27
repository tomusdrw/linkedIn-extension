angular.module('App').factory('Profiles', function($q) {
  return {
    getAll: function() {
      var deferred = $q.defer();
      chrome.storage.local.get('profiles', function(res) {
        if (res.profiles) {
          deferred.resolve(_.values(res.profiles));
        } else {
          deferred.reject('no-profiles');
        }
      });
      return deferred.promise;
    },

    setProfiles: function(profiles) {
      var deferred = $q.defer();      

      var prof = {};
      profiles.map(function(profile){
        prof[profile.id] = profile;
      });

      chrome.storage.local.set({
        profiles: prof
      }, function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    }
  };
});
