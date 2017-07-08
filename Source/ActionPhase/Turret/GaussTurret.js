function GaussTurret (battle, x, y) {
	var ROTATING_PATROL_SPEED = 0.03;
	var ROTATING_UPDATE_LATENCY = 2000;
	var SHADOW_DISTANCE = 8;
	
	var newIndicator = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/NewIndicator.png");
	var baseImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gauss/Base.png");
	var shadowImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gauss/Shadow.png");
	var turretImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gauss/Turret.png");
	
	this.m_type = ENUM_TURRET_GAUSS;
	this.m_blockX = x;
	this.m_blockY = y;
	this.m_x = x * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
	this.m_y = y * BATTLE_FIELD_BLOCK_SIZE + (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0;
	this.m_angle = 0;
	
	this.m_name = g_turretData[ENUM_TURRET_GAUSS].m_name;
	this.m_range = g_turretData[ENUM_TURRET_GAUSS].m_range;
	this.m_rotateSpeed = g_turretData[ENUM_TURRET_GAUSS].m_rotateSpeed;
	this.m_rateOfFire = g_turretData[ENUM_TURRET_GAUSS].m_rateOfFire;
	this.m_ammoCost = g_turretData[ENUM_TURRET_GAUSS].m_ammoCost;
	this.m_energyCost = g_turretData[ENUM_TURRET_GAUSS].m_energyCost;
	
	this.bullet = new Array();
	
	var rotatingDir = 0;
	var rotatingUpdateCount = 0;
	
	var rateOfFireCount = 0;
	var aiRefreshInterval = 0;
	
	this.m_new = true;
	this.m_target = null;
	this.m_order = AI_ACTION_IDLE;
	
	
	this.m_provokedTarget = null;
	this.m_provokedTime = 0;
	this.m_disabledTime = 0;
	this.m_jammingTime = 0;
	
	
	
	this.m_AIChecker = new Array();
	for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
		this.m_AIChecker[i] = new AIChecker (battle, this);
	}
	this.m_AIChecker[0].m_conditionType = AI_CHECKER_SELF;
	this.m_AIChecker[0].m_conditionValue = AI_CHECKER_SELF_HAVE_TARGET;
	this.m_AIChecker[0].m_actionType = AI_ACTION_ATTACK;
	this.m_AIChecker[1].m_conditionType = AI_CHECKER_RANGE;
	this.m_AIChecker[1].m_conditionValue = AI_CHECKER_RANGE_NEAREST;
	this.m_AIChecker[1].m_actionType = AI_ACTION_ATTACK;
	
	
	
	
	g_gaussSoundNode.SetCameraHandler (battle.camera);
	g_disintegrateSoundNode.SetCameraHandler (battle.camera);
	
	
	this.Update = function (deltaTime) {
		if (battle.IsBuildMode() == false) {
			var realRange = this.m_range;
			if (this.m_jammingTime > 0) {
				realRange *= FRIGATE_RANGE_REDUCE_MULTIPLIER;
				this.m_jammingTime -= deltaTime;
			}
			
			if (this.m_provokedTime > 0) {
				this.m_provokedTime -= deltaTime;
				if (this.m_provokedTime < 0) {
					this.m_provokedTime = 0;
					this.m_provokedTarget = null;
				}
			}
			
			if (this.m_disabledTime > 0) {
				this.m_disabledTime -= deltaTime;
				if (this.m_disabledTime < 0) this.m_disabledTime = 0;
			}
			else {
				aiRefreshInterval += deltaTime;
				if (aiRefreshInterval >= INTERVAL_OF_AI_CHECK) {
					if (this.m_provokedTarget == null || CalculateRangeBetweenTwoPoint(this.m_provokedTarget.m_x, this.m_provokedTarget.m_y, this.m_x, this.m_y) > realRange) {
						// AI recheck time
						aiRefreshInterval = 0;
						this.m_order = 0;
						
						// Find all enemy currently in range
						var minRange = -1;
						var enemyInRange = new Array();
						for (var i=0; i<battle.GetEnemyList().length; i++) {
							enemyInRange[i] = battle.GetEnemyList()[i];
						}
						for (var i=enemyInRange.length-1; i>=0; i--) {
							var tempEnemy = enemyInRange[i];
							var range = CalculateRangeBetweenTwoPoint(tempEnemy.m_x, tempEnemy.m_y, this.m_x, this.m_y);
							if (range > realRange || tempEnemy.m_invisibleDuration > 0) {
								enemyInRange.splice (i, 1);
							}
						}
						
						// Loop through condition to find an action, and a target list
						var enemySuitable = enemyInRange;
						for (var i=0; i<NUMBER_OF_AI_CHECK; i++) {
							enemySuitable = this.m_AIChecker[i].Check (enemySuitable);
							this.m_order = this.m_AIChecker[i].m_actionType;
							if (this.m_order == AI_ACTION_NONE) {
								enemySuitable = enemyInRange;
							}
							else if (this.m_order == AI_ACTION_ATTACK || this.m_order == AI_ACTION_SPECIAL || this.m_order == AI_ACTION_IDLE) {
								if (enemySuitable.length == 0) {
									enemySuitable = enemyInRange;
								}
								else {
									break;
								}
							}
						}
						
						// If action equal attack
						if (this.m_order == AI_ACTION_ATTACK || this.m_order == AI_ACTION_SPECIAL) {
							// Find the nearest one in the suitable list
							for (var i=0; i<enemySuitable.length; i++) {
								var tempEnemy = enemySuitable[i];
								var range = CalculateRangeBetweenTwoPoint(tempEnemy.m_x, tempEnemy.m_y, this.m_x, this.m_y);
								if (minRange == -1 || range < minRange) {
									minRange = range;
									this.m_target = tempEnemy;
								}
							}
						}
						
						// If can't find a target, or attack command not issued
						if (this.m_target == null || this.m_order == AI_ACTION_NEXT || this.m_order == AI_CHECKER_NONE) {
							// If tower is fire at will, find nearest enemy in range
							this.m_order = AI_ACTION_IDLE;
						}
					}
					else {
						this.m_target = this.m_provokedTarget;
						this.m_order = AI_ACTION_ATTACK;
					}
				}
			}
		}
		else {
			this.m_order = AI_ACTION_IDLE;
			this.m_disabledTime = 0;
			this.m_provokedTime = 0;
			this.m_provokedTarget = null;
		}
		if (this.m_disabledTime <= 0) {
			if (this.m_order == AI_ACTION_ATTACK || this.m_order == AI_ACTION_SPECIAL) {
				if (this.m_target.m_live == false || this.m_target.m_finish == true || this.m_target.m_invisibleDuration > 0) {
					// If enemy is dead, time to recheck AI
					aiRefreshInterval = INTERVAL_OF_AI_CHECK;
					this.m_target = null;
					this.m_provokedTime = 0;
					this.m_provokedTarget = null;
				}
				else {
					var range = CalculateRangeBetweenTwoPoint(this.m_target.m_x, this.m_target.m_y, this.m_x, this.m_y);
				
					if (range <= realRange) {
						var targetAngle = CalculateAngleBetweenTwoPoint (this.m_x, this.m_y, this.m_target.m_x, this.m_target.m_y);
						
						var rotateSpeedThisLoop;
						if (g_profile.upgrade[UPGRADE_BASE_2][UPGRADE_TIER_3] == true)
							rotateSpeedThisLoop = this.m_rotateSpeed * deltaTime * UPGRADE_BASE_ROTATE_SPEED_MODIFIER;
						else
							rotateSpeedThisLoop = this.m_rotateSpeed * deltaTime;
							
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
						
						if (this.m_angle == targetAngle) {
							if (this.m_order == AI_ACTION_ATTACK)
								this.Attack ();
							else if (this.m_order == AI_ACTION_SPECIAL)
								this.SpecialAttack (deltaTime);
						}
					}
					else {
						// If enemy is out range, time to recheck AI
						aiRefreshInterval = INTERVAL_OF_AI_CHECK;
						this.m_target = null;
						this.m_provokedTime = 0;
						this.m_provokedTarget = null;
					}
				}
			}
			else if (this.m_order == AI_ACTION_IDLE) {
				rotatingUpdateCount += deltaTime;
				if (rotatingUpdateCount > ROTATING_UPDATE_LATENCY) {
					rotatingDir = (Math.random() * 3) >> 0;
					rotatingUpdateCount -= ROTATING_UPDATE_LATENCY;
				}
				
				if (rotatingDir == 1) {
					this.m_angle -= ROTATING_PATROL_SPEED * deltaTime;
				}
				else if (rotatingDir == 2) {
					this.m_angle += ROTATING_PATROL_SPEED * deltaTime;
				}
			}
		}
		
		
		
		if (rateOfFireCount > 0) {
			rateOfFireCount -= deltaTime;
		}
		
		if (this.m_angle < 0) this.m_angle += 360;
		if (this.m_angle > 360) this.m_angle -= 360;
		
		
		for (var i=this.bullet.length-1; i>=0; i--) {
			this.bullet[i].Update (deltaTime);
			if (this.bullet[i].m_live == false) {
				this.bullet.splice(i, 1);
			}
		}
	}
	
	this.Draw = function (context) {
		var offsetX = 0;
		var offsetY = 0;
		if (navigator.isCocoonJS) {
			offsetX = battle.camera.x;
			offsetY = battle.camera.y;
		}
		if (this.m_new) {
			g_graphicEngine.DrawFast (context, newIndicator, this.m_x - 10 - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, this.m_y - 10 - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0);
		}
		g_graphicEngine.DrawFast (context, baseImage, this.m_x - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, this.m_y - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0);
		g_graphicEngine.Draw (context, shadowImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, this.m_x + SHADOW_DISTANCE - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, this.m_y + SHADOW_DISTANCE - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1, false, false, this.m_angle);
		g_graphicEngine.Draw (context, turretImage, 0, 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, this.m_x - offsetX - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, this.m_y - offsetY - (BATTLE_FIELD_BLOCK_SIZE * 0.5) >> 0, BATTLE_FIELD_BLOCK_SIZE, BATTLE_FIELD_BLOCK_SIZE, 1, false, false, this.m_angle);
	}
	
	this.DrawBullet = function (context) {
		// Draw all this.bullet on the view portion of the buffer
		for (var i=0; i<this.bullet.length; i++) {
			this.bullet[i].Draw (context);
		}
	}
	
	
	this.Attack = function () {
		if (rateOfFireCount <= 0) {
			if (battle.m_ammunition >= this.m_ammoCost && battle.m_energy >= this.m_energyCost) {
				battle.m_ammunition -= this.m_ammoCost;
				battle.m_energy -= this.m_energyCost;
				
				rateOfFireCount += this.m_rateOfFire;
				
				var temp = new GaussProjectile (battle, this.m_x, this.m_y, this.m_angle);
				this.bullet.push (temp);
				
				g_gaussSoundNode.Play(this.m_x, this.m_y);
			}
		}
	}
	
	this.SpecialAttack = function (deltaTime) {
		var energyCost = DISINTEGRATE_ENERGY_COST_PER_SECOND * deltaTime * 0.001;
		if (battle.m_energy >= energyCost) {
			battle.m_energy -= energyCost;
			
			var temp = new DisintegrateBeam (battle, this.m_x, this.m_y, this.m_angle, this.m_target);
			this.bullet.push (temp);
			
			g_disintegrateSoundNode.Play(this.m_x, this.m_y);
		}
	}
	
	this.Disable = function (time) {
		this.m_disabledTime = time;
	}
	
	this.Provoke = function (target, time) {
		this.m_provokedTarget = target;
		this.m_provokedTime = time;
	}
	
	this.Jam = function (time) {
		this.m_jammingTime = time;
	}
}