function SlowShockWaveProjectile(battle, x, y) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SlowShockWave/SlowShockWave.png");
	
	this.m_type = ENUM_PROJECTILE_SLOW_SHOCKWAVE;
	this.m_x = x;
	this.m_y = y;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_SLOW_SHOCKWAVE].m_speed;
	
	this.m_range = g_turretData[ENUM_TURRET_SHOCKWAVE].m_range;
	if (g_profile.upgrade[UPGRADE_WAVE][UPGRADE_TIER_1] == true) {
		this.m_range += UPGRADE_WAVE_ADDITIONAL_RANGE;
	}

	this.m_live = true;
	
	this.m_size = 0;
	this.m_alpha = 1;
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var distance = this.m_speed * deltaTime;
			this.m_size += distance * 2;
			if (this.m_size >= this.m_range * 2) {
				this.m_live = false;
			}
			this.m_alpha -= distance / this.m_range;
			
			var enemy = battle.GetEnemyList();
			for (var i=0; i<enemy.length; i++) {
				var tempEnemy = enemy[i];
				var range = CalculateRangeBetweenTwoPoint (tempEnemy.m_x, tempEnemy.m_y, this.m_x, this.m_y);
				
				if (range < this.m_size * 0.5 + tempEnemy.m_size) {
					tempEnemy.BuffSlow(SLOW_BUFF_DURATION, SLOW_BUFF_AMOUNT);
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
			
			g_graphicEngine.SetDrawModeAddActive (context, true);
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (this.m_size * 0.5) >> 0, (this.m_y >> 0) - offsetY - (this.m_size * 0.5) >> 0, this.m_size, this.m_size, this.m_alpha);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
	
	this.Destroy = function () {
	
	}
}