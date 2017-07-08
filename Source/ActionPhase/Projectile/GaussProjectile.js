function GaussProjectile (battle, x, y, angle) {
	var GAUSS_IMAGE_LENGTH = 200;
	var GAUSS_ACTUAL_LENGTH = 2000;
	var CHECK_INTERVAL = 10;
	
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Gauss/Gauss.png");
	
	this.m_type = ENUM_PROJECTILE_GAUSS;
	this.m_x = x;
	this.m_y = y;
	this.m_startX = x;
	this.m_startY = y;
	this.m_angle = angle;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_GAUSS].m_speed;
	this.m_damage = g_bulletData[ENUM_PROJECTILE_GAUSS].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_GAUSS].m_armorPierce;
	
	this.m_live = true;
	
	var length = 0;
	var scale = GAUSS_IMAGE_LENGTH / GAUSS_ACTUAL_LENGTH;
	var enemyHitList = new Array();
	var emitterList = new Array();
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var numberOfCheck = (deltaTime / CHECK_INTERVAL) >> 0;
			for (var i=0; i<numberOfCheck; i++) {
				this.MoveAndCheck (CHECK_INTERVAL);
			}
			var timeLeft = deltaTime - (CHECK_INTERVAL * numberOfCheck);
			if (timeLeft > 0) {
				this.MoveAndCheck (timeLeft);
			}
			
			// If fly out of the battle field
			if (this.m_x < -BATTLE_FIELD_BLOCK_SIZE - GAUSS_ACTUAL_LENGTH) this.m_live = false;
			else if (this.m_x > BATTLE_FIELD_SIZE_W + BATTLE_FIELD_BLOCK_SIZE + GAUSS_ACTUAL_LENGTH) this.m_live = false;
			else if (this.m_y < -BATTLE_FIELD_BLOCK_SIZE - GAUSS_ACTUAL_LENGTH) this.m_live = false;
			else if (this.m_y > BATTLE_FIELD_SIZE_H + BATTLE_FIELD_BLOCK_SIZE + GAUSS_ACTUAL_LENGTH) this.m_live = false;
			
			if (this.m_live == false) {
				for (var i=emitterList.length-1; i>=0; i--) {
					g_particleEngine.RemoveEmitter (emitterList[i]);
				}
			}
		}
	}
	
	this.MoveAndCheck = function (subDeltaTime) {
		this.m_x += this.m_speed * subDeltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
		this.m_y -= this.m_speed * subDeltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
		
		if (length < GAUSS_ACTUAL_LENGTH) {
			length = CalculateRangeBetweenTwoPoint(this.m_startX, this.m_startY, this.m_x, this.m_y);
			if (length > GAUSS_ACTUAL_LENGTH) {
				length = GAUSS_ACTUAL_LENGTH;
			}
		}
		
		var enemy = battle.GetEnemyList();
		
		for (var i=0; i<enemy.length; i++) {
			var tempEnemy = enemy[i];
			if (enemyHitList.indexOf(tempEnemy) == -1) {
				if (tempEnemy.CheckPointCollision (this.m_x, this.m_y) == true && tempEnemy.m_live == true ) {
					// Direct hit damage
					if (g_profile.upgrade[UPGRADE_GAUSS][UPGRADE_TIER_2] == true) {
						if (Math.random() <= UPGRADE_GAUSS_CRITICAL_CHANCE) {
							tempEnemy.TakeDamage (this.m_damage * UPGRADE_GAUSS_CRITICAL_DAMAGE_MULTIPLIER, this.m_armorPierce);
						}
						else {
							tempEnemy.TakeDamage (this.m_damage, this.m_armorPierce);
						}
					}
					else {
						tempEnemy.TakeDamage (this.m_damage, this.m_armorPierce);
					}
					enemyHitList.push (tempEnemy);
					
					if (g_profile.upgrade[UPGRADE_GAUSS][UPGRADE_TIER_1] == true) {
						this.m_damage -= this.m_damage * UPGRADE_GAUSS_DAMAGE_REDUCTION;
					}
					else {
						this.m_damage -= this.m_damage * GAUSS_DAMAGE_LOSS;
					}
					
					var tempEmitter = g_particleDef.CreateDirectionalFragEmitter(this.m_angle);
					tempEmitter.Start();
					tempEmitter.m_x = tempEnemy.m_x;
					tempEmitter.m_y = tempEnemy.m_y;
					emitterList.push (tempEmitter);
				}
			}
		}
		
		for (var i=emitterList.length-1; i>=0; i--) {
			if (emitterList[i].m_start == false) {
				g_particleEngine.RemoveEmitter (emitterList[i]);
				emitterList.splice (i, 1);
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
		
			if (length * scale >= 1) {
				g_graphicEngine.SetDrawModeAddActive (context, true);
				g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, (length * scale) >> 0, ((this.m_x - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((this.m_y - BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, (length + BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, 1, false, false, this.m_angle, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
				g_graphicEngine.SetDrawModeAddActive (context, false);
			}
		}
	}
	
	this.Destroy = function () {
	
	}
}