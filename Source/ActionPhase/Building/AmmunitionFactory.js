function AmmunitionFactory (battle, x, y) {
	var baseImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Building/AmmunitionFactory/Base.png");
	
	this.m_type = ENUM_BUILDING_AMMUNITION;
	this.m_blockX = x;
	this.m_blockY = y;
	this.m_x = x * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
	this.m_y = y * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
	
	this.m_name = g_turretData[ENUM_BUILDING_AMMUNITION].m_name;
	
	this.bullet = new Array();
	this.m_new = true;
	this.m_AIChecker = new Array();
	for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
		this.m_AIChecker[i] = new AIChecker (battle, this);
	}

	
	this.Update = function (deltaTime) {
		if (battle.m_ammunition < MAX_AMMUNITION) {
			battle.m_ammunition += AMMUNITION_PRODUCE_RATE * deltaTime * 0.001;
			if (battle.m_ammunition > MAX_AMMUNITION) {
				battle.m_ammunition = MAX_AMMUNITION;
			}
		}
	}
	
	this.Draw = function (context) {
		var offsetX = 0;
		var offsetY = 0;
		if (navigator.isCocoonJS) {
			offsetX = battle.camera.x;
			offsetY = battle.camera.y;
		}
		g_graphicEngine.DrawFast (context, baseImage, this.m_x - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, this.m_y - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0);
	}
	
	this.DrawBullet = function (context, x, y, w, h) {
	
	}
	
	this.Disable = function (time) {
	
	}
	
	this.Provoke = function (target, duration) {
	
	}
	
	this.Jam = function (time) {
	
	}
}