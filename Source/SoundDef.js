var g_UISoundNode = new UISoundNode();

var g_gatlingSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/GatlingShot.mp3", 100, 0.4, 0.6);
var g_cannonSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/CannonShot.mp3", 100, 0.7, 1);
var g_bulletDestroySoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/BulletDestroy.mp3", 100, 0.7, 1);
var g_gatlingImpactSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/GatlingImpact.mp3", 100, 0.5, 0.7);
var g_gaussSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/GaussShot.mp3", 100, 0.7, 1);
var g_missileSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/MissileShot.mp3", 100, 0.7, 1);
var g_staticSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/StaticBallShot.mp3", 100, 0.7, 1);
var g_waveSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/WaveShot.mp3", 100, 0.7, 1);
var g_nullHitSoundNode = new ActionSingleSoundNode(ROOT_FOLDER + "Sound/NullHit.mp3", 100, 0.7, 1);

var g_disintegrateSoundNode = new ActionLoopSoundNode(ROOT_FOLDER + "Sound/Disintegrate.mp3", 100, 0.5, 0.7);
var g_electricSoundNode = new ActionLoopSoundNode(ROOT_FOLDER + "Sound/Electric.mp3", 100, 0.7, 1);
var g_laserSoundNode = new ActionLoopSoundNode(ROOT_FOLDER + "Sound/Laser.mp3", 100, 0.7, 1);
var g_spraySoundNode = new ActionLoopSoundNode(ROOT_FOLDER + "Sound/Spray.mp3", 100, 0.5, 0.7);

var g_explosionSoundNode = new ActionRandomSoundNode(100, 0.8, 1);
g_explosionSoundNode.AddFileName (ROOT_FOLDER + "Sound/Explosion 3.mp3");
g_explosionSoundNode.AddFileName (ROOT_FOLDER + "Sound/Explosion 4.mp3");

var g_explosionDebrisSoundNode = new ActionRandomSoundNode(100, 0.8, 1);
g_explosionDebrisSoundNode.AddFileName (ROOT_FOLDER + "Sound/Explosion 1.mp3");
g_explosionDebrisSoundNode.AddFileName (ROOT_FOLDER + "Sound/Explosion 2.mp3");

var g_mainMenuMusic = new MusicNode (ROOT_FOLDER + "Sound/Music.mp3");
var g_ambientMusicNode = new MusicNode (ROOT_FOLDER + "Sound/Ambient.mp3");
var g_actionMusicNode = new MusicNode (ROOT_FOLDER + "Sound/BGMusic.mp3");

var g_introMusicNode;
if (PLATFORM == "ARMORGAME") {
	g_introMusicNode = new MusicNode (ROOT_FOLDER + "ArmorGames/Intro.mp3");
}


function LoadSound() {
	g_UISoundNode.Load();

	g_gatlingSoundNode.Load();
	g_cannonSoundNode.Load();
	g_bulletDestroySoundNode.Load();
	g_gatlingImpactSoundNode.Load();
	g_gaussSoundNode.Load();
	g_missileSoundNode.Load();
	g_staticSoundNode.Load();
	g_waveSoundNode.Load();
	g_nullHitSoundNode.Load();

	g_disintegrateSoundNode.Load();
	g_electricSoundNode.Load();
	g_laserSoundNode.Load();
	g_spraySoundNode.Load();

	g_explosionSoundNode.Load();
	g_explosionSoundNode.Load();
	g_explosionSoundNode.Load();

	g_explosionDebrisSoundNode.Load();
	g_explosionDebrisSoundNode.Load();
	g_explosionDebrisSoundNode.Load();

	g_mainMenuMusic.Load();
	g_ambientMusicNode.Load();
	g_actionMusicNode.Load();
	
	if (PLATFORM == "ARMORGAME") {
		g_introMusicNode.Load();
	}
}