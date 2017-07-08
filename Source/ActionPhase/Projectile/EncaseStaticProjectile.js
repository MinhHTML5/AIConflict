function EncaseStaticProjectile (battle, x, y, angle) {
	var MAX_DISTANCE = 15;
	var FRAME_BLINK_INTERVAL = 200;
	var NUMBER_OF_FRAME = 4;
	var currentFrame = 0;
	var frameCount = 0;
	
	var SPARK_FRAME_BLINK_INTERVAL = 50;
	var NUMBER_OF_SPARK_FRAME = 8;
	var currentSparkFrame = 0;
	var sparkFrameCount = 0;
	
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Static/EncaseStatic.png");
	var image2 = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Static/Static.png");
	var image3 = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Static/Spark.png");
	
	this.m_type = ENUM_PROJECTILE_ENCASE_STATIC;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_speed;
	this.m_damage = g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_armorPierce;
	this.m_areaOfEffect = g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_areaOfEffect;
	
	if (g_profile.upgrade[UPGRADE_STATIC][UPGRADE_TIER_2] == true) {
		this.m_areaOfEffect += this.m_areaOfEffect * UPGRADE_STATIC_ADDITIONAL_AOE;
	}
	
	this.m_live = true;
	
	var detonated = false;
	var lifeTime = 0;
	var maxLifeTime = ENCASE_STATIC_BALL_LIFE_TIME;
	
	if (g_profile.upgrade[UPGRADE_STATIC][UPGRADE_TIER_1] == true) {
		maxLifeTime += UPGRADE_STATIC_ADDITIONAL_TIME;
	}
	
	var target = null;
	var targetOffsetX = 0;
	var targetOffsetY = 0;
	var targetOffsetA = 0;
	
	var trailEmitter = g_particleDef.CreateBulletStaticEmitter();
	
	
	
	
	var target = null;
	var targetDistance = null;
	var bonusDamage = 1;
	
	
	g_electricSoundNode.SetCameraHandler (battle.camera);
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			if (detonated == false) {
				this.m_x += this.m_speed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
				this.m_y -= this.m_speed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
				
				var enemy = battle.GetEnemyList();
				
				for (var i=0; i<enemy.length; i++) {
					var tempEnemy = enemy[i];
					if (tempEnemy.CheckPointCollision (this.m_x, this.m_y) == true && tempEnemy.m_live == true ) {
						battle.SpawnExplosion (ENUM_STATIC_EXPLOSION, this.m_x, this.m_y);
						g_particleEngine.RemoveEmitter (trailEmitter);
						detonated = true;
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
			
			if (detonated == true) {
				target = new Array();
				targetDistance = new Array();
				
				var enemy = battle.GetEnemyList();
				
				bonusDamage = 1;
			
				for (var i=0; i<enemy.length; i++) {
					var tempEnemy = enemy[i];
					if (tempEnemy.m_live == true ) {
						var range = CalculateRangeBetweenTwoPoint (this.m_x, this.m_y, tempEnemy.m_x, tempEnemy.m_y);
						if (range < this.m_areaOfEffect + tempEnemy.m_size * 0.5) {
							target.push (tempEnemy);
							targetDistance.push (range);
							if (g_profile.upgrade[UPGRADE_STATIC][UPGRADE_TIER_3] == true) {
								bonusDamage += UPGRADE_STATIC_DAMAGE_PER_ENEMY;
							}
						}
					}
				}
				
				for (var i=0; i<target.length; i++) {
					var tempEnemy = target[i];
					if (tempEnemy.m_energyShield == true) {
						tempEnemy.TakeDamage (this.m_damage * deltaTime * bonusDamage * ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE, this.m_armorPierce);
					}
					else {
						tempEnemy.TakeDamage (this.m_damage * deltaTime * bonusDamage, this.m_armorPierce);
					}
				}
				
				if (target.length > 0) {
					g_electricSoundNode.Play(this.m_x, this.m_y);
				}
				
				// Blink
				frameCount += deltaTime;
				if (frameCount >= FRAME_BLINK_INTERVAL) {
					frameCount -= FRAME_BLINK_INTERVAL;
					currentFrame ++;
					if (currentFrame == NUMBER_OF_FRAME) {
						currentFrame = 0;
					}
				}
				
				// Spark
				sparkFrameCount += deltaTime;
				if (sparkFrameCount >= SPARK_FRAME_BLINK_INTERVAL) {
					sparkFrameCount -= SPARK_FRAME_BLINK_INTERVAL;
					currentSparkFrame ++;
					if (currentSparkFrame == NUMBER_OF_SPARK_FRAME) {
						currentSparkFrame = 0;
					}
				}
				
				lifeTime += deltaTime;
				if (lifeTime > maxLifeTime) {
					this.Remove();
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
			
			if (detonated == false) {
				g_graphicEngine.Draw (context, image, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1, false, false, this.m_angle);
			}
			else {
				g_graphicEngine.Draw (context, image2, BATTLE_FIELD_BLOCK_SIZE * currentFrame, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1, false, false, this.m_angle);
				for (var i=0; i<target.length; i++) {
					var tempAngle = CalculateAngleBetweenTwoPoint (this.m_x, this.m_y, target[i].m_x, target[i].m_y);
					var actualFrame = (i + currentSparkFrame) % 8;
					g_graphicEngine.Draw (context, image3, BATTLE_FIELD_BLOCK_SIZE * actualFrame, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, ((this.m_x + (Math.sin(tempAngle * DEG_TO_RAD) - 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetX, ((this.m_y - (Math.cos(tempAngle * DEG_TO_RAD) + 1) * BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0) - offsetY, BATTLE_FIELD_BLOCK_SIZE, targetDistance[i], 1, false, false, tempAngle + 180, BATTLE_FIELD_BLOCK_SIZE * 0.5, BATTLE_FIELD_BLOCK_SIZE * 0.5);
				}
			}
			
			
			g_graphicEngine.SetDrawModeAddActive (context, false);
		}
	}
	
	this.Remove = function () {
		this.m_live = false;
		g_particleEngine.RemoveEmitter (trailEmitter);
	}
	
	this.Destroy = function () {
		this.Remove();
		battle.SpawnExplosion (ENUM_STATIC_DESTROY_EXPLOSION, this.m_x, this.m_y);
	}
}