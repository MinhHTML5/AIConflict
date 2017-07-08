function GlassButton () {
	var SIZE_W = 150;
	var SIZE_H = 50;
	var BLEND_SPEED = 0.003;
	
	var imgU = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Up.png");
	var imgD = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Down.png");
	var imgO = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Over.png");
	var imgDisable = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Disable.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_caption = 0;
	this.m_alpha = 1;
	this.m_enable = true;
	
	var middle_x = 0;
	var middle_y = 0;
	
	var callBack = null;
	var param = null;
	
	var state = 0;
	var blend = 0;
	
	
	
	this.Init = function (x, y, cap, cb, pr) {
		this.m_x = x;
		this.m_y = y;
		this.m_caption = cap;
		
		callBack = cb;
		param = pr;
		
		middle_x = this.m_x + SIZE_W * 0.5;
		middle_y = this.m_y + SIZE_H * 0.5;
	}
	
	this.SetPosition = function (x, y) {
		this.m_x = x;
		this.m_y = y;
		
		middle_x = this.m_x + SIZE_W * 0.5;
		middle_y = this.m_y + SIZE_H * 0.5;
	}
	
	this.SetCaption = function (cap) {
		this.m_caption = cap;
	}
	
	
	this.SetCallBack = function (cb, pr) {
		callBack = cb;
		param = pr;
	}
	
	this.SetAlpha = function (alpha) {
		this.m_alpha = alpha;
	}
	
	
	
	this.Update = function (deltaTime) {
		if (this.m_enable == true) {
			if (USE_TOUCH == false) {
				// Mouse =======================================
				if (g_inputEngine.m_mouseX >= this.m_x && g_inputEngine.m_mouseX <= this.m_x + SIZE_W
				&&  g_inputEngine.m_mouseY >= this.m_y && g_inputEngine.m_mouseY <= this.m_y + SIZE_H) {
					if (g_inputEngine.m_mousePress == 0) {
						if (state == 2) {
							callBack(param);
							if (AUDIO_ENABLE) g_UISoundNode.PlayUp();
						}
						if (state == 0) {
							if (AUDIO_ENABLE) g_UISoundNode.PlayOver();
						}
						state = 1;
					}
					else {
						if (state == 1) {
							if (AUDIO_ENABLE) g_UISoundNode.PlayDown();
						}
						state = 2;
					}
				}
				else {
					state = 0;
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
				}
				else {
					if (g_inputEngine.m_touchX[0] >= this.m_x && g_inputEngine.m_touchX[0] <= this.m_x + SIZE_W
					&&  g_inputEngine.m_touchY[0] >= this.m_y && g_inputEngine.m_touchY[0] <= this.m_y + SIZE_H) {
						if (state == 0) {
							state = 2;
							g_UISoundNode.PlayDown();
						}
					}
					else {
						state = 0;
					}
				}
			}
			
			if (state != 0) {
				blend += BLEND_SPEED * deltaTime;
				if (blend > 1) blend = 1;
			}
			else {
				blend -= BLEND_SPEED * deltaTime;
				if (blend < 0) blend = 0;
			}
		}
		else {
		
		}
	}
	
	this.Draw = function (context) {
		if (this.m_enable == true) {
			var colorBlend = (blend * 55) >> 0;
			if (state == 0) {
				g_graphicEngine.Draw (context, imgU, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
				if (blend > 0) {
					g_graphicEngine.Draw (context, imgO, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha * blend);
				}
				g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, middle_y, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 4, 200 + colorBlend, 200 + colorBlend, this.m_alpha);
			}
			else if (state == 1) {
				g_graphicEngine.Draw (context, imgU, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
				g_graphicEngine.Draw (context, imgO, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha * blend);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, middle_y, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 4, 200 + colorBlend, 200 + colorBlend, this.m_alpha);
			}
			else if (state == 2) {
				g_graphicEngine.Draw (context, imgD, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, middle_y, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 4, 4, 4, this.m_alpha);
			}
		}
		else {
			g_graphicEngine.Draw (context, imgDisable, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
			g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, middle_y, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 181, 181, 181, this.m_alpha);
		}
	}
}