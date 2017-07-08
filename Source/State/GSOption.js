function GSOption () {
	var instance = this;
	var init = false;
	
	var PANEL_X = 440;
	var PANEL_Y = 100;
	var PANEL_W = 400;
	var PANEL_H = 500;
	
	var mainPanel = new GlassPanel();
	
	var sfxScroll = new GlassScroll();
	var musicScroll = new GlassScroll();
	var uiScroll = new GlassScroll();
	
	var tempSFXVol;
	var tempMusicVol;
	var tempUIVol;
	
	var saveButton = new GlassButton();
	var cancelButton = new GlassButton();
	
	this.Init = function () {
		if (init == false) {
			mainPanel.Init (PANEL_X, PANEL_Y, PANEL_W, PANEL_H);
			sfxScroll.Init (PANEL_X + 50, PANEL_Y + 100, PANEL_W - 100, AdjustSFX);
			musicScroll.Init (PANEL_X + 50, PANEL_Y + 200, PANEL_W - 100, AdjustMusic);
			uiScroll.Init (PANEL_X + 50, PANEL_Y + 300, PANEL_W - 100, AdjustUI);
			
			saveButton.Init (PANEL_X + 50, PANEL_Y + 400, TEXT_GENERIC_SAVE, Save);
			cancelButton.Init (PANEL_X + 200, PANEL_Y + 400, TEXT_GENERIC_CANCEL, Cancel);
			
			init = true;
		}
		
		tempSFXVol = g_profile.sfxVol;
		tempMusicVol = g_profile.musicVol;
		tempUIVol = g_profile.uiVol;
		
		sfxScroll.SetProgress (g_profile.sfxVol);
		musicScroll.SetProgress (g_profile.musicVol);
		uiScroll.SetProgress (g_profile.uiVol);
	}
	
	this.Update = function (deltaTime) {
		sfxScroll.Update (deltaTime);
		musicScroll.Update (deltaTime);
		uiScroll.Update (deltaTime);
		
		saveButton.Update (deltaTime);
		cancelButton.Update (deltaTime);
		
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.FillCanvas (g_context, 35, 70, 76, 0.7);
		
		mainPanel.Draw (g_context);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_OPTION_SFX, PANEL_X + PANEL_W * 0.5, PANEL_Y + 80, PANEL_W, PRIMARY_FONT, 16, true, false, "center", "middle", 4, 255, 255, 1);
		sfxScroll.Draw (g_context);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_OPTION_MUSIC, PANEL_X + PANEL_W * 0.5, PANEL_Y + 180, PANEL_W, PRIMARY_FONT, 16, true, false, "center", "middle", 4, 255, 255, 1);
		musicScroll.Draw (g_context);
		
		g_graphicEngine.DrawTextRGB (g_context, TEXT_OPTION_INTERFACE, PANEL_X + PANEL_W * 0.5, PANEL_Y + 280, PANEL_W, PRIMARY_FONT, 16, true, false, "center", "middle", 4, 255, 255, 1);
		uiScroll.Draw (g_context);
		
		saveButton.Draw (g_context);
		cancelButton.Draw (g_context);
	}
	
	
	var AdjustSFX = function (vol) {
		if (vol < 0) vol = 0;
		if (vol > 1) vol = 1;
		if (vol == null) vol = 0;
		tempSFXVol = vol;
		g_soundManager.SetVolume (tempSFXVol, tempMusicVol, tempUIVol);
	}
	var AdjustMusic = function (vol) {
		if (vol < 0) vol = 0;
		if (vol > 1) vol = 1;
		if (vol == null) vol = 0;
		tempMusicVol = vol;
		g_soundManager.SetVolume (tempSFXVol, tempMusicVol, tempUIVol);
	}
	var AdjustUI = function (vol) {
		if (vol < 0) vol = 0;
		if (vol > 1) vol = 1;
		if (vol == null) vol = 0;
		tempUIVol = vol;
		g_soundManager.SetVolume (tempSFXVol, tempMusicVol, tempUIVol);
	}
	
	var Save = function () {
		g_profile.sfxVol = tempSFXVol;
		g_profile.musicVol = tempMusicVol;
		g_profile.uiVol = tempUIVol;
		
		g_profile.Save();
		
		PopSubState();
	}
	
	var Cancel = function () {
		g_soundManager.SetVolume (g_profile.sfxVol, g_profile.musicVol, g_profile.uiVol);
		PopSubState();
	}
}