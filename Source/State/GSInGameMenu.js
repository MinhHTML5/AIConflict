function GSInGameMenu () {
	var instance = this;
	var init = false;
	
	var resultPanelX = 250;
	var resultPanelY = 150;
	var resultPanelW = 480;
	var resultPanelH = 390;

	var mainPanelX = 490;
	var mainPanelY = 150;
	var mainPanelW = 300;
	var mainPanelH = 390;
	
	var resultPanel = new GlassPanel();
	var mainPanel = new GlassPanel();
	var cheatPanel = new GlassPanel();
	
	var menuResumeButton = new GlassSquareButton();
	var menuRetryWaveButton = new GlassSquareButton();
	var menuRetryGameButton = new GlassSquareButton();
	var menuHelpButton = new GlassSquareButton();
	var menuOptionButton = new GlassSquareButton();
	var menuQuitButton = new GlassSquareButton();
	
	var cheatPerfectWinButton = new GlassSquareButton();
	var cheatNormalWinButton = new GlassSquareButton();
	var cheatKillAllButton = new GlassSquareButton();
	var cheatLoseButton = new GlassSquareButton();
	
	var dialogueType = 0;
	var structureScore = 0;
	var economicScore = 0;
	var performanceScore = 0;
	var totalScore = 0;
	var bestScore = 0;
	var perfect = false;
	var reward = 0;
	
	this.Init = function () {
		if (init == false) {
			resultPanel.Init(resultPanelX, resultPanelY, resultPanelW, resultPanelH);
			mainPanel.Init(mainPanelX, mainPanelY, mainPanelW, mainPanelH);
			
			menuRetryWaveButton.Init (mainPanelX + 50, mainPanelY + 50, TEXT_IG_MENU_RESTART_WAVE, MenuRetryWaveCallback, null, 200);
			menuRetryGameButton.Init (mainPanelX + 50, mainPanelY + 100, TEXT_IG_MENU_RESTART_MISSION, MenuRetryGameCallback, null, 200);
			menuQuitButton.Init (mainPanelX + 50, mainPanelY + 150, TEXT_IG_MENU_ABORT_MISSION, MenuQuitCallback, null, 200);
			
			menuHelpButton.Init (mainPanelX + 50, mainPanelY + 200, TEXT_GENERIC_HELP, MenuHelpCallback, null, 200);
			menuOptionButton.Init (mainPanelX + 50, mainPanelY + 250, TEXT_GENERIC_OPTION, MenuOptionCallback, null, 200);
			
			menuResumeButton.Init (mainPanelX + 50, mainPanelY + 300, TEXT_IG_MENU_RESUME_MISSION, MenuResumeCallback, null, 200);
			
			
			if (PLATFORM == "TEST") {
				cheatPanel.Init(1000, 250, 300, 290);
				cheatPerfectWinButton.Init (1050, mainPanelY + 150, "Cheat Perfect Win", CheatPerfectWin, null, 200);
				cheatNormalWinButton.Init (1050, mainPanelY + 200, "Cheat Normal Win", CheatNormalWin, null, 200);
				cheatKillAllButton.Init (1050, mainPanelY + 250, "Cheat Kill All", CheatKillAll, null, 200);
				cheatLoseButton.Init (1050, mainPanelY + 300, "Cheat Lose", CheatLose, null, 200);
			}
			
			init = true;
		}
	}
	
	this.Update = function (deltaTime) {
		menuResumeButton.HandleInput ();
		menuRetryWaveButton.HandleInput ();
		menuRetryGameButton.HandleInput ();
		menuHelpButton.HandleInput ();
		menuOptionButton.HandleInput ();
		menuQuitButton.HandleInput ();
		
		if (PLATFORM == "TEST" && dialogueType <= 1) {
			cheatPerfectWinButton.HandleInput ();
			cheatNormalWinButton.HandleInput ();
			cheatKillAllButton.HandleInput ();
			cheatLoseButton.HandleInput ();
		}
		
		g_soundManager.Update (deltaTime);
	}
	
	this.Draw = function () {
		g_graphicEngine.FillCanvas (g_context, 35, 70, 76, 0.7);
		
		mainPanel.Draw (g_context);
		
		if (dialogueType == 0 || dialogueType == 1) {
			
		}
		else if (dialogueType == 2 || dialogueType == 4) {
			resultPanel.Draw (g_context);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_VICTORY, resultPanelX + resultPanelW * 0.5, resultPanelY + 65, mainPanelW, PRIMARY_FONT, 20, true, false, "center", "middle", 4, 255, 255, 1);
		}
		else if (dialogueType == 3) {
			resultPanel.Draw (g_context);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_DEFEAT, resultPanelX + resultPanelW * 0.5, resultPanelY + 65, mainPanelW, PRIMARY_FONT, 20, true, false, "center", "middle", 4, 255, 255, 1);
		}
		
		if (dialogueType == 2 || dialogueType == 3 || dialogueType == 4) {
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_STRUCTURE_SCORE, resultPanelX + 60, resultPanelY + 110, mainPanelW, PRIMARY_FONT, 10, false, false, "left", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_ECONOMIC_SCORE, resultPanelX + 60, resultPanelY + 140, mainPanelW, PRIMARY_FONT, 10, false, false, "left", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_PERFORM_SCORE, resultPanelX + 60, resultPanelY + 170, mainPanelW, PRIMARY_FONT, 10, false, false, "left", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_TOTAL_SCORE, resultPanelX + 60, resultPanelY + 220, mainPanelW, PRIMARY_FONT, 10, false, false, "left", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_BEST_SCORE, resultPanelX + 60, resultPanelY + 250, mainPanelW, PRIMARY_FONT, 10, false, false, "left", "middle", 4, 200, 200, 1);
			
			g_graphicEngine.DrawTextRGB (g_context, structureScore, resultPanelX + 400, resultPanelY + 110, mainPanelW, PRIMARY_FONT, 10, false, false, "right", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, economicScore, resultPanelX + 400, resultPanelY + 140, mainPanelW, PRIMARY_FONT, 10, false, false, "right", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, performanceScore, resultPanelX + 400, resultPanelY + 170, mainPanelW, PRIMARY_FONT, 10, false, false, "right", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, totalScore, resultPanelX + 400, resultPanelY + 220, mainPanelW, PRIMARY_FONT, 10, false, false, "right", "middle", 4, 200, 200, 1);
			g_graphicEngine.DrawTextRGB (g_context, bestScore, resultPanelX + 400, resultPanelY + 250, mainPanelW, PRIMARY_FONT, 10, false, false, "right", "middle", 4, 200, 200, 1);
			
			if (totalScore > bestScore) {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_NEW_RECORD, resultPanelX + 400, resultPanelY + 300, mainPanelW, PRIMARY_FONT, 12, false, false, "right", "middle", 4, 200, 200, 1);
			}
			if (perfect) {
				g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_PERFECT, resultPanelX + 60, resultPanelY + 300, mainPanelW, PRIMARY_FONT, 12, false, false, "left", "middle", 4, 200, 200, 1);
			}
			
			if (reward > 0) {
			
				g_graphicEngine.DrawTextRGB (g_context, TEXT_IG_MENU_POINT_EARN, resultPanelX + 60, resultPanelY + 340, mainPanelW, PRIMARY_FONT, 10, false, false, "left", "middle", 4, 200, 200, 1);
				g_graphicEngine.DrawTextRGB (g_context, reward, resultPanelX + 400, resultPanelY + 340, mainPanelW, PRIMARY_FONT, 10, false, false, "right", "middle", 4, 200, 200, 1);
			}
		}
			
		menuResumeButton.Draw (g_context);
		menuRetryWaveButton.Draw (g_context);
		menuRetryGameButton.Draw (g_context);
		menuQuitButton.Draw (g_context);
		menuHelpButton.Draw (g_context);
		menuOptionButton.Draw (g_context);
		
		if (PLATFORM == "TEST" && dialogueType <= 1) {
			cheatPanel.Draw (g_context);
			cheatPerfectWinButton.Draw (g_context);
			cheatNormalWinButton.Draw (g_context);
			cheatKillAllButton.Draw (g_context);
			cheatLoseButton.Draw (g_context);
		}
	}
	
	
	this.SetData = function (type, sc, ec, pc, bc, pf, rw) {
		switch (type) {
			case 0:
				menuResumeButton.m_enable = true;
				menuRetryWaveButton.m_enable = false;
				menuRetryGameButton.m_enable = true;
				menuQuitButton.m_enable = true;
				menuQuitButton.SetCaption (TEXT_IG_MENU_ABORT_MISSION);
				mainPanelX = 490;
				break;
			case 1:
				menuResumeButton.m_enable = true;
				menuRetryWaveButton.m_enable = true;
				menuRetryGameButton.m_enable = true;
				menuQuitButton.m_enable = true;
				menuQuitButton.SetCaption (TEXT_IG_MENU_ABORT_MISSION);
				mainPanelX = 490;
				break;
			case 2:
				menuResumeButton.m_enable = false;
				menuRetryWaveButton.m_enable = true;
				menuRetryGameButton.m_enable = true;
				menuQuitButton.m_enable = true;
				menuQuitButton.SetCaption (TEXT_IG_MENU_NEXT_MISSION);
				mainPanelX = 700;
				break;
			case 3:
				menuResumeButton.m_enable = false;
				menuRetryWaveButton.m_enable = true;
				menuRetryGameButton.m_enable = true;
				menuQuitButton.m_enable = true;
				menuQuitButton.SetCaption (TEXT_IG_MENU_LEAVE_MISSION);
				mainPanelX = 700;
				break;
			case 4:
				menuResumeButton.m_enable = false;
				menuRetryWaveButton.m_enable = true;
				menuRetryGameButton.m_enable = true;
				menuQuitButton.m_enable = true;
				menuQuitButton.SetCaption (TEXT_IG_MENU_AFTERMATH);
				mainPanelX = 700;
				break;
		}
		
		
		mainPanel.SetPosition(mainPanelX, mainPanelY);
		menuRetryWaveButton.SetPosition (mainPanelX + 50, mainPanelY + 50);
		menuRetryGameButton.SetPosition (mainPanelX + 50, mainPanelY + 100);
		menuQuitButton.SetPosition (mainPanelX + 50, mainPanelY + 150);
		menuHelpButton.SetPosition (mainPanelX + 50, mainPanelY + 200);
		menuOptionButton.SetPosition (mainPanelX + 50, mainPanelY + 250);
		menuResumeButton.SetPosition (mainPanelX + 50, mainPanelY + 300);
		
		dialogueType = type;
		
		
		if (dialogueType == 2 || dialogueType == 3 || dialogueType == 4) {
			structureScore = sc;
			economicScore = ec;
			performanceScore = pc;
			bestScore = bc;
			perfect = pf;
			reward = rw;
			
			totalScore = structureScore + economicScore + performanceScore;
		}
	}
	
	
	function MenuResumeCallback () {
		g_stateEngine.PopState();
	}
	function MenuRetryWaveCallback () {
		g_gsActionPhase.RetryWave ();
		g_stateEngine.PopState();
		g_particleEngine.Clean();
	}
	function MenuRetryGameCallback () {
		g_gsActionPhase.RestartMission ();
		g_stateEngine.PopState();
		g_particleEngine.Clean();
	}
	function MenuQuitCallback () {
		g_particleEngine.Clean();
		g_stateEngine.PopState();
		
		if (dialogueType == 4) {
			GoToCredit();
		}
		else {
			GoToMissionSelect();
			g_ambientMusicNode.Stop();
			g_actionMusicNode.Stop();
		}
		
		
	}
	function MenuHelpCallback () {
		g_stateEngine.PopState();
		PushTutorial();
	}
	function MenuOptionCallback () {
		PushOption();
	}
	
	
	
	function CheatPerfectWin () {
		if (PLATFORM == "TEST") {
			g_stateEngine.PopState();
			g_gsActionPhase.FinishMission(1);
		}
	}
	function CheatNormalWin () {
		if (PLATFORM == "TEST") {
			g_stateEngine.PopState();
			g_gsActionPhase.FinishMission(2);
		}
	}
	function CheatKillAll () {
		if (PLATFORM == "TEST") {
			g_stateEngine.PopState();
			g_gsActionPhase.m_battle.CheatKillAll();
		}
	}
	function CheatLose () {
		if (PLATFORM == "TEST") {
			g_stateEngine.PopState();
			g_gsActionPhase.Defeated();
		}
	}
}