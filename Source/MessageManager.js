function MessageFormat (isClick, text) {
	this.m_text = text;
	this.m_isClickToContinue = isClick;
	
	this.m_drawMenuArrow = false;
	this.m_drawMenuX = 0;
	this.m_drawMenuY = 0;
	this.m_drawMenuA = 0;
	
	this.m_drawMapArrow = false;
	this.m_drawMapX = 0;
	this.m_drawMapY = 0;
}

function MessageManager() {
	var m_messageQueue = new Array();
	
	this.PushMessage = function (message) {
		m_messageQueue.push (message);
	}
	
	this.PopMessage = function () {
		m_messageQueue.splice (0, 1);
	}
	
	this.Clear = function () {
		m_messageQueue = new Array();
	}
	
	
	this.GetActiveMessage = function () {
		if (m_messageQueue.length > 0) {
			return m_messageQueue[0];
		}
		return null;
	}
	
	
	
	var offsetD = 0;
	var offsetY = 0;
	
	this.Update = function (deltaTime) {
		if (m_messageQueue.length > 0) {
			if (offsetD == 0) {
				offsetY += deltaTime * 0.04;
				if (offsetY >= 20) {
					offsetD = 1;
				}
			}
			else if (offsetD == 1) {
				offsetY -= deltaTime * 0.04;
				if (offsetY <= 0) {
					offsetD = 0;
				}
			}
		}
	}
}