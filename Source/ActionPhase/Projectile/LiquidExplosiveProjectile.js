function LiquidExplosiveProjectile (battle, x, y, angle) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/LiquidExplosive/LEParticle.png");
	
	this.m_type = ENUM_PROJECTILE_ACID;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_ACID].m_speed;
	this.m_damage = g_bulletData[ENUM_PROJECTILE_ACID].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_ACID].m_armorPierce;
	
	this.m_live = true;
	
	this.m_w = 0;
	this.m_h = 0;
	
	var range = 0;
	var scale = 0;
	var alpha = 1;
	
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var enemy = battle.GetEnemyList();
			
			var distance = this.m_speed * deltaTime;
			range += distance;
			
			this.m_x += distance * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y -= distance * Math.cos(this.m_angle * DEG_TO_RAD);
			
			for (var i=0; i<enemy.length; i++) {
				var tempEnemy = enemy[i];
				if (Math.abs (this.m_x - tempEnemy.m_x) < this.m_w * 0.25 + tempEnemy.m_size * 0.5
				&&  Math.abs (this.m_y - tempEnemy.m_y) < this.m_h * 0.25 + tempEnemy.m_size * 0.5
				&&  tempEnemy.m_live == true ) {
					if (tempEnemy.m_kineticShield == false) {
						if (g_profile.upgrade[UPGRADE_ACID][UPGRADE_TIER_3] == true) {
							tempEnemy.BuffLiquidExplosive(LIQUID_EXPLOSIVE_DURATION, LIQUID_EXPLOSIVE_DAMAGE_MULTIPLIER * UPGRADE_LE_DAMAGE_MULTIPLIER);
						}
						else {
							tempEnemy.BuffLiquidExplosive(LIQUID_EXPLOSIVE_DURATION, LIQUID_EXPLOSIVE_DAMAGE_MULTIPLIER);
						}
					}
				}
			}
			
			if (range >= g_turretData[ENUM_TURRET_ACID].m_range) {
				this.m_live = false;
			}
			else {
				scale = (range / g_turretData[ENUM_TURRET_ACID].m_range) * ACID_BULLET_MAX_SCALE;
				alpha = (1 - (range / g_turretData[ENUM_TURRET_ACID].m_range));
				
				this.m_w = BATTLE_FIELD_BLOCK_SIZE * scale;
				this.m_h = BATTLE_FIELD_BLOCK_SIZE * scale;
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
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (this.m_w * 0.5) >> 0, (this.m_y >> 0) - offsetY - (this.m_h * 0.5) >> 0, this.m_w, this.m_h, alpha);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
	
	this.Destroy = function () {
	
	}
}