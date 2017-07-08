function GSWait () {
	var instance = this;
	var init = false;
	
	var PANEL_X = 440;
	var PANEL_Y = 100;
	var PANEL_W = 400;
	var PANEL_H = 300;
	
	var mainPanel = new GlassPanel();
	
	var waitIcon = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/WaitIcon/Wait.png");
	var waitAngle = 0;
	
	this.m_jumpToMissionSelect = false;
	
	this.Init = function () {
		if (init == false) {
			mainPanel.Init (PANEL_X, PANEL_Y, PANEL_W, PANEL_H);
			init = true;
		}
	}
	
	this.Update = function (deltaTime) {
		waitAngle += deltaTime * 0.05;
		if (waitAngle >= 360) waitAngle -= 360;
		
		if (this.m_jumpToMissionSelect == true) {
			var done = g_gsMissionSelect.RenderButtonUpdate();
			if (done) {
				this.m_jumpToMissionSelect = false;
				PopSubState();
				g_stateEngine.SwitchState (g_gsMissionSelect, 1);
			}
		}
		
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.FillCanvas (g_context, 35, 70, 76, 0.7);
		mainPanel.Draw (g_context);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_WAIT_PLEASE, PANEL_X + PANEL_W * 0.5, PANEL_Y + 60, PANEL_W, PRIMARY_FONT, 18, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.Draw (g_context, waitIcon, 0, 0, 128, 128, PANEL_X + 136, PANEL_Y + 110, 128, 128, 1, false, false, waitAngle);
	}
}