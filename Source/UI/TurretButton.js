function TurretButton (icon, sizeW, sizeH) {
	var SIZE_W = 70;
	var SIZE_H = 90;
	var BLEND_SPEED = 0.003;
	var TEXT_OFFSET = 78;
	
	var imgU = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Up.png");
	var imgD = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Down.png");
	var imgO = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Over.png");
	var imgDis = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Disable.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_caption = 0;
	this.m_alpha = 1;
	
	var middle_x = 0;
	var middle_y = 0;
	
	this.m_caption = 0;
	this.m_enable = true;
	
	var callBack = null;
	var overCallBack = null;
	var param = null;
	
	var state = 0;
	var blend = 0;
	
	var imgIcon = null;
	if (icon) {
		imgIcon = g_graphicEngine.LoadImage(icon);
	}
	var iconSizeW = sizeW;
	var iconSizeH = sizeH;
	
	
	this.Init = function (x, y, cb, overcb, pr) {
		this.m_x = x;
		this.m_y = y;
		
		callBack = cb;
		overCallBack = overcb;
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
	
	this.SetIcon = function (icon, sizeW, sizeH) {
		imgIcon = g_graphicEngine.LoadImage(icon);
		iconSizeW = sizeW;
		iconSizeH = sizeH;
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
							g_UISoundNode.PlayUp();
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
					overCallBack(param);
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
							overCallBack(param);
							g_UISoundNode.PlayDown();
						}
					}
					else {
						state = 0;
					}
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
		if (this.m_enable == true) {
			var colorBlend = (blend * 55) >> 0;
			if (state == 0) {
				g_graphicEngine.Draw (context, imgU, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
				if (blend > 0) {
					g_graphicEngine.Draw (context, imgO, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha * blend);
				}
				g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, this.m_y + TEXT_OFFSET, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 4, 200 + colorBlend, 200 + colorBlend, this.m_alpha);
			}
			else if (state == 1) {
				g_graphicEngine.Draw (context, imgU, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
				g_graphicEngine.Draw (context, imgO, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha * blend);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, this.m_y + TEXT_OFFSET, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 4, 200 + colorBlend, 200 + colorBlend, this.m_alpha);
			}
			else if (state == 2) {
				g_graphicEngine.Draw (context, imgD, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
				g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, this.m_y + TEXT_OFFSET, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 4, 4, 4, this.m_alpha);
			}
			if (imgIcon) {
				g_graphicEngine.Draw(context, imgIcon, 0, 0, iconSizeW, iconSizeH, this.m_x + (SIZE_W - iconSizeW) * 0.5, this.m_y + (SIZE_H - iconSizeH) * 0.3, iconSizeW, iconSizeH, this.m_alpha);
			}
		}
		else {
			if (imgIcon) {
				g_graphicEngine.Draw(context, imgIcon, 0, 0, iconSizeW, iconSizeH, this.m_x + (SIZE_W - iconSizeW) * 0.5, this.m_y + (SIZE_H - iconSizeH) * 0.3, iconSizeW, iconSizeH, this.m_alpha);
			}
			g_graphicEngine.Draw (context, imgDis, 0, 0, SIZE_W, SIZE_H, this.m_x, this.m_y, SIZE_W, SIZE_H, this.m_alpha);
			g_graphicEngine.DrawTextRGB (context, this.m_caption, middle_x, this.m_y + TEXT_OFFSET, SIZE_W, "Spartakus", 13, true, false, "center", "middle", 192, 192, 192, this.m_alpha);
		}
	}
}