// ==UserScript==
// @name            The West Script Suite
// @include         http://*.the-west.*/game.php*
// @author          Slygoxx
// @grant           none
// @version         1.0
// @description     A collection of enhancements for the browsergame The West
// @updateURL       https://github.com/Sepherane/userscripts/raw/master/scripts/Scriptsuite.user.js
// @installURL      https://github.com/Sepherane/userscripts/raw/master/scripts/Scriptsuite.user.js
// ==/UserScript==

function runScript(source) {
    if ('function' == typeof source) {
        source = '(' + source + ')();'
    }
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

runScript(function() {

    SlySuite = {
        preferences: {
            KOTimer: true,
            RiverColours: "default",
            Experience: false
        },
        getPreference: function(pref) {
            return this.preferences[pref];
        }

    };

    SlySuite.KOTimer = new Object();
    SlySuite.KOTimer.timeleft = 0;
    SlySuite.KOTimer.aliveAgain = 0;
    SlySuite.KOTimer.image = "<div style='position:relative;display:block;width:59px;height:59px;cursor:pointer;' id='knockouttimer'><div id='timer'></div></div>";

    SlySuite.KOTimer.firstrun = function() {

        if ($('.game_notification_area').length > 0) {
            $('.game_notification_area').append(this.image);
        } else {
            setTimeout(SlySuite.KOTimer.firstrun, 3000);
            console.log('Couldn\'t find the notification area, trying again soon...');
            return;
        }
        $('#knockouttimer').css('background-image', 'url("http://i300.photobucket.com/albums/nn22/qwexrty/knockout_sprite_zps97503234.png")');

        $('#knockouttimer #timer').css({
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'right': '0px',
            'color': 'white',
            'text-align': 'center',
            'font-size': '11px',
            'height': '30px',
            'line-height': '30px'
        });

        SlySuite.KOTimer.retrieveTimeleft();
        SlySuite.KOTimer.update();
    };

    SlySuite.KOTimer.retrieveTimeleft = function() {
        if (Character.homeTown.town_id != 0) // Can only request the info when you're in a town
        {
            $.post("game.php?window=building_sheriff&mode=index", {
                town_id: Character.homeTown.town_id
            }, function(data) {
                SlySuite.KOTimer.timeleft = data.timeleft;
                SlySuite.KOTimer.aliveAgain = Math.round(new Date().getTime() / 1000) + data.timeleft;
            });
        } else // We'll hide the image when you're not in a town
        {
            SlySuite.KOTimer.aliveAgain = 0;
            $('#knockouttimer').hide();

        }
        setTimeout(SlySuite.KOTimer.retrieveTimeleft, 300000); // And we'll do it again in 5 minutes
    };

    SlySuite.KOTimer.update = function() {
        var unix = Math.round(new Date().getTime() / 1000);
        aliveAgain = SlySuite.KOTimer.aliveAgain;
        if (aliveAgain < unix) {
            $('#knockouttimer').hide();
            setTimeout(SlySuite.KOTimer.update, 10000);
            return;
        } else
            $('#knockouttimer').show();

        difference = aliveAgain - unix;
        hours = Math.floor(difference / 60 / 60);
        difference -= hours * 60 * 60;
        minutes = Math.floor(difference / 60);
        difference -= minutes * 60;

        if (hours == 0 && minutes == 0)
            $('#knockouttimer #timer').html(Math.round(difference) + 's');
        else if (hours == 0)
            $('#knockouttimer #timer').html(minutes + 'm');
        else
            $('#knockouttimer #timer').html(hours + 'h:' + minutes + 'm');

        setTimeout(SlySuite.KOTimer.update, 1000);

    };


    if (SlySuite.getPreference('KOTimer'))
        SlySuite.KOTimer.firstrun();




});