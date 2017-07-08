function LoadImage() {
	// Background
	for (var i=1; i<=9; i++) {
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Background/" + i + ".jpg");
	}
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/Logo.png");
	
	// Building
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Building/AmmunitionFactory/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Building/EnergyFactory/Base.png");
	
	// Enemy
	for (var i=1; i<=5; i++) {
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/1/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/2/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/3/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/4/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/5/" + i + ".png");
		
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/1/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/2/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/3/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/4/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Fighter/5/" + i + ".png");
		
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/1/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/2/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/3/" + i + ".png");
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/4/" + i + ".png");
	}
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/Heal.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/Shield.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Corvette/Speed.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/Frigate/GShield.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/CDBar.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/HPBar.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/EShield.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Enemy/KShield.png");
	
	// Explosion
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/ExplosionDebris.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/FireExplosion.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/GatlingExplosion.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/QuickExplosion.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/QuickExplosionBlue.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/SmallExplosion.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/ShockWaveExplosion.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Explosion/StaticExplosion.png");
	
	// Particle
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle1.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle2.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle3.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle4.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle5.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/HotFrag.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/SmokeParticle.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/SparkParticle.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/StaticParticle.png");
	
	// Platform
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Block.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CIBL.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CIBR.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CITL.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-CITR.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COBL.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COBR.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COTL.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-COTR.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-EB.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-EL.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-ER.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-ET.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Platform/Platform-Mid.png");
	
	// Projectile
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Acid/AcidParticle.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Cannon/Cannon.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/DisintegrateBeam/DisintegrateBeam.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/DisintegrateBeam/DisintegrateBeamTip.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Gatling/Gatling.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Gauss/Gauss.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Laser/Laser.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Laser/LaserTip.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/LiquidExplosive/LEParticle.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Missile/Missile.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/NullMissile/NullMissile.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Penetrator/Penetrator.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/ShockWave/ShockWave.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SlowShockWave/SlowShockWave.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Static/EncaseStatic.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Static/Spark.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/Static/Static.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SuperLaser/Laser.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SuperLaser/LaserTip.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Projectile/SuperLaser/RefractLaser.png");
	
	// Turret
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Acid/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Acid/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Acid/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Cannon/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Cannon/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Cannon/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gatling/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gatling/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gatling/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gauss/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gauss/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Gauss/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Laser/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Laser/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Laser/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Missile/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Missile/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Missile/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/ShockWave/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Static/Base.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Static/Shadow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/Static/Turret.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Turret/NewIndicator.png");
	
	
	// Path
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/PathDisplay.png");
	
	// Main Menu
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/AmmunitionBar/AmmunitionBarE.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/AmmunitionBar/AmmunitionBarF.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/EnemyDesign/Generic.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/EnergyBar/EnergyBarE.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/EnergyBar/EnergyBarF.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/Particle/BlueParticle.png");
	for (var i=1; i<=10; i++) {
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/TurretDesign/Turret " + i + ".png");
	}
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/UpgradeIcon/CheckIcon.png");
	
	for (var i=1; i<=4; i++) {
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/Shop/Pack " + i + ".png");
	}
	
	for (var i=1; i<=10; i++) {
		for (var j=1; j<=3; j++) {
			g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/UpgradeIcon/" + i + "" + j + ".png");
		}
	}
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/WaitIcon/Wait.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/MissionLock.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/LeftArrow.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/RightArrow.png");
	
	
	
	// Map Editor
	for (var i=1; i<=10; i++) {
		g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Turret " + i + ".png");
	}
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MapEditor/Selector.png");
	
	// User Interface
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/BG-Left.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/BG-Mid.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/BG-Right.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/FG-Left.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/FG-Mid.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassBar/FG-Right.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Disable.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Down.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Over.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassButton/Button-Up.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftD.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftDis.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftN.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/LeftO.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidD.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidDis.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidN.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/MidO.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightD.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightDis.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightN.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassMenu/RightO.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Corner.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Left-Edge.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Mid.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassPanel/BG-Top-Edge.png");
	
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/IconButton/Button-Down.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/IconButton/Button-Over.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/IconButton/Button-Up.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Down.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Over.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/TurretButton/Button-Up.png");
	
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/LeftN.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/RightN.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/MidN.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/LeftO.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/RightO.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/MidO.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/LeftI.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/RightI.png");
	g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/UI/GlassScroll/MidI.png");
	
}