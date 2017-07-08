function GSSelectMission () {
	var MAP_BUTTON_W = 180;
	var MAP_BUTTON_H = 108;
	
	var instance = this;
	var splashImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Splash.jpg");
	var lockImageHandle = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/MissionLock.png");
	
	this.m_rendered = false;
	
	var init = false;
	var missionRendering = 0;
	
	var mainMenuPanel = new GlassPanel();
	var backButton = new GlassButton();
	var playButton = new GlassButton();
	
	var lastMouseState = 0;
	
	var missionOffset = 0;
	var missionHovering = 0;
	var missionSelecting = 1;
	var backGroundImage = new Array();
	var mapBufferCanvas = new Array();
	var mapBufferContext = new Array();
	
	var bigMapBufferCanvas = null;
	var bigMapBufferContext = null;
	
	var leftArrowButton = new IconButton();
	var rightArrowButton = new IconButton();
	
	this.Init = function () {
		if (init == false) {
			mainMenuPanel.Init (0, 0, 1280, 720);
			
			backButton.Init (35, 630, TEXT_GENERIC_BACK, Back);
			playButton.Init (1095, 630, TEXT_GENERIC_START, Play);
			
			leftArrowButton.Init (55, 505, ShiftLeft);
			leftArrowButton.SetIcon (ROOT_FOLDER + "Image/MainMenu/LeftArrow.png", 50, 50);
			rightArrowButton.Init (1145, 505, ShiftRight);
			rightArrowButton.SetIcon (ROOT_FOLDER + "Image/MainMenu/RightArrow.png", 50, 50);
			
			this.LoadMap();
			
			missionSelecting = 1;
			
			init = true;
		}
	}
	
	
	this.LoadMap = function () {
		for (var i=1; i<g_missionData.length; i++) {
			backGroundImage[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Background/" + g_missionData[i].background + ".jpg");
			
			mapBufferCanvas[i] = document.createElement("canvas");
			mapBufferCanvas[i].width  = MAP_BUTTON_W;
			mapBufferCanvas[i].height = MAP_BUTTON_W;
			mapBufferContext[i] = mapBufferCanvas[i].getContext("2d");
		}
		
		bigMapBufferCanvas = document.createElement("canvas");
		bigMapBufferCanvas.width  = BATTLE_FIELD_SIZE_W / 2;
		bigMapBufferCanvas.height = BATTLE_FIELD_SIZE_H / 2;
		bigMapBufferContext = bigMapBufferCanvas.getContext("2d");
	}
	
	
	this.RenderSingleMap = function (index) {
		var cameraInfo = new CameraPosition(0, 0, BATTLE_FIELD_SIZE_W, BATTLE_FIELD_SIZE_H);
		var map = new Map(BATTLE_FIELD_SIZE_W, BATTLE_FIELD_SIZE_H);
		map.Import(g_missionData[index].map);
		map.RenderField (false);
		map.SetCamera(cameraInfo);
		
		g_graphicEngine.Draw (bigMapBufferContext, backGroundImage[index], 0, 0, CANVAS_W, CANVAS_H, 0, 0, bigMapBufferCanvas.width, bigMapBufferCanvas.height);
		map.Draw(bigMapBufferContext, 0, 0, bigMapBufferCanvas.width, bigMapBufferCanvas.height);
	}
	
	this.RenderButtonUpdate = function () {
		if (this.m_rendered == false) {
			missionRendering ++;
			if (missionRendering < g_missionData.length) {
				this.RenderSingleMap (missionRendering);
				g_graphicEngine.CopyCanvas (mapBufferContext[missionRendering], bigMapBufferCanvas, 0, 0, bigMapBufferCanvas.width, bigMapBufferCanvas.height, 0, 0, MAP_BUTTON_W, MAP_BUTTON_H);
			}
			else {
				this.m_rendered = true;
			}
			return false;
		}
		else {
			missionSelecting = g_profile.progress;
			if (missionSelecting >= g_missionData.length) {
				missionSelecting = g_missionData.length - 1;
			}
			missionOffset = g_profile.progress - 3;
			if (missionOffset < 0) missionOffset = 0;
			if (missionOffset > g_missionData.length - 6) missionOffset = g_missionData.length - 6;
			
			this.RenderSingleMap (missionSelecting);
			return true;
		}
	}
	
	this.Update = function (deltaTime) {
		backButton.Update (deltaTime);
		playButton.Update (deltaTime);
		leftArrowButton.Update (deltaTime);
		rightArrowButton.Update (deltaTime);
		
		var tempMissionHovering = -1;
		if (USE_TOUCH == false) {
			// Mouse =======================================
			if (g_inputEngine.m_mouseY >= 490 && g_inputEngine.m_mouseY <= 598) {
				for (var i=0; i<5; i++) {
					if (g_inputEngine.m_mouseX >= 150 + i * 200 && g_inputEngine.m_mouseX <= 330 + i * 200) {
						if (missionHovering != i) {
							g_UISoundNode.PlayOver();
						}
							
						tempMissionHovering = i;
						
						if (g_inputEngine.m_mousePress == 0 && lastMouseState == 1) {
							g_UISoundNode.PlayUp();
							
							if (g_profile.progress >= i + missionOffset + 1) {
								if (missionSelecting != i + missionOffset + 1) {
									missionSelecting = i + missionOffset + 1;
									this.RenderSingleMap (missionSelecting);
								}
							}
						}
						if (g_inputEngine.m_mousePress == 1 && lastMouseState == 0) {
							g_UISoundNode.PlayDown();
						}
						
						break;
					}
				}
			}
			missionHovering = tempMissionHovering;
		}
		else {
			if (g_inputEngine.m_touchX.length == 0) {
				if (missionHovering != -1) {
					g_UISoundNode.PlayUp();
					
					if (g_profile.progress >= missionHovering + missionOffset + 1) {
						if (missionSelecting != missionHovering + missionOffset + 1) {
							missionSelecting = missionHovering + missionOffset + 1;
							this.RenderSingleMap (missionSelecting);
						}
					}
					
					missionHovering = -1;
				}
			}
			else {
				var hit = false;
				if (g_inputEngine.m_touchY[0] >= 490 && g_inputEngine.m_touchY[0] <= 598) {
					for (var i=0; i<5; i++) {
						if (g_inputEngine.m_touchX[0] >= 150 + i * 200 && g_inputEngine.m_touchX[0] <= 330 + i * 200) {
							missionHovering = i;
							g_UISoundNode.PlayDown();
							hit = true;
							break;
						}
					}
				}
				
				if (hit == false) {
					missionHovering = -1;
				}
			}
		}
		
		
		
		lastMouseState = g_inputEngine.m_mousePress;
		
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.DrawFast (g_context, splashImageHandle, 0, 0);
		
		mainMenuPanel.Draw (g_context);
		
		if (this.m_rendered == true) {
			g_graphicEngine.CopyCanvas (g_context, bigMapBufferCanvas, 0, 0, bigMapBufferCanvas.width, bigMapBufferCanvas.height, 540, 40, 700, 420);
			
			for (var i=0; i<5; i++) {
				g_graphicEngine.CopyCanvas (g_context, mapBufferCanvas[i + missionOffset + 1], 0, 0, MAP_BUTTON_W, MAP_BUTTON_H, 150 + i * 200, 490, MAP_BUTTON_W, MAP_BUTTON_H);
				g_graphicEngine.DrawRect (g_context, 150 + i * 200, 490, MAP_BUTTON_W, MAP_BUTTON_H, 1, 1, 255, 255, 1);
				
				if (g_profile.progress < i + missionOffset + 1) {
					g_graphicEngine.DrawFast (g_context, lockImageHandle, 150 + i * 200, 490);
				}
			}
		}
		
		if (missionHovering > -1) {
			g_graphicEngine.DrawRect (g_context, 145 + missionHovering * 200, 485, 190, 118, 1, 1, 255, 255, 1);
		}
		
		g_graphicEngine.FillCanvas (g_context, 1, 16, 20, 0.5, 40, 40, 490, 420);
		g_graphicEngine.DrawRect (g_context, 40, 40, 490, 420, 1, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 540, 40, 700, 420, 1, 1, 255, 255, 1);
		g_graphicEngine.DrawRect (g_context, 40, 470, 1200, 150, 1, 1, 255, 255, 1);
		
		g_graphicEngine.DrawTextRGB (g_context, g_missionData[missionSelecting].name, 280, 70, 400, SECONDARY_FONT, 25, true, false, "center", "middle", 4, 255, 255, 1);
		g_graphicEngine.DrawTextRGB (g_context, g_missionData[missionSelecting].desc, 60, 110, 450, SECONDARY_FONT, 15, false, false, "left", "middle", 4, 255, 255, 1, true);
		
		leftArrowButton.Draw (g_context);
		rightArrowButton.Draw (g_context);
		
		backButton.Draw (g_context);
		playButton.Draw (g_context);
	}
	
	
	function Back() {
		GoToMainMenu();
	}
	
	function Play() {
		GoToActionPhase(missionSelecting);
	}
	
	function ShiftLeft () {
		missionOffset -= 1;
		if (missionOffset < 0) missionOffset = 0;
	}
	function ShiftRight () {
		missionOffset += 1;
		if (missionOffset > g_missionData.length - 6) missionOffset = g_missionData.length - 6;
	}
}