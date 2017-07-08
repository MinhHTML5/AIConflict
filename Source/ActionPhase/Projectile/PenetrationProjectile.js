function PenetrationProjectile (battle, x, y, angle) {
	var MAX_DISTANCE = 15;
	var FRAME_BLINK_INTERVAL = 100;
	var NUMBER_OF_FRAME = 2;
	var currentFrame = 0;
	var frameCount = 0;
	
	var drillTime = 3000;
	if (g_profile.upgrade[UPGRADE_CANNON][UPGRADE_TIER_1] == true) {
		drillTime = UPGRADE_CANNON_PR_FUSE;
	}
	
	var fuse = 0;
	
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Penetrator/Penetrator.png");
	
	this.m_type = ENUM_PROJECTILE_PENETRATOR;
	this.m_x = x;
	this.m_y = y;
	this.m_angle = angle;
	
	this.m_speed = g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_speed;
	if (g_profile.upgrade[UPGRADE_CANNON][UPGRADE_TIER_2] == true) {
		this.m_speed *= UPGRADE_CANNON_PROJECTILE_SPEED;
	}
	this.m_damage = g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_damage;
	this.m_armorPierce = g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_armorPierce;
	this.m_areaOfEffect = g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_areaOfEffect;
	
	this.m_live = true;
	
	var target = null;
	var targetOffsetX = 0;
	var targetOffsetY = 0;
	var targetOffsetA = 0;
	
	var trailEmitter = g_particleDef.CreateBulletSmokeEmitter();
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			if (target == null) {
				var enemy = battle.GetEnemyList();
				
				this.m_x += this.m_speed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
				this.m_y -= this.m_speed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
				
				for (var i=0; i<enemy.length; i++) {
					var tempEnemy = enemy[i];
					if (tempEnemy.CheckPointCollision (this.m_x, this.m_y) == true &&  tempEnemy.m_live == true ) {
						g_particleEngine.RemoveEmitter (trailEmitter);
						if (tempEnemy.m_kineticShield == true) {
							this.Destroy();
						}
						else {
							target = tempEnemy;
							targetOffsetX = this.m_x - tempEnemy.m_x;
							targetOffsetY = this.m_y - tempEnemy.m_y;
							targetOffsetA = this.m_angle - tempEnemy.m_angle;
							
							if (targetOffsetX > MAX_DISTANCE) targetOffsetX = MAX_DISTANCE;
							if (targetOffsetY > MAX_DISTANCE) targetOffsetY = MAX_DISTANCE;
							if (targetOffsetX < -MAX_DISTANCE) targetOffsetX = -MAX_DISTANCE;
							if (targetOffsetY < -MAX_DISTANCE) targetOffsetY = -MAX_DISTANCE;
						}
						
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
			else {
				this.m_x = target.m_x + targetOffsetX;
				this.m_y = target.m_y + targetOffsetY;
				this.m_angle = target.m_angle + targetOffsetA;
				
				fuse += deltaTime;
				if (fuse >= drillTime || target.m_live == false) {
					this.m_live = 0;
					battle.SpawnExplosion (ENUM_SMALL_EXPLOSION, this.m_x, this.m_y);
					if (target.m_live == true) target.TakeDamage (this.m_damage, this.m_armorPierce);
				}
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
			g_graphicEngine.Draw (context, image, BATTLE_FIELD_BLOCK_SIZE * currentFrame, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, (this.m_x >> 0) - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1, false, false, this.m_angle);
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