// ==UserScript==
// @name			The West Colourful Rivers
// @description		Allows you to change the colours of the rivers in The West.
// @include			http://*.the-west.*/game.php*
// @version			1.2
// @author			Slygoxx
// @grant			none
// @updateURL       http://userscripts.org/scripts/source/388964.meta.js
// @installURL      http://userscripts.org/scripts/source/388964.user.js
// ==/UserScript== 

function contentEval(source) {
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }

  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
  document.body.removeChild(script);
}

RiverFunction = function(){
    RiverColours = {initialized:false};
    RiverColours.currentColour = 'default';
    RiverColours.possibleColours = {Default:'default',Red:'halloween',Green:'paddy',Pink:'valentine',Blue:''};
    RiverColours.init = function(){
        if(typeof(Map.Helper) == 'undefined')
			return;
        RiverColours.initialized = true;
        RiverColours.oldScript = Map.Helper.imgPath.lookForModification.bind({});
        Map.Helper.imgPath.lookForModification = function(path,d){
            if(/river|deco_egg_05|quests_fluss/.test(path) && RiverColours.currentColour != 'default')
            {
                return RiverColours.currentColour+'/'+path;
            }
            else
                return RiverColours.oldScript(path,d);
            
        }
        RiverColours.changeColour = function(c){
            if(c==RiverColours.currentColour)
                return;
            RiverColours.currentColour = c;
            Map.Helper.imgPath.clearCache();
            Map.refresh(true);
            if(typeof(localStorage) != 'undefined')
                localStorage['RiverColour'] = c;
        }
    };
    var bottom = $('<div></div>').attr({
		'class' : 'menucontainer_bottom'
	});
    
    var icon = $('<div></div>').attr({
        'class' : 'menulink',
        'title' : "Change river colour"
    }).css({
        'background': 'url(http://i300.photobucket.com/albums/nn22/qwexrty/woof_zpsbc7c7465.png~original)',
        'background-position': '0px 0px'
    }).mouseleave(function(){
            $(this).css("background-position","0px 0px");
    }).mouseenter(function(e) {
        	$(this).css("background-position","25px 0px");
    }).click(function(e){
        if(!RiverColours.initialized)
        	RiverColours.init();
        RiverColours.openMenu(e);
    });
    
    $('#ui_menubar .ui_menucontainer :last').after($('<div></div>').attr({
		'class' : 'ui_menucontainer',
		'id' : 'RC_icon'
	}).append(icon).append(bottom));
    
    
    RiverColours.openMenu = function(e){
        if (isDefined(RiverColours.selectbox)) {
			RiverColours.selectbox.items = [];
        } 
        else {
			RiverColours.selectbox = new west.gui.Selectbox(true);
			RiverColours.selectbox.setWidth(250).addListener(
				function(key) {
				eval(RiverColours.changeColour(key));
					});
		}
		$.each(
		RiverColours.possibleColours,
		function(indexB, keyB) {
				RiverColours.selectbox.addItem(keyB, indexB);
		});
        RiverColours.selectbox.show(e);
        $('.tw2gui_selectbgr .arrow').hide();
    }
    $(setTimeout(function(){
        if(typeof(localStorage['RiverColour']) != 'undefined')
        {
            console.log('Loaded river colour settings from localStorage');
            RiverColours.init();
            RiverColours.changeColour(localStorage['RiverColour']);
        }
    },5000));
};

contentEval(RiverFunction);