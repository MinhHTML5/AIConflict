function PathDisplay (battle) {
	var MOVE_SPEED = 50;
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/PathDisplay.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_finish = false;
	
	var moveDelayCount = 0;
	var curX = 0;
	var curY = 0;
	var nextX = 0;
	var nextY = 0;
	var angle = 0;
	var historyX = [];
	var historyY = [];
	var historyA = [];
	var path = null;
		
	this.Spawn = function (x, y, p) {
		curX = x;
		curY = y;
		path = p;
		
		this.m_x = curX * BATTLE_FIELD_BLOCK_SIZE + BATTLE_FIELD_BLOCK_SIZE * 0.5;
		this.m_y = curY * BATTLE_FIELD_BLOCK_SIZE + BATTLE_FIELD_BLOCK_SIZE * 0.5;
		this.PickATarget(curX, curY);
	}
	
	
	this.Update = function (deltaTime) {
		moveDelayCount += deltaTime;
		if (moveDelayCount > MOVE_SPEED) {
			curX = nextX;
			curY = nextY;
			this.m_x = curX * BATTLE_FIELD_BLOCK_SIZE + BATTLE_FIELD_BLOCK_SIZE * 0.5;
			this.m_y = curY * BATTLE_FIELD_BLOCK_SIZE + BATTLE_FIELD_BLOCK_SIZE * 0.5;
			
			if (path[curX][curY] == 0) {
				historyX.splice(0, 1);
				historyY.splice(0, 1);
				historyA.splice(0, 1);
				if (historyX.length == 0) {
					this.m_finish = true;
				}
			}
			else {
				this.PickATarget(curX, curY);
			
				if (nextX == curX - 1 && nextY == curY - 1) 		angle = -45;
				else if (nextX == curX && nextY == curY - 1)		angle = 0;
				else if (nextX == curX + 1 && nextY == curY - 1)	angle = 45;
				else if (nextX == curX - 1 && nextY == curY) 		angle = -90;
				else if (nextX == curX + 1 && nextY == curY)		angle = 90;
				else if (nextX == curX - 1 && nextY == curY + 1) 	angle = -135;
				else if (nextX == curX && nextY == curY + 1)		angle = 180;
				else if (nextX == curX + 1 && nextY == curY + 1)	angle = 135;
				
				
				if (historyX.length >= 5) {
					historyX.splice(0, 1);
					historyY.splice(0, 1);
					historyA.splice(0, 1);
				}
				historyX.push (curX);
				historyY.push (curY);
				historyA.push (angle);
			}
			
			moveDelayCount = 0;
		}
	}
	
	
	this.Draw = function (context) {
		var offsetX = 0;
		var offsetY = 0;
		if (navigator.isCocoonJS) {
			offsetX = battle.camera.x;
			offsetY = battle.camera.y;
		}
			
		var alpha = 0.5;
		for (var i=historyX.length - 1; i>= 0; i--) {
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((historyX[i] * BATTLE_FIELD_BLOCK_SIZE) >> 0) - offsetX, ((historyY[i] * BATTLE_FIELD_BLOCK_SIZE) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, alpha, false, false, historyA[i]);
			alpha -= 0.1;
		}
	}
	
	
	this.PickATarget = function (x, y) {
		var minValue = 99999;
		// Left
		if (x > 0 && path[x-1][y] < minValue) {
			minValue = path[x-1][y];
			nextX = x-1;
			nextY = y;
		}
		
		// Top
		if (y > 0 && path[x][y-1] < minValue) {
			minValue = path[x][y-1];
			nextX = x;
			nextY = y-1;
		}
		
		// Down
		if (y < BATTLE_FIELD_BLOCK_H - 1 && path[x][y+1] < minValue) {
			minValue = path[x][y+1];
			nextX = x;
			nextY = y+1;
		}
		
		// Right
		if (x < BATTLE_FIELD_BLOCK_W - 1 && path[x+1][y] < minValue) {
			minValue = path[x+1][y];
			nextX = x+1;
			nextY = y;
		}
		
		// Top - left
		if (x > 0 && y > 0 && path[x-1][y-1] < minValue) {
			minValue = path[x-1][y-1];
			nextX = x-1;
			nextY = y-1;
		}
		
		// Down - left
		if (x > 0 && y < BATTLE_FIELD_BLOCK_H - 1 && path[x-1][y+1] < minValue) {
			minValue = path[x-1][y+1];
			nextX = x-1;
			nextY = y+1;
		}
		
		// Top - right
		if (x < BATTLE_FIELD_BLOCK_W - 1 && y > 0 && path[x+1][y-1] < minValue) {
			minValue = path[x+1][y-1];
			nextX = x+1;
			nextY = y-1;
		}
		
		// Down - right
		if (x < BATTLE_FIELD_BLOCK_W - 1 && y < BATTLE_FIELD_BLOCK_H - 1 && path[x+1][y+1] < minValue) {
			minValue = path[x+1][y+1];
			nextX = x+1;
			nextY = y+1;
		}		
		
		targetValue = minValue;
	}
}