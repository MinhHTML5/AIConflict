// What state do we need?
var g_gsLoader;
var g_gsMainMenu;
var g_gsMissionSelect;
var g_gsActionPhase;
var g_gsUpgrade;
var g_gsInfo;
var g_gsShop;
var g_gsOption;
var g_gsInGameMenu;
var g_gsWait;
var g_gsCredit;
var g_gsTutorial;

var g_gsIntro;

function LoadAllState () {
	LoadSound();
	LoadImage();
	
	g_gsMainMenu = new GSMainMenu();
	g_gsMissionSelect = new GSSelectMission();
	g_gsActionPhase = new GSActionPhase();
	g_gsUpgrade = new GSUpgrade();
	g_gsInfo = new GSInfo();
	g_gsShop = new GSShop();
	g_gsOption = new GSOption();
	g_gsInGameMenu = new GSInGameMenu();
	g_gsWait = new GSWait();
	g_gsCredit = new GSCredit();
	g_gsTutorial = new GSTutorial();
	
	if (PLATFORM == "ARMORGAME") {
		g_gsIntro = new GSIntro();
	}
}


function GoToLoaderState () {
	g_gsLoader = new GSLoader();
	g_gsLoader.Init();
	g_stateEngine.SwitchState (g_gsLoader, 0);
}

function GoToIntro () {
	if (PLATFORM == "ARMORGAME") {
		g_gsIntro.Init();
		g_stateEngine.SwitchState (g_gsIntro, 1);
	}
}

function GoToMainMenu () {
	g_soundManager.StopSoundNode();
	g_gsMainMenu.Init();
	g_stateEngine.SwitchState (g_gsMainMenu, 1);
	ShowAds();
}

function GoToMissionSelect () {
	g_soundManager.StopSoundNode();
	g_gsMissionSelect.Init();
	
	if (g_gsMissionSelect.m_rendered == false) {
		PushWait();
		g_gsWait.m_jumpToMissionSelect = true;
	}
	else {
		g_gsMissionSelect.RenderButtonUpdate();
		g_stateEngine.SwitchState (g_gsMissionSelect, 1);
	}
	
	HideAds();
}

function GoToActionPhase(mission) {
	g_soundManager.StopSoundNode();
	g_gsActionPhase.Init();
	g_gsActionPhase.StartMission (mission);
	g_stateEngine.SwitchState (g_gsActionPhase, 1);
	HideAds();
}

function GoToUpgrade() {
	g_soundManager.StopSoundNode();
	g_gsUpgrade.Init();
	g_stateEngine.SwitchState (g_gsUpgrade, 1);
	HideAds();
}

function GoToInfo() {
	g_soundManager.StopSoundNode();
	g_gsInfo.Init();
	g_stateEngine.SwitchState (g_gsInfo, 1);
	ShowAds();
}

function GoToShop() {
	g_soundManager.StopSoundNode();
	g_gsShop.Init();
	g_stateEngine.SwitchState (g_gsShop, 1);
	ShowAds();
}

function GoToCredit() {
	g_soundManager.StopSoundNode();
	g_gsCredit.Init();
	g_stateEngine.SwitchState (g_gsCredit, 1);
	ShowAds();
}


function PushOption() {
	g_gsOption.Init();
	g_stateEngine.PushState (g_gsOption);
	SetAdsAlpha (0.4);
}

function PushInGameMenu() {
	g_gsInGameMenu.Init();
	g_stateEngine.PushState (g_gsInGameMenu);
}

function PushWait() {
	g_gsWait.Init();
	g_stateEngine.PushState (g_gsWait);
	SetAdsAlpha (0.4);
}

function PushTutorial() {
	g_gsTutorial.Init();
	g_stateEngine.PushState (g_gsTutorial);
}


function PopSubState () {
	g_stateEngine.PopState();
	SetAdsAlpha (1);
}

var RAD_TO_DEG = 57.29577951308231;
var DEG_TO_RAD = 0.0174532925199433;
function CalculateRangeBetweenTwoPoint (x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
function CalculateAngleBetweenTwoPoint (x1, y1, x2, y2) {
	var angle = 0;
	if (y2 == y1) {
		if (x2 > x1)
			angle = 90;
		else if (x2 < x1)
			angle = -90;
	}
	else {
		angle = Math.atan((x2 - x1) / (y1 - y2)) * RAD_TO_DEG;
		if (y2 > y1) {
			angle += 180;
		}
		if (angle < 0) angle += 360;
	}
	
	return angle;
}


Init();
InitUpgradeDef();

g_stateEngine.Start();
GoToLoaderState();
