function SuperLaserProjectile (battle, x, y, angle, enemy) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SuperLaser/Laser.png");
	var tipImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SuperLaser/LaserTip.png");
	var rImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SuperLaser/RefractLaser.png");
	
	this.m_type = ENUM_PROJECTILE_SUPER_LASER;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	this.m_target = enemy;
	
	this.m_damage = g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_armorPierce;
	this.m_areaOfEffect = g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_areaOfEffect;
	
	this.m_live = true;
	
	var range = 0;
	var life = 0;
	
	var laserX = this.m_x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	var laserY = this.m_y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	var tipX = this.m_x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE * 0.5;
	var tipY = this.m_y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE * 0.5;
	
	var refractionX1 = null;
	var refractionY1 = null;
	var refractionA1 = null;
	var refractionR1 = null;
	
	var refractionX2 = null;
	var refractionY2 = null;
	var refractionA2 = null;
	var refractionR2 = null;
	
	var refractionX3 = null;
	var refractionY3 = null;
	var refractionA3 = null;
	var refractionR3 = null;
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			if (life == 0) {
				if (this.m_target.m_energyShield == true) {
					this.m_target.TakeDamage (this.m_damage * ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE, this.m_armorPierce);
				}
				else {
					this.m_target.TakeDamage (this.m_damage, this.m_armorPierce);
				}
				range = CalculateRangeBetweenTwoPoint (this.m_target.m_x, this.m_target.m_y, this.m_x, this.m_y) - BATTLE_FIELD_BLOCK_SIZE * 0.5;
				range = range >> 0;
				if (range < 0) range = 1;
				
				var enemy = battle.GetEnemyList();
				var range1 = -1; var tempE1 = null;
				var range2 = -1; var tempE2 = null;
				var range3 = -1; var tempE3 = null;
				
				for (var i=0; i<enemy.length; i++) {
					if (enemy[i] != this.m_target) {
						var tempRange = Math.sqrt((this.m_target.m_x - enemy[i].m_x) * (this.m_target.m_x - enemy[i].m_x) + (this.m_target.m_y - enemy[i].m_y) * (this.m_target.m_y - enemy[i].m_y));
						if (range1 == -1 || tempRange < range1) {
							range2 = range1;
							tempE2 = tempE1;
							range1 = tempRange;
							tempE1 = enemy[i];
						}
						else if (range2 == -1 || tempRange < range2) {
							range3 = range2;
							tempE3 = tempE2;
							range2 = tempRange;
							tempE2 = enemy[i];
						}
						else if (range3 == -1 || tempRange < range3) {
							range3 = tempRange;
							tempE3 = enemy[i];
						}
					}
				}
				
				if (tempE1 != null) {
					if (range1 < this.m_areaOfEffect) {
						refractionX1 = tempE1.m_x;
						refractionY1 = tempE1.m_y;
						refractionA1 = CalculateAngleBetweenTwoPoint (this.m_target.m_x, this.m_target.m_y, refractionX1, refractionY1);
						refractionR1 = range1;
						if (tempE1.m_energyShield == true) {
							tempE1.TakeDamage (this.m_damage * LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER * ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE, this.m_armorPierce);
						}
						else {
							tempE1.TakeDamage (this.m_damage * LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER, this.m_armorPierce);
						}
					}
				}
				if (tempE2 != null) {
					if (range2 < this.m_areaOfEffect) {
						refractionX2 = tempE2.m_x;
						refractionY2 = tempE2.m_y;
						refractionA2 = CalculateAngleBetweenTwoPoint (this.m_target.m_x, this.m_target.m_y, refractionX2, refractionY2);
						refractionR2 = range2;
						if (tempE2.m_energyShield == true) {
							tempE2.TakeDamage (this.m_damage * LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER * ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE, this.m_armorPierce);
						}
						else {
							tempE2.TakeDamage (this.m_damage * LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER, this.m_armorPierce);
						}
					}
				}
				if (tempE3 != null && g_profile.upgrade[UPGRADE_LASER][UPGRADE_TIER_3] == true) {
					if (range3 < this.m_areaOfEffect) {
						refractionX3 = tempE3.m_x;
						refractionY3 = tempE3.m_y;
						refractionA3 = CalculateAngleBetweenTwoPoint (this.m_target.m_x, this.m_target.m_y, refractionX3, refractionY3);
						refractionR3 = range3;
						if (tempE3.m_energyShield == true) {
							tempE3.TakeDamage (this.m_damage * LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER * ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE, this.m_armorPierce);
						}
						else {
							tempE3.TakeDamage (this.m_damage * LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER, this.m_armorPierce);
						}
					}
				}
			}
			life += deltaTime;
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
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (laserX - offsetX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (laserY - offsetY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, range, 1, false, false, this.m_angle + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
			g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (tipX - offsetX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (tipY - offsetY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_target.m_x - offsetX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (this.m_target.m_y - offsetY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			
			
			if (refractionA1 != null) {
				g_graphicEngine.Draw (context, rImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((this.m_target.m_x + (Math.sin(refractionA1 * DEG_TO_RAD) - 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((this.m_target.m_y - (Math.cos(refractionA1 * DEG_TO_RAD) + 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, refractionR1, 1, false, false, refractionA1 + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
				g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((refractionX1 - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((refractionY1 - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			}
			if (refractionA2 != null) {
				g_graphicEngine.Draw (context, rImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((this.m_target.m_x + (Math.sin(refractionA2 * DEG_TO_RAD) - 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((this.m_target.m_y - (Math.cos(refractionA2 * DEG_TO_RAD) + 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, refractionR2, 1, false, false, refractionA2 + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
				g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((refractionX2 - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((refractionY2 - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			}
			if (refractionA3 != null && g_profile.upgrade[UPGRADE_LASER][UPGRADE_TIER_3] == true) {
				g_graphicEngine.Draw (context, rImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((this.m_target.m_x + (Math.sin(refractionA3 * DEG_TO_RAD) - 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0), ((this.m_target.m_y - (Math.cos(refractionA3 * DEG_TO_RAD) + 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, refractionR3, 1, false, false, refractionA3 + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
				g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((refractionX3 - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((refractionY3 - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			}
			
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
		
		if (life >= g_turretData[5].m_rateOfFire) {
			this.m_live = false;
		}
	}
	
	this.Destroy = function () {
	
	}
}