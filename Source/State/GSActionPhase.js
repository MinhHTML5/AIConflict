var MOUSE_TOUCH_SCROLL_DIFFERENCE = 7;

var BATTLE_FIELD_BLOCK_SIZE = 50;
var BATTLE_FIELD_SIZE_W = 2000;
var BATTLE_FIELD_SIZE_H = 1200;
var BATTLE_FIELD_BLOCK_W = (BATTLE_FIELD_SIZE_W / BATTLE_FIELD_BLOCK_SIZE) >> 0;
var BATTLE_FIELD_BLOCK_H = (BATTLE_FIELD_SIZE_H / BATTLE_FIELD_BLOCK_SIZE) >> 0;


function GSActionPhase () {
	var MAIN_PANEL_DEFAULT_Y = 600;
	var MAIN_PANEL_MOVE_SPEED = 0.2;
	var ENEMY_PANEL_DEFAULT_H = 100;
	var TURRET_PANEL_DEFAULT_X = -20;
	var TURRET_PANEL_DEFAULT_Y = 120;
	var TURRET_PANEL_DEFAULT_W = 530;
	var TURRET_PANEL_MOVE_SPEED = 1;
	var ENERGY_PANEL_DEFAULT_X = 1150;
	var ENERGY_PANEL_DEFAULT_Y = 320;
	var MESSAGE_PANEL_X = 940;
	var MESSAGE_PANEL_Y = 40;
	var KEY_SCROLL_SPEED = 0.8;
	var KEY_ZOOM_SPEED = 0.6;
	var DISPLAY_MONEY_CHANGE_SPEED = 0.1;
	
	
	var instance = this;
	
	var init = false;
	var currentWaveData = null;
	
	var pausing = false;
	
	var nextWaveList = null;
	var moneyDisplay = 0;
	
	var mousePressing = false;
	var anchorMouseX = 0;
	var anchorMouseY = 0;
	var anchorCameraX = 0;
	var anchorCameraY = 0;
	var lastKnownTouchX = 0;
	var lastKnownTouchY = 0;
	
	var enemyPanelY = -20;
	var enemyPanel = new GlassPanel();
	
	var mainPanelY = MAIN_PANEL_DEFAULT_Y;
	var mainMenuPanel1 = new GlassPanel();
	var mainMenuPanel2 = new GlassPanel();
	var mainMenuPanel3 = new GlassPanel();
	var mainMenuPanel4 = new GlassPanel();
	var mainMenuPanel5 = new GlassPanel();
	var messagePanel = new GlassPanel();
	
	var enemyInfoPopup = new GlassPanel();
	var turretInfoPopup = new GlassPanel();
	
	var displayBuildMenu = false;
	var gameSpeed = 1;
	
	var turretInfoPanelShowing = false;
	var turretInfoPanelAdvance = false;
	var turretInfoPanelX = - TURRET_PANEL_DEFAULT_W + TURRET_PANEL_DEFAULT_X;
	var turretInfoPanel = new GlassPanel();
	
	var turretDesign = new Array()
	for (var i=1; i<=10; i++) {
		turretDesign[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/TurretDesign/Turret " + i + ".png");
	}
	
	var selectButton = new Array();
	for (var i=0; i<10; i++) {
		selectButton[i] = new TurretButton();
	}
	
	var enemyInfoPopupIndex = -1;
	var enemyInfoPopupX = -100;
	var enemyInfoPopupY = -100;
	
	var turretInfoPopupIndex = -1;
	var turretInfoPopupX = -100;
	var turretInfoPopupY = -100;
	
	var startButton = new GlassButton();
	var speedButton = new GlassButton();
	var menuButton = new GlassButton();
	
	var imgAmmunitionBarE = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/AmmunitionBar/AmmunitionBarE.png");
	var imgAmmunitionBarF = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/AmmunitionBar/AmmunitionBarF.png");
	var imgEnergyBarE = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/EnergyBar/EnergyBarE.png");
	var imgEnergyBarF = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/EnergyBar/EnergyBarF.png");
	
	
	
	var structureScore = 0;
	var economicScore = 0;
	var performanceScore = 0;
	var bestScore = 0;
	var reward = 0;
	
	var conditionMenuSelectingIndex = 0;
	var conditionMenu = new Array();
		var conditionSubMenu = new Array();
			var enemyMenu = new Array();
				var enemyHPMenu = new Array();
				var enemySpeedMenu = new Array();
				var enemyArmourMenu = new Array();
				var enemyRankMenu = new Array();
				var enemyDistanceToTurretMenu = new Array();
				var enemyDistanceToExitMenu = new Array();
				var enemyClusterMenu = new Array();
				var enemyStatusMenu = new Array();
			var globalMenu = new Array();
				var selfMenu = new Array();
				var ammunitionMenu = new Array();
				var energyMenu = new Array();
		
		
	var actionMenuSelectingIndex = 0;
	var actionMenu = new Array();
		var actionSubMenu = new Array();
	
	var displayingTurret = null;
	var clipboardAI = null;
	
	
	var preset1Button = new GlassSquareButton();
	var preset2Button = new GlassSquareButton();
	var preset3Button = new GlassSquareButton();
	var copyAIButton = new GlassSquareButton();
	var pasteAIButton = new GlassSquareButton();
	var applyButton = new GlassSquareButton();
	var basicSetupButton = new GlassSquareButton();
	
	var advanceSetupButton = new GlassSquareButton();
	
	var sellButton = new GlassSquareButton();
	
	
	
	var presetAI = new Array();
	presetAI[0] = new Array();
	presetAI[1] = new Array();
	presetAI[2] = new Array();
	for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
		presetAI[0][i] = new AIChecker();
		presetAI[1][i] = new AIChecker();
		presetAI[2][i] = new AIChecker();
	}
	
	presetAI[0][0].m_conditionType = AI_CHECKER_SELF;
	presetAI[0][0].m_conditionValue = AI_CHECKER_SELF_HAVE_TARGET;
	presetAI[0][0].m_actionType = AI_ACTION_ATTACK;
	presetAI[0][1].m_conditionType = AI_CHECKER_RANGE;
	presetAI[0][1].m_conditionValue = AI_CHECKER_RANGE_NEAREST;
	presetAI[0][1].m_actionType = AI_ACTION_ATTACK;
	
	presetAI[1][0].m_conditionType = AI_CHECKER_SELF;
	presetAI[1][0].m_conditionValue = AI_CHECKER_SELF_HAVE_TARGET;
	presetAI[1][0].m_actionType = AI_ACTION_SPECIAL;
	presetAI[1][1].m_conditionType = AI_CHECKER_RANGE;
	presetAI[1][1].m_conditionValue = AI_CHECKER_RANGE_NEAREST;
	presetAI[1][1].m_actionType = AI_ACTION_SPECIAL;
	
	presetAI[2][0].m_conditionType = AI_CHECKER_SELF;
	presetAI[2][0].m_conditionValue = AI_CHECKER_SELF_HAVE_TARGET;
	presetAI[2][0].m_actionType = AI_ACTION_IDLE;
	presetAI[2][1].m_conditionType = AI_CHECKER_RANGE;
	presetAI[2][1].m_conditionValue = AI_CHECKER_RANGE_NEAREST;
	presetAI[2][1].m_actionType = AI_ACTION_IDLE;
	
	this.m_battle = new Battle(this);
	this.m_mission = 0;
	
	var enemyImage = new Array();
	for (i=1; i<=5; i++) {
		enemyImage[110 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/1/" + i + ".png");
		enemyImage[120 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/2/" + i + ".png");
		enemyImage[130 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/3/" + i + ".png");
		enemyImage[140 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/4/" + i + ".png");
		enemyImage[150 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/5/" + i + ".png");
		
		enemyImage[210 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/1/" + i + ".png");
		enemyImage[220 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/2/" + i + ".png");
		enemyImage[230 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/3/" + i + ".png");
		enemyImage[240 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/4/" + i + ".png");
		enemyImage[250 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/5/" + i + ".png");
		
		enemyImage[310 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/1/" + i + ".png");
		enemyImage[320 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/2/" + i + ".png");
		enemyImage[330 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/3/" + i + ".png");
		enemyImage[340 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/4/" + i + ".png");
		enemyImage[350 + i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/5/" + i + ".png");
	}
	
	enemyImage[411] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Cruiser/1/1.png");
	enemyImage[421] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Cruiser/2/1.png");
	enemyImage[431] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Cruiser/3/1.png");
	
	
	
	var MATCH_RESULT_NOT_FINISHED = 0;
	var MATCH_RESULT_PERFECT_WIN = 1;
	var MATCH_RESULT_NORMAL_WIN = 2;
	var MATCH_RESULT_LOSE = 3;
	var matchResult = 0;
	

	
	this.Init = function () {
		if (init == false) {
			// Init
			init = true;
			
			// Init the next wave panel:
			enemyPanel.Init (-20, enemyPanelY, 1000, ENEMY_PANEL_DEFAULT_H);
			
			// Init the main control UI
			mainMenuPanel1.Init (-20, CANVAS_H, 760, 140);
			mainMenuPanel2.Init (940, -20, 200, ENEMY_PANEL_DEFAULT_H);
			mainMenuPanel3.Init (1100, -20, 200, ENEMY_PANEL_DEFAULT_H);
			mainMenuPanel4.Init (790, 630, 510, 110);
			mainMenuPanel5.Init (ENERGY_PANEL_DEFAULT_X, ENERGY_PANEL_DEFAULT_Y, 150, 350);
			
			messagePanel.Init (MESSAGE_PANEL_X, MESSAGE_PANEL_Y, 360, 320);
			
			enemyInfoPopup.Init (0, 0, 350, 300);
			turretInfoPopup.Init (0, 0, 250, 350);
			
			for (var i=0; i<selectButton.length; i++) {
				selectButton[i].Init (0, 0, BuildTurret, DisplayTurretInfo, (i + 1));
				selectButton[i].SetIcon (ROOT_FOLDER + "Image/MapEditor/Turret " + (i + 1) + ".png", 50, 50);
				if (i == ENUM_TURRET_GATLING - 1 && g_profile.upgrade[UPGRADE_GATLING][UPGRADE_TIER_3] == true) {
					selectButton[i].SetCaption (g_turretData[i+1].m_cost * UPGRADE_GATLING_COST_MULTIPLER);
				}
				else {
					selectButton[i].SetCaption (g_turretData[i+1].m_cost);
				}
			}
			
			startButton.Init (820, 660, TEXT_GENERIC_START, StartButtonCallBack);
			speedButton.Init (970, 660, TEXT_AP_SPEED + "1", SpeedButtonCallBack);
			menuButton.Init (1120, 660, TEXT_GENERIC_MENU, MenuButtonCallBack);
			
			turretInfoPanel.Init (0, 0, TURRET_PANEL_DEFAULT_W, 530);
			
			
			preset1Button.Init (0, 0, TEXT_AP_PRESET_1, Preset1ButtonCallBack, null, 150);
			preset2Button.Init (0, 0, TEXT_AP_PRESET_2, Preset2ButtonCallBack, null, 150);
			preset3Button.Init (0, 0, TEXT_AP_PRESET_3, Preset3ButtonCallBack, null, 150);
			copyAIButton.Init (0, 0, TEXT_AP_COPY_AI, CopyAIButtonCallBack, null, 150);
			pasteAIButton.Init (0, 0, TEXT_AP_PASTE_AI, PasteAIButtonCallBack, null, 150);
			applyButton.Init (0, 0, TEXT_AP_APPLY_AI, ApplyButtonCallBack, null, 150);
			basicSetupButton.Init (0, 0, TEXT_AP_BASIC, SwitchToBasicView, null, 150);
			
			advanceSetupButton.Init (0, 0, TEXT_AP_ADVANCE, SwitchToAdvanceView, null, 150);
			
			sellButton.Init (0, 0, TEXT_AP_SELL, SellButtonCallBack, null, 150);
			
			
			this.SetUpAIMenuSystem();
			this.UpdateUI (0);
		}
		
		
		g_mainMenuMusic.Stop();
		
		
		mainPanelY = CANVAS_H;
		mainMenuPanel1.SetPosition (-20, mainPanelY);
		for (var i=0; i<selectButton.length; i++) {
			selectButton[i].SetPosition (5 + i * 71, mainPanelY + 25);
		}
		
		enemyPanelY = -ENEMY_PANEL_DEFAULT_H;
		enemyPanel.SetPosition (-20, enemyPanelY);
		
		turretInfoPanelShowing = false
		turretInfoPanelX = -TURRET_PANEL_DEFAULT_W + TURRET_PANEL_DEFAULT_X;
		turretInfoPanel.SetPosition (turretInfoPanelX, TURRET_PANEL_DEFAULT_Y);
		
		structureScore = 0;
		economicScore = 0;
		performanceScore = 0;
		bestScore = 0;
		reward = 0;
	}
	
	this.StartMission = function (mission) {
		mainPanelY = CANVAS_H;
		enemyPanelY = -ENEMY_PANEL_DEFAULT_H;
		
		this.m_mission = mission;
		this.m_battle = new Battle(this);
		this.m_battle.LoadBattle(mission);
		moneyDisplay = this.m_battle.GetMoney();
		this.DisplayNextWaveList();
		
		g_message.Clear();
		this.AddDialogue ();
		
		displayBuildMenu = false;
		
		matchResult = MATCH_RESULT_NOT_FINISHED;
	}
	
	this.LoadMission = function (data) {
		mainPanelY = CANVAS_H;
		enemyPanelY = -ENEMY_PANEL_DEFAULT_H;
		
		this.m_battle = new Battle(this);
		this.m_battle.ImportWaveDataFromJSON (data);
		this.DisplayNextWaveList();
		this.AddDialogue ();
		
		matchResult = MATCH_RESULT_NOT_FINISHED;
	}
	
	this.RetryWave = function () {
		this.LoadMission (currentWaveData);
	}
	
	this.RestartMission = function () {
		this.StartMission (this.m_mission);
	}
	
	this.FinishWave = function () {
		this.DisplayNextWaveList();
		this.AddDialogue ();
	}
	
	this.FinishMission = function (overRide) {
		if (this.m_battle.GetLife() == g_missionData[this.m_mission].life) {
			matchResult = MATCH_RESULT_PERFECT_WIN;
		}
		else {
			matchResult = MATCH_RESULT_NORMAL_WIN;
		}
		
		if (overRide != null) {
			matchResult = overRide;
		}
		
		if (matchResult == MATCH_RESULT_PERFECT_WIN)
			g_message.PushMessage (new MessageFormat (true, g_missionData[this.m_mission].perfectWinText));
		else 
			g_message.PushMessage (new MessageFormat (true, g_missionData[this.m_mission].normalWinText));
		
		if (this.m_mission == g_profile.progress) {
			g_profile.progress ++;
			g_profile.upgradePoint >> 0;
			g_profile.upgradePoint += g_missionData[this.m_mission].reward;
			g_profile.Save();
			if (PLATFORM == "KONGREGATE") {
				SubmitProgress (g_profile.progress);
			}
			
			reward = g_missionData[this.m_mission].reward;
		}
	}
	
	this.Defeated = function () {
		matchResult = MATCH_RESULT_LOSE;
		
		g_message.PushMessage (new MessageFormat (true, g_missionData[this.m_mission].loseText));
	}
	
	
	this.DisplayNextWaveList = function () {
		nextWaveList = new Array();
		var temp = this.m_battle.GetNextWaveEnemyList();
		for (var i=0; i<temp.length; i++) {
			for (var j=0; j<temp[i].length; j++) {
				var tempID = temp[i][j];
				if (tempID > 0) {
					if (nextWaveList.indexOf(tempID) == -1) {
						nextWaveList.push (tempID);
					}
				}
			}
		}
		nextWaveList.sort();
	}
	
	this.DisplayBuildMenu = function () {
		displayBuildMenu = true;
		
		for (var i=0; i<selectButton.length; i++) {
			var cost = 0;
			if (i == ENUM_TURRET_GATLING - 1 && g_profile.upgrade[UPGRADE_GATLING][UPGRADE_TIER_3] == true)
				cost = g_turretData[i+1].m_cost * UPGRADE_GATLING_COST_MULTIPLER;
			else
				cost = g_turretData[i+1].m_cost;
			
			if (this.m_battle.GetMoney() >= cost) 
				selectButton[i].m_enable = true;
			else
				selectButton[i].m_enable = false;
		}
	}
	this.HideBuildMenu = function () {
		displayBuildMenu = false;
	}
	
	function MenuButtonCallBack () {
		PushInGameMenu();
		if (instance.m_battle.GetWaveNumber() == 0) {
			g_gsInGameMenu.SetData (0);
		}
		else {
			g_gsInGameMenu.SetData (1);
		}
	}
	
	function BuildTurret (index) {
		instance.m_battle.BuildTurret (index);
	}
	
	function DisplayTurretInfo (index) {
		turretInfoPopupIndex = index;
	}
	
	function StartButtonCallBack () {
		if (instance.m_battle.IsBuildMode() == true) {
			currentWaveData = instance.m_battle.ExportWaveDataToJSON();
			
			instance.m_battle.StartWave();
			turretInfoPanelShowing = false;
			startButton.SetCaption (TEXT_AP_PAUSE);
			
			pausing = false;
			instance.HideBuildMenu();
		}
		else {
			if (pausing == false) {
				pausing = true;
				startButton.SetCaption (TEXT_AP_RESUME);
			}
			else {
				pausing = false;
				startButton.SetCaption (TEXT_AP_PAUSE);
			}
		}
		instance.m_battle.UnSelectTurret();
	}
	
	function SpeedButtonCallBack () {
		if (gameSpeed == 1) gameSpeed = 2;
		else if (gameSpeed == 2) gameSpeed = 3;
		else if (gameSpeed == 3) gameSpeed = 1;
		
		speedButton.SetCaption (TEXT_AP_SPEED + gameSpeed);
	}
	
	
	
	
	
	
	function Preset1ButtonCallBack () {
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			displayingTurret.m_AIChecker[i].CloneFromThisAI (presetAI[0][i]);
		}
		instance.AssignNameToMenu();
	}
	
	function Preset2ButtonCallBack () {
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			displayingTurret.m_AIChecker[i].CloneFromThisAI (presetAI[1][i]);
		}
		instance.AssignNameToMenu();
	}
	function Preset3ButtonCallBack () {
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			displayingTurret.m_AIChecker[i].CloneFromThisAI (presetAI[2][i]);
		}
		instance.AssignNameToMenu();
	}
	
	function CopyAIButtonCallBack () {
		clipboardAI = new Array();
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			clipboardAI[i] = new AIChecker (null, null);
			clipboardAI[i].CloneFromThisAI (displayingTurret.m_AIChecker[i]);
		}
	}
	
	function PasteAIButtonCallBack () {
		if (clipboardAI != null) {
			for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
				displayingTurret.m_AIChecker[i].CloneFromThisAI (clipboardAI[i]);
			}
			instance.AssignNameToMenu();
		}
	}
	
	function ApplyButtonCallBack () {
		var turret = instance.m_battle.GetTurretList();
		for (var i=0; i<turret.length; i++) {
			if (turret[i] != displayingTurret && turret[i].m_type == displayingTurret.m_type) {
				for (var j=0; j<NUMBER_OF_AI_CHECK; j++) {
					turret[i].m_AIChecker[j].CloneFromThisAI (displayingTurret.m_AIChecker[j]);
				}
			}
		}
	}
	
	function SwitchToBasicView() {
		turretInfoPanelAdvance = false;
	}
	function SwitchToAdvanceView() {
		turretInfoPanelAdvance = true;
	}
	
	function SellButtonCallBack () {
		instance.m_battle.SellTurret();
		instance.m_battle.UnSelectTurret();
	}
	
	this.DisplayTurretInfo = function (turret) {
		displayingTurret = turret;
		if (this.m_battle.IsBuildMode() == true) {
			turretInfoPanelAdvance = false;
			turretInfoPanelShowing = true;
			this.AssignNameToMenu();
			sellButton.m_enable = true;
		}
		else if (g_profile.upgrade[UPGRADE_BASE_1][UPGRADE_TIER_3] == true && pausing == true) {
			turretInfoPanelShowing = true;
			this.AssignNameToMenu();
			sellButton.m_enable = false;
		}
		
		if (turretInfoPanelShowing == true && displayingTurret.m_type > ENUM_TURRET_STATIC) {
			preset1Button.m_enable = false;
			preset2Button.m_enable = false;
			preset3Button.m_enable = false;
			copyAIButton.m_enable = false;
			pasteAIButton.m_enable = false;
			applyButton.m_enable = false;
			
			for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
				actionMenu[i].m_enable = false;
				conditionMenu[i].m_enable = false;
			}
		}
		else {
			preset1Button.m_enable = true;
			preset2Button.m_enable = true;
			preset3Button.m_enable = true;
			copyAIButton.m_enable = true;
			pasteAIButton.m_enable = true;
			applyButton.m_enable = true;
			
			for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
				actionMenu[i].m_enable = true;
				conditionMenu[i].m_enable = true;
				if (i >= NUMBER_OF_FREE_AI_CHECK && g_profile.upgrade[UPGRADE_BASE_1][UPGRADE_TIER_1] == false) {
					actionMenu[i].m_enable = false;
					conditionMenu[i].m_enable = false;
				}
			}
		}
	}
	
	this.HideTurretInfo = function () {
		turretInfoPanelShowing = false;
	}
	
	
	
	
	
	
	
	
	
	this.Update = function (deltaTime) {
		// Handle key and mouse
		this.HandleInput (deltaTime);
		
		// Update game state
		if (pausing == false) {
			for (var i=0; i<gameSpeed; i++) {
				this.m_battle.Update (deltaTime);
			}
		}
		
		// UI Update
		this.UpdateUI (deltaTime);
		
		// Update displayed money number
		if (moneyDisplay < this.m_battle.GetMoney()) {
			moneyDisplay += deltaTime * DISPLAY_MONEY_CHANGE_SPEED;
			if (moneyDisplay > this.m_battle.GetMoney()) {
				moneyDisplay = this.m_battle.GetMoney();
			}
		}
		else if (moneyDisplay > this.m_battle.GetMoney()) {
			moneyDisplay -= deltaTime * DISPLAY_MONEY_CHANGE_SPEED;
			if (moneyDisplay < this.m_battle.GetMoney()) {
				moneyDisplay = this.m_battle.GetMoney();
			}
		}
		
		g_message.Update (deltaTime);
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		this.m_battle.m_turretInfoIndex = turretInfoPopupIndex;
		
		
		// BATTLE
		this.m_battle.Draw();
		
		// TOP ENEMY INFO PANEL
		if (enemyPanelY != -ENEMY_PANEL_DEFAULT_H) {
			enemyPanel.Draw (g_context);
			for (var i=0; i<nextWaveList.length; i++) {
				if (nextWaveList[i] < 200) {
					g_graphicEngine.DrawFast (g_context, enemyImage[nextWaveList[i]], i * 60 + 180, enemyPanelY + 25);
				}
				else if (nextWaveList[i] < 300) {
					g_graphicEngine.Draw (g_context, enemyImage[nextWaveList[i]], 0, 0, 70, 70, i * 60 + 180, enemyPanelY + 25, 50, 50);
				}
				else if (nextWaveList[i] < 400) {
					g_graphicEngine.Draw (g_context, enemyImage[nextWaveList[i]], 0, 0, 100, 100, i * 60 + 180, enemyPanelY + 25, 50, 50);
				}
				else if (nextWaveList[i] < 500) {
					g_graphicEngine.Draw (g_context, enemyImage[nextWaveList[i]], 0, 0, 150, 150, i * 60 + 180, enemyPanelY + 25, 50, 50);
				}
			}
		
			g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_NEXT_WAVE, 20, enemyPanelY + 50, 300, PRIMARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_WAVE + " " + this.m_battle.GetWaveNumber() + " / " + this.m_battle.GetMaxWaveNumber(), 800, enemyPanelY + 50, 300, PRIMARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
		}
		
		
		
		// ALL PERMA APPEAR PANEL
		mainMenuPanel2.Draw (g_context);
		mainMenuPanel3.Draw (g_context);
		mainMenuPanel4.Draw (g_context);
		mainMenuPanel5.Draw (g_context);
		
		// INFO STUFF
		g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_NEXT_LIFE + this.m_battle.GetLife(), 1040, 30, 300, PRIMARY_FONT, 13, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_NEXT_MONEY + (moneyDisplay >> 0), 1200, 30, 300, PRIMARY_FONT, 13, false, false, "center", "middle", 4, 255, 255, 1);
		
		// MESSAGE PANEL
		if (g_message.GetActiveMessage() != null) {
			messagePanel.Draw (g_context);
			g_graphicEngine.DrawTextRGB (g_context, g_message.GetActiveMessage().m_text, MESSAGE_PANEL_X + 40, MESSAGE_PANEL_Y + 50, 270, SECONDARY_FONT, 14, false, false, "left", "middle", 4, 255, 255, 1, true);
			if (g_message.GetActiveMessage().m_isClickToContinue) {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_CLICK_TO_CONTINUE, MESSAGE_PANEL_X + 180, MESSAGE_PANEL_Y + 270, 270, SECONDARY_FONT, 14, false, false, "center", "middle", 4, 255, 255, 1);
			}
		}
		
		// BUILD PANEL
		if (mainPanelY != CANVAS_H) {
			mainMenuPanel1.Draw (g_context);
			for (var i=0; i<selectButton.length; i++) {
				selectButton[i].Draw (g_context);
			}
		}
		
		// BOTTOM BUTTON
		startButton.Draw (g_context);
		speedButton.Draw (g_context);
		menuButton.Draw (g_context);
		
		// AMMUNITION
		var tempH = 250 * (1 - this.m_battle.m_ammunition / MAX_AMMUNITION);
		g_graphicEngine.Draw (g_context, imgAmmunitionBarE, 0, 0, 25, tempH, ENERGY_PANEL_DEFAULT_X + 45, ENERGY_PANEL_DEFAULT_Y + 45, 25, tempH, 1);
		g_graphicEngine.Draw (g_context, imgAmmunitionBarF, 0, tempH, 25, 250 - tempH, ENERGY_PANEL_DEFAULT_X + 45, ENERGY_PANEL_DEFAULT_Y + 45 + tempH, 25, 250 - tempH, 1);
		
		tempH = 250 * (1 - this.m_battle.m_energy / MAX_ENERGY);
		g_graphicEngine.Draw (g_context, imgEnergyBarE, 0, 0, 25, tempH, ENERGY_PANEL_DEFAULT_X + 80, ENERGY_PANEL_DEFAULT_Y + 45, 25, tempH, 1);
		g_graphicEngine.Draw (g_context, imgEnergyBarF, 0, tempH, 25, 250 - tempH, ENERGY_PANEL_DEFAULT_X + 80, ENERGY_PANEL_DEFAULT_Y + 45 + tempH, 25, 250 - tempH, 1);
		
		
		
		// TURRET INFO
		if (turretInfoPanelShowing == true || turretInfoPanelX > - TURRET_PANEL_DEFAULT_W + TURRET_PANEL_DEFAULT_X) {
			turretInfoPanel.Draw (g_context);
			
			if (displayingTurret != null) {
				g_graphicEngine.DrawTextRGB (g_context, displayingTurret.m_name, turretInfoPanelX + TURRET_PANEL_DEFAULT_W * 0.5, TURRET_PANEL_DEFAULT_Y + 50, 300, PRIMARY_FONT, 15, false, false, "center", "middle", 4, 255, 255, 1);
			}
			
			preset1Button.Draw (g_context);
			preset2Button.Draw (g_context);
			preset3Button.Draw (g_context);
			
			if (turretInfoPanelAdvance == true) {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_CONDITION, turretInfoPanelX + 40, TURRET_PANEL_DEFAULT_Y + 80, 300, PRIMARY_FONT, 11, false, false, "left", "middle", 4, 255, 255, 1);
				g_graphicEngine.DrawTextRGB (g_context, TEXT_AP_ACTION, turretInfoPanelX + 342, TURRET_PANEL_DEFAULT_Y + 80, 300, PRIMARY_FONT, 11, false, false, "left", "middle", 4, 255, 255, 1);
			
				for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
					conditionMenu[i].Draw (g_context);
					actionMenu[i].Draw (g_context);
				}
			
				copyAIButton.Draw (g_context);
				pasteAIButton.Draw (g_context);
				applyButton.Draw (g_context);
				basicSetupButton.Draw (g_context);
			}
			else {
				g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, turretInfoPanelX + 115, TURRET_PANEL_DEFAULT_Y + 80, 300, 300);
				g_graphicEngine.DrawRect (g_context, turretInfoPanelX + 115, TURRET_PANEL_DEFAULT_Y + 80, 300, 300, 2, 1, 200, 200, 1);
				g_graphicEngine.Draw (g_context, turretDesign[displayingTurret.m_type], 0, 0, 300, 300, turretInfoPanelX + 115, TURRET_PANEL_DEFAULT_Y + 80, 300, 300, 1);
				advanceSetupButton.Draw (g_context);
			}
			
			sellButton.Draw (g_context);
		}
		
		
		
		// ENEMY POPUP
		if (enemyInfoPopupIndex > -1) {
			var tier = nextWaveList[enemyInfoPopupIndex] % 10;
			var enemyIndex = (nextWaveList[enemyInfoPopupIndex] / 10) >> 0;
			enemyInfoPopup.Draw (g_context);
			
			g_graphicEngine.DrawTextRGB (g_context, g_enemyData[enemyIndex].m_name + TEXT_AP_MARK + tier, enemyInfoPopupX + 175, enemyInfoPopupY + 45, 270, SECONDARY_FONT, 17, false, false, "center", "middle", 4, 255, 255, 1, true);
			g_graphicEngine.DrawTextRGB (g_context, g_enemyData[enemyIndex].m_desc, enemyInfoPopupX + 40, enemyInfoPopupY + 90, 270, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1, true);
			
			var realHP = g_enemyData[enemyIndex].m_maxHP * g_enemyTierHPMultilpier[tier - 1];
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_HIT_POINT, enemyInfoPopupX + 40, enemyInfoPopupY + 190, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, realHP, enemyInfoPopupX + 120, enemyInfoPopupY + 190, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			var armorRank;
			if (g_enemyData[enemyIndex].m_armor < 0.01) armorRank = TEXT_INFO_ARMOUR_NONE;
			else if (g_enemyData[enemyIndex].m_armor < ARMOUR_DEF_LIGHT) armorRank = TEXT_INFO_ARMOUR_LIGHT;
			else if (g_enemyData[enemyIndex].m_armor < ARMOUR_DEF_HEAVY) armorRank = TEXT_INFO_ARMOUR_MEDIUM;
			else  armorRank = TEXT_INFO_ARMOUR_HEAVY;
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_ARMOUR, enemyInfoPopupX + 40, enemyInfoPopupY + 210, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, ((g_enemyData[enemyIndex].m_armor * 100) >> 0) + "% - " + armorRank, enemyInfoPopupX + 120, enemyInfoPopupY + 210, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			var speedRank;
			if (g_enemyData[enemyIndex].m_speed < SPEED_DEF_SLOW) speedRank = TEXT_INFO_SPEED_SLOW;
			else if (g_enemyData[enemyIndex].m_speed < SPEED_DEF_FAST) speedRank = TEXT_INFO_SPEED_MEDIUM;
			else  speedRank = TEXT_INFO_SPEED_FAST;
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_SPEED, enemyInfoPopupX + 40, enemyInfoPopupY + 230, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, ((g_enemyData[enemyIndex].m_speed * 100) >> 0) + " - " + speedRank, enemyInfoPopupX + 120, enemyInfoPopupY + 230, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_DAMAGE, enemyInfoPopupX + 40, enemyInfoPopupY + 250, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, g_enemyData[enemyIndex].m_damage, enemyInfoPopupX + 120, enemyInfoPopupY + 250, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
		}
		
		// TURRET POPUP
		if (turretInfoPopupIndex > -1) {
			turretInfoPopupX = g_inputEngine.m_mouseX;
			turretInfoPopupY = g_inputEngine.m_mouseY - 350;
			turretInfoPopup.SetPosition (turretInfoPopupX, turretInfoPopupY);
			
			turretInfoPopup.Draw (g_context);
			g_graphicEngine.DrawTextRGB (g_context, g_turretData[turretInfoPopupIndex].m_name, turretInfoPopupX + 125, turretInfoPopupY + 50, 100, SECONDARY_FONT, 17, false, false, "center", "middle", 4, 255, 255, 1);
			g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, turretInfoPopupX + 50, turretInfoPopupY + 70, 150, 150);
			g_graphicEngine.DrawRect (g_context, turretInfoPopupX + 50, turretInfoPopupY + 70, 150, 150, 2, 1, 200, 200, 1);
			g_graphicEngine.Draw (g_context, turretDesign[turretInfoPopupIndex], 0, 0, 300, 300, turretInfoPopupX + 50, turretInfoPopupY + 70, 150, 150, 1);
			g_graphicEngine.DrawTextRGB (g_context, g_turretData[turretInfoPopupIndex].m_tips, turretInfoPopupX + 125, turretInfoPopupY + 240, 150, SECONDARY_FONT, 14, false, false, "center", "middle", 4, 255, 255, 1, true);
			
			turretInfoPopupIndex = -1;
		}
	}
	
	
	
	
	
	
	this.UpdateUI = function (deltaTime) {
		// Update the main panel
		if (this.m_battle.IsBuildMode() == true) {
			startButton.SetCaption (TEXT_GENERIC_START);
			
			if (enemyPanelY < -20) {
				enemyPanelY += deltaTime * MAIN_PANEL_MOVE_SPEED;
				if (enemyPanelY > -20) enemyPanelY = -20;
			}
		}
		else {
			if (enemyPanelY > -ENEMY_PANEL_DEFAULT_H) {
				enemyPanelY -= deltaTime * MAIN_PANEL_MOVE_SPEED;
			}
		}
		
		if (displayBuildMenu == true && this.m_battle.IsBuildMode() == true) {
			if (mainPanelY > MAIN_PANEL_DEFAULT_Y) mainPanelY -= deltaTime * MAIN_PANEL_MOVE_SPEED;
			else mainPanelY = MAIN_PANEL_DEFAULT_Y;
		}
		else {
			if (mainPanelY < CANVAS_H) mainPanelY += deltaTime * MAIN_PANEL_MOVE_SPEED;
			else mainPanelY = CANVAS_H;
		}
		
		enemyPanel.SetPosition (-20, enemyPanelY);
		
		mainMenuPanel1.SetPosition (-20, mainPanelY);
		for (var i=0; i<selectButton.length; i++) {
			selectButton[i].SetPosition (5 + i * 71, mainPanelY + 25);
		}
		
		// Update things on the main panel
		for (var i=0; i<selectButton.length; i++) {
			selectButton[i].Update (deltaTime);
		}
		
		
		// Update the info panel
		if (turretInfoPanelShowing == true) {
			if (turretInfoPanelX < TURRET_PANEL_DEFAULT_X) turretInfoPanelX += deltaTime * TURRET_PANEL_MOVE_SPEED;
			else turretInfoPanelX = TURRET_PANEL_DEFAULT_X;
		}
		else {
			if (turretInfoPanelX > - TURRET_PANEL_DEFAULT_W + TURRET_PANEL_DEFAULT_X) turretInfoPanelX -= deltaTime * TURRET_PANEL_MOVE_SPEED;
			else turretInfoPanelX = - TURRET_PANEL_DEFAULT_W + TURRET_PANEL_DEFAULT_X;
		}
		
		turretInfoPanel.SetPosition (turretInfoPanelX, TURRET_PANEL_DEFAULT_Y);
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			conditionMenu[i].SetPosition (turretInfoPanelX + 40, TURRET_PANEL_DEFAULT_Y + 90 + i * 41);
			actionMenu[i].SetPosition (turretInfoPanelX + 342, TURRET_PANEL_DEFAULT_Y + 90 + i * 41);
		}
		
		
		copyAIButton.SetPosition (turretInfoPanelX + 40, TURRET_PANEL_DEFAULT_Y + 364);
		pasteAIButton.SetPosition (turretInfoPanelX + 191, TURRET_PANEL_DEFAULT_Y + 364);
		applyButton.SetPosition (turretInfoPanelX + 342, TURRET_PANEL_DEFAULT_Y + 364);
		
		preset1Button.SetPosition (turretInfoPanelX + 40, TURRET_PANEL_DEFAULT_Y + 405);
		preset2Button.SetPosition (turretInfoPanelX + 191, TURRET_PANEL_DEFAULT_Y + 405);
		preset3Button.SetPosition (turretInfoPanelX + 342, TURRET_PANEL_DEFAULT_Y + 405);
		
		basicSetupButton.SetPosition (turretInfoPanelX + 40, TURRET_PANEL_DEFAULT_Y + 446);
		advanceSetupButton.SetPosition (turretInfoPanelX + 40, TURRET_PANEL_DEFAULT_Y + 446);
		
		sellButton.SetPosition (turretInfoPanelX + 342, TURRET_PANEL_DEFAULT_Y + 446);
		
		
		//turretInfoPanelAdvance
		//turretInfoPanelShowing
	}
	
	this.HandleInput = function (deltaTime) {
		// Drag and drop to move map
		enemyInfoPopupIndex = -1;
		enemyInfoPopupX = -100;
		enemyInfoPopupY = -100;
				
		if (USE_TOUCH == false) {
			if ((g_inputEngine.m_mouseX < 810 || g_inputEngine.m_mouseY < 650) && g_inputEngine.m_mouseY < mainPanelY) {
				var continueHandleInput = false;
				for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
					if (continueHandleInput == false)
						continueHandleInput = conditionMenu[i].HandleInput ();
					else
						conditionMenu[i].HandleInput ();
					
					if (continueHandleInput == false)
						continueHandleInput = actionMenu[i].HandleInput ();
					else
						actionMenu[i].HandleInput ();
				}
				
			
				if (turretInfoPanelShowing == true) {
					if (turretInfoPanelAdvance == true) {
						if (continueHandleInput == false) 	continueHandleInput = copyAIButton.HandleInput ();
						else								copyAIButton.HandleInput ();
						if (continueHandleInput == false) 	continueHandleInput = pasteAIButton.HandleInput ();
						else								pasteAIButton.HandleInput ();
						if (continueHandleInput == false) 	continueHandleInput = applyButton.HandleInput ();
						else								applyButton.HandleInput ();
						if (continueHandleInput == false) 	continueHandleInput = basicSetupButton.HandleInput ();
						else								basicSetupButton.HandleInput ();
					}
					else {
						if (continueHandleInput == false) 	continueHandleInput = advanceSetupButton.HandleInput ();
						else								advanceSetupButton.HandleInput ();
					}
					if (continueHandleInput == false) 	continueHandleInput = preset1Button.HandleInput ();
					else								preset1Button.HandleInput ();
					if (continueHandleInput == false) 	continueHandleInput = preset2Button.HandleInput ();
					else								preset2Button.HandleInput ();
					if (continueHandleInput == false) 	continueHandleInput = preset3Button.HandleInput ();
					else								preset3Button.HandleInput ();
					if (continueHandleInput == false) 	continueHandleInput = sellButton.HandleInput ();
					else								sellButton.HandleInput ();
				}
				
				
				
				
				if (g_inputEngine.m_mouseY <= enemyPanelY + 75) {
					for (var i=0; i<nextWaveList.length; i++) {
						if (g_inputEngine.m_mouseX >= i * 60 + 180 && g_inputEngine.m_mouseX <= i * 60 + 180 + 50) {
							enemyInfoPopupIndex = i;
							enemyInfoPopupX = g_inputEngine.m_mouseX;
							enemyInfoPopupY = g_inputEngine.m_mouseY;
							enemyInfoPopup.SetPosition (enemyInfoPopupX, enemyInfoPopupY);
							
							break;
						}
					}
				}
				
			
				if (continueHandleInput == false) {
					if (g_inputEngine.m_mousePress == 1) {
						if (mousePressing == false) {
							anchorMouseX = g_inputEngine.m_mouseX;
							anchorMouseY = g_inputEngine.m_mouseY;
							anchorCameraX = this.m_battle.camera.x;
							anchorCameraY = this.m_battle.camera.y;
						}
						else {
							var mapScale = this.m_battle.camera.w / CANVAS_W;
							var deltaX = anchorMouseX - g_inputEngine.m_mouseX;
							var deltaY = anchorMouseY - g_inputEngine.m_mouseY;
							this.m_battle.camera.x = anchorCameraX + deltaX * mapScale;
							this.m_battle.camera.y = anchorCameraY + deltaY * mapScale;
							this.m_battle.ApplyCamera();
						}
						mousePressing = true;
					}
					else {
						if (g_inputEngine.m_mouseX > turretInfoPanelX + TURRET_PANEL_DEFAULT_W || g_inputEngine.m_mouseY < TURRET_PANEL_DEFAULT_Y) {
							var scale = this.m_battle.camera.w / CANVAS_W;
							var scaleMouseX = g_inputEngine.m_mouseX * scale;
							var scaleMouseY = g_inputEngine.m_mouseY * scale;
							var blockMouseX = scaleMouseX + this.m_battle.camera.x;
							var blockMouseY = scaleMouseY + this.m_battle.camera.y;
							var blockX = (blockMouseX / BATTLE_FIELD_BLOCK_SIZE) >> 0;
							var blockY = (blockMouseY / BATTLE_FIELD_BLOCK_SIZE) >> 0;
							
							if (mousePressing == true) {
								var deltaX = Math.abs(anchorMouseX - g_inputEngine.m_mouseX);
								var deltaY = Math.abs(anchorMouseY - g_inputEngine.m_mouseY);
								if (deltaX < MOUSE_TOUCH_SCROLL_DIFFERENCE && deltaY < MOUSE_TOUCH_SCROLL_DIFFERENCE) {
									if (g_message.GetActiveMessage() != null && g_message.GetActiveMessage().m_isClickToContinue) {
										g_message.PopMessage();
										
										if (this.m_mission == 1 && this.m_battle.GetWaveNumber() == 0) PushTutorial();
										
										var dialogueType = 0;
										var perfect = (matchResult == MATCH_RESULT_PERFECT_WIN);
										if (matchResult == MATCH_RESULT_PERFECT_WIN || matchResult == MATCH_RESULT_NORMAL_WIN) {
											CalculateScore();
											PushInGameMenu();
											if (this.m_mission == g_missionData.length - 1)	dialogueType = 4;
											else dialogueType = 2;
											
											g_gsInGameMenu.SetData (dialogueType, structureScore, economicScore, performanceScore, bestScore, perfect, reward);
										}
										else if (matchResult == MATCH_RESULT_LOSE) {
											CalculateScore();
											PushInGameMenu();
											dialogueType = 3;
											g_gsInGameMenu.SetData (dialogueType, structureScore, economicScore, performanceScore, bestScore, false, 0);
										}
									}
									else {
										this.m_battle.ClickOnBlock (blockX, blockY);
									}
								}
							}
						}
						mousePressing = false;
					}
				}
			}
		}
		else {
			if (g_inputEngine.m_touchY.length <= 1) {
				var continueHandleInput = false;
				for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
					if (continueHandleInput == false)
						continueHandleInput = conditionMenu[i].HandleInput ();
					else
						conditionMenu[i].HandleInput ();
					
					if (continueHandleInput == false)
						continueHandleInput = actionMenu[i].HandleInput ();
					else
						actionMenu[i].HandleInput ();
				}
				
				if (turretInfoPanelShowing == true) {
					if (turretInfoPanelAdvance == true) {
						if (continueHandleInput == false) 	continueHandleInput = copyAIButton.HandleInput ();
						else								copyAIButton.HandleInput ();
						if (continueHandleInput == false) 	continueHandleInput = pasteAIButton.HandleInput ();
						else								pasteAIButton.HandleInput ();
						if (continueHandleInput == false) 	continueHandleInput = applyButton.HandleInput ();
						else								applyButton.HandleInput ();
						if (continueHandleInput == false) 	continueHandleInput = basicSetupButton.HandleInput ();
						else								basicSetupButton.HandleInput ();
					}
					else {
						if (continueHandleInput == false) 	continueHandleInput = advanceSetupButton.HandleInput ();
						else								advanceSetupButton.HandleInput ();
					}
					if (continueHandleInput == false) 	continueHandleInput = preset1Button.HandleInput ();
					else								preset1Button.HandleInput ();
					if (continueHandleInput == false) 	continueHandleInput = preset2Button.HandleInput ();
					else								preset2Button.HandleInput ();
					if (continueHandleInput == false) 	continueHandleInput = preset3Button.HandleInput ();
					else								preset3Button.HandleInput ();
					if (continueHandleInput == false) 	continueHandleInput = sellButton.HandleInput ();
					else								sellButton.HandleInput ();
				}
			}
			
			if (g_inputEngine.m_touchY.length == 0) {
				if (mousePressing == true) {
					mousePressing = false;
					
					if (lastKnownTouchX > turretInfoPanelX + TURRET_PANEL_DEFAULT_W || lastKnownTouchY < TURRET_PANEL_DEFAULT_Y) {
						var deltaX = Math.abs(anchorMouseX - lastKnownTouchX);
						var deltaY = Math.abs(anchorMouseY - lastKnownTouchY);
						if (deltaX < MOUSE_TOUCH_SCROLL_DIFFERENCE && deltaY < MOUSE_TOUCH_SCROLL_DIFFERENCE) {
							var scale = this.m_battle.camera.w / CANVAS_W;
							var scaleMouseX = lastKnownTouchX * scale;
							var scaleMouseY = lastKnownTouchY * scale;
							var blockMouseX = scaleMouseX + this.m_battle.camera.x;
							var blockMouseY = scaleMouseY + this.m_battle.camera.y;
							var blockX = (blockMouseX / BATTLE_FIELD_BLOCK_SIZE) >> 0;
							var blockY = (blockMouseY / BATTLE_FIELD_BLOCK_SIZE) >> 0;

							if (g_message.GetActiveMessage() != null && g_message.GetActiveMessage().m_isClickToContinue) {
								g_message.PopMessage();
								
								if (this.m_mission == 1 && this.m_battle.GetWaveNumber() == 0) PushTutorial();
								
								var dialogueType = 0;
								var perfect = (matchResult == MATCH_RESULT_PERFECT_WIN);
								if (matchResult == MATCH_RESULT_PERFECT_WIN || matchResult == MATCH_RESULT_NORMAL_WIN) {
									CalculateScore();
									PushInGameMenu();
									if (this.m_mission == g_missionData.length - 1)	dialogueType = 4;
									else dialogueType = 2;
									
									g_gsInGameMenu.SetData (dialogueType, structureScore, economicScore, performanceScore, bestScore, perfect, reward);
								}
								else if (matchResult == MATCH_RESULT_LOSE) {
									CalculateScore();
									PushInGameMenu();
									dialogueType = 3;
									g_gsInGameMenu.SetData (dialogueType, structureScore, economicScore, performanceScore, bestScore, false, 0);
								}
							}
							else {
								this.m_battle.ClickOnBlock (blockX, blockY);
							}
						}
					}
				}
			}
			else if (g_inputEngine.m_touchY.length == 1) {
				lastKnownTouchX = g_inputEngine.m_touchX[0];
				lastKnownTouchY = g_inputEngine.m_touchY[0];
				
				if ((g_inputEngine.m_touchX[0] < 810 || g_inputEngine.m_touchY[0] < 650) && g_inputEngine.m_touchY[0] < mainPanelY) {
					for (var k=0; k<g_inputEngine.m_touchX.length; k++) {
						for (var i=0; i<nextWaveList.length; i++) {
							if (g_inputEngine.m_touchY[k] <= enemyPanelY + 75 && g_inputEngine.m_touchX[k] >= i * 60 + 180 && g_inputEngine.m_touchX[k] <= i * 60 + 180 + 50) {
								enemyInfoPopupIndex = i;
								enemyInfoPopupX = g_inputEngine.m_touchX[k];
								enemyInfoPopupY = g_inputEngine.m_touchY[k];
								enemyInfoPopup.SetPosition (enemyInfoPopupX, enemyInfoPopupY);
								continueHandleInput = true;
								
								break;
							}
						}
					}
					
					if (continueHandleInput == false) {
						if (g_inputEngine.m_touchX[0] > turretInfoPanelX + TURRET_PANEL_DEFAULT_W || g_inputEngine.m_touchY[0] < TURRET_PANEL_DEFAULT_Y) {
							var scale = this.m_battle.camera.w / CANVAS_W;
							var scaleMouseX = g_inputEngine.m_touchX[0] * scale;
							var scaleMouseY = g_inputEngine.m_touchY[0] * scale;
							var blockMouseX = scaleMouseX + this.m_battle.camera.x;
							var blockMouseY = scaleMouseY + this.m_battle.camera.y;
							var blockX = (blockMouseX / BATTLE_FIELD_BLOCK_SIZE) >> 0;
							var blockY = (blockMouseY / BATTLE_FIELD_BLOCK_SIZE) >> 0;
							
							if (mousePressing == false) {
								anchorMouseX = g_inputEngine.m_touchX[0];
								anchorMouseY = g_inputEngine.m_touchY[0];
								anchorCameraX = this.m_battle.camera.x;
								anchorCameraY = this.m_battle.camera.y;
								
								mousePressing = true;
							}
							else {
								var mapScale = this.m_battle.camera.w / CANVAS_W;
								var deltaX = anchorMouseX - g_inputEngine.m_touchX[0];
								var deltaY = anchorMouseY - g_inputEngine.m_touchY[0];
								this.m_battle.camera.x = anchorCameraX + deltaX * mapScale;
								this.m_battle.camera.y = anchorCameraY + deltaY * mapScale;
								this.m_battle.ApplyCamera();
							}
						}
					}
				}
			}
			else if (g_inputEngine.m_touchY.length == 2) {
			
			}
		}
		
		
		
		
		
		
		// Zoom map using mouse wheel
		var deltaWheel = g_inputEngine.m_mouseWheel;
		g_inputEngine.ResetWheel();
		if (deltaWheel != 0) this.m_battle.Zoom (-deltaTime * deltaWheel * 4);
		
		
		// Scroll or zoom using key
		if (g_inputEngine.m_keyState[37] == 1) {
			this.m_battle.camera.x -= deltaTime * KEY_SCROLL_SPEED;
			this.m_battle.ApplyCamera();
		}
		if (g_inputEngine.m_keyState[38] == 1) {
			this.m_battle.camera.y -= deltaTime * KEY_SCROLL_SPEED;
			this.m_battle.ApplyCamera();
		}
		if (g_inputEngine.m_keyState[39] == 1) {
			this.m_battle.camera.x += deltaTime * KEY_SCROLL_SPEED;
			this.m_battle.ApplyCamera();
		}
		if (g_inputEngine.m_keyState[40] == 1) {
			this.m_battle.camera.y += deltaTime * KEY_SCROLL_SPEED;
			this.m_battle.ApplyCamera();
		}
		if (g_inputEngine.m_keyState[187] == 1 || g_inputEngine.m_keyState[61] == 1 || g_inputEngine.m_keyState[107] == 1) {
			this.m_battle.Zoom(-deltaTime * KEY_ZOOM_SPEED);
		}
		if (g_inputEngine.m_keyState[189] == 1 || g_inputEngine.m_keyState[173] == 1 || g_inputEngine.m_keyState[109] == 1) {
			this.m_battle.Zoom(deltaTime * KEY_ZOOM_SPEED);
		}
		
		if (g_message.GetActiveMessage() != null && g_message.GetActiveMessage().m_isClickToContinue) {
		
		}
		else {
			startButton.Update (deltaTime);
			speedButton.Update (deltaTime);
			menuButton.Update (deltaTime);
		}
	}
	
	
	
	var CalculateScore = function () {
		structureScore = 0;
		economicScore = 0;
		performanceScore = 0;
		
		var turret = instance.m_battle.GetTurretList();
		for (var i=0; i<turret.length; i++) {
			structureScore += g_turretData[turret[i].m_type].m_cost;
		}
		economicScore = instance.m_battle.GetMoney() >> 0;
		performanceScore = instance.m_battle.GetLife() * 10;
		
		if (instance.m_battle.GetLife() == g_missionData[instance.m_mission].life) {
			performanceScore += 1000;
		}
		
		bestScore = g_profile.score[instance.m_mission];
		
		if (structureScore + economicScore + performanceScore > bestScore) {
			g_profile.score[instance.m_mission] = structureScore + economicScore + performanceScore;
		}
	}
	
	
	this.SetUpAIMenuSystem = function () {
		for (var i=0; i<5; i++) {
			actionSubMenu[i] = new GlassMenu();
			actionSubMenu[i].m_w = 220;
			actionSubMenu[i].m_callBack = this.SelectAction;
			actionSubMenu[i].m_param = i;
		}
		actionSubMenu[0].m_caption = TEXT_AI_ACTION_NONE;
		actionSubMenu[1].m_caption = TEXT_AI_ACTION_ATTACK;
		actionSubMenu[2].m_caption = TEXT_AI_ACTION_SPECIAL;
		actionSubMenu[3].m_caption = TEXT_AI_ACTION_IDLE;
		actionSubMenu[4].m_caption = TEXT_AI_ACTION_NEXT;
		
		
		for (var i=0; i<10; i++) {
			enemyHPMenu[i] = new GlassMenu();
			enemyHPMenu[i].m_w = 220;
			enemyHPMenu[i].m_subMenuTop = 0;
			enemyHPMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyHPMenu[i].m_callBack = this.SelectCondition;
			enemyHPMenu[i].m_param = AI_CHECKER_HP;
			enemyHPMenu[i].m_param2 = i + 1;
		}
		enemyHPMenu[0].m_caption = TEXT_AI_HP + " < 80%"; 
		enemyHPMenu[1].m_caption = TEXT_AI_HP + " < 60%";
		enemyHPMenu[2].m_caption = TEXT_AI_HP + " < 40%";
		enemyHPMenu[3].m_caption = TEXT_AI_HP + " < 20%";
		enemyHPMenu[4].m_caption = TEXT_AI_HP + " > 80%";
		enemyHPMenu[5].m_caption = TEXT_AI_HP + " > 60%";
		enemyHPMenu[6].m_caption = TEXT_AI_HP + " > 40%";
		enemyHPMenu[7].m_caption = TEXT_AI_HP + " > 20%";
		enemyHPMenu[8].m_caption = TEXT_AI_HP_LOWEST;
		enemyHPMenu[9].m_caption = TEXT_AI_HP_HIGHEST;
		
		for (var i=0; i<5; i++) {
			enemySpeedMenu[i] = new GlassMenu();
			enemySpeedMenu[i].m_w = 220;
			enemySpeedMenu[i].m_subMenuTop = 0;
			enemySpeedMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemySpeedMenu[i].m_callBack = this.SelectCondition;
			enemySpeedMenu[i].m_param = AI_CHECKER_SPEED;
			enemySpeedMenu[i].m_param2 = i + 1;
			
		}
		enemySpeedMenu[0].m_caption = TEXT_AI_SPEED_FAST;
		enemySpeedMenu[1].m_caption = TEXT_AI_SPEED_MEDIUM;
		enemySpeedMenu[2].m_caption = TEXT_AI_SPEED_SLOW;
		enemySpeedMenu[3].m_caption = TEXT_AI_SPEED_FASTEST;
		enemySpeedMenu[4].m_caption = TEXT_AI_SPEED_SLOWEST;
		
		
		for (var i=0; i<4; i++) {
			enemyArmourMenu[i] = new GlassMenu();
			enemyArmourMenu[i].m_w = 220;
			enemyArmourMenu[i].m_subMenuTop = 0;
			enemyArmourMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyArmourMenu[i].m_callBack = this.SelectCondition;
			enemyArmourMenu[i].m_param = AI_CHECKER_ARMOUR;
			enemyArmourMenu[i].m_param2 = i + 1;
		}
		enemyArmourMenu[0].m_caption = TEXT_AI_ARMOUR_HEAVY;
		enemyArmourMenu[1].m_caption = TEXT_AI_ARMOUR_MEDIUM;
		enemyArmourMenu[2].m_caption = TEXT_AI_ARMOUR_LIGHT;
		enemyArmourMenu[3].m_caption = TEXT_AI_ARMOUR_NONE;
		
		for (var i=0; i<4; i++) {
			enemyRankMenu[i] = new GlassMenu();
			enemyRankMenu[i].m_w = 220;
			enemyRankMenu[i].m_subMenuTop = 0;
			enemyRankMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyRankMenu[i].m_callBack = this.SelectCondition;
			enemyRankMenu[i].m_param = AI_CHECKER_RANK;
			enemyRankMenu[i].m_param2 = i + 1;
		}
		enemyRankMenu[0].m_caption = TEXT_AI_RANK_FIGHTER;
		enemyRankMenu[1].m_caption = TEXT_AI_RANK_CORVETTE;
		enemyRankMenu[2].m_caption = TEXT_AI_RANK_FRIGATE;
		enemyRankMenu[3].m_caption = TEXT_AI_RANK_CARRIER;
		
		
		for (var i=0; i<4; i++) {
			enemyDistanceToTurretMenu[i] = new GlassMenu();
			enemyDistanceToTurretMenu[i].m_w = 220;
			enemyDistanceToTurretMenu[i].m_subMenuTop = 0;
			enemyDistanceToTurretMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyDistanceToTurretMenu[i].m_callBack = this.SelectCondition;
			enemyDistanceToTurretMenu[i].m_param = AI_CHECKER_RANGE;
			enemyDistanceToTurretMenu[i].m_param2 = i + 1;
		}
		enemyDistanceToTurretMenu[0].m_caption = TEXT_AI_RANGE_1;
		enemyDistanceToTurretMenu[1].m_caption = TEXT_AI_RANGE_2;
		enemyDistanceToTurretMenu[2].m_caption = TEXT_AI_RANGE_3;
		enemyDistanceToTurretMenu[3].m_caption = TEXT_AI_RANGE_4;
		
		for (var i=0; i<2; i++) {
			enemyDistanceToExitMenu[i] = new GlassMenu();
			enemyDistanceToExitMenu[i].m_w = 220;
			enemyDistanceToExitMenu[i].m_subMenuTop = 0;
			enemyDistanceToExitMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyDistanceToExitMenu[i].m_callBack = this.SelectCondition;
			enemyDistanceToExitMenu[i].m_param = AI_CHECKER_DISTANCE;
			enemyDistanceToExitMenu[i].m_param2 = i + 1;
		}
		enemyDistanceToExitMenu[0].m_caption = TEXT_AI_NEAREST_EXIT;
		enemyDistanceToExitMenu[1].m_caption = TEXT_AI_FURTHEST_EXIT;
		
		for (var i=0; i<5; i++) {
			enemyClusterMenu[i] = new GlassMenu();
			enemyClusterMenu[i].m_w = 220;
			enemyClusterMenu[i].m_subMenuTop = 0;
			enemyClusterMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyClusterMenu[i].m_callBack = this.SelectCondition;
			enemyClusterMenu[i].m_param = AI_CHECKER_CLUSTER;
			enemyClusterMenu[i].m_param2 = i + 1;
		}
		enemyClusterMenu[0].m_caption = TEXT_AI_CLUSTER_0;
		enemyClusterMenu[1].m_caption = TEXT_AI_CLUSTER_1;
		enemyClusterMenu[2].m_caption = TEXT_AI_CLUSTER_2;
		enemyClusterMenu[3].m_caption = TEXT_AI_CLUSTER_3;
		enemyClusterMenu[4].m_caption = TEXT_AI_CLUSTER_4;
		
		
		
		for (var i=0; i<10; i++) {
			enemyStatusMenu[i] = new GlassMenu();
			enemyStatusMenu[i].m_w = 220;
			enemyStatusMenu[i].m_subMenuTop = 0;
			enemyStatusMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			enemyStatusMenu[i].m_callBack = this.SelectCondition;
			enemyStatusMenu[i].m_param = AI_CHECKER_STATUS;
			enemyStatusMenu[i].m_param2 = i + 1;
		}
		enemyStatusMenu[0].m_caption = TEXT_AI_STATUS_1;
		enemyStatusMenu[1].m_caption = TEXT_AI_STATUS_2;
		enemyStatusMenu[2].m_caption = TEXT_AI_STATUS_3;
		enemyStatusMenu[3].m_caption = TEXT_AI_STATUS_4;
		enemyStatusMenu[4].m_caption = TEXT_AI_STATUS_5;
		enemyStatusMenu[5].m_caption = TEXT_AI_STATUS_6;
		enemyStatusMenu[6].m_caption = TEXT_AI_STATUS_7;
		enemyStatusMenu[7].m_caption = TEXT_AI_STATUS_8;
		enemyStatusMenu[8].m_caption = TEXT_AI_STATUS_9;
		enemyStatusMenu[9].m_caption = TEXT_AI_STATUS_10;

		
		
		
		for (var i=0; i<8; i++) {
			enemyMenu[i] = new GlassMenu();
			enemyMenu[i].m_w = 220;
			enemyMenu[i].m_subMenuTop = 0;
			enemyMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
		}
		enemyMenu[0].m_caption = TEXT_AI_HP;
		enemyMenu[0].m_subMenuArray = enemyHPMenu;
		enemyMenu[1].m_caption = TEXT_AI_SPEED;
		enemyMenu[1].m_subMenuArray = enemySpeedMenu;
		enemyMenu[2].m_caption = TEXT_AI_ARMOUR;
		enemyMenu[2].m_subMenuArray = enemyArmourMenu;
		enemyMenu[3].m_caption = TEXT_AI_RANK;
		enemyMenu[3].m_subMenuArray = enemyRankMenu;
		enemyMenu[4].m_caption = TEXT_AI_DISTANCE_TURRET;
		enemyMenu[4].m_subMenuArray = enemyDistanceToTurretMenu;
		enemyMenu[5].m_caption = TEXT_AI_DISTANCE_EXIT;
		enemyMenu[5].m_subMenuArray = enemyDistanceToExitMenu;
		enemyMenu[6].m_caption = TEXT_AI_CLUSTER;
		enemyMenu[6].m_subMenuArray = enemyClusterMenu;
		enemyMenu[7].m_caption = TEXT_AI_STATUS;
		enemyMenu[7].m_subMenuArray = enemyStatusMenu;
		
		
		
		
		
		for (var i=0; i<1; i++) {
			selfMenu[i] = new GlassMenu();
			selfMenu[i].m_w = 220;
			selfMenu[i].m_subMenuTop = 0;
			selfMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			selfMenu[i].m_callBack = this.SelectCondition;
			selfMenu[i].m_param = AI_CHECKER_SELF;
			selfMenu[i].m_param2 = i + 1;
		}
		selfMenu[0].m_caption = TEXT_AI_HAVE_TARGET;
		
		for (var i=0; i<8; i++) {
			ammunitionMenu[i] = new GlassMenu();
			ammunitionMenu[i].m_w = 220;
			ammunitionMenu[i].m_subMenuTop = 0;
			ammunitionMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			ammunitionMenu[i].m_callBack = this.SelectCondition;
			ammunitionMenu[i].m_param = AI_CHECKER_AMMUNITION;
			ammunitionMenu[i].m_param2 = i + 1;
		}
		ammunitionMenu[0].m_caption = TEXT_AI_AMMUNITION + " < 80%"; 
		ammunitionMenu[1].m_caption = TEXT_AI_AMMUNITION + " < 60%"; 
		ammunitionMenu[2].m_caption = TEXT_AI_AMMUNITION + " < 40%"; 
		ammunitionMenu[3].m_caption = TEXT_AI_AMMUNITION + " < 20%"; 
		ammunitionMenu[4].m_caption = TEXT_AI_AMMUNITION + " > 80%"; 
		ammunitionMenu[5].m_caption = TEXT_AI_AMMUNITION + " > 60%"; 
		ammunitionMenu[6].m_caption = TEXT_AI_AMMUNITION + " > 40%"; 
		ammunitionMenu[7].m_caption = TEXT_AI_AMMUNITION + " > 20%"; 
		
		for (var i=0; i<8; i++) {
			energyMenu[i] = new GlassMenu();
			energyMenu[i].m_w = 220;
			energyMenu[i].m_subMenuTop = 0;
			energyMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			energyMenu[i].m_callBack = this.SelectCondition;
			energyMenu[i].m_param = AI_CHECKER_ENERGY;
			energyMenu[i].m_param2 = i + 1;
		}
		energyMenu[0].m_caption = TEXT_AI_ENERGY + " < 80%"; 
		energyMenu[1].m_caption = TEXT_AI_ENERGY + " < 60%"; 
		energyMenu[2].m_caption = TEXT_AI_ENERGY + " < 40%"; 
		energyMenu[3].m_caption = TEXT_AI_ENERGY + " < 20%"; 
		energyMenu[4].m_caption = TEXT_AI_ENERGY + " > 80%"; 
		energyMenu[5].m_caption = TEXT_AI_ENERGY + " > 60%"; 
		energyMenu[6].m_caption = TEXT_AI_ENERGY + " > 40%"; 
		energyMenu[7].m_caption = TEXT_AI_ENERGY + " > 20%"; 
		
		
		for (var i=0; i<3; i++) {
			globalMenu[i] = new GlassMenu();
			globalMenu[i].m_w = 220;
			globalMenu[i].m_subMenuTop = 0;
			globalMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
		}
		globalMenu[0].m_caption = TEXT_AI_SELF;
		globalMenu[0].m_subMenuArray = selfMenu;
		globalMenu[1].m_caption = TEXT_AI_AMMUNITION;
		globalMenu[1].m_subMenuArray = ammunitionMenu;
		globalMenu[2].m_caption = TEXT_AI_ENERGY;
		globalMenu[2].m_subMenuArray = energyMenu;
		
		
		
		conditionSubMenu[0] = new GlassMenu();
		conditionSubMenu[0].m_w = 220;
		conditionSubMenu[0].m_caption = TEXT_AI_ACTION_NONE;
		conditionSubMenu[0].m_callBack = this.SelectCondition;
		conditionSubMenu[0].m_param = AI_CHECKER_NONE;
		
		conditionSubMenu[1] = new GlassMenu();
		conditionSubMenu[1].m_w = 220;
		conditionSubMenu[1].m_caption = TEXT_AI_SUB_COND_ENEMY;
		conditionSubMenu[1].m_subMenuArray = enemyMenu;
		conditionSubMenu[1].m_subMenuTop = 0;
		conditionSubMenu[1].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
		
		conditionSubMenu[2] = new GlassMenu();
		conditionSubMenu[2].m_w = 220;
		conditionSubMenu[2].m_caption = TEXT_AI_SUB_COND_GLOBAL;
		conditionSubMenu[2].m_subMenuArray = globalMenu;
		conditionSubMenu[2].m_subMenuTop = 0;
		conditionSubMenu[2].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
		
		
		
		
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			conditionMenu[i] = new GlassMenu();
			conditionMenu[i].m_w = 301;
			conditionMenu[i].m_caption = "";
			conditionMenu[i].m_subMenuArray = conditionSubMenu;
			conditionMenu[i].m_subMenuTop = 0;
			conditionMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			conditionMenu[i].m_subMenuLeft = 490;
			conditionMenu[i].m_callBack = this.SelectConditionIndex;
			conditionMenu[i].m_param = i;
			if (i >= NUMBER_OF_FREE_AI_CHECK && g_profile.upgrade[UPGRADE_BASE_1][UPGRADE_TIER_1] == false) {
				conditionMenu[i].m_enable = false;
			}
		}
		
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			actionMenu[i] = new GlassMenu();
			actionMenu[i].m_w = 150;
			actionMenu[i].m_caption = "";
			actionMenu[i].m_subMenuArray = actionSubMenu;
			actionMenu[i].m_subMenuTop = 0;
			actionMenu[i].m_subMenuBottom = MAIN_PANEL_DEFAULT_Y;
			actionMenu[i].m_subMenuLeft = 490;
			actionMenu[i].m_callBack = this.SelectActionIndex;
			actionMenu[i].m_param = i;
			if (i >= NUMBER_OF_FREE_AI_CHECK && g_profile.upgrade[UPGRADE_BASE_1][UPGRADE_TIER_1] == false) {
				actionMenu[i].m_enable = false;
			}
		}
			
	}
	
	
	this.AssignNameToMenu = function () {
		for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
			switch (displayingTurret.m_AIChecker[i].m_conditionType) {
				case AI_CHECKER_HP:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyHPMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_SPEED:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemySpeedMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_ARMOUR:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyArmourMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_RANK:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyRankMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_RANGE:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyDistanceToTurretMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_DISTANCE:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyDistanceToExitMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_CLUSTER:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyClusterMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_STATUS:
					conditionMenu[i].m_caption = TEXT_AP_TARGET + enemyStatusMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_SELF:
					conditionMenu[i].m_caption = TEXT_AP_CONDITION + selfMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_AMMUNITION:
					conditionMenu[i].m_caption = TEXT_AP_CONDITION + ammunitionMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				case AI_CHECKER_ENERGY:
					conditionMenu[i].m_caption = TEXT_AP_CONDITION + energyMenu[displayingTurret.m_AIChecker[i].m_conditionValue - 1].m_caption;
					break;
				default:
					conditionMenu[i].m_caption = TEXT_AP_NONE;
			}
			
			if (displayingTurret.m_AIChecker[i].m_actionType == 0) {
				actionMenu[i].m_caption = TEXT_AP_NONE;
			}
			else {
				actionMenu[i].m_caption = actionSubMenu[displayingTurret.m_AIChecker[i].m_actionType].m_caption;
			}
		}
	}
	
	this.SelectConditionIndex = function (index) {
		conditionMenuSelectingIndex = index;
	}
	
	this.SelectActionIndex = function (index) {
		actionMenuSelectingIndex = index;
	}
	
	this.SelectCondition = function (index1, index2) {
		displayingTurret.m_AIChecker[conditionMenuSelectingIndex].m_conditionType = index1;
		displayingTurret.m_AIChecker[conditionMenuSelectingIndex].m_conditionValue = index2;
		conditionMenu[conditionMenuSelectingIndex].ResetState();
		instance.AssignNameToMenu();
	}
	
	this.SelectAction = function (index) {
		displayingTurret.m_AIChecker[actionMenuSelectingIndex].m_actionType = index;
		actionMenu[actionMenuSelectingIndex].ResetState();
		instance.AssignNameToMenu();
	}
	
	
	
	this.AddDialogue = function () {
		var wave = this.m_battle.GetWaveNumber();
		if (this.m_mission == 1) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_1_1));
			}
			else if (wave == 1) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_1_2));
			}
			else if (wave == 2) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_1_3));
			}
		}
		else if (this.m_mission == 2) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_2_1));
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_2_2));
			}
			else if (wave == 5) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_2_3));
			}
			else if (wave == 13) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_2_4));
			}
		}
		else if (this.m_mission == 3) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_3_1));
			}
			else if (wave == 6) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_3_2));
			}
			else if (wave == 17) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_3_3));
			}
		}
		else if (this.m_mission == 4) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_4_1));
			}
			else if (wave == 1) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_4_2));
			}
			else if (wave == 2) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_4_3));
			}
			else if (wave == 4) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_4_4));
			}
		}
		else if (this.m_mission == 5) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_5_1));
			}
			else if (wave == 4) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_5_2));
			}
			else if (wave == 5) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_5_3));
			}
		}
		else if (this.m_mission == 6) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_6_1));
			}
			else if (wave == 4) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_6_2));
			}
		}
		else if (this.m_mission == 7) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_7_1));
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_7_2));
			}
			else if (wave == 1) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_7_3));
			}
		}
		else if (this.m_mission == 8) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_8_1));
			}
			else if (wave == 9) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_8_2));
			}
		}
		else if (this.m_mission == 9) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_9_1));
			}
			else if (wave == 9) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_9_2));
			}
			else if (wave == 17) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_9_3));
			}
		}
		else if (this.m_mission == 10) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_10_1));
			}
			else if (wave == 1) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_10_2));
			}
			else if (wave == 10) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_10_3));
			}
		}
		else if (this.m_mission == 11) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_11_1));
			}
			else if (wave == 9) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_11_2));
			}
			else if (wave == 15) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_11_3));
			}
		}
		else if (this.m_mission == 12) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_12_1));
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_12_2));
			}
			else if (wave == 4) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_12_3));
			}
			else if (wave == 13) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_12_4));
			}
			else if (wave == 18) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_12_5));
			}
		}
		else if (this.m_mission == 13) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_13_1));
			}
			else if (wave == 10) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_13_2));
			}
		}
		else if (this.m_mission == 14) {
			if (wave == 0) {
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_14_1));
				g_message.PushMessage (new MessageFormat(true, TEXT_MISSION_MESSAGE_14_2));
			}
		}
	}
}


