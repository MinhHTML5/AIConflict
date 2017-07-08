function GSUpgrade () {
	var EMITTER_MOVING_SPEED = 0.2;
	
	var instance = this;
	
	var upgradeTreePanel = new GlassPanel();
	var upgradeInfoPanel = new GlassPanel();
	var upgradeBuyTokenPanel = new GlassPanel();
	
	var resetButton = new GlassButton();
	var upgradeButton = new GlassButton();
	var buyIAPButton = new GlassButton();
	var exitButton = new GlassButton();
	
	
	var splashImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Splash.jpg");
	
	var init = false;
	var upgradeHoverX = 0;
	var upgradeHoverY = 0;
	var upgradeSelectX = 0;
	var upgradeSelectY = 0;
	
	
	var turretIcon = new Array();
	for (var i=0; i<8; i++) {
		turretIcon[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/TurretDesign/Small/Turret " + (i + 1) + ".png");
	}
	
	var lastMouseState = false;
	
	var emitterPhase = 0;
	var emitterOffset = 0;
	var emitter1 = null;
	var emitter2 = null;
	
	var checkIcon = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/UpgradeIcon/CheckIcon.png");
	
	
	var Reset = function () {
		for (var i=0; i<10; i++) {
			for (var j=0; j<3; j++) {
				if (g_profile.upgrade[i][j] == true) {
					g_profile.upgradePoint += g_upgradeData[i][j].price;
					g_profile.upgrade[i][j] = false;
				}
			}
		}
	}
	
	var Upgrade = function () {
		g_profile.upgradePoint -= g_upgradeData[upgradeSelectX][upgradeSelectY].price;
		g_profile.upgrade[upgradeSelectX][upgradeSelectY] = true;
		
		g_UISoundNode.PlayStartWave();
	}
	
	var GoToIAP = function () {
		GoToShop();
	}
	
	var Exit = function() {
		g_particleEngine.Clean();
		GoToMainMenu();
		g_profile.Save();
	}
	
	
	
	
	
	
	this.Init = function () {
		if (init == false) {
			upgradeTreePanel.Init (0, 0, 1280, 520);
			upgradeInfoPanel.Init (0, 500, 920, 220);
			upgradeBuyTokenPanel.Init (900, 500, 380, 220);
			
			resetButton.Init (570, 630, TEXT_GENERIC_RESET, Reset);
			upgradeButton.Init (730, 630, TEXT_GENERIC_UPGRADE, Upgrade);
			exitButton.Init (1090, 630, TEXT_GENERIC_BACK, Exit);
			buyIAPButton.Init (940, 630, TEXT_GENERIC_SHOP, GoToIAP);
			
			upgradeButton.m_enable = false;
			
			init = true;
		}
		
		emitter1 = this.CreateBlueEmitter();
		emitter2 = this.CreateBlueEmitter();
			
		emitterPhase = 0;
		upgradeSelectX = -1;
		upgradeSelectY = -1;
		lastMouseState = 0;
	}
	
	this.Update = function (deltaTime) {
		resetButton.Update (deltaTime);
		upgradeButton.Update (deltaTime);
		exitButton.Update (deltaTime);
		buyIAPButton.Update (deltaTime);
		
		var tempUpgradeHoverX = -1;
		var tempUpgradeHoverY = -1;
		
		if (g_inputEngine.m_mousePress == 0 && lastMouseState == 1) {
			upgradeSelectX = -1;
			upgradeSelectY = -1;
			upgradeButton.m_enable = false;
		}
		
		if (USE_TOUCH == false) {
			// Mouse =======================================
			for (var j=0; j<3; j++) {
				if (g_inputEngine.m_mouseY >= 170 + j * 100 && g_inputEngine.m_mouseY <= 170 + j * 100 + 90) {
					for (var i=0; i<10; i++) {
						if (g_inputEngine.m_mouseX >= 55 + i * 120 && g_inputEngine.m_mouseX <= 55 + i * 120 + 90) {
							if (upgradeHoverX != i || upgradeHoverY != j) {
								g_UISoundNode.PlayOver();
							}
							tempUpgradeHoverX = i;
							tempUpgradeHoverY = j;
							
							if (g_inputEngine.m_mousePress == 0 && lastMouseState == 1) {
								g_UISoundNode.PlayUp();
								
								upgradeSelectX = tempUpgradeHoverX;
								upgradeSelectY = tempUpgradeHoverY;
								if (g_upgradeData[upgradeSelectX][upgradeSelectY].price <= g_profile.upgradePoint && g_profile.upgrade[upgradeSelectX][upgradeSelectY] == false) {
									upgradeButton.m_enable = true;
								}
							}
							
							if (g_inputEngine.m_mousePress == 1 && lastMouseState == 0) {
								g_UISoundNode.PlayDown();
							}
							
							break;
						}
					}
				}
			}
			
			upgradeHoverX = tempUpgradeHoverX;
			upgradeHoverY = tempUpgradeHoverY;
		}
		else {
			// Touch =======================================
			if (g_inputEngine.m_touchX.length == 0) {
				if (upgradeHoverX != -1) {
					upgradeSelectX = upgradeHoverX;
					upgradeSelectY = upgradeHoverY;
					if (g_upgradeData[upgradeSelectX][upgradeSelectY].price <= g_profile.upgradePoint && g_profile.upgrade[upgradeSelectX][upgradeSelectY] == false)
						upgradeButton.m_enable = true;
					else
						upgradeButton.m_enable = false;
					
					g_UISoundNode.PlayUp();
				}
				else {
					upgradeSelectX = -1;
					upgradeSelectY = -1;
					upgradeButton.m_enable = false;
				}
			}
			else {
				var hit = false;
				for (var j=0; j<3; j++) {
					for (var i=0; i<10; i++) {
						if (g_inputEngine.m_touchY[0] >= 170 + j * 100 && g_inputEngine.m_touchY[0] <= 170 + j * 100 + 90
						&&  g_inputEngine.m_touchX[0] >= 55 + i * 120 && g_inputEngine.m_touchX[0] <= 55 + i * 120 + 90) {
							if (upgradeHoverX != i || upgradeHoverY != j) {
								g_UISoundNode.PlayDown();
							}
							upgradeHoverX = i;
							upgradeHoverY = j;
							
							hit = true;
							break;
						}
					}
				}
				
				if (hit == false) {
					upgradeHoverX = -1;
					upgradeHoverY = -1;
				}
			}
		}
		
		
		
		if (upgradeSelectX != -1) {
			g_graphicEngine.DrawRect (g_context, 55 + upgradeHoverX * 120, 170 + upgradeHoverY * 100, 90, 90, 2, 1, 255, 255, 1);
			emitterOffset += deltaTime * EMITTER_MOVING_SPEED;
			if (emitterOffset >= 90) {
				emitterOffset = 0;
				emitterPhase ++;
				if (emitterPhase >= 2) emitterPhase = 0;
			}
			
			if (emitterPhase == 0) {
				emitter1.m_x = 55 + upgradeSelectX * 120 + emitterOffset;
				emitter1.m_y = 170 + upgradeSelectY * 100;
				emitter2.m_x = 55 + upgradeSelectX * 120 + 90 - emitterOffset;
				emitter2.m_y = 170 + upgradeSelectY * 100 + 90;
			}
			else if (emitterPhase == 1) {
				emitter1.m_x = 55 + upgradeSelectX * 120 + 90;
				emitter1.m_y = 170 + upgradeSelectY * 100 + emitterOffset;
				emitter2.m_x = 55 + upgradeSelectX * 120;
				emitter2.m_y = 170 + upgradeSelectY * 100 + 90 - emitterOffset;
			}
		}
		else {
			emitter1.m_x = -100;
			emitter2.m_x = -100;
		}
		
		lastMouseState = g_inputEngine.m_mousePress;
		
		g_particleEngine.Update (deltaTime);
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.DrawFast (g_context, splashImageHandle, 0, 0);
		
		upgradeTreePanel.Draw (g_context);
		upgradeInfoPanel.Draw (g_context);
		upgradeBuyTokenPanel.Draw (g_context);
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 42, 40, 1195, 440);
		for (var i=0; i<8; i++) {
			g_graphicEngine.DrawFast (g_context, turretIcon[i], 42 + i * 120, 40);
			g_graphicEngine.DrawRect (g_context, 42 + i * 120, 40, 115, 440, 2, 1, 255, 255, 1);
			g_graphicEngine.DrawRect (g_context, 42 + i * 120, 40, 115, 115, 2, 1, 255, 255, 1);
		}
		
		g_graphicEngine.DrawRect (g_context, 42 + 8 * 120, 40, 235, 440, 2, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 42 + 8 * 120, 40, 235, 115, 2, 1, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_UPGRADE_BASE, 1120, 95, 400, PRIMARY_FONT, 16, true, false, "center", "middle", 4, 255, 255, 1);
		
		for (var i=0; i<10; i++) {
			for (var j=0; j<3; j++) {
				g_graphicEngine.DrawFast (g_context, g_upgradeData[i][j].image, 75 + i * 120, 190 + j * 100);
				if (g_profile.upgrade[i][j] == true) {
					g_graphicEngine.DrawRect (g_context, 55 + i * 120, 170 + j * 100, 90, 90, 2, 80, 255, 80, 1);
					g_graphicEngine.DrawFast (g_context, checkIcon, 55 + i * 120 + 60, 170 + j * 100 + 60);
					
				}
			}
		}
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 42, 580, 475, 100);
		g_graphicEngine.DrawRect (g_context, 42, 580, 475, 100, 2, 1, 255, 255, 1);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_UPGRADE_POINTS + g_profile.upgradePoint, 870, 550, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_UPGRADE_COST, 864, 580, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
		
		if (upgradeSelectX == -1) {
			if (upgradeHoverX > -1) {
				g_graphicEngine.DrawRect (g_context, 55 + upgradeHoverX * 120, 170 + upgradeHoverY * 100, 90, 90, 2, 1, 255, 255, 1);
				g_graphicEngine.DrawTextRGB (g_context, g_upgradeData[upgradeHoverX][upgradeHoverY].name, 42, 550, 400, PRIMARY_FONT, 16, true, false, "left", "middle", 4, 255, 255, 1);
				g_graphicEngine.DrawTextRGB (g_context, g_upgradeData[upgradeHoverX][upgradeHoverY].desc, 52, 595, 440, SECONDARY_FONT, 15, false, false, "left", "middle", 4, 255, 255, 1, true);
				g_graphicEngine.DrawTextRGB (g_context, g_upgradeData[upgradeHoverX][upgradeHoverY].price, 870, 580, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
				if (g_profile.upgrade[upgradeHoverX][upgradeHoverY] == true) {
					g_graphicEngine.DrawTextRGB (g_context, TEXT_UPGRADE_UGPRADED, 870, 610, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
					g_graphicEngine.DrawFast (g_context, checkIcon, 720, 595);
				}
			}
			else {
				g_graphicEngine.DrawTextRGB (g_context, "-", 870, 580, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
			}
		}
		else if (upgradeSelectX > -1) {
			if (upgradeHoverX > -1) {
				g_graphicEngine.DrawRect (g_context, 55 + upgradeHoverX * 120, 170 + upgradeHoverY * 100, 90, 90, 2, 1, 255, 255, 1);
			}
			g_graphicEngine.DrawTextRGB (g_context, g_upgradeData[upgradeSelectX][upgradeSelectY].name, 42, 550, 400, PRIMARY_FONT, 16, true, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, g_upgradeData[upgradeSelectX][upgradeSelectY].desc, 52, 595, 440, SECONDARY_FONT, 15, false, false, "left", "middle", 4, 255, 255, 1, true);
			g_graphicEngine.DrawTextRGB (g_context, g_upgradeData[upgradeSelectX][upgradeSelectY].price, 870, 580, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
			if (g_profile.upgrade[upgradeSelectX][upgradeSelectY] == true) {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_UPGRADE_UGPRADED, 870, 610, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
				g_graphicEngine.DrawFast (g_context, checkIcon, 720, 595);
			}
		}
		
		resetButton.Draw (g_context);
		upgradeButton.Draw (g_context);
		
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_UPGRADE_PURCHASE, 945, 550, 280, SECONDARY_FONT, 19, false, false, "left", "middle", 4, 255, 255, 1, true);
		exitButton.Draw (g_context);
		buyIAPButton.Draw (g_context);
		
		g_particleEngine.Draw (g_context);
	}
	
	
	
	
	
	
	this.CreateBlueEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/Particle/BlueParticle.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.002;
		particle.m_alpha = 1;
		particle.m_drawAdd = false;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 500;
		particle.m_drawAdd = true;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_emitForceMin = 0;
		emitter.m_emitForceMax = 0;
		emitter.m_randomizeScaleMin = 0.3;
		emitter.m_randomizeScaleMax = 0.3;
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 0;
		emitter.m_randomizeRotateSpeedMin = 0;
		emitter.m_randomizeRotateSpeedMax = 0;
		emitter.m_emitRate = 0.1;
		emitter.Start();
		
		return emitter;
	}
}