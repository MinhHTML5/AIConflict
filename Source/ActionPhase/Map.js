function CameraPosition(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

function TurretData() {
	this.type = 0;
	this.x = 0;
	this.y = 0;
}

function MapData() {
	this.block = null;
	this.object = null;
}

function Map(width, height) {
	// ========================================================================================================
	// Map data
	this.width = width;
	this.height = height;
	this.blockWidth = (this.width / BATTLE_FIELD_BLOCK_SIZE) >> 0;
	this.blockHeight = (this.height / BATTLE_FIELD_BLOCK_SIZE) >> 0;
	
	var m_platformBufferCanvas = document.createElement("canvas");
	if (navigator.isCocoonJS) {
		m_platformBufferCanvas.width  = this.width * 0.5;
		m_platformBufferCanvas.height = this.height * 0.5;
	}
	else {
		m_platformBufferCanvas.width  = this.width;
		m_platformBufferCanvas.height = this.height;
	}
	var m_platformBufferContext = m_platformBufferCanvas.getContext("2d");
	
	this.block = new Array();
	for (var i=-1; i<this.blockWidth+1; i++) {
		this.block[i] = new Array();
		for (var j=-1; j<this.blockHeight+1; j++) {
			this.block[i][j] = 0;
		}
	}
	
	this.object = new Array();
	// ========================================================================================================
	
	
	
	
	// ========================================================================================================
	// Images
	var gridGImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Grid-G.png");
	var gridRImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Grid-R.png");
	var platformImage = new Array();
	for (var i=0; i<4; i++) {
		platformImage[i] = new Array();
	}
	
	platformImage[0][0] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Mid.png");
	platformImage[0][1] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Block.png");
	platformImage[0][2] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COTL.png");
	platformImage[0][3] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CITL.png");
	platformImage[0][4] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-ET.png");
	
	platformImage[1][0] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Mid.png");
	platformImage[1][1] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Block.png");
	platformImage[1][2] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COTR.png");
	platformImage[1][3] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CITR.png");
	platformImage[1][4] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-ER.png");
	
	platformImage[2][0] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Mid.png");
	platformImage[2][1] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Block.png");
	platformImage[2][2] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COBR.png");
	platformImage[2][3] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CIBR.png");
	platformImage[2][4] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-EB.png");
	
	platformImage[3][0] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Mid.png");
	platformImage[3][1] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Block.png");
	platformImage[3][2] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COBL.png");
	platformImage[3][3] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CIBL.png");
	platformImage[3][4] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-EL.png");
	
	var entryImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Entry.png");
	var exitImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Exit.png");
	
	var objectImage = new Array();
	objectImage[1] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 1.png");
	objectImage[2] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 2.png");
	objectImage[3] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 3.png");
	objectImage[4] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 4.png");
	objectImage[5] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 5.png");
	objectImage[6] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 6.png");
	objectImage[7] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 7.png");
	objectImage[8] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 8.png");
	objectImage[9] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 9.png");
	objectImage[10] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret 10.png");
	// ========================================================================================================
	
	
	
	
	
	// ========================================================================================================
	// Camera
	var cameraPosition = null;
	this.SetCamera = function (camera) {
		cameraPosition = camera;
		if (cameraPosition.x < 0) cameraPosition.x = 0;
		if (cameraPosition.y < 0) cameraPosition.y = 0;
		if (cameraPosition.x > this.width - cameraPosition.w) cameraPosition.x = this.width - cameraPosition.w;
		if (cameraPosition.y > this.height - cameraPosition.h) cameraPosition.y = this.height - cameraPosition.h;
	}
	// ========================================================================================================
	
	
	
	
	
	
	// ========================================================================================================
	// Draw
	this.RenderField = function (editMode) {
		var map = this.block;
		var realSize = BATTLE_FIELD_BLOCK_SIZE;
		if (navigator.isCocoonJS) {
			realSize = (realSize / 2) >> 0;
		}
		
		g_graphicEngine.ClearCanvas (m_platformBufferCanvas, m_platformBufferContext, 0, 0, this.width, this.height);
		
		for (var i=0; i<this.blockWidth; i++) {
			for (var j=0; j<this.blockHeight; j++) {
				var block = map[i][j];
				
				if (block == 0) {
					if (editMode) {
						g_graphicEngine.Draw (m_platformBufferContext, gridGImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
				}
				else if (block == 1) {
					// Inner corner
					if (map[i-1][j-1] == 0 && map[i+1][j-1] == 1 && map[i-1][j+1] == 1 && map[i+1][j+1] == 1 && map[i-1][j] == 1 && map[i+1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[0][3], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					else if (map[i-1][j-1] == 1 && map[i+1][j-1] == 0 && map[i-1][j+1] == 1 && map[i+1][j+1] == 1 && map[i-1][j] == 1 && map[i+1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[1][3], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					else if (map[i-1][j-1] == 1 && map[i+1][j-1] == 1 && map[i-1][j+1] == 1 && map[i+1][j+1] == 0 && map[i-1][j] == 1 && map[i+1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[2][3], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					else if (map[i-1][j-1] == 1 && map[i+1][j-1] == 1 && map[i-1][j+1] == 0 && map[i+1][j+1] == 1 && map[i-1][j] == 1 && map[i+1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[3][3], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Normal block
					
					else if (map[i-1][j-1] == 1 && map[i+1][j-1] == 1 && map[i-1][j+1] == 1 && map[i+1][j+1] == 1 && map[i+1][j+1] == 1 && map[i-1][j] == 1 && map[i+1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[0][0], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					
					// Edge
					// Up
					else if (map[i-1][j] == 1 && map[i+1][j] == 1 && map [i][j+1] == 1 && map [i+1][j+1] == 1 && map [i-1][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[0][4], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Right
					else if (map[i-1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1 && map [i-1][j-1] == 1 && map [i-1][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[1][4], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Down
					else if (map[i-1][j] == 1 && map[i+1][j] == 1 && map[i][j-1] == 1 && map [i+1][j-1] == 1 && map [i-1][j-1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[2][4], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Left
					else if (map[i+1][j] == 1 && map[i][j-1] == 1 && map [i][j+1] == 1 && map [i+1][j-1] == 1 && map [i+1][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[3][4], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					
					// Outer Corner
					// Top - left
					else if (map[i+1][j] == 1 && map [i][j+1] == 1 && map [i+1][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[0][2], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Top - right
					else if (map[i-1][j] == 1 && map [i][j+1] == 1 && map [i-1][j+1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[1][2], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Bottom - right
					else if (map[i-1][j] == 1 && map[i][j-1] == 1 && map [i-1][j-1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[2][2], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					// Bottom - left
					else if (map[i+1][j] == 1 && map[i][j-1] == 1 && map [i+1][j-1] == 1) {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[3][2], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					
					// Stand alone block
					else {
						g_graphicEngine.Draw (m_platformBufferContext, platformImage[0][1], 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
					
					if (editMode) {
						g_graphicEngine.Draw (m_platformBufferContext, gridRImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize);
					}
				}
				else if (block == 2) {
					if (editMode) {
						if (i == 0)							g_graphicEngine.Draw (m_platformBufferContext, entryImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 90);
						else if (i == this.blockWidth - 1)	g_graphicEngine.Draw (m_platformBufferContext, entryImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 270);
						else if (j == 0)					g_graphicEngine.Draw (m_platformBufferContext, entryImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 180);
						else								g_graphicEngine.Draw (m_platformBufferContext, entryImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 0);
					}
				}
				else if (block == 3) {
					if (editMode) {
						if (i == this.blockWidth - 1)		g_graphicEngine.Draw (m_platformBufferContext, exitImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 90);
						else if (i == 0)					g_graphicEngine.Draw (m_platformBufferContext, exitImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 270);
						else if (j == this.blockHeight - 1)	g_graphicEngine.Draw (m_platformBufferContext, exitImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 180);
						else								g_graphicEngine.Draw (m_platformBufferContext, exitImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, i * realSize, j * realSize, realSize, realSize, 1, false, false, 0);
					}
				}
			}
		}
		
		if (editMode) {
			for (var i=0; i<this.object.length; i++) {
				g_graphicEngine.DrawFast (m_platformBufferContext, objectImage[this.object[i].type], this.object[i].x * BATTLE_FIELD_BLOCK_SIZE, this.object[i].y * BATTLE_FIELD_BLOCK_SIZE);
			}
		}
	}
	
	
	this.Draw = function (context, x, y, w, h) {
		if (x == null) x = 0;
		if (y == null) y = 0;
		if (w == null) w = CANVAS_W;
		if (h == null) h = CANVAS_H;
		
		if (navigator.isCocoonJS) {
			g_graphicEngine.CopyCanvas (context, m_platformBufferCanvas, (cameraPosition.x * 0.5) >> 0, (cameraPosition.y * 0.5) >> 0, (cameraPosition.w * 0.5) >> 0, (cameraPosition.h * 0.5) >> 0, 0, 0, w, h);
		}
		else {
			g_graphicEngine.CopyCanvas (context, m_platformBufferCanvas, cameraPosition.x >> 0, cameraPosition.y >> 0, cameraPosition.w >> 0, cameraPosition.h >> 0, x, y, w, h);
		}
	}
	// ========================================================================================================
	
	
	
	// ========================================================================================================
	// Export and Import
	this.Export = function () {
		var mapData = new MapData();
		mapData.block = new Array();
		for (var i=-1; i<this.blockWidth+1; i++) {
			mapData.block[i+1] = new Array();
			for (var j=-1; j<this.blockHeight+1; j++) {
				mapData.block[i+1][j+1] = this.block[i][j];
			}
		}
		mapData.object = this.object;
		return JSON.stringify(mapData);
	}
	
	this.Import = function (string) {
		var mapData;
		try {
			mapData = JSON.parse(string);
			for (var i=-1; i<this.blockWidth+1; i++) {
				this.block[i] = new Array();
				for (var j=-1; j<this.blockHeight+1; j++) {
					this.block[i][j] = mapData.block[i+1][j+1];
				}
			}
			this.object = mapData.object;
		}
		catch (e) {}
	}
	// ========================================================================================================
	
	
	// ========================================================================================================
	// Utility
	this.GetBuildableStatus = function (x, y) {
		var map = this.block;
		
		if (map[x-1][y-1] == 1 && map[x][y-1] == 1 && map[x+1][y-1] == 1
		&&  map[x-1][y] == 1 && map[x][y] == 1 && map[x+1][y] == 1
		&&  map[x-1][y+1] == 1 && map[x][y+1] == 1 && map[x+1][y+1] == 1) {
			return true;
		}
		else {
			return false;
		}
	}
	// ========================================================================================================
}