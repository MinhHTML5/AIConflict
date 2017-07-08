function GSLoader () {
	var SPLASH_SHOW_TIME = 1000;
	var SPLASH_BLUR_ALPHA = 0.5;
	
	var PANEL_FADE_SPEED = 0.002;
	
	var STORY_PANEL_X = 340;
	var STORY_PANEL_Y = 0;
	var LOADING_PANEL_X = 340;
	var LOADING_PANEL_Y = 570;
	
	
	var STEP_LOAD_SPLASH = 0;
	var STEP_SHOW_SPLASH = 1;
	var STEP_LOAD_LOADER = 2;
	var STEP_FADE_LOADER = 3;
	var STEP_LOAD_DATA = 4;
	var STEP_LOAD_ADDITIONAL_API = 5;
	var STEP_LOAD_PROFILE = 6;
	var STEP_CLICK = 7;
	var STEP_FADE_OUT = 8;
	
	var splashImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Splash.jpg");
	
	var showingTime = 0;
	var panelAlpha = 0;
	var loadingProgress = 0;
	var step = STEP_LOAD_SPLASH;
	
	var storyPanel = null;
	var loadingPanel = null;
	var loadingProgressBar = null;
	
	
	var init = false;
	
	this.m_currentStep = 0;
	
	this.Init = function () {
		if (init == false) {
			init = true;
			g_graphicEngine.DrawTextRGB (g_context, "For font loading purpose", -99, -99, 500, PRIMARY_FONT, 13);
			g_graphicEngine.DrawTextRGB (g_context, "For font loading purpose", -99, -99, 500, SECONDARY_FONT, 13);
		}
	}
	
	this.Update = function (deltaTime) {
		if (step == STEP_LOAD_SPLASH) {
			if (g_graphicEngine.GetLoadingProgress() == 1) {
				step = STEP_SHOW_SPLASH;
				
				panelAlpha = 0;
				storyPanel = new GlassPanel();
				loadingPanel = new GlassPanel();
				loadingProgressBar = new GlassBar();
			}
		}
		else if (step == STEP_SHOW_SPLASH) {
			showingTime += deltaTime;
			if (showingTime > SPLASH_SHOW_TIME) {
				step = STEP_LOAD_LOADER;
			}
		}
		else if (step == STEP_LOAD_LOADER) {
			if (g_graphicEngine.GetLoadingProgress() == 1) {
				storyPanel.Init (STORY_PANEL_X, STORY_PANEL_Y, 600, 600);
				storyPanel.SetAlpha (0);
				
				loadingPanel.Init (LOADING_PANEL_X, LOADING_PANEL_Y, 600, 150);
				loadingPanel.SetAlpha (0);
				
				loadingProgressBar.Init (LOADING_PANEL_X + 50, LOADING_PANEL_Y + 80, 500);
				loadingProgressBar.SetAlpha (0);
				
				LoadAllState();
				
				step = STEP_FADE_LOADER;
			}
		}
		else if (step == STEP_FADE_LOADER) {
			panelAlpha += deltaTime * PANEL_FADE_SPEED;
			if (panelAlpha >= 1) {
				panelAlpha = 1;
				step = STEP_LOAD_DATA;
			}
			storyPanel.SetAlpha (panelAlpha);
			loadingPanel.SetAlpha (panelAlpha);
			loadingProgressBar.SetAlpha (panelAlpha);
		}
		else if (step == STEP_LOAD_DATA) {
			loadingProgress = g_soundManager.GetProgress() * 0.5 + g_graphicEngine.GetLoadingProgress() * 0.5;
			if (loadingProgress >= 1) {
				loadingProgress = 1;
				step = STEP_LOAD_ADDITIONAL_API;
			}
			loadingProgressBar.SetProgress (loadingProgress);
		}
		else if (step == STEP_LOAD_ADDITIONAL_API) {
			if (PLATFORM == "KONGREGATE") {
				if (kongregate != null) {
					g_profile.Load();
					step = STEP_LOAD_PROFILE;
				}
			}
			else {
				g_profile.Load();
				step = STEP_LOAD_PROFILE;
			}
		}
		else if (step == STEP_LOAD_PROFILE) {
			if (g_profile.hasOfficialData == true) {
				step = STEP_CLICK;
			}
		}
		else if (step == STEP_CLICK) {
			if (g_inputEngine.m_mousePress == true || g_inputEngine.m_touchX.length > 0) {
				step = STEP_FADE_OUT;
				
				if (PLATFORM == "ARMORGAME") {
					GoToIntro();
					g_inputEngine.m_mousePress = false;
				}
				else {
					GoToMainMenu();
				}
				
				if (PLATFORM == "KONGREGATE") {
					SubmitInit();
				}
			}
		}
		
		this.m_currentStep = step;
	}
	
	this.Draw = function () {
		if (step >= STEP_SHOW_SPLASH) {
			g_graphicEngine.DrawFast (g_context, splashImageHandle, 0, 0);
		}
		
		if (step >= STEP_FADE_LOADER) {
			g_graphicEngine.FillCanvas (g_context, 0, 0, 0, panelAlpha * SPLASH_BLUR_ALPHA);
			storyPanel.Draw (g_context);
			loadingPanel.Draw (g_context);
			loadingProgressBar.Draw (g_context);
			
			g_graphicEngine.DrawTextRGB (g_context, TEXT_LOADER_STORY, STORY_PANEL_X + 55, STORY_PANEL_Y + 45, 500, SECONDARY_FONT, 15, false, false, "left", "top", 4, 255, 255, panelAlpha, true);
			
			if (step < STEP_CLICK) {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_LOADER_LOADING, LOADING_PANEL_X + 55, LOADING_PANEL_Y + 50, 100, PRIMARY_FONT, 13, true, false, "left", "top", 4, 200, 200, panelAlpha);
				g_graphicEngine.DrawTextRGB (g_context, ((loadingProgress * 100) >> 0) + "%", LOADING_PANEL_X + 530, LOADING_PANEL_Y + 50, 100, PRIMARY_FONT, 13, true, false, "right", "top", 4, 200, 200, panelAlpha);
			}
			else {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_LOADER_CLICK, LOADING_PANEL_X + 55, LOADING_PANEL_Y + 50, 100, PRIMARY_FONT, 13, true, false, "left", "top", 4, 200, 200, panelAlpha);
			}
		}
	}
}