// ==UserScript==
// @name Login Info Getter
// @namespace logininfogetter
// @description gets sessionId, sessionToken, and timestamp
// @include http://*.tetrisfriends.com/games/*/game.php*
// @grant none
// @run-at document-end
// @version 0.0.5
// @author morningpee
// ==/UserScript==

function buildFlashVarsParamString()
{
    var flashVars = new Object();

    var flashVarsRequest = new XMLHttpRequest();
    flashVarsRequest.addEventListener('load', function(){ try{ haveFlashVars(this.responseText, flashVars); } catch(err){alert(err + "\n" + err.stack);} } );

    var ASYNCHRONOUS_REQUEST = true;
    flashVarsRequest.open('GET', location.href, ASYNCHRONOUS_REQUEST);
    flashVarsRequest.send();
}

function getParameter(parameter){
   var query = window.location.search.substring(1);
   var vars = query.split('&');
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split('=');
           if(pair[0] === parameter){return pair[1];}
   }
   return '';
};

function haveFlashVars(responseText, flashVars)
{
    var rawFlashVars = responseText.match(/flashVars.*?=.*?({[\s\S]*?})/)[1];

    flashVars.sessionId = rawFlashVars.match(/sessionId.*?:.*?encodeURIComponent\('(.*?)'\)/)[1];
    flashVars.sessionToken = rawFlashVars.match(/sessionToken.*?:.*?encodeURIComponent\('(.*?)'\)/)[1];
    flashVars.timestamp = rawFlashVars.match(/timestamp.*?:.*?(\d+)/)[1];

    var urlParameters = ['das', 'ar'];
    var tempParameter = '';
    for(i in urlParameters)
    {
        var tempParameter = getParameter( urlParameters[i] );
        if( tempParameter !== '' )
            flashVars[ urlParameters[i] ] = tempParameter;

    }

    try{
        flashVars.friendUserIds = rawFlashVars.match(/friendUserIds.*?'((\d+,)*\d*)'/)[1];
        flashVars.blockedToByUserIds = rawFlashVars.match(/blockedToByUserIds.*?'((\d+,)*\d*)'/)[1];
    }catch(err)
    {
        /* If this failed, the user is not logged in. */
    }


    document.body.appendChild(document.createElement('textArea')).textContent = JSON.stringify(flashVars).replace(/,/g, ",\n").replace(/^{/g, "{\n").replace(/}$/g, "\n}");
}

buildFlashVarsParamString();
