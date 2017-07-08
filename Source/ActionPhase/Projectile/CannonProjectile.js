function CannonProjectile (battle, x, y, angle) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Cannon/Cannon.png");
	
	this.m_type = ENUM_PROJECTILE_CANNON;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_CANNON].m_speed;
	if (g_profile.upgrade[UPGRADE_CANNON][UPGRADE_TIER_2] == true) {
		this.m_speed *= UPGRADE_CANNON_PROJECTILE_SPEED;
	}
	this.m_damage = g_bulletData[ENUM_PROJECTILE_CANNON].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_CANNON].m_armorPierce;
	this.m_areaOfEffect = g_bulletData[ENUM_PROJECTILE_CANNON].m_areaOfEffect;
	
	this.m_live = true;
	
	
	var trailEmitter = g_particleDef.CreateBulletSparkEmitter();
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var enemy = battle.GetEnemyList();
			
			this.m_x += this.m_speed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y -= this.m_speed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
			
			for (var i=0; i<enemy.length; i++) {
				var tempEnemy = enemy[i];
				if (tempEnemy.CheckPointCollision (this.m_x, this.m_y) == true && tempEnemy.m_live == true ) {
					battle.SpawnExplosion (ENUM_SMALL_EXPLOSION, this.m_x, this.m_y);
					
					// Direct hit damage
					if (tempEnemy.m_kineticShield == true) {
						tempEnemy.TakeDamage (this.m_damage * KINETIC_SHIELD_PENALTY_TO_PHYSIC_DAMAGE, this.m_armorPierce);
					}
					else {
						tempEnemy.TakeDamage (this.m_damage, this.m_armorPierce);
					}
					
					// Splash damage
					for (var j=0; j<enemy.length; j++) {
						var tempEnemy2 = enemy[j];
						if (tempEnemy2 != tempEnemy) {
							var range = CalculateRangeBetweenTwoPoint (tempEnemy2.m_x, tempEnemy2.m_y, this.m_x, this.m_y);
							if (range <= this.m_areaOfEffect + tempEnemy2.m_size * 0.5) {
								var splashAP = 0;
								if (g_profile.upgrade[UPGRADE_CANNON][UPGRADE_TIER_3] == true) {
									splashAP = UPGRADE_CANNON_SHARPNEL_MULTIPLIER;
								}
								if (tempEnemy2.m_kineticShield == true) {
									tempEnemy2.TakeDamage (this.m_damage * KINETIC_SHIELD_PENALTY_TO_PHYSIC_DAMAGE, splashAP);
								}
								else {
									tempEnemy2.TakeDamage (this.m_damage, splashAP);
								}
							}
						}
					}
					
					// No longer live
					this.Remove();
					break;
				}
			}
			
			
			// If fly out of the battle field
			if (this.m_x < -BATTLE_FIELD_BLOCK_SIZE) this.Remove();
			else if (this.m_x > BATTLE_FIELD_SIZE_W + BATTLE_FIELD_BLOCK_SIZE) this.Remove();
			else if (this.m_y < -BATTLE_FIELD_BLOCK_SIZE) this.Remove();
			else if (this.m_y > BATTLE_FIELD_SIZE_H + BATTLE_FIELD_BLOCK_SIZE) this.Remove();
			
			// Update the emitter
			trailEmitter.m_x = this.m_x;
			trailEmitter.m_y = this.m_y;
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
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1, false, false, this.m_angle);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
	
	this.Remove = function () {
		this.m_live = false;
		g_particleEngine.RemoveEmitter (trailEmitter);
	}
	
	this.Destroy = function () {
		this.Remove();
		battle.SpawnExplosion (ENUM_BULLET_DESTROY_EXPLOSION, this.m_x, this.m_y);
	}
}