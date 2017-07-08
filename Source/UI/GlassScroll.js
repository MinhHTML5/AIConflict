function GlassScroll () {
	var BLEND_SPEED = 0.003;
	var BLOCK_WIDTH = 20;
	var BLOCK_HEIGHT = 28;
	
	var imgLN = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/LeftN.png");
	var imgRN = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/RightN.png");
	var imgMN = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/MidN.png");
	
	var imgLO = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/LeftO.png");
	var imgRO = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/RightO.png");
	var imgMO = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/MidO.png");
	
	var imgLI = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/LeftI.png");
	var imgRI = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/RightI.png");
	var imgMI = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/MidI.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_w = 0;
	this.m_alpha = 0;
	
	this.m_progress = 0;
	this.m_enable = true;
	this.m_callback = null;
	
	var m_canvasN = null;
	var m_contextN = null;
	var m_canvasO = null;
	var m_contextO = null;
	var m_canvasI = null;
	var m_contextI = null;
	
	var topAlpha = 0;
	
	this.Init = function (x, y, w, callback) {
		this.m_x = x;
		this.m_y = y;
		this.m_w = w;
		
		this.m_alpha = 1;
		
		m_canvasN = document.createElement("canvas");
		m_canvasN.width  = this.m_w;
		m_canvasN.height = BLOCK_HEIGHT;
		m_contextN = m_canvasN.getContext("2d");
		
		g_graphicEngine.Draw (m_contextN, imgLN, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 1);
		g_graphicEngine.Draw (m_contextN, imgRN, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, this.m_w - BLOCK_WIDTH, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 1);
		g_graphicEngine.Draw (m_contextN, imgMN, 0, 0, 1, BLOCK_HEIGHT, BLOCK_WIDTH, 0, this.m_w - BLOCK_WIDTH * 2, BLOCK_HEIGHT, 1);
		
		m_canvasO = document.createElement("canvas");
		m_canvasO.width  = this.m_w;
		m_canvasO.height = BLOCK_HEIGHT;
		m_contextO = m_canvasO.getContext("2d");
		
		g_graphicEngine.Draw (m_contextO, imgLO, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 1);
		g_graphicEngine.Draw (m_contextO, imgRO, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, this.m_w - BLOCK_WIDTH, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 1);
		g_graphicEngine.Draw (m_contextO, imgMO, 0, 0, 1, BLOCK_HEIGHT, BLOCK_WIDTH, 0, this.m_w - BLOCK_WIDTH * 2, BLOCK_HEIGHT, 1);
		
		m_canvasI = document.createElement("canvas");
		m_canvasI.width  = this.m_w;
		m_canvasI.height = BLOCK_HEIGHT;
		m_contextI = m_canvasI.getContext("2d");
		
		g_graphicEngine.Draw (m_contextI, imgLI, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 1);
		g_graphicEngine.Draw (m_contextI, imgRI, 0, 0, BLOCK_WIDTH, BLOCK_HEIGHT, this.m_w - BLOCK_WIDTH, 0, BLOCK_WIDTH, BLOCK_HEIGHT, 1);
		g_graphicEngine.Draw (m_contextI, imgMI, 0, 0, 1, BLOCK_HEIGHT, BLOCK_WIDTH, 0, this.m_w - BLOCK_WIDTH * 2, BLOCK_HEIGHT, 1);
		
		this.m_callback = callback;
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
	
	
	this.Update = function (deltaTime) {
		if (this.m_enable == true) {
			var fade = false;
			if (USE_TOUCH == false) {
				// Mouse =======================================
				if (g_inputEngine.m_mouseX >= this.m_x && g_inputEngine.m_mouseX <= this.m_x + this.m_w
				&&  g_inputEngine.m_mouseY >= this.m_y && g_inputEngine.m_mouseY <= this.m_y + BLOCK_HEIGHT) {
					fade = true
					if (g_inputEngine.m_mousePress == true) {
						this.m_progress = (g_inputEngine.m_mouseX - this.m_x) / this.m_w;
						if (this.m_callback != null) {
							this.m_callback (this.m_progress);
						}
					}
				}
			}
			else {
				// Touch =======================================
				for (var i=0; i<g_inputEngine.m_touchX.length; i++) {
					if (g_inputEngine.m_touchX[i] >= this.m_x && g_inputEngine.m_touchX[i] <= this.m_x + this.m_w
					&&  g_inputEngine.m_touchY[i] >= this.m_y && g_inputEngine.m_touchY[i] <= this.m_y + BLOCK_HEIGHT) {
						fade = true;
						this.m_progress = (g_inputEngine.m_mouseX - this.m_x) / this.m_w;
						if (this.m_callback != null) {
							this.m_callback (this.m_progress);
						}
						break;
					}
				}
			}
			
			
			if (fade) {
				topAlpha += BLEND_SPEED * deltaTime;
				if (topAlpha > 1) topAlpha = 1;
			}
			else {
				topAlpha -= BLEND_SPEED * deltaTime;
				if (topAlpha < 0) topAlpha = 0;
			}
		}
	}
	
	this.Draw = function (context) {
		var innerWidth = (this.m_progress * this.m_w) >> 0;
		if (innerWidth <= 0) innerWidth = 1;
		if (innerWidth >= this.m_w) innerWidth = this.m_w;
		
		g_graphicEngine.CopyCanvas (context, m_canvasI, 0, 0, innerWidth, this.m_h, this.m_x, this.m_y, innerWidth, BLOCK_HEIGHT, this.m_alpha);
		g_graphicEngine.CopyCanvas (context, m_canvasN, 0, 0, this.m_w, this.m_h, this.m_x, this.m_y, this.m_w, BLOCK_HEIGHT, this.m_alpha);
		if (topAlpha > 0) {
			g_graphicEngine.CopyCanvas (context, m_canvasO, 0, 0, this.m_w, this.m_h, this.m_x, this.m_y, this.m_w, BLOCK_HEIGHT, this.m_alpha * topAlpha);
		}
	}
}