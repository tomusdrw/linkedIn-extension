'use strict';
(function() {
    var name = document.querySelector('.member-name');
    var plusModal = false;
    var previewModal = false;
    var taggle = null;
    var showPlusModal = function() {
        if (!plusModal) {
            plusModal = document.querySelector('#linkedInExt-personForm');
        }
        plusModal.classList.add('show');
        document.querySelector('#linkedInExt-tags').innerHTML = '';
        taggle = new Taggle('linkedInExt-tags', {
            tags: Profile.tags
        });
    };
    var addPlusButton = function() {
        var button = document.createElement('button');
        button.textContent = '+';
        button.addEventListener('click', showPlusModal);
        name.appendChild(button);
    };
    var editPerson = function(e) {
        e.preventDefault();
        Profile.email = this.querySelector('.linkedInExt-email input').value;
        Profile.status = this.querySelector('.linkedInExt-status').value;
        Profile.city = this.querySelector('.linkedInExt-city input').value;
        Profile.comment = this.querySelector('.linkedInExt-comment textarea').value;
        Profile.tags = taggle.getTags().values;
        Profile.added = true;
        Storage.setProfile(Profile, function(res) {
            plusModal.classList.remove('show');
            propagateTemplates();
        });
    };
    var propagateTemplates = function() {
        return new Promise(function(resolve) {
            plusModal = Transparency.render(document.querySelector('#linkedInExt-personForm'), Profile);
            if (Profile.added) {
                previewModal = Transparency.render(document.querySelector('#linkedInExt-personPreview'), Profile);
                previewModal.classList.add('show');
            }
            resolve(true);
        });
    };
    var attachTemplateEvents = function() {
        plusModal.addEventListener('submit', editPerson);
        plusModal.querySelector('.linkedInExt-close').addEventListener('click', function(e) {
            e.preventDefault();
            plusModal.classList.remove('show');
        });
    };

    function safe$(selector, prop) {

        var $item = document.querySelector(selector);
        if ($item) {
            return $item[prop];
        }

        return null;
    }

    var Profile = {
        id: null,
        img:null,
        name: null,
        email: null,
        city: null,
        status: null,
        comment: null,
        tags: [],
        added: false
    };
    var setProfile = function(data) {
        if (!data) {
            Profile.name = safe$(NAME_EL, 'textContent');
            Profile.city = safe$(LOCAL_EL, 'textContent');
            Profile.img = safe$(IMG_EL, 'src');
            Profile.createdAt = new Date().getTime();
        } else {
            Profile = data;
        }
    };
    var init = function() {
        var profileId = extractProfileId(window.location.href);
        Profile.id = profileId;
        console.log(Profile.id);
        Storage.getProfile(profileId, function(res) {
            setProfile(res);
            getTemplates().then(propagateTemplates).then(attachTemplateEvents);
            addPlusButton();
        });
    };
    var getTemplates = function() {
        return new Promise(function(resolve, reject) {
            try {
                var xmlHttp = null,
                    scriptSrc = chrome.extension.getURL('scripts/content/templates.html');
                xmlHttp = new XMLHttpRequest();
                xmlHttp.open('GET', scriptSrc, false);
                xmlHttp.send(null);
                var inject = document.createElement('div');
                inject.innerHTML = xmlHttp.responseText;
                document.body.insertBefore(inject, document.body.firstChild);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };
    init();
})();