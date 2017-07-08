function ShockWaveProjectile(battle, x, y) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/ShockWave/ShockWave.png");
	
	this.m_type = ENUM_PROJECTILE_SHOCKWAVE;
	this.m_x = x;
	this.m_y = y;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_SHOCKWAVE].m_speed;
	this.m_damage = g_bulletData[ENUM_PROJECTILE_SHOCKWAVE].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_SHOCKWAVE].m_armorPierce;
	
	this.m_range = g_turretData[ENUM_TURRET_SHOCKWAVE].m_range;
	if (g_profile.upgrade[UPGRADE_WAVE][UPGRADE_TIER_1] == true) {
		this.m_range += UPGRADE_WAVE_ADDITIONAL_RANGE;
	}

	this.m_live = true;
	
	this.m_size = 0;
	this.m_alpha = 1;
	
	var enemyHitList = new Array();
	
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
				if (enemyHitList.indexOf(tempEnemy) == -1) {
					var range = CalculateRangeBetweenTwoPoint (tempEnemy.m_x, tempEnemy.m_y, this.m_x, this.m_y);
					
					if (range < this.m_size * 0.5 + tempEnemy.m_size * 0.5) {
						var damage = this.m_damage;
						if (g_profile.upgrade[UPGRADE_WAVE][UPGRADE_TIER_2] == true) {
							damage *= UPGRADE_WAVE_RIP_DAMAGE_MULTIPLIER;
						}
						if (tempEnemy.m_energyShield == true) {
							damage *= ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE;
						}
						
						tempEnemy.TakeDamage (damage, this.m_armorPierce);
						enemyHitList.push (tempEnemy);
					}
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