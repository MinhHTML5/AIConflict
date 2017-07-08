function GSInfo () {
	var EMITTER_MOVING_SPEED = 0.2;
	
	var DESIGN_AREA_X = 940;
	var DESIGN_AREA_Y = 40;
	var DESIGN_AREA_W = 300;
	var DESIGN_AREA_H = 300;
	
	var TEXT_AREA_X = 520;
	var TEXT_AREA_Y = 40;
	var TEXT_AREA_W = 410;
	var TEXT_AREA_H = 540;
	
		
	var instance = this;
	var init = false;
		
	var splashImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Splash.jpg");

	var selectPanel = new GlassPanel();
	var infoPanel = new GlassPanel();
	var buttonPanel = new GlassPanel();
	var adsPanel = new GlassPanel();
	
	var turretButton = new Array();
	for (var i=0; i<10; i++) {
		turretButton[i] = new IconButton();
	}
	
	var enemyButton = new Array();
	for (var i=0; i<18; i++) {
		enemyButton[i] = new IconButton();
	}
	
	var turretDesign = new Array()
	for (var i=1; i<=10; i++) {
		turretDesign[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/TurretDesign/Turret " + i + ".png");
	}
	
	var genericEnemyDesign = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/EnemyDesign/Generic.png");
	
	var exitButton = new GlassButton();
	
	var selectingCategory = 0;
	var selectingIndex = 0;
	
	var designDrawH = 300;
	
	this.Init = function () {
		if (init == false) {
			selectPanel.Init (0, 0, 500, 620);
			infoPanel.Init (480, 0, 800, 620);
			
			for (var i=0; i<10; i++) {
				turretButton[i].Init (50 + (i % 5) * 80, 70 + ((i / 5) >> 0) * 80, SelectTurret, (i + 1));
				turretButton[i].SetIcon (ROOT_FOLDER + "Image/MapEditor/Turret " + (i + 1) + ".png", 50, 50);
			}
			
			for (var i=0; i<enemyButton.length; i++) {
				enemyButton[i].Init (50 + (i % 5) * 80, 265 + ((i / 5) >> 0) * 80, SelectEnemy, (i + 1));
			}
			
			enemyButton[0].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/1/1.png", 50, 50);
			enemyButton[1].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/2/1.png", 50, 50);
			enemyButton[2].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/3/1.png", 50, 50);
			enemyButton[3].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/4/1.png", 50, 50);
			enemyButton[4].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/5/1.png", 50, 50);
			
			enemyButton[5].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/1/2.png", 70, 70, 55, 55);
			enemyButton[6].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/2/2.png", 70, 70, 55, 55);
			enemyButton[7].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/3/2.png", 70, 70, 55, 55);
			enemyButton[8].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/4/2.png", 70, 70, 55, 55);
			enemyButton[9].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/5/2.png", 70, 70, 55, 55);
			
			enemyButton[10].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/1/4.png", 100, 100, 65, 65);
			enemyButton[11].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/2/4.png", 100, 100, 65, 65);
			enemyButton[12].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/3/4.png", 100, 100, 65, 65);
			enemyButton[13].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/4/4.png", 100, 100, 65, 65);
			enemyButton[14].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/5/4.png", 100, 100, 65, 65);
			
			enemyButton[15].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Cruiser/1/1.png", 150, 150, 65, 65);
			enemyButton[16].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Cruiser/2/1.png", 150, 150, 65, 65);
			enemyButton[17].SetIcon (ROOT_FOLDER + "Image/ActionPhase/Enemy/Cruiser/3/1.png", 150, 150, 65, 65);
			
			buttonPanel.Init (1000, ADS_PANEL_Y, 280, ADS_PANEL_H);
			exitButton.Init (1065, 635, TEXT_GENERIC_BACK, Exit);
			
			adsPanel.Init (ADS_PANEL_X, ADS_PANEL_Y, ADS_PANEL_W, ADS_PANEL_H);
			
			
			
			init = true;
		}
	}
	
	this.Update = function (deltaTime) {
		for (var i=0; i<10; i++) {
			turretButton[i].Update (deltaTime);
		}
		
		for (var i=0; i<enemyButton.length; i++) {
			enemyButton[i].Update (deltaTime);
		}
		
		if (designDrawH < DESIGN_AREA_H) {
			designDrawH += deltaTime * 0.5;
			if (designDrawH > DESIGN_AREA_H) designDrawH = DESIGN_AREA_H;
		}
		
		exitButton.Update (deltaTime);
		
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.DrawFast (g_context, splashImageHandle, 0, 0);
		
		selectPanel.Draw (g_context);
		infoPanel.Draw (g_context);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_TURRET, 50, 55, 400, PRIMARY_FONT, 16, true, false, "left", "middle", 4, 255, 255, 1);
		for (var i=0; i<10; i++) {
			turretButton[i].Draw (g_context);
		}
		g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_ENEMY, 50, 250, 400, PRIMARY_FONT, 16, true, false, "left", "middle", 4, 255, 255, 1);
		for (var i=0; i<enemyButton.length; i++) {
			enemyButton[i].Draw (g_context);
		}
		
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, DESIGN_AREA_X, DESIGN_AREA_Y, DESIGN_AREA_W, DESIGN_AREA_H);
		g_graphicEngine.DrawRect (g_context, DESIGN_AREA_X, DESIGN_AREA_Y, DESIGN_AREA_W, DESIGN_AREA_H, 2, 1, 255, 255, 1);
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, TEXT_AREA_X, TEXT_AREA_Y, TEXT_AREA_W, TEXT_AREA_H);
		g_graphicEngine.DrawRect (g_context, TEXT_AREA_X, TEXT_AREA_Y, TEXT_AREA_W, TEXT_AREA_H, 2, 1, 255, 255, 1);
		
		if (selectingCategory == 1) {
			g_graphicEngine.Draw (g_context, turretDesign[selectingIndex], 0, 0, DESIGN_AREA_W, designDrawH, DESIGN_AREA_X, DESIGN_AREA_Y, DESIGN_AREA_W, designDrawH);
			g_graphicEngine.DrawTextRGB (g_context, g_turretData[selectingIndex].m_name, TEXT_AREA_X + 10, TEXT_AREA_Y + 20, 400, PRIMARY_FONT, 16, true, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, g_turretData[selectingIndex].m_desc, TEXT_AREA_X + 10, TEXT_AREA_Y + 50, 360, SECONDARY_FONT, 15, false, false, "left", "middle", 4, 255, 255, 1, true);
		}
		else if (selectingCategory == 2) {
			g_graphicEngine.Draw (g_context, genericEnemyDesign, 0, 0, DESIGN_AREA_W, designDrawH, DESIGN_AREA_X, DESIGN_AREA_Y, DESIGN_AREA_W, designDrawH);
			
			var enemyIndex = 0;
			switch (selectingIndex) {
				case 1: enemyIndex = 11; break;
				case 2: enemyIndex = 12; break;
				case 3: enemyIndex = 13; break;
				case 4: enemyIndex = 14; break;
				case 5: enemyIndex = 15; break;
				
				case 6: enemyIndex = 21; break;
				case 7: enemyIndex = 22; break;
				case 8: enemyIndex = 23; break;
				case 9: enemyIndex = 24; break;
				case 10: enemyIndex = 25; break;
				
				case 11: enemyIndex = 31; break;
				case 12: enemyIndex = 32; break;
				case 13: enemyIndex = 33; break;
				case 14: enemyIndex = 34; break;
				case 15: enemyIndex = 35; break;
				
				case 16: enemyIndex = 41; break;
				case 17: enemyIndex = 42; break;
				case 18: enemyIndex = 43; break;
			}
			
			g_graphicEngine.DrawTextRGB (g_context, g_enemyData[enemyIndex].m_name, TEXT_AREA_X + 10, TEXT_AREA_Y + 20, 400, PRIMARY_FONT, 16, true, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, g_enemyData[enemyIndex].m_desc, TEXT_AREA_X + 10, TEXT_AREA_Y + 50, 360, SECONDARY_FONT, 15, false, false, "left", "middle", 4, 255, 255, 1, true);
			
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_SPECIFICATION, TEXT_AREA_X + 10, TEXT_AREA_Y + 150, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			var realHP = g_enemyData[enemyIndex].m_maxHP;
			if (enemyIndex < 40) {
				realHP = realHP + " / " + realHP * g_enemyTierHPMultilpier[1] + " / " + realHP * g_enemyTierHPMultilpier[2] + " / " + realHP * g_enemyTierHPMultilpier[3] + " / " + realHP * g_enemyTierHPMultilpier[4];
			}
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_HIT_POINT,TEXT_AREA_X + 10, TEXT_AREA_Y + 175, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, realHP, TEXT_AREA_X + 80, TEXT_AREA_Y + 175, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			var armorRank;
			if (g_enemyData[enemyIndex].m_armor < 0.01) armorRank = TEXT_INFO_ARMOUR_NONE;
			else if (g_enemyData[enemyIndex].m_armor < ARMOUR_DEF_LIGHT) armorRank = TEXT_INFO_ARMOUR_LIGHT;
			else if (g_enemyData[enemyIndex].m_armor < ARMOUR_DEF_HEAVY) armorRank = TEXT_INFO_ARMOUR_MEDIUM;
			else  armorRank = TEXT_INFO_ARMOUR_HEAVY;
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_ARMOUR, TEXT_AREA_X + 10, TEXT_AREA_Y + 200, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, ((g_enemyData[enemyIndex].m_armor * 100) >> 0) + "% - " + armorRank, TEXT_AREA_X + 80, TEXT_AREA_Y + 200, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			var speedRank;
			if (g_enemyData[enemyIndex].m_speed < SPEED_DEF_SLOW) speedRank = TEXT_INFO_SPEED_SLOW;
			else if (g_enemyData[enemyIndex].m_speed < SPEED_DEF_FAST) speedRank = TEXT_INFO_SPEED_MEDIUM;
			else  speedRank = TEXT_INFO_SPEED_FAST;
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_SPEED, TEXT_AREA_X + 10, TEXT_AREA_Y + 225, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, ((g_enemyData[enemyIndex].m_speed * 100) >> 0) + " - " + speedRank, TEXT_AREA_X + 80, TEXT_AREA_Y + 225, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			
			g_graphicEngine.DrawTextRGB (g_context, TEXT_INFO_DAMAGE, TEXT_AREA_X + 10, TEXT_AREA_Y + 250, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, g_enemyData[enemyIndex].m_damage, TEXT_AREA_X + 80, TEXT_AREA_Y + 250, 200, SECONDARY_FONT, 13, false, false, "left", "middle", 4, 255, 255, 1);
		}
		
		if (ENABLE_ADS == true) {
			adsPanel.Draw (g_context);
		}
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 1025, ADS_PANEL_Y + 25, 230, ADS_PANEL_H - 50);
		buttonPanel.Draw (g_context);
		exitButton.Draw (g_context);
	}
	
	
	var SelectTurret = function (index) {
		selectingCategory = 1;
		selectingIndex = index;
		designDrawH = 0;
	}
	
	var SelectEnemy = function (index) {
		selectingCategory = 2;
		selectingIndex = index;
		designDrawH = 0;
	}
	
	var Exit = function () {
		g_particleEngine.Clean();
		GoToMainMenu();
	}
}