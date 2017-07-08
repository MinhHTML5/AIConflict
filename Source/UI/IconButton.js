function IconButton (icon, sizeW, sizeH) {
	var SIZE_W = 80;
	var SIZE_H = 80;
	var ICON_MAX_SIZE = 66;
	var BLEND_SPEED = 0.003;
	
	var imgU = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/IconButton/Button-Up.png");
	var imgD = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/IconButton/Button-Down.png");
	var imgO = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/IconButton/Button-Over.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_caption = 0;
	this.m_alpha = 1;
	
	var middle_x = 0;
	var middle_y = 0;
	
	var callBack = null;
	var param = null;
	
	var state = 0;
	var blend = 0;
	
	var imgIcon = null;
	if (icon) {
		imgIcon = g_graphicEngine.LoadImage(icon);
	}
	var iconSizeW = sizeW;
	var iconSizeH = sizeH;
	
	var realW = iconSizeW;
	var realH = iconSizeH;
	if (realW > ICON_MAX_SIZE) realW = ICON_MAX_SIZE;
	if (realH > ICON_MAX_SIZE) realH = ICON_MAX_SIZE;
	
	
	this.Init = function (x, y, cb, pr) {
		this.m_x = x;
		this.m_y = y;
		
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
	
	this.SetIcon = function (icon, sizeW, sizeH, rW, rH) {
		imgIcon = g_graphicEngine.LoadImage(icon);
		iconSizeW = sizeW;
		iconSizeH = sizeH;
		
		if (rW == null) {
			realW = iconSizeW;
			if (realW > ICON_MAX_SIZE) realW = ICON_MAX_SIZE;
		}
		else {
			realW = rW;
		}
		if (rH == null) {
			realH = iconSizeW;
			if (realH > ICON_MAX_SIZE) realH = ICON_MAX_SIZE;
		}
		else {
			realH = rW;
		}
	}
	
	
	this.SetCallBack = function (cb, pr) {
		callBack = cb;
		param = pr;
	}
	
	this.SetAlpha = function (alpha) {
		this.m_alpha = alpha;
	}
	
	
	
	this.Update = function (deltaTime) {	
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
					if (AUDIO_ENABLE) g_UISoundNode.PlayUp();
				}
			}
			else {
				if (g_inputEngine.m_touchX[0] >= this.m_x && g_inputEngine.m_touchX[0] <= this.m_x + SIZE_W
				&&  g_inputEngine.m_touchY[0] >= this.m_y && g_inputEngine.m_touchY[0] <= this.m_y + SIZE_H) {
					if (state == 0) {
						state = 2;
						if (AUDIO_ENABLE) g_UISoundNode.PlayDown();
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
	
	this.Draw = function (context) {
		var colorBlend = (blend * 55) >> 0;
		if (state == 0) {
			g_graphicEngine.Draw (context, imgU, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
			if (blend > 0) {
				g_graphicEngine.Draw (context, imgO, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha * blend);
			}
		}
		else if (state == 1) {
			g_graphicEngine.Draw (context, imgU, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
			g_graphicEngine.Draw (context, imgO, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha * blend);
		}
		else if (state == 2) {
			g_graphicEngine.Draw (context, imgD, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
		}
		if (imgIcon) {
			g_graphicEngine.Draw (context, imgIcon, 0, 0, iconSizeW, iconSizeH, this.m_x + (SIZE_W - realW) * 0.5, this.m_y + (SIZE_H - realH) * 0.5, realW, realH, this.m_alpha);
		}
	}
}