function GSCredit () {
	var instance = this;
	var init = false;
	
	var splashImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Splash.jpg");
	
	var adsPanel = new GlassPanel();
	var mainPanel = new GlassPanel();
	var buttonPanel = new GlassPanel();
	
	var exitButton = new GlassButton();
	
	var Exit = function() {
		GoToMainMenu();
	}
	this.Init = function () {
		if (init == false) {
			mainPanel.Init (0, 0, 1280, 620);
			adsPanel.Init (ADS_PANEL_X, ADS_PANEL_Y, ADS_PANEL_W, ADS_PANEL_H);
			buttonPanel.Init (1000, ADS_PANEL_Y, 280, ADS_PANEL_H);
			
			exitButton.Init (1065, 635, "Exit", Exit);
			
			init = true;
		}
	}
	this.Update = function (deltaTime) {
		g_soundManager.Update (deltaTime);
		
		exitButton.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.DrawFast (g_context, splashImageHandle, 0, 0);
		mainPanel.Draw (g_context);
		buttonPanel.Draw (g_context);
		
		exitButton.Draw (g_context);
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 45, 45, 800, 530);
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 865, 45, 370, 530);
		
		g_graphicEngine.DrawRect (g_context, 45, 45, 800, 530, 2, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 865, 45, 370, 530, 2, 1, 255, 255, 1);
		
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_CREDIT_AFTERMATH, 445, 70, 800, PRIMARY_FONT, 15, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_CREDIT_STORY, 55, 120, 780, SECONDARY_FONT, 15, false, false, "left", "middle", 4, 255, 255, 1, true);
		
		
		
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_CREDIT_PROGRAMMER, 1050, 70, 370, PRIMARY_FONT, 15, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Hoang Tuan Minh", 1050, 100, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_CREDIT_GRAPHIC_DESIGNER, 1050, 170, 370, PRIMARY_FONT, 15, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Do Tuan Anh", 1050, 200, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Hoang Tuan Minh", 1050, 230, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_CREDIT_SOUND_DESIGNER, 1050, 300, 370, PRIMARY_FONT, 15, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Hoang Tuan Minh", 1050, 330, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_CREDIT_GAME_DESIGNER, 1050, 400, 370, PRIMARY_FONT, 15, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Nguyen Huu Long", 1050, 430, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Pham Thanh Nam", 1050, 460, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, "Hoang Tuan Minh", 1050, 490, 370, SECONDARY_FONT, 19, false, false, "center", "middle", 4, 255, 255, 1);
		
		if (ENABLE_ADS == true) {
			adsPanel.Draw (g_context);
		}
	}
}