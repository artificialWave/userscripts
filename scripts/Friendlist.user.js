// ==UserScript==
// @name        The West Friendevents
// @description Add a button to filter friends you haven't sent anything to, works for all events
// @include     http://*.the-west.*/game.php*
// @version     1.0
// @autor       Slygoxx (Original by Duncol)
// @grant       none
// @updateURL	https://github.com/Sepherane/userscripts/raw/master/scripts/Friendlist.user.js
// @installURL	https://github.com/Sepherane/userscripts/raw/master/scripts/Friendlist.user.js
// ==/UserScript==
(function(e) {
    var t = document.createElement("script");
    t.type = "application/javascript";
    t.textContent = "(" + e + ")();";
    document.body.appendChild(t);
    t.parentNode.removeChild(t);
})
(function() {
    if (/http:\/\/.+\.the-west\..*\/game\.php.*/
        .test(window.location.href)) {

        FriendsEvents = {
            interval: 0,
            ready: false,
            create: function(currentEvent) {
                try {
                    WestUi.FriendsBar.friendsBarUi.inLine = function() {

                        WestUi.FriendsBar.friendsBarUi.changeEvents_('unlisten');
                        $('.filter_event').css({
                            'opacity': '1'
                        });
                        WestUi.FriendsBar.friendsBarUi.friendsBar.setFilter(currentEvent, true);

                    };
                    WestUi.FriendsBar.friendsBarUi.friendsBar.filterTypes_[currentEvent] = function(player) {

                        if (player.name === Character.name) return false;

                        var term = this.activeFilters_[currentEvent];

                        var ev = Game.sesData[currentEvent];

                        var lastActivation = WestUi.FriendsBar.friendsBarUi.friendsBar.getEventActivation(currentEvent, player.player_id);
                        var diff = lastActivation + parseInt(ev.friendsbar.cooldown, 10) - new ServerDate().getTime() / 1000;
                        return (diff < 0);

                    };
                    var img = $('<img class="fbar-event-img filter_event" ' +
                        'src="/images/interface/friendsbar/events/' + currentEvent + '.png" />');

                    var here = $('div.toggler-left');
                    here.append('<div />').before(img);
                    img.click(function(e) {
                            if (!isDefined(WestUi.FriendsBar.friendsBarUi.friendsBar.activeFilters_[currentEvent])) {

                                WestUi.FriendsBar.friendsBarUi.inLine();
                            } else {
                                WestUi.FriendsBar.friendsBarUi.friendsBar.setFilter(currentEvent, null);
                                $('.filter_event').css({
                                    'opacity': '0.43'
                                });
                                WestUi.FriendsBar.friendsBarUi.changeEvents_('listen');
                            }
                        }

                    );
                    img.css({
                        'opacity': '0.43',
                        'cursor': 'pointer'
                    });
                    FriendsEvents.ready = true;
                } catch (e) {
                    ErrorLog.log('Error creating button : ', e);
                }
            }

        }


        try {

            var that = this;
            var timeout = 0;
            FriendsEvents.interval = setInterval(
                function() {

                    var loading = false;

                    if (isDefined(WestUi.FriendsBar.friendsBarUi)) {
                        loading = true;


                    } else {



                    }
                    if (loading) {
                        clearInterval(FriendsEvents.interval);
                        for (eventName in Game.sesData) {
                            ev = Game.sesData[eventName];

                            if (!ev.friendsbar) continue;

                            if (buildTimestamp(ev.meta.end, true) <= new ServerDate().getTime()) continue;

                            FriendsEvents.create(ev.event_id); // If event is active and requires the friendsbar, show the button.
                        }



                    }

                }, 500);

        } catch (e) {
            ErrorLog.log("Error intialising script: ", e);

            FriendsEvents.ready = false;
        }



    }



});