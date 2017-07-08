function DisintegrateBeam (battle, x, y, angle, enemy) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/DisintegrateBeam/DisintegrateBeam.png");
	var tipImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/DisintegrateBeam/DisintegrateBeamTip.png");
	
	this.m_type = ENUM_PROJECTILE_DISINTEGRATE_BEAM;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	this.m_target = enemy;
	
	this.m_live = true;
	
	var range = 0;
	
	var laserX = this.m_x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	var laserY = this.m_y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	var tipX = this.m_x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE * 0.5;
	var tipY = this.m_y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE * 0.5;
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			this.m_target.BuffDisintegrateBeam (DISINTEGRATE_DURATION, DISINTEGRATE_AMPLIFY_MULTIPLIER);
			
			if (g_profile.upgrade[UPGRADE_GAUSS][UPGRADE_TIER_3] == true) {
				if (this.m_target.m_HP / this.m_target.m_maxHP <= UPGRADE_GAUSS_SHATTER_THRESHOLD) {
					this.m_target.TakeDamage (1000000, 1);
				}
			}
			
			range = CalculateRangeBetweenTwoPoint (this.m_target.m_x, this.m_target.m_y, this.m_x, this.m_y) - BATTLE_FIELD_BLOCK_SIZE * 0.5;
			range = range >> 0;
			if (range < 0) range = 1;
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
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((laserX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((laserY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, range, 1, false, false, this.m_angle + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
			g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((tipX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((tipY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((this.m_target.m_x - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, ((this.m_target.m_y - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
		
		this.m_live = false;
	}
	
	this.Destroy = function () {
	
	}
}