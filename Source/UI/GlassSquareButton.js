function GlassSquareButton () {
	var BLOCK_SIZE = 10;
	var BUTTON_HEIGHT = 40;

	var imgLeftNormal = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftN.png");
	var imgMidNormal = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidN.png");
	var imgRightNormal = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightN.png");
	
	var imgLeftOver = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftO.png");
	var imgMidOver = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidO.png");
	var imgRightOver = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightO.png");
	
	var imgLeftDown = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftD.png");
	var imgMidDown = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidD.png");
	var imgRightDown = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightD.png");
	
	var imgLeftDis = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftDis.png");
	var imgMidDis = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidDis.png");
	var imgRightDis = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightDis.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_w = 0;
	this.m_caption = 0;
	
	var callBack = null;
	var param = null;
	
	this.m_enable = true;
	
	var state = 0;
	
	
	
	this.Init = function (x, y, cap, cb, pr, w) {
		this.m_x = x;
		this.m_y = y;
		this.m_caption = cap;
		
		callBack = cb;
		param = pr;
		
		this.m_w = w;
	}
	
	this.SetPosition = function (x, y) {
		this.m_x = x;
		this.m_y = y;
	}
	
	this.SetAlpha = function (alpha) {
		this.m_alpha = alpha;
	}
	
	this.SetCaption = function (caption) {
		this.m_caption = caption;
	}
	
	this.HandleInput = function () {
		if (this.m_enable == true) {
			if (USE_TOUCH == false) {
				// Mouse =======================================
				if (g_inputEngine.m_mouseX >= this.m_x && g_inputEngine.m_mouseX <= this.m_x + this.m_w
				&&  g_inputEngine.m_mouseY >= this.m_y && g_inputEngine.m_mouseY <= this.m_y + BUTTON_HEIGHT) {
					if (g_inputEngine.m_mousePress == 0) {
						if (state == 2){
							g_UISoundNode.PlayUp();
							callBack(param);
						}
						if (state == 0) {
							g_UISoundNode.PlayOver();
						}
						state = 1;
					}
					else {
						if (state == 1) {
							g_UISoundNode.PlayDown();
						}
						state = 2;
					}
					
					return true;
				}
				else {
					state = 0;
					return false;
				}
			}
			else {
				// Touch =======================================
				if (g_inputEngine.m_touchX.length == 0) {
					if (state == 2) {
						state = 0;
						callBack(param);
						g_UISoundNode.PlayUp();
					}
					return false;
				}
				else {
					if (g_inputEngine.m_touchX[0] >= this.m_x && g_inputEngine.m_touchX[0] <= this.m_x + this.m_w
					&&  g_inputEngine.m_touchY[0] >= this.m_y && g_inputEngine.m_touchY[0] <= this.m_y + BUTTON_HEIGHT) {
						if (state == 0) {
							state = 2;
							g_UISoundNode.PlayDown();
						}
						return true;
					}
					else {
						state = 0;
						return false;
					}
				}
			}
		}
		else {
			return false;
		}
	}
	
	this.Draw = function (context) {
		if (this.m_enable == true) {
			if (state == 0) {
				g_graphicEngine.Draw (context, imgLeftNormal, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.Draw (context, imgMidNormal, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + BLOCK_SIZE, this.m_y, this.m_w - BLOCK_SIZE * 2, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.Draw (context, imgRightNormal, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + this.m_w - BLOCK_SIZE, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, this.m_x + this.m_w * 0.5, this.m_y + 15, this.m_w, "Spartakus", 9, false, false, "center", "top", 4, 200, 200, this.m_alpha);
			}
			else if (state == 1) {
				g_graphicEngine.Draw (context, imgLeftOver, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.Draw (context, imgMidOver, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + BLOCK_SIZE, this.m_y, this.m_w - BLOCK_SIZE * 2, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.Draw (context, imgRightOver, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + this.m_w - BLOCK_SIZE, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, this.m_x + this.m_w * 0.5, this.m_y + 15, this.m_w, "Spartakus", 9, false, false, "center", "top", 4, 255, 255, this.m_alpha);
			}
			else if (state == 2) {
				g_graphicEngine.Draw (context, imgLeftDown, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.Draw (context, imgMidDown, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + BLOCK_SIZE, this.m_y, this.m_w - BLOCK_SIZE * 2, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.Draw (context, imgRightDown, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + this.m_w - BLOCK_SIZE, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, this.m_x + this.m_w * 0.5, this.m_y + 15, this.m_w, "Spartakus", 9, false, false, "center", "top", 255, 255, 255, this.m_alpha);
			}
		}
		else {
			g_graphicEngine.Draw (context, imgLeftDis, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
			g_graphicEngine.Draw (context, imgMidDis, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + BLOCK_SIZE, this.m_y, this.m_w - BLOCK_SIZE * 2, BUTTON_HEIGHT, this.m_alpha);
			g_graphicEngine.Draw (context, imgRightDis, 0, 0, BLOCK_SIZE, BUTTON_HEIGHT, this.m_x + this.m_w - BLOCK_SIZE, this.m_y, BLOCK_SIZE, BUTTON_HEIGHT, this.m_alpha);
			g_graphicEngine.DrawTextRGB (context, this.m_caption, this.m_x + this.m_w * 0.5, this.m_y + 15, this.m_w, "Spartakus", 9, false, false, "center", "top", 128, 128, 128, this.m_alpha);
		}
	}
}