/*
Copyright (C) 2021 Michael Slíva <michael@sliva.dev>
Licensed under the Academic Free License version 3.0

You should have received a copy of the Academic Free License version 3.0 
along with this program. If not, see <https://spdx.org/licenses/AFL-3.0.html>.
*/

if (!jQuery) throw new Error("jQuery is not loaded!");

const rememberVolume = document.getElementById("rememberVolume");
const radio = document.getElementById("radio");	
const streamURL = "https://listen.jetstreamradio.com:8000/autodj";

var helpMoveTimer;
var playerResizeTimer;
var playerResizeTimer2;
var currentlyPlayingTimer;
var animationTimer;
var animationTimerTime = 0;

var w = 245 - $("#playerInfoHeading").width();
$("#playerInfoPlaying").css("min-width", w);

var d = new Date();
var expireDays = 3650;
d.setTime(d.getTime() + (expireDays*24*60*60*1000));
var expires = "expires="+ d.toUTCString();

function getTime() {
  var r = "?time=" + new Date().getTime();
  return r;
}

function getCookieValue(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == ' ') {
    c = c.substring(1);
  }
  if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
  }
  }
  return "";
}

function getBoolRememberVolume() {
  var result = Number(getCookieValue("rememberVolume"));
  if (result == 1) {
    return true;
  } else {
    return false;
  }
}

function resetVolume() {
  if (!getBoolRememberVolume()){
    radio.volume = 0.25;
    document.getElementById("volume").value = "25";
    rememberVolume.checked = false;
  } else {
    var savedVolume = Number(getCookieValue("savedVolume"));
    radio.volume = savedVolume;
    document.getElementById("volume").value = String(savedVolume * 100);
    rememberVolume.checked = true;
  }
}

resetVolume();

function getVolume() {
  if (!getBoolRememberVolume()){
    return 0.25;
  } else {
    return Number(getCookieValue("savedVolume"));
  }
}

function radioPlayerPause() {
    $("#radio").animate({volume: 0}, 2000);
    setTimeout(function(){
      radio.pause();
      radio.setAttribute("src", "");
      setTimeout(function() { 
        radio.load(); // This stops the stream from downloading
      });
    }, 2000);
    clearInterval(currentlyPlayingTimer);
    $(".fa-pause-circle").css("display", "none");
    $(".fa-play-circle").css("display", "initial");
    $("#equaliser-container").css("opacity", 0);
    $("#playerInfo").css("transition", "opacity 1s ease");
    $("#playerInfo").css("opacity", 0);
    $("#playerAbout").css("animation", "helpMoveClickPause 0.5s ease 1.5s");
    if ((animationTimerTime) >= 5 && (animationTimerTime <= 10)) {
      $("#playerClanhouseLogo").css("animation", "playerLogoFadeStopClan 3s");
      $("#playerJetstreamLogo").css("animation", "playerLogoFadeStopJet 3s 0s");
    } else {
      $("#playerClanhouseLogo").css("animation", "playerLogoFadeStop 3s");
      $("#playerJetstreamLogo").css("animation", "");
    }
    playerResizeTimer = setTimeout(function(){
      $("#playerMiddleLine").css("top", "-24px");
      $("#playerBottomLine").css("top", "-24px");
      $("#currentVolume").css("top", "-24px");
      $("#MagicPlayer").css("height", "76px");
    }, 1000);
    playerResizeTimer2 = setTimeout(function(){
      $("#MagicPlayer").css("width", "228px");
      $("#playerLogo").css("left", "0px");
    }, 1500);
    helpMoveTimer = setTimeout(function(){
      $("#playerAbout").css("left", "-22px");
    }, 2000);
    clearInterval(animationTimer);
    
    $(".equaliser-column:nth-child(1) .colour-bar").css("animation", "color-bar-paused 2s 1s ease-out alternate infinite");
    $(".equaliser-column:nth-child(2) .colour-bar").css("animation", "color-bar-paused 2s 0.5s ease-out alternate infinite");
    $(".equaliser-column:nth-child(3) .colour-bar").css("animation", "color-bar-paused 2s 1.5s ease-out alternate infinite");
    $(".equaliser-column:nth-child(4) .colour-bar").css("animation", "color-bar-paused 2s 0.375s ease-out alternate infinite");
    $(".equaliser-column:nth-child(5) .colour-bar").css("animation", "color-bar-paused 2s 2s ease-out alternate infinite");
}

function radioPlayerPlay() {
    clearTimeout(helpMoveTimer);
    clearTimeout(playerResizeTimer);
    clearTimeout(playerResizeTimer2);
    animationTimer = setInterval(currentAnimation, 1000);
    radio.setAttribute("src", streamURL + getTime());
    radio.load();
    radio.play();
    $("#radio").animate({volume: 0}, 0);
    $("#radio").animate({volume: getVolume()}, 2000);
    $(".fa-play-circle").css("display", "none");
    $(".fa-pause-circle").css("display", "initial");
    $("#playerAbout").css("animation", "helpMoveClickPlay 0.5s ease");
    $("#playerAbout").css("left", "0px");
    $("#equaliser-container").css("opacity", 1);
    $("#MagicPlayer").css("height", "100px");
    $("#MagicPlayer").css("width", "245px");
    $("#playerLogo").css("left", "17px");
    $("#playerMiddleLine").css("top", "0px");
    $("#playerBottomLine").css("top", "0px");
    $("#currentVolume").css("top", "0px");
    $("#playerInfo").css("transition", "opacity 3s ease-in");
    $("#playerInfo").css("opacity", 1);
    $("#playerClanhouseLogo").css("animation", "playerLogoFade 10s infinite");
    $("#playerJetstreamLogo").css("animation", "playerLogoFade 10s 5s infinite");
    currentlyPlaying();
    currentlyPlayingTimer = setInterval(currentlyPlaying, 10000);
    
    $(".equaliser-column:nth-child(1) .colour-bar").css("animation", "color-bar-playing 2s 1s ease-out alternate infinite");
    $(".equaliser-column:nth-child(2) .colour-bar").css("animation", "color-bar-playing 2s 0.5s ease-out alternate infinite");
    $(".equaliser-column:nth-child(3) .colour-bar").css("animation", "color-bar-playing 2s 1.5s ease-out alternate infinite");
    $(".equaliser-column:nth-child(4) .colour-bar").css("animation", "color-bar-playing 2s 0.375s ease-out alternate infinite");
    $(".equaliser-column:nth-child(5) .colour-bar").css("animation", "color-bar-playing 2s 2s ease-out alternate infinite");
}

function setVolume(val) {
  clearTimeout(fadeoutTimer);
  radio.volume = val / 100;
  if (getBoolRememberVolume()) {
    document.cookie = "savedVolume=" + radio.volume + ";" + expires + ";path=/;Secure";
  }
  $("#currentVolume").css("transition", "top 0.5s ease 0s, opacity 0.5s ease 0s");
  $("#currentVolume").css("opacity", 1);
  document.getElementById("currentVolume").innerHTML = "Volume: " + val + "%";
  var fadeoutTimer = setTimeout(function(){
    $("#currentVolume").css("transition", "top 0.5s ease 0s, opacity 2.5s cubic-bezier(.17,.84,.44,1) 2s");
    $("#currentVolume").css("opacity", 0);
  }, 500);
}

function rememberCheck() {
  if (rememberVolume.checked){
    document.cookie = "rememberVolume=1;" + expires + ";path=/;Secure";
    document.cookie = "savedVolume=" + radio.volume + ";" + expires + ";path=/;Secure";
  } else {
    document.cookie = "rememberVolume=0;" + expires + ";path=/;Secure";
  }
}

function currentlyPlaying() {
  var songGetter = "./playing.php" + getTime();
  $.ajax({
    url: songGetter,
    dataType: "text",
    success: function(currentSong) {
      currentSong = currentSong.replaceAll('&amp;', '&');
      // sanitize the song name for XSS injection in case it's not properly sanitized by the API
      currentSong = currentSong.replaceAll('<', '&lt;');
      currentSong = currentSong.replaceAll('>', '&gt;');
      currentSong = currentSong.replaceAll('"', '&quot;');
      currentSong = currentSong.replaceAll('\'', '&#39;');
      currentSong = currentSong.replaceAll('/', '&#x2F;');
      currentSong = currentSong.replaceAll('\\', '&#x5C;');
      currentSong = currentSong.replaceAll('\n', '<br>');
      currentSong = currentSong.replaceAll('\r', '<br>');
      currentSong = currentSong.replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;');
      // sanitized
      $( "#playerInfoPlaying" ).html(currentSong);
      songToHistory(currentSong);
    }
  });
}

function currentAnimation() {
  animationTimerTime++;
  if (animationTimerTime === 10) {
    animationTimerTime = 0;
  }
}

/* MediaSession support */
try {
  navigator.mediaSession.setActionHandler('play', function() {
    radioPlayerPlay();
  });
  navigator.mediaSession.setActionHandler('pause', function() {
    radioPlayerPause();
  });
  navigator.mediaSession.setActionHandler('stop', function() {
      radioPlayerPause();
  });
} catch(error) {
  log('Warning! Media session actions are not supported.' + error.message);
}

document.getElementById('playerAbout').title = "MagicD3VIL's Radio Player\nCopyright (C) 2021 Michael Slíva <michael@sliva.dev>\nLicensed under the Academic Free License version 3.0";
