function GatlingExplosion (battle, x, y) {
	var EXPLOSION_RANDOM_OFFSET = 10;
	
	var FRAME_NUMBER = 29;
	var FRAME_RATE = 16;
	var FRAME_SIZE = 50;
	
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/GatlingExplosion.png");
	
	this.m_x = x + ((Math.random() * EXPLOSION_RANDOM_OFFSET * 2) >> 0) - EXPLOSION_RANDOM_OFFSET;
	this.m_y = y + ((Math.random() * EXPLOSION_RANDOM_OFFSET * 2) >> 0) - EXPLOSION_RANDOM_OFFSET;
	this.m_angle = (Math.random() * 360) >> 0;
	
	this.m_live = true;
	
	var frame = 0;
	var frameCount = 0;
	
	
	g_gatlingImpactSoundNode.SetCameraHandler (battle.camera);
	g_gatlingImpactSoundNode.Play (x, y);

	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			frameCount += deltaTime;
			while (frameCount > FRAME_RATE) {
				frameCount -= FRAME_RATE;
				frame ++;
				if (frame == FRAME_NUMBER) {
					this.m_live = false;
				}
			}
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
			
			var row = frame % 8;
			var col = (frame / 8) >> 0;
			g_graphicEngine.SetDrawModeAddActive (context, true);
			g_graphicEngine.Draw (context, image, row * FRAME_SIZE, col * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, (this.m_x >> 0) - offsetX - (FRAME_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (FRAME_SIZE * 0.5) >> 0, FRAME_SIZE, FRAME_SIZE, 1, false, false, this.m_angle);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
}