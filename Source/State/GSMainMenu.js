function GSMainMenu () {
	var MAIN_MENU_PANEL_X = 0;
	var MAIN_MENU_PANEL_Y = 385;
	var TITLE_PANEL_Y = -10;
	var instance = this;
	
	var CHEAT_PANEL_X = 1070;
	var CHEAT_PANEL_Y = 552;
	
	var mainMenuPanel = new GlassPanel();
	var startButton = new GlassButton();
	var upgradeButton = new GlassButton();
	var infoButton = new GlassButton();
	var optionButton = new GlassButton();
	var shopButton = new GlassButton();
	
	var loginPanel = new GlassPanel();
	var logInButton = new GlassButton();
	
	var unlockProfileButton = new GlassButton();
	var resetProfileButton = new GlassButton();
	
	//var titlePanel = new GlassPanel();
	var cheatPanel = new GlassPanel();
	var adsPanel = new GlassPanel();
	
	var logo = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Logo.png");
	
	var init = false;
	this.m_battle = new Battle();
	
	
	var StartGame = function () {
		g_particleEngine.Clean();
		GoToMissionSelect();
	}
	
	var Upgrade = function () {
		g_particleEngine.Clean();
		GoToUpgrade();
	}
	
	var Info = function () {
		g_particleEngine.Clean();
		GoToInfo();
	}
	
	var Option = function () {
		PushOption();
	}
	
	var Shop = function () {
		if (PLATFORM != "ARMORGAME") {
			g_particleEngine.Clean();
			GoToShop();
		}
	}
	
	var UnlockProfile = function () {
		g_profile.progress = g_missionData.length - 1;
	}
	
	var ResetProfile = function () {
		g_profile.Reset();
	}
	
	var ShowLogin = function () {
		if (PLATFORM == "KONGREGATE") {
			kongregate.services.showRegistrationBox();
		}
	}
	
	this.Init = function () {
		if (init == false) {
			mainMenuPanel.Init (MAIN_MENU_PANEL_X, MAIN_MENU_PANEL_Y, 220, 345);
			startButton.Init (MAIN_MENU_PANEL_X + 35, MAIN_MENU_PANEL_Y + 40, TEXT_GENERIC_START, StartGame);
			upgradeButton.Init (MAIN_MENU_PANEL_X + 35, MAIN_MENU_PANEL_Y + 95, TEXT_GENERIC_UPGRADE, Upgrade);
			infoButton.Init (MAIN_MENU_PANEL_X + 35, MAIN_MENU_PANEL_Y + 150, TEXT_GENERIC_INFO, Info);
			optionButton.Init (MAIN_MENU_PANEL_X + 35, MAIN_MENU_PANEL_Y + 260, TEXT_GENERIC_OPTION, Option);
			
			if (PLATFORM != "ARMORGAME") {
				shopButton.Init (MAIN_MENU_PANEL_X + 35, MAIN_MENU_PANEL_Y + 205, TEXT_GENERIC_SHOP, Shop);
			}
			
			if (PLATFORM == "KONGREGATE") {
				loginPanel.Init (300, 600, 680, 130);
				logInButton.Init (800, 640, "Login", ShowLogin);
			}
				
			cheatPanel.Init (CHEAT_PANEL_X, CHEAT_PANEL_Y, 220, 180);
			
			//titlePanel.Init (ADS_PANEL_X, TITLE_PANEL_Y, ADS_PANEL_W, ADS_PANEL_H);
			adsPanel.Init (ADS_PANEL_X, ADS_PANEL_Y, ADS_PANEL_W, ADS_PANEL_H);
			
			if (PLATFORM == "TEST") {
				unlockProfileButton.Init (CHEAT_PANEL_X + 35, CHEAT_PANEL_Y + 40, "Unlock", UnlockProfile);
				resetProfileButton.Init (CHEAT_PANEL_X + 35, CHEAT_PANEL_Y + 95, "Reset", ResetProfile);
			}
			
			init = true;
			
			this.m_battle = new Battle();
			this.m_battle.LoadBattle(0);
			this.m_battle.StartWave();
		}
		
		g_mainMenuMusic.Play(false);
	}
	
	this.Update = function (deltaTime) {
		this.m_battle.Update (deltaTime);
		
		startButton.Update (deltaTime);
		upgradeButton.Update (deltaTime);
		infoButton.Update (deltaTime);
		optionButton.Update (deltaTime);
		
		if (PLATFORM != "ARMORGAME") {
			shopButton.Update (deltaTime);
		}
		
		if (PLATFORM == "TEST") {
			resetProfileButton.Update (deltaTime);
			unlockProfileButton.Update (deltaTime);
		}
		
		if (PLATFORM == "KONGREGATE") {
			if (KG_isGuest == true) {
				logInButton.Update (deltaTime);
			}
		}
		
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		this.m_battle.Draw(true);
		
		g_graphicEngine.FillCanvas (g_context, 35, 70, 76, 0.7);
		
		//titlePanel.Draw (g_context);
		g_graphicEngine.DrawFast (g_context, logo, 330, 0);
		
		
		mainMenuPanel.Draw (g_context);
		startButton.Draw (g_context);
		upgradeButton.Draw (g_context);
		infoButton.Draw (g_context);
		optionButton.Draw (g_context);
		
		if (PLATFORM != "ARMORGAME") {
			shopButton.Draw (g_context);
		}
		
		if (PLATFORM == "KONGREGATE") {
			loginPanel.Draw (g_context);
			if (KG_isGuest == true) {
				g_graphicEngine.DrawTextRGB (g_context, "You are not logged in...", 380, 665, 300, PRIMARY_FONT, 14, true, false, "left", "middle", 4, 255, 255, 1);
				logInButton.Draw (g_context);
			}
			else {
				g_graphicEngine.DrawTextRGB (g_context, "Welcome, " + KG_userName, 640, 665, 300, PRIMARY_FONT, 14, true, false, "center", "middle", 4, 255, 255, 1);
			}
		}
		
		if (ENABLE_ADS == true) {
			adsPanel.Draw (g_context);
		}
		
		if (PLATFORM == "TEST") {
			cheatPanel.Draw (g_context);
			resetProfileButton.Draw (g_context);
			unlockProfileButton.Draw (g_context);
		}
	}
}