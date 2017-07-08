function NullMissileProjectile (battle, x, y, angle, enemy) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/NullMissile/NullMissile.png");
	
	this.m_type = ENUM_PROJECTILE_MISSILE;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	this.m_target = enemy;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_MISSILE].m_speed;
	this.m_damage = g_bulletData[ENUM_PROJECTILE_MISSILE].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_MISSILE].m_armorPierce;
	this.m_areaOfEffect = g_bulletData[ENUM_PROJECTILE_MISSILE].m_areaOfEffect;
	
	if (g_profile.upgrade[UPGRADE_MISSILE][UPGRADE_TIER_1] == true) {
		this.m_homingSpeed *= UPGRADE_MISSILE_HOMING;
	}
	
	this.m_live = true;
	
	
	var trailEmitter = g_particleDef.CreateBulletSmokeEmitter();
	
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var enemy = battle.GetEnemyList();
			
			if (this.m_target != null) {
				if (this.m_target.m_live == true && this.m_target.m_finish == false) {
					var targetAngle = CalculateAngleBetweenTwoPoint (this.m_x, this.m_y, this.m_target.m_x, this.m_target.m_y);
					
					var rotateSpeedThisLoop = this.m_homingSpeed * deltaTime;
					if (Math.abs(targetAngle - this.m_angle) <= 45) {
						if (targetAngle > this.m_angle + rotateSpeedThisLoop) {
							this.m_angle += rotateSpeedThisLoop;
						}
						else if (targetAngle < this.m_angle - rotateSpeedThisLoop) {
							this.m_angle -= rotateSpeedThisLoop;
						}
						else {
							this.m_angle = targetAngle;
						}
					}
					else if (Math.abs(targetAngle - this.m_angle) >= 315) {
						if (targetAngle > this.m_angle) this.m_angle -= rotateSpeedThisLoop;
						else if (targetAngle < this.m_angle) this.m_angle += rotateSpeedThisLoop;
					}
					else {
						this.m_target = null;
					}
				}
				else {
					this.m_target = null;
				}
			}
			else {
				if (g_profile.upgrade[UPGRADE_MISSILE][UPGRADE_TIER_2] == true) {
					var minRange = -1;
					for (var i=0; i<enemy.length; i++) {
						var targetAngle = CalculateAngleBetweenTwoPoint (this.m_x, this.m_y, enemy[i].m_x, enemy[i].m_y);
						if (Math.abs(targetAngle - this.m_angle) <= 45 || Math.abs(targetAngle - this.m_angle) >= 315) {
							var range = CalculateRangeBetweenTwoPoint (this.m_x, this.m_y, enemy[i].m_x, enemy[i].m_y);
							if (range < minRange || minRange == -1) {
								this.m_target = enemy[i];
								minRange = range;
							}
						}
					}
				}
			}
			
			
			this.m_x += this.m_speed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y -= this.m_speed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
			
			for (var i=0; i<enemy.length; i++) {
				var tempEnemy = enemy[i];
				if (tempEnemy.CheckPointCollision (this.m_x, this.m_y) == true && tempEnemy.m_live == true ) {
					battle.SpawnExplosion (ENUM_SHOCKWAVE_EXPLOSION, this.m_x, this.m_y);
					g_particleEngine.RemoveEmitter (trailEmitter);
				
					// Splash damage
					for (var j=0; j<enemy.length; j++) {
						var tempEnemy2 = enemy[j];
						var range = CalculateRangeBetweenTwoPoint (tempEnemy2.m_x, tempEnemy2.m_y, this.m_x, this.m_y);
						if (range <= this.m_areaOfEffect) {
							tempEnemy2.Purge();
							if (g_profile.upgrade[UPGRADE_MISSILE][UPGRADE_TIER_3] == true) {
								tempEnemy2.BuffSlow(UPGRADE_MISSILE_SLOW_DURATION, SLOW_BUFF_AMOUNT);
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
			
			if (this.m_angle < 0) this.m_angle += 360;
			if (this.m_angle > 360) this.m_angle -= 360;
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