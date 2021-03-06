<?php
	require 'SDK/facebook.php';

	$app_id = '1416241065312513';
	$app_secret = 'b3b8648f8916a5422fb31ca795b9fab9';
	$app_namespace = 'aiconflict';
	$app_url = 'https://apps.facebook.com/' . $app_namespace . '/';
	$scope = 'email,publish_actions';

	// Init the Facebook SDK
	$facebook = new Facebook(array(
		 'appId'  => $app_id,
		 'secret' => $app_secret,
	));

	// Get the current user
	$user = $facebook->getUser();

	// If the user has not installed the app, redirect them to the Login Dialog
	if (!$user) {
		$loginUrl = $facebook->getLoginUrl(array(
		  'scope' => $scope,
		  'redirect_uri' => $app_url,
		));

		print('<script> top.location.href=\'' . $loginUrl . '\'</script>');
	}
?>



<!DOCTYPE html>
<html lang=en>
<head>
	<meta charset=utf-8>
	<title>AI-Conflict Tower Defense</title>	
	
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="apple-touch-icon" href="images/icon.png" />
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
	<style>
		body {
			margin: 0;
		}

		canvas {
			padding-left: 0;
			padding-right: 0;
			display: block;
		}
		
		@font-face {
			font-family: "Spartakus";
			src: url('../fonts/Spartakus.ttf') format('truetype');
			src: local('☺'), 
				url('../fonts/Spartakus.woff') format('woff');
		}
		
		@font-face {
			font-family: "Nova";
			src: url('../fonts/Nova.ttf') format('truetype');
			src: local('☺'), 
				url('../fonts/Nova.woff') format('woff');
		}
	</style>
	
	
	
</head>

<body>
	<div id="fb-root"></div>
    <script src="//connect.facebook.net/en_US/all.js"></script>
	<script>
		var ROOT_FOLDER = "../";
		var PLATFORM = "FACEBOOK";
		var ENABLE_ADS = true;
		
		var FB_appID = '<?php echo $app_id ?>';
		var FB_appNamespace = '<?php echo $app_namespace ?>';
		var FB_userID = '<?php echo $user ?>';;
		
		// Initialize the JS SDK
		FB.init({
			appId: FB_appID,
			frictionlessRequests: true,
			cookie: true,
		});


		var buyingPacket;
		function PurchaseUpgradePack (index) {
			var curTime = new Date();
			var requestID = index + "-" + FB_userID + "-" + curTime;
			buyingPacket = index;
			
			FB.ui({
				method: 'pay',
				action: 'purchaseitem',
				product: 'http://ai-conflict.com/Facebook/IAP/Pack' + index + '.html',
				request_id: requestID,
				quantity: 1
				},
				PurchaseCallback
			);
		}

		function PurchaseCallback(paymentData) {
			if (paymentData.status == "completed") {
				setTimeout (PollPaymentUpdate, 5000);
			}
			else {
				PopSubState();
				// Push a fail dialogue here
			}
		}
		
		var oldUpgradePoint;
		function PollPaymentUpdate () {
			oldUpgradePoint = g_profile.upgradePoint;
			g_profile.Load (PollPaymentUpdateCallback);
		}
		function PollPaymentUpdateCallback() {
			if (oldUpgradePoint != g_profile.upgradePoint) {
				g_gsShop.PurchaseSuccess();
			}
			else {
				setTimeout (PollPaymentUpdate, 5000);
			}
		}
	</script>
	<script src="../Source/Ads.js"></script>
	
	<script src="../Source/Engine/GraphicEngine.js"></script>
	<script src="../Source/Engine/InputEngine.js"></script>
	<script src="../Source/Engine/ParticleEngine.js"></script>
	<script src="../Source/Engine/StateEngine.js"></script>
	
	<script src="../Source/UI/GlassPanel.js"></script>
	<script src="../Source/UI/GlassBar.js"></script>
	<script src="../Source/UI/GlassMenu.js"></script>
	<script src="../Source/UI/GlassButton.js"></script>
	<script src="../Source/UI/GlassSquareButton.js"></script>
	<script src="../Source/UI/GlassScroll.js"></script>
	<script src="../Source/UI/IconButton.js"></script>
	<script src="../Source/UI/TurretButton.js"></script>
	
	<script src="../Source/Localization/LocalizationEN.js"></script>

	<script src="../Source/ActionPhase/AIChecker.js"></script>
	<script src="../Source/ActionPhase/PathDisplay.js"></script>
	<script src="../Source/ActionPhase/ParticleDef.js"></script>
	
	<script src="../Source/ActionPhase/Explosion/GatlingExplosion.js"></script>
	<script src="../Source/ActionPhase/Explosion/SmallExplosion.js"></script>
	<script src="../Source/ActionPhase/Explosion/SmallExplosionWithDebris.js"></script>
	<script src="../Source/ActionPhase/Explosion/FireExplosion.js"></script>
	<script src="../Source/ActionPhase/Explosion/ShockWaveExplosion.js"></script>
	<script src="../Source/ActionPhase/Explosion/StaticExplosion.js"></script>
	<script src="../Source/ActionPhase/Explosion/BulletDestroyExplosion.js"></script>
	<script src="../Source/ActionPhase/Explosion/StaticDestroyExplosion.js"></script>
	
	<script src="../Source/ActionPhase/Projectile/AcidProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/CannonProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/GatlingProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/LaserProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/MissileProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/ShockWaveProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/GaussProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/PenetrationProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/LiquidExplosiveProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/SuperLaserProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/StaticProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/NullMissileProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/SlowShockWaveProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/EncaseStaticProjectile.js"></script>
	<script src="../Source/ActionPhase/Projectile/DisintegrateBeam.js"></script>
	
	
	<script src="../Source/ActionPhase/Turret/AcidTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/CannonTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/GatlingTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/LaserTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/MissileTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/ShockWaveTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/GaussTurret.js"></script>
	<script src="../Source/ActionPhase/Turret/StaticTurret.js"></script>
	
	<script src="../Source/ActionPhase/Building/AmmunitionFactory.js"></script>
	<script src="../Source/ActionPhase/Building/EnergyFactory.js"></script>
	
	
	<script src="../Source/ActionPhase/Enemy/Fighter.js"></script>
	<script src="../Source/ActionPhase/Enemy/Corvette.js"></script>
	<script src="../Source/ActionPhase/Enemy/Frigate.js"></script>
	<script src="../Source/ActionPhase/Enemy/Cruiser.js"></script>
	
	<script src="../Source/ActionPhase/Map.js"></script>
	<script src="../Source/ActionPhase/Battle.js"></script>

	
	<script src="../Source/State/GSLoader.js"></script>
	<script src="../Source/State/GSMainMenu.js"></script>
	<script src="../Source/State/GSActionPhase.js"></script>
	<script src="../Source/State/GSUpgrade.js"></script>
	<script src="../Source/State/GSInfo.js"></script>
	<script src="../Source/State/GSOption.js"></script>
	<script src="../Source/State/GSSelectMission.js"></script>
	<script src="../Source/State/GSShop.js"></script>
	<script src="../Source/State/GSInGameMenu.js"></script>
	<script src="../Source/State/GSWait.js"></script>
	<script src="../Source/State/GSCredit.js"></script>
	<script src="../Source/State/GSTutorial.js"></script>
	
	
	<script src="../Source/GameData.js"></script>
	<script src="../Source/SoundManager.js"></script>
	<script src="../Source/Profile.js"></script>
	<script src="../Source/MessageManager.js"></script>
	
	<script src="../Source/Sound/UISoundNode.js"></script>
	<script src="../Source/Sound/ActionSingleSoundNode.js"></script>
	<script src="../Source/Sound/ActionLoopSoundNode.js"></script>
	<script src="../Source/Sound/ActionRandomSoundNode.js"></script>
	<script src="../Source/Sound/MusicNode.js"></script>
	
	<script src="../Source/ImageDef.js"></script>
	<script src="../Source/UpgradeDef.js"></script>
	<script src="../Source/MissionDef.js"></script>
	
	<script src="../Source/Core.js"></script>
	<script src="../Source/Main.js"></script>
	
	<script src="../Source/SoundDef.js"></script>
	
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-52347416-1', 'auto');
		ga('send', 'pageview');
	</script>
</body>
</html>