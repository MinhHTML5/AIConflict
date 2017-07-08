function GlassBar () {
	var BLOCK_SIZE = 25;
	
	var imgBGL = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/BG-Left.png");
	var imgBGR = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/BG-Right.png");
	var imgBGM = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/BG-Mid.png");
	
	var imgFGL = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/FG-Left.png");
	var imgFGR = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/FG-Right.png");
	var imgFGM = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/FG-Mid.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_w = 0;
	this.m_alpha = 0;
	
	this.m_progress = 0;
	
	this.Init = function (x, y, w) {
		this.m_x = x;
		this.m_y = y;
		this.m_w = w;
		
		this.m_alpha = 1;
	}
	
	this.SetPosition = function (x, y) {
		this.m_x = x;
		this.m_y = y;
	}
	
	this.SetAlpha = function (alpha) {
		this.m_alpha = alpha;
	}
	
	this.SetProgress = function (progress) {
		if (progress > 1) progress = 1;
		if (progress < 0) progress = 0;
		
		this.m_progress = progress;
	}
	
	this.Draw = function (context) {
		// Background
		g_graphicEngine.Draw (context, imgBGL, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x, this.m_y, BLOCK_SIZE, BLOCK_SIZE, this.m_alpha);
		g_graphicEngine.Draw (context, imgBGM, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x + BLOCK_SIZE, this.m_y, this.m_w - 2 * BLOCK_SIZE, BLOCK_SIZE, this.m_alpha);
		g_graphicEngine.Draw (context, imgBGR, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x + this.m_w - BLOCK_SIZE, this.m_y, BLOCK_SIZE, BLOCK_SIZE, this.m_alpha);
		
		// Foreground
		var fgWidth = this.m_progress * this.m_w;
		if (fgWidth < BLOCK_SIZE * 2) fgWidth = BLOCK_SIZE * 2;
		g_graphicEngine.Draw (context, imgFGL, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x, this.m_y, BLOCK_SIZE, BLOCK_SIZE, this.m_alpha);
		g_graphicEngine.Draw (context, imgFGR, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x + fgWidth - BLOCK_SIZE, this.m_y, BLOCK_SIZE, BLOCK_SIZE, this.m_alpha);
		if (fgWidth > BLOCK_SIZE * 2) {
			g_graphicEngine.Draw (context, imgFGM, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x + BLOCK_SIZE, this.m_y, fgWidth - 2 * BLOCK_SIZE, BLOCK_SIZE, this.m_alpha);
		}
	}
}