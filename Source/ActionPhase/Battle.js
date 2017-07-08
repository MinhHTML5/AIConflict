function Position () {
	this.x = 0;
	this.y = 0;
}

function WaveSaveData () {
	this.m_level = 0;
	this.m_life = 0;
	this.m_wave = 0;
	this.m_money = 0;
	
	this.m_turretType = new Array();
	this.m_turretX = new Array();
	this.m_turretY = new Array();
	this.m_turretNew = new Array();
	this.m_turretAI = new Array();
}

function Battle (gsActionPhase) {
	var SPAWN_PATH_DISPLAY_LATENCY = 750;
	
	var backGroundImage;
	var map = new Map(BATTLE_FIELD_SIZE_W, BATTLE_FIELD_SIZE_H);
	var spawnList = null;
	var turret = new Array();
	var enemy = new Array();
	var explosion = new Array();
	var pathDisplay = new Array();
	
	var level = 0;
	var life = 0;
	var money = 0;
	this.m_ammunition = 0;
	this.m_energy = 0;
	
	var buildIcon = new Array();
	for (var i=0; i<10; i++) {
		buildIcon[i] = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret " + (i + 1) + ".png");
	}
	var selectorImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Selector.png");
	
	var buildMode = true;
	var blockSelectingX = 0;
	var blockSelectingY = 0;
	var drawBuildSquare = false;
	
	var turretRangeColorLoopDir = 0;
	var turretRangeColorLoopVal = 0;
	var turretSelecting = null;
	var turretSelectingIndex = null;
	
	this.m_turretInfoIndex = -1;
	
	var spawnWave = 0;
	var spawnTimer = 0;
	var spawnIndex = 0;
	
	if (!navigator.isCocoonJS) {
		var battleBufferCanvas = document.createElement("canvas");
		battleBufferCanvas.width  = BATTLE_FIELD_SIZE_W;
		battleBufferCanvas.height = BATTLE_FIELD_SIZE_H;
		var battleBufferContext = battleBufferCanvas.getContext("2d");
	}
	
	var entryPoint = new Array();
	var exitPoint = new Array();
	var pathMapForCreep = new Array();
	var pathMapForBoss = new Array();
	
	var isMenuBattle = false;
	var spawnPathDisplayCount = 0;
	
	var screenShakeX = 0;
	var screenShakeY = 0;
	var screenShakeCount = 0;
	
	
	// CAMERA ================================================================
	this.camera = new CameraPosition(0, 0, CANVAS_W, CANVAS_H);
	
	this.Zoom = function (amount) {
		var tempW = this.camera.w;
		var tempH = this.camera.h;
		
		tempW += amount;
		if (tempW < CANVAS_W) tempW = CANVAS_W;
		else if (tempW > BATTLE_FIELD_SIZE_W) tempW = BATTLE_FIELD_SIZE_W;
		tempH = (tempW / CANVAS_W) * CANVAS_H;
		
		this.camera.x -= (tempW - this.camera.w) / 2;
		this.camera.y -= (tempH - this.camera.h) / 2;
		this.camera.w = tempW;
		this.camera.h = tempH;
		
		this.ApplyCamera();
	}
	
	this.ApplyCamera = function () {
		map.SetCamera(this.camera);
	}
	// =======================================================================
	
	
	
	// =======================================================================
	// Get - Set stuff
	this.GetEnemyList = function() {
		return enemy;
	}
	
	this.GetTurretList = function() {
		return turret;
	}
	
	this.GetLife = function () {
		return life;
	}
	
	this.GetMoney = function () {
		return money;
	}
	
	this.GetWaveNumber = function () {
		return spawnWave;
	}
	
	this.GetMaxWaveNumber = function () {
		return spawnList.length - 1;
	}
	
	this.GetNextWaveEnemyList = function () {
		return spawnList[spawnWave + 1];
	}
	
	this.StartWave = function () {
		if (!isMenuBattle) {
			g_UISoundNode.PlayStartWave();
			g_ambientMusicNode.Stop();
			g_actionMusicNode.Play(true);
		}
		
		spawnIndex = 0;
		spawnWave ++;
		buildMode = false;
		for (var i=0; i<turret.length; i++) {
			turret[i].m_new = false;
		}
		
		//pathDisplay = [];
		drawBuildSquare = false;
	}
	
	this.FinishWave = function () {
		if (!isMenuBattle) {
			g_ambientMusicNode.Play(true);
			g_actionMusicNode.Stop();
		}
		
		buildMode = true;
		this.m_ammunition = MAX_AMMUNITION;
		this.m_energy = MAX_ENERGY;
		
		if (spawnWave == spawnList.length-1) {
			gsActionPhase.FinishMission();
		}
		else {
			gsActionPhase.FinishWave();
		}
		
		var rewardRatio = MONEY_REWARD_RATIO;
		if (g_profile.upgrade[UPGRADE_BASE_2][UPGRADE_TIER_2] == true) {
			rewardRatio = UPGRADE_BASE_NEW_MONEY_REWARD
		}
		money = money * rewardRatio;
		
		spawnPathDisplayCount = SPAWN_PATH_DISPLAY_LATENCY;
	}
	
	this.IsBuildMode = function () {
		return buildMode;
	}
	
	this.BuildTurret = function (type) {
		var actualCost = g_turretData[type].m_cost
		if (type == ENUM_TURRET_GATLING && g_profile.upgrade[UPGRADE_GATLING][UPGRADE_TIER_3] == true) {
			actualCost *= UPGRADE_GATLING_COST_MULTIPLER;
		}
		
		if (money >= actualCost && drawBuildSquare == true) {
			this.SpawnTurret (type, blockSelectingX, blockSelectingY);
			money -= actualCost;
			g_gsActionPhase.HideBuildMenu();
			drawBuildSquare = false;
			
			//this.ClickOnBlock (blockSelectingX, blockSelectingY);
			g_UISoundNode.PlayBuild();
		}
	}
	
	this.ClickOnBlock = function (x, y) {
		blockSelectingX = x;
		blockSelectingY = y;
		
		var findATurret = false;
		for (var i=0; i<turret.length; i++) {
			if (turret[i].m_blockX == blockSelectingX && turret[i].m_blockY == blockSelectingY) {
				this.SelectTurret (i);
				findATurret = true;
				g_gsActionPhase.HideBuildMenu();
				drawBuildSquare = false;
				break;
			}
		}
		if (findATurret == false) {
			this.UnSelectTurret();
			if (buildMode == true && map.GetBuildableStatus(blockSelectingX, blockSelectingY) == true) {
				g_gsActionPhase.DisplayBuildMenu();
				drawBuildSquare = true;
			}
			else {
				g_gsActionPhase.HideBuildMenu();
				drawBuildSquare = false;
			}
		}
	}
	
	this.SelectTurret = function (index) {
		gsActionPhase.DisplayTurretInfo(turret[index]);
		turretSelecting = turret[index];
		turretSelectingIndex = index;
	}
	this.UnSelectTurret = function () {
		gsActionPhase.HideTurretInfo();
		turretSelecting = null;
		turretSelectingIndex = null;
	}
	
	this.SellTurret = function () {
		if (turretSelectingIndex != null) {
			var turretCost = g_turretData[turretSelecting.m_type].m_cost;
			if (turretSelecting.m_type == ENUM_TURRET_GATLING && g_profile.upgrade[UPGRADE_GATLING][UPGRADE_TIER_3] == true) {
				turretCost *= UPGRADE_GATLING_COST_MULTIPLER;
			}
			if (turretSelecting.m_new == true) {
				money += turretCost;
			}
			else {
				if (g_profile.upgrade[UPGRADE_BASE_1][UPGRADE_TIER_2] == true)
					money += (turretCost * UPGRADE_BASE_SELL_COST) >> 0;
				else
					money += (turretCost * TURRET_SELL_COST) >> 0;
			}
			turret.splice (turretSelectingIndex, 1);
			
			g_UISoundNode.PlaySell();
		}
	}
	// =======================================================================
	
	
	
	
	
	
	
	
	// =======================================================================
	// Battle placement
	this.LoadBattle = function (lvl) {
		level = lvl;
		spawnIndex = 0;
		spawnWave = 0;
		backGroundImage = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Background/" + g_missionData[level].background + ".jpg");
		life = g_missionData[level].life;
		money = g_missionData[level].money;
		spawnList = g_missionData[level].enemy;
		map.Import(g_missionData[level].map);
		map.RenderField (false);
		
		this.ApplyCamera();
		this.SetUpPathFinder();
		
		for (var i=0; i<map.object.length; i++) {
			var temp = this.SpawnTurret (map.object[i].type, map.object[i].x, map.object[i].y);
			temp.m_new = false;
		}
		
		this.m_ammunition = MAX_AMMUNITION;
		this.m_energy = MAX_ENERGY;
		
		g_inputEngine.ResetWheel();
		
		if (level == 0) {
			isMenuBattle = true;
			this.camera.y = 0;
			this.ApplyCamera();
		}
		
		g_ambientMusicNode.Stop();
		g_actionMusicNode.Stop();
		if (!isMenuBattle) {
			g_ambientMusicNode.Play(true);
		}
		
		spawnPathDisplayCount = SPAWN_PATH_DISPLAY_LATENCY;
	}
	
	
	this.SpawnTurret = function (type, x, y) {
		var temp;
		switch (type) {
			case ENUM_TURRET_GATLING:
				temp = new GatlingTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_CANNON:
				temp = new CannonTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_MISSILE:
				temp = new MissileTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_ACID:
				temp = new AcidTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_LASER:
				temp = new LaserTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_SHOCKWAVE:
				temp = new ShockWaveTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_GAUSS:
				temp = new GaussTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_TURRET_STATIC:
				temp = new StaticTurret (this, x, y);
				turret.push(temp);
				break;
			case ENUM_BUILDING_AMMUNITION:
				temp = new AmmunitionFactory (this, x, y);
				turret.push(temp);
				break;
			case ENUM_BUILDING_ENERGY:
				temp = new EnergyFactory (this, x, y);
				turret.push(temp);
				break;
		}
		
		return temp;
	}
	
	
	this.SpawnEnemy = function (type, entry, exit) {
		var angle = 0;
		if (type > 0) {
			if (entryPoint[entry].x == 0)								angle = 90;
			else if (entryPoint[entry].x == BATTLE_FIELD_BLOCK_W - 1)	angle = 270;
			else if (entryPoint[entry].y == 0)							angle = 180;
			else if (entryPoint[entry].y == BATTLE_FIELD_BLOCK_H - 1)	angle = 0;
			var rank = (type / 100) >> 0;
			var tempEnemy = null;
			var pathMap = null;
			switch (rank) {
				case 1:
					pathMap = pathMapForCreep;
					tempEnemy = new Fighter(this, type);
					break;
				case 2:
					pathMap = pathMapForCreep;
					tempEnemy = new Corvette(this, type);
					break;
				case 3:
					pathMap = pathMapForBoss;
					tempEnemy = new Frigate(this, type);
					break;
				case 4:
					pathMap = pathMapForBoss;
					tempEnemy = new Cruiser(this, type);
					tempEnemy.m_creepPath = pathMapForCreep[exit];
					break;
			}
			if (tempEnemy != null) {
				if (angle == 90) 		tempEnemy.Spawn (entryPoint[entry].x - 1, entryPoint[entry].y, angle, pathMap[exit], pathMap[exit][entryPoint[entry].x][entryPoint[entry].y]);
				else if (angle == 270) 	tempEnemy.Spawn (entryPoint[entry].x + 1, entryPoint[entry].y, angle, pathMap[exit], pathMap[exit][entryPoint[entry].x][entryPoint[entry].y]);
				else if (angle == 180)	tempEnemy.Spawn (entryPoint[entry].x, entryPoint[entry].y - 1, angle, pathMap[exit], pathMap[exit][entryPoint[entry].x][entryPoint[entry].y]);
				else if (angle == 0)	tempEnemy.Spawn (entryPoint[entry].x, entryPoint[entry].y, angle, pathMap[exit], pathMap[exit][entryPoint[entry].x][entryPoint[entry].y]);
				
				enemy.push (tempEnemy);
			}
		}
	}
	
	
	this.SpawnEnemyFromCruiser = function (type, x, y, angle, pathMap, entryValue) {
		var rank = (type / 100) >> 0;
		var tempEnemy = null;
		switch (rank) {
			case 1:
				tempEnemy = new Fighter(this, type);
				break;
			case 2:
				tempEnemy = new Corvette(this, type);
				break;
			case 3:
				tempEnemy = new Frigate(this, type);
				break;
		}
		if (tempEnemy != null) {
			tempEnemy.Spawn (x, y, angle, pathMap, entryValue);
			enemy.push (tempEnemy);
		}
	}
	
	
	
	this.SpawnExplosion = function (type, x, y) {
		switch (type) {
			case ENUM_GATLING_EXPLOSION:
				var temp = new GatlingExplosion (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_SMALL_EXPLOSION:
				var temp = new SmallExplosion (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_SMALL_EXPLOSION_DEBRIS:
				var temp = new SmallExplosionWithDebris (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_FIRE_EXPLOSION:
				var temp = new FireExplosion (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_SHOCKWAVE_EXPLOSION:
				var temp = new ShockWaveExplosion (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_STATIC_EXPLOSION:
				var temp = new StaticExplosion (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_BULLET_DESTROY_EXPLOSION:
				var temp = new BulletDestroyExplosion (this, x, y);
				explosion.push (temp);
				break;
			case ENUM_STATIC_DESTROY_EXPLOSION:
				var temp = new StaticDestroyExplosion (this, x, y);
				explosion.push (temp);
				break;
			
		}
	}
	
	
	this.SpawnPathDisplay = function (entry, exit) {
		var tempPD = new PathDisplay (this);
		tempPD.Spawn (entryPoint[entry].x, entryPoint[entry].y, pathMapForCreep[exit])
		pathDisplay.push (tempPD);
	}
	
	
	this.CreatePathDisplayEffect = function () {
		for (var i=0; i<entryPoint.length; i++) {
			for (var j=0; j<exitPoint.length; j++) {
				this.SpawnPathDisplay (i, j);
			}
		}
	}
	
	this.ShakeScreen = function (duration) {
		screenShakeCount = duration;
	}
	// =======================================================================
	
	
	
	
	
	
	
	// =======================================================================
	// Update - Loop
	this.Update = function (deltaTime) {
		if (deltaTime > 50) deltaTime = 50;
		// ========================================================
		// Spawning enemy & check for win condition
		if (buildMode == false) {
			var stillSpawning = false;
			spawnTimer += deltaTime;
			if (spawnTimer > SPAWNING_INTERVAL) {
				spawnTimer -= SPAWNING_INTERVAL;
				
				for (var i=0; i<entryPoint.length; i++) {
					var exit = (Math.random() * exitPoint.length) >> 0;
					
					if (isMenuBattle == false) {
						if (spawnIndex < spawnList[spawnWave][i].length) {
							this.SpawnEnemy (spawnList[spawnWave][i][spawnIndex], i, exit);
							stillSpawning = true;
						}
					}
					else {
						var a, b, c = 0;
						a = 1;
						b = ((Math.random() * 3) >> 0) + 1;
						c = ((Math.random() * 3) >> 0) + 1;
						this.SpawnEnemy (a * 100 + b * 10 + c, i, exit);
						stillSpawning = true;
					}
				}
				
				if (isMenuBattle == false) {
					if (stillSpawning == true) {
						spawnIndex ++;
					}
					else {
						if (enemy.length == 0) {
							this.FinishWave ();
						}
					}
				}
			}
		}
		else {
			spawnPathDisplayCount += deltaTime;
			if (spawnPathDisplayCount > SPAWN_PATH_DISPLAY_LATENCY) {
				this.CreatePathDisplayEffect();
				spawnPathDisplayCount = 0;
			}
		}
		// ========================================================
		
		
		// ========================================================
		// Update all entities on the map
		for (var i=0; i<turret.length; i++) {
			turret[i].Update (deltaTime);
		}
		for (var i=0; i<enemy.length; i++) {
			enemy[i].Update (deltaTime);
			if (enemy[i].m_live == false) {
				money += enemy[i].GetBounty();
				enemy.splice(i, 1);
				this.ShakeScreen (200);
			}
			else if (enemy[i].m_finish == true) {
				life -= enemy[i].m_damage;
				enemy.splice(i, 1);
				if (life <= 0 && isMenuBattle == false) {
					gsActionPhase.Defeated();
				}
			}
		}
		for (var i=0; i<explosion.length; i++) {
			explosion[i].Update (deltaTime);
			if (explosion[i].m_live == false) {
				explosion.splice(i, 1);
			}
		}
		
		
		for (var i=0; i<pathDisplay.length; i++) {
			pathDisplay[i].Update (deltaTime);
			if (pathDisplay[i].m_finish == true) {
				pathDisplay.splice(i, 1);
			}
		}
		// ========================================================
		
		
		
		
		// ========================================================
		// Base ammunition and energy regen
		var regenMultiplier = 1;
		if (g_profile.upgrade[UPGRADE_BASE_2][UPGRADE_TIER_1] == true) {
			regenMultiplier = UPGRADE_BASE_RESUPPLY_MULTIPLIER;
		}
		if (this.m_ammunition < MAX_AMMUNITION) {
			
			this.m_ammunition += BASE_AMMUNITION_PRODUCE_RATE * regenMultiplier * deltaTime * 0.001;
			if (this.m_ammunition > MAX_AMMUNITION) {
				this.m_ammunition = MAX_AMMUNITION;
			}
		}
		if (this.m_energy < MAX_ENERGY) {
			this.m_energy += BASE_ENERGY_PRODUCE_RATE * regenMultiplier * deltaTime * 0.001;
			if (this.m_energy > MAX_ENERGY) {
				this.m_energy = MAX_ENERGY;
			}
		}
		
		// ========================================================
		
		
		// ========================================================
		g_particleEngine.Update (deltaTime);
		// ========================================================
		
		
		if (turretSelecting != null || drawBuildSquare == true) {
			if (turretRangeColorLoopDir == 0) {
				turretRangeColorLoopVal += deltaTime * 0.5;
				if (turretRangeColorLoopVal >= 255) {
					turretRangeColorLoopVal = 255;
					turretRangeColorLoopDir = 1;
				}
			}
			else {
				turretRangeColorLoopVal -= deltaTime * 0.5;
				if (turretRangeColorLoopVal <= 0) {
					turretRangeColorLoopVal = 0;
					turretRangeColorLoopDir = 0;
				}
			}
		}
		
		
		// Screen shake
		if (screenShakeCount > 0) {
			screenShakeCount -= deltaTime;
			if (screenShakeCount <= 0) {
				screenShakeCount = 0;
				screenShakeX = 0;
				screenShakeY = 0;
			}
			else {
				var shakeOffset = (screenShakeCount * 0.02) >> 0;
				if (shakeOffset > 4) shakeOffset = 4;
				screenShakeX = shakeOffset - Math.random() * shakeOffset * 2;
				screenShakeY = shakeOffset - Math.random() * shakeOffset * 2;
			}
		}
	}
	
	this.Draw = function () {
		if (!navigator.isCocoonJS) {
			// Draw background
			g_graphicEngine.ClearCanvas (battleBufferCanvas, battleBufferContext, this.camera.x + screenShakeX, this.camera.y + screenShakeY, this.camera.w, this.camera.h);
			g_graphicEngine.Draw (battleBufferContext, backGroundImage, 0, 0, CANVAS_W, CANVAS_H, this.camera.x, this.camera.y, this.camera.w, this.camera.h);
			
			// Draw the platforms to the screen
			map.Draw(battleBufferContext, this.camera.x, this.camera.y, this.camera.w, this.camera.h);
			// Draw all turret on the view portion of the buffer
			for (var i=0; i<turret.length; i++) {
				if (turret[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					turret[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					turret[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					turret[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					turret[i].Draw (battleBufferContext);
				}
			}
			// Draw all enemy on the view portion of the buffer
			for (var i=0; i<enemy.length; i++) {
				if (enemy[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					enemy[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					enemy[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					enemy[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					enemy[i].Draw (battleBufferContext);
				}
			}
			// Draw all turret's bullet
			for (var i=0; i<turret.length; i++) {
				turret[i].DrawBullet (battleBufferContext, this.camera.x, this.camera.y, this.camera.w, this.camera.h);
			}
			// Draw all explosion on the view portion of the buffer
			for (var i=0; i<explosion.length; i++) {
				if (explosion[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					explosion[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					explosion[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					explosion[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					explosion[i].Draw (battleBufferContext);
				}
			}
			// Draw the path display
			for (var i=0; i<pathDisplay.length; i++) {
				if (pathDisplay[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					pathDisplay[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					pathDisplay[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					pathDisplay[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					pathDisplay[i].Draw (battleBufferContext);
				}
			}
			// Render the tower selecting onto buffer as well
			if (turretSelecting != null && turretSelecting.m_type <= ENUM_TURRET_STATIC) {
				g_graphicEngine.DrawCircle (battleBufferContext, turretSelecting.m_x, turretSelecting.m_y, turretSelecting.m_range, 2, turretRangeColorLoopVal, 255, 255, 1);
			}
			else if (this.m_turretInfoIndex > -1) {
				g_graphicEngine.DrawCircle (battleBufferContext, (blockSelectingX + 0.5) * BATTLE_FIELD_BLOCK_SIZE, (blockSelectingY + 0.5) * BATTLE_FIELD_BLOCK_SIZE, g_turretData[this.m_turretInfoIndex].m_range, 2, turretRangeColorLoopVal, 255, 255, 1);
			}
			// Render the selecting square
			if (drawBuildSquare == true) {
				g_graphicEngine.Draw (battleBufferContext, selectorImage, 0, 0, 70, 70, blockSelectingX * BATTLE_FIELD_BLOCK_SIZE - 10, blockSelectingY * BATTLE_FIELD_BLOCK_SIZE - 10, 70, 70, (turretRangeColorLoopVal / 255));
			}
			/*
			for (var i=0; i<BATTLE_FIELD_BLOCK_W; i++) {
				for (var j=0; j<BATTLE_FIELD_BLOCK_H; j++) {
					if (pathMapForBoss[0][i][j] < 99999) {
						g_graphicEngine.DrawTextRGB (battleBufferContext, pathMapForBoss[0][i][j], i * BATTLE_FIELD_BLOCK_SIZE + BATTLE_FIELD_BLOCK_SIZE / 2, j * BATTLE_FIELD_BLOCK_SIZE + BATTLE_FIELD_BLOCK_SIZE / 2, 300, "Spartakus", 8, false, false, "center", "middle", 4, 255, 255, 1);
					}
				}
			}
			*/
			// Draw all particle
			g_particleEngine.Draw (battleBufferContext, this.camera.x >> 0, this.camera.y >> 0, this.camera.w >> 0, this.camera.h >> 0);
			
			// Draw the view portion of the buffer to the screen
			g_graphicEngine.CopyCanvas (g_context, battleBufferCanvas, (this.camera.x >> 0) + screenShakeX, (this.camera.y >> 0) + screenShakeY, this.camera.w >> 0, this.camera.h >> 0, 0, 0, CANVAS_W, CANVAS_H);
		}
		else {
			// Draw background
			g_graphicEngine.DrawFast (g_context, backGroundImage, 0, 0);
			// Draw the platforms to the screen
			map.Draw(g_context, this.camera.x, this.camera.y, this.camera.w, this.camera.h);
			// Draw all turret on the view portion of the buffer
			for (var i=0; i<turret.length; i++) {
				if (turret[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					turret[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					turret[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					turret[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					turret[i].Draw (g_context);
				}
			}
			// Draw all enemy on the view portion of the buffer
			for (var i=0; i<enemy.length; i++) {
				if (enemy[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					enemy[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					enemy[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					enemy[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					enemy[i].Draw (g_context);
				}
			}
			// Draw all turret's bullet
			for (var i=0; i<turret.length; i++) {
				turret[i].DrawBullet (g_context, this.camera.x, this.camera.y, this.camera.w, this.camera.h);
			}
			// Draw all explosion on the view portion of the buffer
			for (var i=0; i<explosion.length; i++) {
				if (explosion[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					explosion[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					explosion[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					explosion[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					explosion[i].Draw (g_context);
				}
			}
			// Draw the path display
			for (var i=0; i<pathDisplay.length; i++) {
				if (pathDisplay[i].m_x >= this.camera.x - BATTLE_FIELD_BLOCK_SIZE                &&
					pathDisplay[i].m_x <= this.camera.x + this.camera.w + BATTLE_FIELD_BLOCK_SIZE &&
					pathDisplay[i].m_y >= this.camera.y - BATTLE_FIELD_BLOCK_SIZE                &&
					pathDisplay[i].m_y <= this.camera.y + this.camera.h + BATTLE_FIELD_BLOCK_SIZE ){
					pathDisplay[i].Draw (g_context);
				}
			}
			// Render the tower selecting onto buffer as well
			if (turretSelecting != null && turretSelecting.m_type <= ENUM_TURRET_STATIC) {
				g_graphicEngine.DrawCircle (g_context, turretSelecting.m_x - this.camera.x, turretSelecting.m_y - this.camera.y, turretSelecting.m_range, 2, turretRangeColorLoopVal, 255, 255, 1);
			}
			// Render the selecting square
			if (drawBuildSquare == true) {
				g_graphicEngine.Draw (g_context, selectorImage, 0, 0, 70, 70, blockSelectingX * BATTLE_FIELD_BLOCK_SIZE - 10 - this.camera.x, blockSelectingY * BATTLE_FIELD_BLOCK_SIZE - 10 - this.camera.y, 70, 70, (turretRangeColorLoopVal / 255));
			}
			// Draw all particle
			g_particleEngine.Draw (g_context, this.camera.x >> 0, this.camera.y >> 0, this.camera.w >> 0, this.camera.h >> 0);
		}
	}
	// =======================================================================
	
	
	
	
	// =======================================================================
	// Path finder
	this.SetUpPathFinder = function () {
		for (var i=0; i<BATTLE_FIELD_BLOCK_W; i++) {
			for (var j=0; j<BATTLE_FIELD_BLOCK_H; j++) {
				if (map.block[i][j] == 2) {
					var index = entryPoint.length;
					entryPoint[index] = new Position();
					entryPoint[index].x = i;
					entryPoint[index].y = j;
				}
				else if (map.block[i][j] == 3) {
					var index = exitPoint.length;
					exitPoint[index] = new Position();
					exitPoint[index].x = i;
					exitPoint[index].y = j;
				}
			}
		}
		
		
		for (var i=0; i<exitPoint.length; i++) {
			pathMapForCreep[i] = new Array();
			pathMapForBoss[i] = new Array();
			for (var j=0; j<BATTLE_FIELD_BLOCK_W; j++) {
				pathMapForCreep[i][j] = new Array();
				pathMapForBoss[i][j] = new Array();
				for (var k=0; k<BATTLE_FIELD_BLOCK_H; k++) {
					pathMapForCreep[i][j][k] = 99999;
					pathMapForBoss[i][j][k] = 99999;
				}
			}
			pathMapForCreep[i][exitPoint[i].x][exitPoint[i].y] = 0;
			pathMapForBoss[i][exitPoint[i].x][exitPoint[i].y] = 0;
			this.FindAdjacentBlockValue (i, exitPoint[i].x, exitPoint[i].y, pathMapForCreep, false);
			this.FindAdjacentBlockValue (i, exitPoint[i].x, exitPoint[i].y, pathMapForBoss, true);
		}
	}
	
	this.FindAdjacentBlockValue = function (entryIndex, x, y, pMap, forBoss) {
		if (x > 0) {
			if (y > 0 && map.block[x-1][y-1] != 1) {
				if (!forBoss || this.BlockPassAbleByBoss(x-1, y-1)) {
					if (pMap[entryIndex][x-1][y-1] > pMap[entryIndex][x][y] + 1) {
						pMap[entryIndex][x-1][y-1] = pMap[entryIndex][x][y] + 1;
						this.FindAdjacentBlockValue(entryIndex, x-1, y-1, pMap, forBoss);
					}
				}
			}
			if (map.block[x-1][y] != 1) {
				if (!forBoss || this.BlockPassAbleByBoss(x-1, y)) {
					if (pMap[entryIndex][x-1][y] > pMap[entryIndex][x][y] + 1) {
						pMap[entryIndex][x-1][y] = pMap[entryIndex][x][y] + 1;
						this.FindAdjacentBlockValue(entryIndex, x-1, y, pMap, forBoss);
					}
				}
			}
			if (y < BATTLE_FIELD_BLOCK_H - 1 && map.block[x-1][y+1] != 1) {
				if (!forBoss || this.BlockPassAbleByBoss(x-1, y+1)) {
					if (pMap[entryIndex][x-1][y+1] > pMap[entryIndex][x][y] + 1) {
						pMap[entryIndex][x-1][y+1] = pMap[entryIndex][x][y] + 1;
						this.FindAdjacentBlockValue(entryIndex, x-1, y+1, pMap, forBoss);
					}
				}
			}
		}
		if (x < BATTLE_FIELD_BLOCK_W - 1) {
			if (y > 0 && map.block[x+1][y-1] != 1) {
				if (!forBoss || this.BlockPassAbleByBoss(x+1, y-1)) {
					if (pMap[entryIndex][x+1][y-1] > pMap[entryIndex][x][y] + 1) {
						pMap[entryIndex][x+1][y-1] = pMap[entryIndex][x][y] + 1;
						this.FindAdjacentBlockValue(entryIndex, x+1, y-1, pMap, forBoss);
					}
				}
			}
			if (map.block[x+1][y] != 1) {
				if (!forBoss || this.BlockPassAbleByBoss(x+1, y)) {
					if (pMap[entryIndex][x+1][y] > pMap[entryIndex][x][y] + 1) {
						pMap[entryIndex][x+1][y] = pMap[entryIndex][x][y] + 1;
						this.FindAdjacentBlockValue(entryIndex, x+1, y, pMap, forBoss);
					}
				}
			}
			if (y < BATTLE_FIELD_BLOCK_H - 1 && map.block[x+1][y+1] != 1) {
				if (!forBoss || this.BlockPassAbleByBoss(x+1, y+1)) {
					if (pMap[entryIndex][x+1][y+1] > pMap[entryIndex][x][y] + 1) {
						pMap[entryIndex][x+1][y+1] = pMap[entryIndex][x][y] + 1;
						this.FindAdjacentBlockValue(entryIndex, x+1, y+1, pMap, forBoss);
					}
				}
			}
		}
		
		if (y > 0 && map.block[x][y-1] != 1) {
			if (!forBoss || this.BlockPassAbleByBoss(x, y-1)) {
				if (pMap[entryIndex][x][y-1] > pMap[entryIndex][x][y] + 1) {
					pMap[entryIndex][x][y-1] = pMap[entryIndex][x][y] + 1;
					this.FindAdjacentBlockValue(entryIndex, x, y-1, pMap, forBoss);
				}
			}
		}
		if (y < BATTLE_FIELD_BLOCK_H - 1 && map.block[x][y+1] != 1) {
			if (!forBoss || this.BlockPassAbleByBoss(x, y+1)) {
				if (pMap[entryIndex][x][y+1] > pMap[entryIndex][x][y] + 1) {
					pMap[entryIndex][x][y+1] = pMap[entryIndex][x][y] + 1;
					this.FindAdjacentBlockValue(entryIndex, x, y+1, pMap, forBoss);
				}
			}
		}
	}
	
	
	this.BlockPassAbleByBoss = function (x, y) {
		if (x > 0 && x < BATTLE_FIELD_BLOCK_W - 1 && y > 0 && y < BATTLE_FIELD_BLOCK_H - 1) {
			if (map.block[x][y] != 1) {
				var result = true;
				if (map.block[x-1][y-1] == 1) result = false;
				if (map.block[x-1][y]   == 1) result = false;
				if (map.block[x-1][y+1] == 1) result = false;
				if (map.block[x][y-1]   == 1) result = false;
				if (map.block[x][y+1]   == 1) result = false;
				if (map.block[x+1][y-1] == 1) result = false;
				if (map.block[x+1][y]   == 1) result = false;
				if (map.block[x+1][y+1] == 1) result = false;
				return result;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
	// =======================================================================
	
	
	
	
	
	// Save & Load ===========================================================
	this.ExportWaveDataToJSON = function () {
		var object = new WaveSaveData();
		object.m_level = level;
		object.m_wave = spawnWave;
		object.m_money = money;
		object.m_life = life;
		
		for (var i=0; i<turret.length; i++) {
			object.m_turretType[i] = turret[i].m_type;
			object.m_turretX[i] = turret[i].m_blockX;
			object.m_turretY[i] = turret[i].m_blockY;
			object.m_turretNew[i] = turret[i].m_new;
			
			object.m_turretAI[i] = new Array();
			for (var j=0; j<NUMBER_OF_AI_CHECK; j++) {
				object.m_turretAI[i][j] = new AIChecker();
				object.m_turretAI[i][j].CloneFromThisAI(turret[i].m_AIChecker[j]);
			}
		}
		
		return JSON.stringify(object);
	}
	
	this.ImportWaveDataFromJSON = function (string) {
		var object = JSON.parse(string);
		
		this.LoadBattle (object.m_level);
		spawnWave = object.m_wave;
		money = object.m_money;
		life = object.m_life;
		
		turret = new Array();
		for (var i=0; i<object.m_turretType.length; i++) {
			this.SpawnTurret (object.m_turretType[i], object.m_turretX[i], object.m_turretY[i]);
			turret[i].m_new = object.m_turretNew[i];
			for (var j=0; j<NUMBER_OF_AI_CHECK; j++) {
				turret[i].m_AIChecker[j].CloneFromThisAI(object.m_turretAI[i][j]);
			}
		}
	}
	// =======================================================================
	
	
	this.CheatKillAll = function () {
		if (PLATFORM == "TEST") {
			for (var i=0; i<enemy.length; i++) {
				enemy[i].TakeDamage (99999999999, 100);
			}
		}
	}
}