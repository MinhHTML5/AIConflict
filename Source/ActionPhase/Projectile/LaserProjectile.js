function LaserProjectile (battle, x, y, angle, enemy) {
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Laser/Laser.png");
	var tipImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Laser/LaserTip.png");
	
	this.m_type = ENUM_PROJECTILE_LASER;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	this.m_target = enemy;
	
	this.m_damage = g_bulletData[ENUM_PROJECTILE_LASER].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_LASER].m_armorPierce;
	
	this.m_live = true;
	
	var range = 0;
	var life = 0;
	
	var laserX = this.m_x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	var laserY = this.m_y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE;
	var tipX = this.m_x + Math.sin(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE * 0.5;
	var tipY = this.m_y - Math.cos(this.m_angle * DEG_TO_RAD) * BATTLE_FIELD_BLOCK_SIZE * 0.5;
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			if (life == 0) {
				var damage = this.m_damage;
				
				if (this.m_target.m_energyShield == true) {
					damage *= ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE;
				}
				if (this.m_target.m_kineticShield == true && g_profile.upgrade[UPGRADE_LASER][UPGRADE_TIER_1] == true) {
					damage *= UPGRADE_LASER_VS_KINETIC_MULTIPLIER;
				}
				
				this.m_target.TakeDamage (damage, this.m_armorPierce);
				range = CalculateRangeBetweenTwoPoint (this.m_target.m_x, this.m_target.m_y, this.m_x, this.m_y) - BATTLE_FIELD_BLOCK_SIZE * 0.5;
				range = range >> 0;
				if (range < 0) range = 1;
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
			g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((laserX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((laserY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, range, 1, false, false, this.m_angle + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
			g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((tipX - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((tipY - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			g_graphicEngine.Draw (context, tipImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((this.m_target.m_x - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((this.m_target.m_y - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1);
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
		
		if (life >= g_turretData[ENUM_TURRET_LASER].m_rateOfFire) {
			this.m_live = false;
		}
	}
	
	this.Destroy = function () {
		
	}
}