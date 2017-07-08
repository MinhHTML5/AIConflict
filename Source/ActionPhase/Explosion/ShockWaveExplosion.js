function ShockWaveExplosion (battle, x, y) {
	var EXPLOSION_RANDOM_OFFSET = 10;
	
	var FRAME_SIZE = 50;
	var FRAME_MAX_SIZE = 160;
	var FRAME_EXPAND_SPEED = 0.6;
	
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/ShockWaveExplosion.png");
	
	this.m_x = x;
	this.m_y = y;
	
	this.m_live = true;
	
	this.m_size = 0;
	this.m_alpha = 1;
	
	g_nullHitSoundNode.SetCameraHandler (battle.camera);
	g_nullHitSoundNode.Play (x, y);

	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var distance = FRAME_EXPAND_SPEED * deltaTime;
			this.m_size += distance;
			if (this.m_size >= FRAME_MAX_SIZE) {
				this.m_live = false;
			}
			this.m_alpha -= distance / FRAME_MAX_SIZE;
		}
	}
	
	this.Draw = function (context) {
		if (this.m_live == true) {
			var offsetX = 0;
			var offsetY = 0;
			if (navigator.isCocoonJS) {
				offsetX = battle.camera.x;
				offsetY = battle.camera.y;
			}
		
			g_graphicEngine.SetDrawModeAddActive (context, true);
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (this.m_size * 0.5) >> 0, (this.m_y >> 0) - offsetY - (this.m_size * 0.5) >> 0, this.m_size, this.m_size, this.m_alpha);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
}