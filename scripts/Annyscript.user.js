// ==UserScript==
// @name      	Annyscript 1
// @author		Slygoxx
// @namespace  	http://forum.the-west.net/
// @version    	0.1
// @description Something cool
// @include     http://*.the-west.*/game.php*
// @grant		none
// @copyright   2012+, You
// ==/UserScript==

$(function(){
    OldScript = Chat.Router.request;
    Chat.Router.request = function(){
    	try{
    		OldScript();
            console.log('Success');
    	}catch(err){
    		merge(batch);
            console.log('Shit broke: '+err);
    		setTimeout(function () {
                nop();
            }, 30000);
        }
    }   
});