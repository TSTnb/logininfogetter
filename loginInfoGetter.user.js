// ==UserScript==
// @name Login Info Getter
// @namespace logininfogetter
// @description gets sessionId, sessionToken, and timestamp
// @include http://*.tetrisfriends.com/games/*/game.php
// @grant none
// @run-at document-end
// @version 0.0.1
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

function haveFlashVars(responseText, flashVars)
{
    var rawFlashVars = responseText.match(/flashVars.*?=.*?({[\s\S]*?})/)[1];

    flashVars.sessionId = rawFlashVars.match(/sessionId.*?:.*?encodeURIComponent\('(.*?)'\)/)[1];
    flashVars.sessionToken = rawFlashVars.match(/sessionToken.*?:.*?encodeURIComponent\('(.*?)'\)/)[1];
    flashVars.timestamp = rawFlashVars.match(/timestamp.*?:.*?(\d+)/)[1];
    document.body.appendChild(document.createElement('textArea')).textContent = flashVars.sessionId + "\n" + flashVars.sessionToken + "\n" + flashVars.timestamp;
}

buildFlashVarsParamString();
