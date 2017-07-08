function GSTutorial () {
	var instance = this;
	var init = false;
	
	var PANEL_X = 190;
	var PANEL_Y = 35;
	var PANEL_W = 900;
	var PANEL_H = 650;
	
	var mainPanel = new GlassPanel();
	
	var leftArrowButton = new IconButton();
	var rightArrowButton = new IconButton();
	var backButton = new GlassButton();
	
	var waitIcon = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/WaitIcon/Wait.png");
	var waitAngle = 0;
	
	var imageArray = new Array();
	for (var i=0; i<9; i++) {
		imageArray[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/Tutorial/" + (i + 1) + ".jpg");
	}
	
	var page = 0;
	
	this.Init = function () {
		if (init == false) {
			mainPanel.Init (PANEL_X, PANEL_Y, PANEL_W, PANEL_H);
			
			leftArrowButton.Init (PANEL_X + 35, 570, ShiftLeft);
			leftArrowButton.SetIcon (ROOT_FOLDER + "Image/MainMenu/LeftArrow.png", 50, 50);
			rightArrowButton.Init (PANEL_X + 787, 570, ShiftRight);
			rightArrowButton.SetIcon (ROOT_FOLDER + "Image/MainMenu/RightArrow.png", 50, 50);
			
			backButton.Init (565, 595, TEXT_GENERIC_BACK, Close);
			
			init = true;
		}
		
	}
	
	this.Update = function (deltaTime) {
		waitAngle += deltaTime * 0.05;
		if (waitAngle >= 360) waitAngle -= 360;
		
		leftArrowButton.Update (deltaTime);
		rightArrowButton.Update (deltaTime);
		backButton.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.FillCanvas (g_context, 35, 70, 76, 0.7);
		
		mainPanel.Draw (g_context);
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, PANEL_X + 40, PANEL_Y + 40, 820, 470);
		g_graphicEngine.DrawRect (g_context, PANEL_X + 40, PANEL_Y + 40, 820, 470, 2, 1, 255, 255, 1);
		g_graphicEngine.Draw (g_context, waitIcon, 0, 0, 128, 128, PANEL_X + 385, PANEL_Y + 180, 128, 128, 1, false, false, waitAngle);
		g_graphicEngine.DrawTextRGB (g_context, TEXT_LOADER_LOADING, PANEL_X + PANEL_W * 0.5, PANEL_Y + 350, PANEL_W, PRIMARY_FONT, 18, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawFast (g_context, imageArray[page], PANEL_X + 50, PANEL_Y + 50);
		
		
		g_graphicEngine.DrawTextRGB (g_context, (page + 1) + " / " + imageArray.length, PANEL_X + PANEL_W * 0.5, PANEL_Y + 535, PANEL_W, PRIMARY_FONT, 18, true, false, "center", "middle", 4, 255, 255, 1);
		
		leftArrowButton.Draw (g_context);
		rightArrowButton.Draw (g_context);
		backButton.Draw (g_context);
		
	}
	
	
	var ShiftLeft = function () {
		if (page > 0) page--;
	}
	var ShiftRight = function () {
		if (page < imageArray.length - 1) page ++;
	}
	
	var Close = function () {
		PopSubState();
	}
}