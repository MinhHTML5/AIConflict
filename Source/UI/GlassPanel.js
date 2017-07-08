function GlassPanel () {
	var BLOCK_SIZE = 50;
	
	var imgC  = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Corner.png");
	var imgTE = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Top-Edge.png");
	var imgLE = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Left-Edge.png");
	var imgM  = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Mid.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_w = 0;
	this.m_h = 0;
	this.m_alpha = 0;
	
	var m_canvas = null;
	var m_context = null;
	
	this.Init = function (x, y, w, h) {
		this.m_x = x;
		this.m_y = y;
		this.m_w = w;
		this.m_h = h;
		
		m_canvas = document.createElement("canvas");
		m_canvas.width  = this.m_w;
		m_canvas.height = this.m_h;
		m_context = m_canvas.getContext("2d");
		
		g_graphicEngine.Draw (m_context, imgC, 0, 0, BLOCK_SIZE, BLOCK_SIZE, 0, 0, BLOCK_SIZE, BLOCK_SIZE, 1);
		g_graphicEngine.Draw (m_context, imgC, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_w - BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, 90);
		g_graphicEngine.Draw (m_context, imgC, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_w - BLOCK_SIZE, this.m_h - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, 180);
		g_graphicEngine.Draw (m_context, imgC, 0, 0, BLOCK_SIZE, BLOCK_SIZE, 0, this.m_h - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, 270);
		
		g_graphicEngine.Draw (m_context, imgTE, 0, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, 0, this.m_w - 2 * BLOCK_SIZE, BLOCK_SIZE, 1);
		g_graphicEngine.Draw (m_context, imgLE, 0, 0, BLOCK_SIZE, BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_h - 2 * BLOCK_SIZE, 1);
		g_graphicEngine.Draw (m_context, imgTE, 0, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, this.m_h - BLOCK_SIZE, this.m_w - 2 * BLOCK_SIZE, BLOCK_SIZE, 1, false, false, 180);
		g_graphicEngine.Draw (m_context, imgLE, 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_w - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, this.m_h - 2 * BLOCK_SIZE, 1, false, false, 180);
		
		g_graphicEngine.Draw (m_context, imgM, 0, 0, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, this.m_w - 2 * BLOCK_SIZE, this.m_h - 2 * BLOCK_SIZE, 1);
		
		this.m_alpha = 1;
	}
	
	this.SetPosition = function (x, y) {
		this.m_x = x;
		this.m_y = y;
	}
	
	this.SetAlpha = function (alpha) {
		this.m_alpha = alpha;
	}
	
	this.Draw = function (context) {
		if (m_canvas != null) {
			g_graphicEngine.CopyCanvas (context, m_canvas, 0, 0, this.m_w, this.m_h, this.m_x, this.m_y, this.m_w, this.m_h, this.m_alpha);
		}
	}
}