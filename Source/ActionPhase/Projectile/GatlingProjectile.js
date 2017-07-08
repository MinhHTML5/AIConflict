function GatlingProjectile (battle, x, y, angle) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Gatling/Gatling.png");
	
	var GATLING_IMAGE_H = 83;
	
	this.m_type = ENUM_PROJECTILE_GATLING;
	this.m_angle = angle;
	this.m_x = x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	this.m_y = y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_GATLING].m_speed;
	this.m_damage = g_bulletData[ENUM_PROJECTILE_GATLING].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_GATLING].m_armorPierce;
	
	if (g_profile.upgrade[UPGRADE_GATLING][UPGRADE_TIER_2] == true) {
		this.m_armorPierce += UPGRADE_GATLING_PIERCING;
	}
	
	this.m_live = true;
	
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var enemy = battle.GetEnemyList();
			
			this.m_x += this.m_speed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y -= this.m_speed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
			
			for (var i=0; i<enemy.length; i++) {
				var tempEnemy = enemy[i];
				if (tempEnemy.CheckPointCollision (this.m_x, this.m_y) == true && tempEnemy.m_live == true ) {
					battle.SpawnExplosion (ENUM_GATLING_EXPLOSION, this.m_x, this.m_y);

					// Direct hit damage
					if (tempEnemy.m_kineticShield == true) {
						tempEnemy.TakeDamage (this.m_damage * KINETIC_SHIELD_PENALTY_TO_PHYSIC_DAMAGE, this.m_armorPierce);
					}
					else {
						tempEnemy.TakeDamage (this.m_damage, this.m_armorPierce);
					}
					
					// No longer live
					this.m_live = false;
					break;
				}
			}
			
			
			// If fly out of the battle field
			if (this.m_x < -BATTLE_FIELD_BLOCK_SIZE) this.m_live = false;
			else if (this.m_x > BATTLE_FIELD_SIZE_W + BATTLE_FIELD_BLOCK_SIZE) this.m_live = false;
			else if (this.m_y < -BATTLE_FIELD_BLOCK_SIZE) this.m_live = false;
			else if (this.m_y > BATTLE_FIELD_SIZE_H + BATTLE_FIELD_BLOCK_SIZE) this.m_live = false;
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
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, GATLING_IMAGE_H, (this.m_x >> 0) - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, GATLING_IMAGE_H, 1, false, false, this.m_angle, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
	
	this.Destroy = function () {
		this.m_live = false;
		battle.SpawnExplosion (ENUM_GATLING_EXPLOSION, this.m_x, this.m_y);
	}
}