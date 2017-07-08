function GSShop () {
	var EMITTER_MOVING_SPEED = 0.2;
	
	var instance = this;
	var init = false;
	
	var splashImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Splash.jpg");
	var packImage = new Array()
	for (var i=0; i<4; i++) {
		packImage[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/Shop/Pack " + (i + 1) + ".png");
	}
	
	var mainPanel = new GlassPanel();
	var exitButton = new GlassButton();
	var purchaseButton = new Array();
	var buttonPanel = new GlassPanel();
	var adsPanel = new GlassPanel();
	
	var Exit = function() {
		GoToMainMenu();
		g_profile.Save();
	}
	
	var Purchase = function (param) {
		if (PLATFORM != "CLAY") {
			PushWait();
		}
		PurchaseUpgradePack (param);
	}
	
	
	this.PurchaseSuccess = function () {
		if (PLATFORM != "CLAY") {
			PopSubState();
		}
		SetAdsAlpha (1);
		g_UISoundNode.PlaySell();
		instance.RefreshPointDisplayed();
	}
	
	var pointSpent;
	var pointCur;
	var pointLeft;
	
	this.Init = function () {
		if (init == false) {
			mainPanel.Init (0, 0, 1280, 620);
			exitButton.Init (1065, 635, TEXT_GENERIC_BACK, Exit);
			
			purchaseButton[0] = new GlassButton();
			purchaseButton[1] = new GlassButton();
			purchaseButton[2] = new GlassButton();
			purchaseButton[3] = new GlassButton();
			
			if (PLATFORM == "KONGREGATE") {
				purchaseButton[0].Init (115, 430, "10 Kreds", Purchase, 1);
				purchaseButton[1].Init (415, 430, "18 Kreds", Purchase, 2);
				purchaseButton[2].Init (715, 430, "40 Kreds", Purchase, 3);
				purchaseButton[3].Init (1015, 430, "70 Kreds", Purchase, 4);
			}
			else {
				purchaseButton[0].Init (115, 430, "$0.99", Purchase, 1);
				purchaseButton[1].Init (415, 430, "$1.79", Purchase, 2);
				purchaseButton[2].Init (715, 430, "$3.99", Purchase, 3);
				purchaseButton[3].Init (1015, 430, "$6.99", Purchase, 4);
			}
			
			if (PLATFORM == "FREE" || (PLATFORM == "KONGREGATE" && KG_userID == 0)) {
				purchaseButton[0].m_enable = false;
				purchaseButton[1].m_enable = false;
				purchaseButton[2].m_enable = false;
				purchaseButton[3].m_enable = false;
			}
			
			buttonPanel.Init (1000, ADS_PANEL_Y, 280, ADS_PANEL_H);
			
			adsPanel.Init (ADS_PANEL_X, ADS_PANEL_Y, ADS_PANEL_W, ADS_PANEL_H);
			
			init = true;
		}
		
		this.RefreshPointDisplayed();
	}
	
	this.RefreshPointDisplayed = function () {
		pointCur = g_profile.upgradePoint;
		pointSpent = 0;
		for (var i=0; i<10; i++) {
			for (var j=0; j<3; j++) {
				if (g_profile.upgrade[i][j] == true) {
					pointSpent += g_upgradeData[i][j].price;
				}
			}
		}
		pointLeft = 100 - pointCur - pointSpent;
		if (pointLeft < 0) pointLeft = 0;
	}
	
	this.Update = function (deltaTime) {
		g_particleEngine.Update (deltaTime);
		g_soundManager.Update (deltaTime);
		
		exitButton.Update (deltaTime);
		for (var i=0; i<purchaseButton.length; i++) {
			purchaseButton[i].Update (deltaTime);
		}
	}
	
	this.Draw = function () {
		g_graphicEngine.DrawFast (g_context, splashImageHandle, 0, 0);
		mainPanel.Draw (g_context);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_PURCHASE_UP, 640, 65, 400, PRIMARY_FONT, 20, true, false, "center", "middle", 4, 255, 255, 1);
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 45, 100, 290, 400);
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 345, 100, 290, 400);
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 645, 100, 290, 400);
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 945, 100, 290, 400);
		
		
		g_graphicEngine.DrawRect (g_context, 45, 100, 290, 400, 2, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 345, 100, 290, 400, 2, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 645, 100, 290, 400, 2, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 945, 100, 290, 400, 2, 1, 255, 255, 1);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_PACK_1, 190, 130, 300, PRIMARY_FONT, 15, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_PACK_2, 490, 130, 300, PRIMARY_FONT, 15, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_PACK_3, 790, 130, 300, PRIMARY_FONT, 15, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_PACK_4, 1090, 130, 300, PRIMARY_FONT, 15, true, false, "center", "middle", 4, 255, 255, 1);
		
		for (var i=0; i<4; i++) {
			g_graphicEngine.DrawFast (g_context, packImage[i], 80 + i * 300, 140);
		}
		
		
		g_graphicEngine.DrawTextRGB (g_context, "10" + TEXT_SHOP_UPGRADE_POINTS, 190, 400, 300, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "20" + TEXT_SHOP_UPGRADE_POINTS, 490, 400, 300, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "50" + TEXT_SHOP_UPGRADE_POINTS, 790, 400, 300, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "100" + TEXT_SHOP_UPGRADE_POINTS, 1090, 400, 300, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);

		for (var i=0; i<purchaseButton.length; i++) {
			purchaseButton[i].Draw (g_context);
		}
		
		if (PLATFORM == "FREE") {
			g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_SORRY, 1240, 530, 780, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1, true);
		}
		else if (PLATFORM == "KONGREGATE" && KG_userID == 0) {
			g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_LOGIN, 1240, 530, 780, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1, true);
		}
		else {
			g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_SPENT, 50, 530, 300, SECONDARY_FONT, 19, false, false, "left", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_AVAILABLE, 50, 560, 300, SECONDARY_FONT, 19, false, false, "left", "middle", 4, 255, 255, 1);
			
			g_graphicEngine.DrawTextRGB (g_context, pointSpent, 320, 530, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
			g_graphicEngine.DrawTextRGB (g_context, pointCur, 320, 560, 300, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1);
			
			g_graphicEngine.DrawTextRGB (g_context, TEXT_SHOP_NEED + pointLeft + TEXT_SHOP_UPGRADE_POINTS, 1240, 530, 780, SECONDARY_FONT, 19, false, false, "right", "middle", 4, 255, 255, 1, true);
		}
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 1025, ADS_PANEL_Y + 25, 230, ADS_PANEL_H - 50);
		buttonPanel.Draw (g_context);
		exitButton.Draw (g_context);
		
		if (ENABLE_ADS == true) {
			adsPanel.Draw (g_context);
		}
	}
}