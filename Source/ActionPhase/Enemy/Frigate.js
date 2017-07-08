function Frigate (battle, type) {
	var SHIELD_IMAGE_SIZE = 100;
	var SHIELD_ACTUAL_SIZE = 130;
	var HP_BAR_LENGTH = 100;
	var HP_BAR_OFFSET = 10;
	
	var GRAVITY_SHIELD_IMAGE_SIZE = 220;
	var GRAVITY_SHIELD_ACTUAL_SIZE = 410;
	
	var dataID = (type / 10) >> 0;
	var variant = dataID - 30;
	var tier = type % 10;
	
	var image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/" + variant + "/" + tier + ".png");
	var kineticShieldImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/KShield.png");
	var energyShieldImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/EShield.png");
	var hpBar = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/HPBar.png");
	
	var gSheldImage  = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/GShield.png");
	
	this.m_x = 0;
	this.m_y = 0;
	this.m_blockX = 0;
	this.m_blockY = 0;
	
	this.m_live = true;
	this.m_finish = false;
	
	this.m_bounty = g_enemyData[dataID].m_bounty;
	this.m_damage = g_enemyData[dataID].m_damage;
	this.m_speed = g_enemyData[dataID].m_speed;
	this.m_HP = g_enemyData[dataID].m_maxHP * g_enemyTierHPMultilpier[tier - 1];
	this.m_maxHP = g_enemyData[dataID].m_maxHP * g_enemyTierHPMultilpier[tier - 1];
	this.m_armor = g_enemyData[dataID].m_armor;
	this.m_range = g_enemyData[dataID].m_range;
	
	this.m_rank = RANK_DEF_FRIGATE;
	this.m_size = 100;

	this.m_path = null;
	this.m_angle = 0;
	

	this.m_kineticShield = false;
	this.m_energyShield = false;
	
	this.m_acidDuration = 0;
	var acidDPS = 0;
	
	this.m_slowDuration = 0;
	var slowFactor = 1;
	
	this.m_fastDuration = 0;
	var fastFactor = 1;
	
	this.m_LEDuration = 0;
	
	this.m_DBDuration = 0;
	var DBAmplifier = 1;
	
	this.m_invisibleDuration = 0;
	
	
	var targetX = null;
	var targetY = null;
	var targetValue = null;
	var entryValue = -1;
	
	this.Spawn = function (x, y, angle, path, entry) {
		this.m_angle = angle;
		this.m_x = x * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
		this.m_y = y * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
		
		this.m_path = path;
		entryValue = entry;
	}
	
	var showHPBarDuration = 0;
	
	
	this.Update = function (deltaTime) {
		if (this.m_live == true) {
			var realSpeed = this.GetCurrentSpeed();
			this.m_blockX = (this.m_x / BATTLE_FIELD_BLOCK_SIZE) >> 0;
			this.m_blockY = (this.m_y / BATTLE_FIELD_BLOCK_SIZE) >> 0;
			
			if (this.m_blockX < 0 || this.m_blockX >= BATTLE_FIELD_BLOCK_W || this.m_blockY < 0 || this.m_blockY >= BATTLE_FIELD_BLOCK_H || targetValue == -1) {
				if (targetValue == -1) {
					if (this.m_x < -this.m_size || this.m_x > BATTLE_FIELD_BLOCK_W * BATTLE_FIELD_BLOCK_SIZE + this.m_size
					||  this.m_y < -this.m_size || this.m_y > BATTLE_FIELD_BLOCK_H * BATTLE_FIELD_BLOCK_SIZE + this.m_size) {
						this.m_finish = true;
					}
				}
			}
			else {
				var tx = targetX * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
				var ty = targetY * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
				if (targetX == null) {
					this.PickATarget(this.m_blockX, this.m_blockY);
				}
				else if (Math.abs(this.m_x - tx) < this.m_size && Math.abs(this.m_y - ty) < this.m_size) {
					if (targetValue > 0) {
						this.PickATarget(targetX, targetY);
					}
					else {
						targetValue = -1;
					}
				}
			
				var targetAngle = 0;
				if (ty == this.m_y) {
					if (tx > this.m_x)
						targetAngle = 90;
					else if (tx < this.m_x)
						targetAngle = -90;
				}
				else {
					targetAngle = Math.atan((tx - this.m_x) / (this.m_y - ty)) * RAD_TO_DEG;
					if (ty > this.m_y) {
						targetAngle += 180;
					}
					if (targetAngle < 0) targetAngle += 360;
				}
				
				var rotateSpeedThisLoop = realSpeed * deltaTime;
				if (Math.abs(targetAngle - this.m_angle) <= 180) {
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
				else {
					if (targetAngle > this.m_angle) this.m_angle -= rotateSpeedThisLoop;
					else if (targetAngle < this.m_angle) this.m_angle += rotateSpeedThisLoop;
				}
			}
			
				
			
			this.m_x += realSpeed * deltaTime * Math.sin(this.m_angle * DEG_TO_RAD);
			this.m_y -= realSpeed * deltaTime * Math.cos(this.m_angle * DEG_TO_RAD);
			
			if (this.m_angle < 0) this.m_angle += 360;
			if (this.m_angle > 360) this.m_angle -= 360;
			
			this.UseSkill(deltaTime);
			
			
			if (showHPBarDuration > 0) {
				showHPBarDuration -= deltaTime;
				if (showHPBarDuration < 0) showHPBarDuration = 0;
			}
			
			
			// Acid
			if (this.m_acidDuration > deltaTime) {
				this.m_acidDuration -= deltaTime;
				this.TakeDamage (deltaTime * acidDPS / 1000, 1);
			}
			else if (this.m_acidDuration > 0) {
				this.m_acidDuration = 0;
				this.TakeDamage (this.m_acidDuration * acidDPS / 1000, 1);
			}
			
			// Slow
			if (this.m_slowDuration > deltaTime) {
				this.m_slowDuration -= deltaTime;
			}
			else if (this.m_slowDuration > 0) {
				this.m_slowDuration = 0;
				slowFactor = 1;
			}
			
			// Fast
			if (this.m_fastDuration > deltaTime) {
				this.m_fastDuration -= deltaTime;
			}
			else if (this.m_fastDuration > 0) {
				this.m_fastDuration = 0;
				fastFactor = 1;
			}
			
			// Liquid Explosive
			this.m_LEDuration -= deltaTime;
			if (this.m_LEDuration <= 0) {
				this.m_LEDuration = 0;
			}
			
			// Disintegrate
			this.m_DBDuration -= deltaTime;
			if (this.m_DBDuration <= 0) {
				this.m_DBDuration = 0;
				DBAmplifier = 1;
			}
			
			
			// Invisible
			this.m_invisibleDuration -= deltaTime;
			if (this.m_invisibleDuration <= 0) {
				this.m_invisibleDuration = 0;
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
		
			var alpha = 1;
			if (this.m_invisibleDuration > 0) {
				alpha = 0.3;
			}
			
			g_graphicEngine.Draw (context, image, 0, 0, this.m_size, this.m_size, (this.m_x >> 0) - offsetX - (this.m_size * 0.5) >> 0, (this.m_y >> 0) - offsetY - (this.m_size * 0.5) >> 0, this.m_size, this.m_size, alpha, false, false, this.m_angle);
			g_graphicEngine.SetDrawModeAddActive (context, true);
			if (this.m_kineticShield == true) {
				g_graphicEngine.Draw (context, kineticShieldImage, 0, 0, SHIELD_IMAGE_SIZE, SHIELD_IMAGE_SIZE, (this.m_x >> 0) - offsetX - (SHIELD_ACTUAL_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (SHIELD_ACTUAL_SIZE * 0.5) >> 0, SHIELD_ACTUAL_SIZE, SHIELD_ACTUAL_SIZE, alpha, false, false);
			}
			if (this.m_energyShield == true) {
				g_graphicEngine.Draw (context, energyShieldImage, 0, 0, SHIELD_IMAGE_SIZE, SHIELD_IMAGE_SIZE, (this.m_x >> 0) - offsetX - (SHIELD_ACTUAL_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (SHIELD_ACTUAL_SIZE * 0.5) >> 0, SHIELD_ACTUAL_SIZE, SHIELD_ACTUAL_SIZE, alpha, false, false);
			}
			if (variant == 1) {
				g_graphicEngine.Draw (context, gSheldImage, 0, 0, GRAVITY_SHIELD_IMAGE_SIZE, GRAVITY_SHIELD_IMAGE_SIZE, (this.m_x >> 0) - offsetX - (GRAVITY_SHIELD_ACTUAL_SIZE * 0.5) >> 0, (this.m_y >> 0) - offsetY - (GRAVITY_SHIELD_ACTUAL_SIZE * 0.5) >> 0, GRAVITY_SHIELD_ACTUAL_SIZE, GRAVITY_SHIELD_ACTUAL_SIZE, 0.5, false, false);
			}
			g_graphicEngine.SetDrawModeAddActive (context, false);
			
			if (showHPBarDuration > 0) {
				var greenHPLength = HP_BAR_LENGTH * (this.m_HP / this.m_maxHP);
				g_graphicEngine.Draw (context, hpBar, 0, 0, 1, 4, (this.m_x >> 0) - offsetX - (this.m_size * 0.5) >> 0, (this.m_y >> 0) - offsetY - ((this.m_size * 0.5) >> 0) - HP_BAR_OFFSET, HP_BAR_LENGTH, 4, 1);
				g_graphicEngine.Draw (context, hpBar, 0, 4, 1, 4, (this.m_x >> 0) - offsetX - (this.m_size * 0.5) >> 0, (this.m_y >> 0) - offsetY - ((this.m_size * 0.5) >> 0) - HP_BAR_OFFSET, greenHPLength, 4, 1);
			}
		}
	}
	
	this.BuffAcid = function (duration, dps) {
		this.m_acidDuration = duration;
		acidDPS = dps;
	}
	
	this.BuffSlow = function (duration, slow) {
		this.m_slowDuration = duration;
		if (slowFactor > slow) {
			slowFactor = slow;
		}
	}
	
	this.BuffSpeed = function (duration, fast) {
		this.m_fastDuration = duration;
		if (fastFactor < fast) {
			fastFactor = fast;
		}
	}
	
	this.BuffInvisible = function (duration) {
		this.m_invisibleDuration = duration;
	}
	
	this.BuffLiquidExplosive = function (duration, damageMultiplier) {
		this.m_LEDuration = duration;
	}
	
	this.BuffDisintegrateBeam = function (duration, damageMultiplier) {
		this.m_DBDuration = duration;
		if (DBAmplifier == 1) {
			DBAmplifier = damageMultiplier;
		}
	}
	
	this.TakeDamage = function (damage, armorPierce) {
		if (this.m_live == true) {
			damage *= DBAmplifier;
			var realArmor;
			if (g_profile.upgrade[UPGRADE_ACID][UPGRADE_TIER_1] == true) {
				realArmor = this.m_armor - armorPierce - UPGRADE_ACID_ARMOUR_REDUCTION;
			}
			else {
				realArmor = this.m_armor - armorPierce;
			}
			
			if (realArmor < 0) realArmor = 0;
			
			this.m_HP -= (1 - realArmor) * damage;
			if (this.m_HP <= 0) {
				this.m_live = false;
				battle.SpawnExplosion (ENUM_SMALL_EXPLOSION_DEBRIS, this.m_x, this.m_y);
				
				if (this.m_LEDuration > 0) {
					battle.SpawnExplosion (ENUM_FIRE_EXPLOSION, this.m_x, this.m_y);
					
					var enemy = battle.GetEnemyList();
					for (var j=0; j<enemy.length; j++) {
						var tempEnemy = enemy[j];
						if (tempEnemy != this) {
							var range = CalculateRangeBetweenTwoPoint (tempEnemy.m_x, tempEnemy.m_y, this.m_x, this.m_y);
							if (range <= LIQUID_EXPLOSIVE_AOE) {
								if (tempEnemy.m_kineticShield == true) {
									tempEnemy.TakeDamage (this.m_maxHP * LIQUID_EXPLOSIVE_DAMAGE_MULTIPLIER * KINETIC_SHIELD_PENALTY_TO_PHYSIC_DAMAGE, 0);
								}
								else {
									tempEnemy.TakeDamage (this.m_maxHP * LIQUID_EXPLOSIVE_DAMAGE_MULTIPLIER, 0);
								}
							}
						}
					}
				}
			}
			
			showHPBarDuration = 3000;
		}
	}
	
	this.Heal = function (HP) {
		if (this.m_HP < this.m_maxHP) {
			this.m_HP += HP;
			if (this.m_HP > this.m_maxHP) {
				this.m_HP = this.m_maxHP;
			}
			showHPBarDuration = 3000;
		}
	}
	
	
	
	this.Purge = function () {
		this.m_slowDuration = 0;
		slowFactor = 1;
		this.m_fastDuration = 0;
		fastFactor = 1;
		this.m_acidDuration = 0;
		acidDPS = 0;
		this.m_LEDuration = 0;
		this.m_invisibleDuration = 0;
		
		
		
		this.m_kineticShield = false;
		this.m_energyShield = false;
	}
	
	
	this.UseSkill = function (deltaTime) {
		var turret = battle.GetTurretList();
		// Protector
		if (variant == 1) {
			for (var i=0; i<turret.length; i++) {
				for (var j=0; j<turret[i].bullet.length; j++) {
					var tempBullet = turret[i].bullet[j];
					var range = CalculateRangeBetweenTwoPoint (tempBullet.m_x, tempBullet.m_y, this.m_x, this.m_y);
					if (range <= this.m_range) {
						tempBullet.Destroy();
					}
				}
			}
		}
		// Tanker
		else if (variant == 2) {
			for (var i=0; i<turret.length; i++) {
				turret[i].Provoke (this, FRIGATE_PROVOKE_DURATION);
			}
		}
		// Drainer
		else if (variant == 3) {
			battle.m_energy -= (FRIGATE_ENERGY_DRAIN_PER_SEC + FRIGATE_ENERGY_DRAIN_MULTIPLIER * tier) * 0.001 * deltaTime;
			if (battle.m_energy < 0) battle.m_energy = 0;
		}
		// Jammer
		else if (variant == 4) {
			for (var i=0; i<turret.length; i++) {
				turret[i].Jam (FRIGATE_RANGE_REDUCE_DURATION);
			}
		}
		// Hacker
		else if (variant == 5) {
			for (var i=0; i<turret.length; i++) {
				var tempTurret = turret[i];
				var range = CalculateRangeBetweenTwoPoint (tempTurret.m_x, tempTurret.m_y, this.m_x, this.m_y);
				if (range <= this.m_range) {
					tempTurret.Disable (FRIGATE_DISABLE_DURATION);
				}
			}
		}
	}
	
	
	
	
	
	
	
	this.GetBounty = function () {
		var bounty = this.m_bounty;
		if (g_profile.upgrade[UPGRADE_WAVE][UPGRADE_TIER_3] == true) {
			var turret = battle.GetTurretList();
			for (var j=0; j<turret.length; j++) {
				var temp = turret[j];
				if (temp.m_type == ENUM_TURRET_SHOCKWAVE) {
					var range = CalculateRangeBetweenTwoPoint (temp.m_x, temp.m_y, this.m_x, this.m_y);
					if (range <= g_turretData[ENUM_TURRET_SHOCKWAVE].m_range) {
						bounty *= UPGRADE_WAVE_BOUNTY_MULTIPLIER;
						break;
					}
				}
			}
		}
		return bounty;
	}
	
	this.GetCurrentSpeed = function () {
		var realSpeed = this.m_speed;
		if (this.m_slowDuration > 0) {
			realSpeed *= slowFactor;
		}
		if (this.m_fastDuration > 0) {
			realSpeed *= fastFactor;
		}
		return realSpeed;
	}
	
	
	
	
	
	
	this.PickATarget = function (x, y) {
		var minValue = 99999;
		// Left
		if (x > 0 && this.m_path[x-1][y] < minValue) {
			minValue = this.m_path[x-1][y];
			targetX = x-1;
			targetY = y;
		}
		
		// Top
		if (y > 0 && this.m_path[x][y-1] < minValue) {
			minValue = this.m_path[x][y-1];
			targetX = x;
			targetY = y-1;
		}
		
		// Down
		if (y < BATTLE_FIELD_BLOCK_H - 1 && this.m_path[x][y+1] < minValue) {
			minValue = this.m_path[x][y+1];
			targetX = x;
			targetY = y+1;
		}
		
		// Right
		if (x < BATTLE_FIELD_BLOCK_W - 1 && this.m_path[x+1][y] < minValue) {
			minValue = this.m_path[x+1][y];
			targetX = x+1;
			targetY = y;
		}
		
		// Top - left
		if (x > 0 && y > 0 && this.m_path[x-1][y-1] < minValue) {
			minValue = this.m_path[x-1][y-1];
			targetX = x-1;
			targetY = y-1;
		}
		
		// Down - left
		if (x > 0 && y < BATTLE_FIELD_BLOCK_H - 1 && this.m_path[x-1][y+1] < minValue) {
			minValue = this.m_path[x-1][y+1];
			targetX = x-1;
			targetY = y+1;
		}
		
		// Top - right
		if (x < BATTLE_FIELD_BLOCK_W - 1 && y > 0 && this.m_path[x+1][y-1] < minValue) {
			minValue = this.m_path[x+1][y-1];
			targetX = x+1;
			targetY = y-1;
		}
		
		// Down - right
		if (x < BATTLE_FIELD_BLOCK_W - 1 && y < BATTLE_FIELD_BLOCK_H - 1 && this.m_path[x+1][y+1] < minValue) {
			minValue = this.m_path[x+1][y+1];
			targetX = x+1;
			targetY = y+1;
		}		
		
		targetValue = minValue;
	}
	
	
	
	this.GetProgress = function () {
		return 1 - (targetValue / entryValue);
	}
	
	this.CheckPointCollision = function (x, y) {
		if (Math.abs (this.m_x - x) < this.m_size * 0.5
		&&  Math.abs (this.m_y - y) < this.m_size * 0.5) {
			return true;
		}
		else {
			return false;
		}
	}
}