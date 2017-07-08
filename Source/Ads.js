var ADS_PANEL_X = 246;
var ADS_PANEL_Y = 585;
var ADS_PANEL_W = 788;
var ADS_PANEL_H = 150;

var ega_siteWidth = 1024;
var ega_offsetTop = 0;
var ega_offsetLeft = 0;
var ega_offsetRight = 0;
var ega_fixedPosition = 0;
var ega_hideLeft = 1;
var ega_hideRight = 1;

if (ENABLE_ADS == true && PLATFORM != "ARMORGAME") {
	document.write("<scr" + "ipt type='text/javascript' src='https://www.epicgameads.com/ads/bannerjs.php?id=uiwRgVdkvB&channel=0&t=ss&sitewidth=" + ega_siteWidth +"&offsettop=" + ega_offsetTop +"&offsetleft=" + ega_offsetLeft + "&offsetright=" + ega_offsetRight + "&fixedposition=" + ega_fixedPosition + "&hideleft=" + ega_hideLeft + "&hideright=" + ega_hideRight + "&cb=" + new Date().getTime() + "'></scri" + "pt>");
}


var agLogo;
var agLike;

var adsShowing = false;
function CreateAds() {
	if (ENABLE_ADS == true) {
		if (PLATFORM == "ARMORGAME") {
			agLogo = new Image();
			agLogo.src = ROOT_FOLDER + "ArmorGames/Logo.png";
			agLogo.style.position = "absolute";
			agLogo.style.cursor = "pointer";
			agLogo.style.opacity = 0.0;
			agLogo.style.visibility = "hidden";
			agLogo.onclick = LinkToArmorGame;
			document.body.appendChild (agLogo);
			
			agLike = new Image();
			agLike.src = ROOT_FOLDER + "ArmorGames/Like.png";
			agLike.style.position = "absolute";
			agLike.style.cursor = "pointer";
			agLike.style.opacity = 0.0;
			agLike.style.visibility = "hidden";
			agLike.onclick = LinkToLike;
			document.body.appendChild (agLike);
		}
		else {
			document.write("<iframe id='banner' src='https://www.epicgameads.com/ads/banneriframe.php?id=uiwRgVdkvB&t=728x90&channel=0&cb=" + (Math.floor(Math.random()*99999) + new Date().getTime()) + "' style='position: absolute; width:728px; height:90px; visibility:hidden; opacity: 0.0;' width='728'; height='90'; frameborder='0' scrolling='no'></iframe>");
		}
	}
}


function ResizeAds (canvasW, canvasH, windowW) {
	if (ENABLE_ADS == true) {
		var scale = canvasW / CANVAS_W;
		
		if (PLATFORM == "ARMORGAME") {
			var logoL = (windowW - canvasW) * 0.5 + 650 * scale - (200 * (1 + scale));
			var logoT = canvasH - 15 * scale - (45 * (1 + scale));
			
			agLogo.style.top = logoT + "px";
			agLogo.style.left = logoL + "px";
			agLogo.style.MozTransform = "scale(" + scale + ")";
			agLogo.style.webkitTransform  = "scale(" + scale + ")";
			
			var likeL = (windowW - canvasW) * 0.5 + 1000 * scale - (128 * (1 + scale));
			
			agLike.style.top = logoT + "px";
			agLike.style.left = likeL + "px";
			agLike.style.MozTransform = "scale(" + scale + ")";
			agLike.style.webkitTransform  = "scale(" + scale + ")";
		}
		else {
			var banner = document.getElementById("banner");
			var bannerL = (windowW - 728) * 0.5;
			var bannerT = canvasH - 15 * scale - (45 * (1 + scale));
			
			banner.style.top = bannerT + "px";
			banner.style.left = bannerL + "px";
			banner.style.MozTransform = "scale(" + scale + ")";
			banner.style.webkitTransform  = "scale(" + scale + ")";
		}
	}
}

function ShowAds() {
	if (ENABLE_ADS == true) {
		adsShowing = true;
	}
}

function HideAds() {
	if (ENABLE_ADS == true) {
		adsShowing = false;
	}
}

function SetAdsVisible () {
	if (ENABLE_ADS == true) {
		if (PLATFORM == "ARMORGAME") {
			agLogo.style.visibility = "visible";
			agLike.style.visibility = "visible";
		}
		else {
			var banner = document.getElementById("banner");
			banner.style.visibility = "visible";
		}
	}
}

function SetAdsAlpha (alpha) {
	if (ENABLE_ADS == true) {
		if (PLATFORM == "ARMORGAME") {
			agLogo.style.opacity = alpha;
			agLike.style.opacity = alpha;
			if (alpha == 0 && adsShowing == false) {
				agLogo.style.visibility = "hidden";
				agLike.style.visibility = "hidden";
			}
			else if (alpha == 1) {
				agLogo.style.cursor = "pointer";
				agLogo.onclick = LinkToArmorGame;
				agLike.style.cursor = "pointer";
				agLike.onclick = LinkToLike;
			}
			else {
				agLogo.style.cursor = "default";
				agLogo.onclick = Empty;
				agLike.style.cursor = "default";
				agLike.onclick = Empty;
			}
		}
		else {
			var banner = document.getElementById("banner");
			banner.style.opacity = alpha;
			if (alpha == 0 && adsShowing == false) {
				banner.style.visibility = "hidden";
			}
		}
	}
}