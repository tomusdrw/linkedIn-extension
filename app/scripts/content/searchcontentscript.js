'use strict';
(function() {

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var node = mutation.addedNodes[0];
            if (!node) {
                return;
            }

            if (!node.classList.contains('entity')) {
                return;
            }

            addButtons(mutation.addedNodes);
        });

    });

    observer.observe(document.querySelector('ul.results'), {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true
    });

    function addButtons(name) {
        [].map.call(name, function($person) {
            addPersonDetails($person);
        });
    }

    function findPersonById(personId) {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.get('profiles', function(res) {
                if (!res.profiles) {
                    return reject('no-profiles');
                }

                var resArr = []
                for (var i in res.profiles) {
                    resArr.push(res.profiles[i])
                }
                resolve(resArr);
            });
        }).then(function(profiles){

          return profiles.reduce(function(found, profile){
            if (found) {
              return found;
            }

            if (profile.id === personId) {
              return profile;
            }
          }, null);

        })

    }


    var personTpl = _.template(
      [
      ' <div style="margin: 5px 0px 10px 0px;">',
      ' <span style="background-color: #aba; padding: 5px 8px; font-size: 13px;"><%= status %></span>',
      ' <% tags.forEach(function(tag){ %>',
      '   <span style="background-color: #daa; padding: 5px 8px; font-size: 13px;"><%= tag %></span>',
      ' <% }); %>',
      ' </div>',
      ].join('\n')
    );

    function addPersonDetails($person) {
        var profileId = extractProfileId($person.querySelector('h3.name > a').href);

        findPersonById(profileId).then(function(profile){
          if (!profile) {
            return;
          }

          var person = personTpl(profile);
          var div = document.createElement('div');
          div.innerHTML = person;
          $person.querySelector('.entity-content').insertBefore(div, $person.querySelector('.entity-content > .headline'));
        });
    }

    addButtons(document.querySelectorAll('li.entity'));


}());
