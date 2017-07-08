function UISoundNode () {
	var FILE_NAME_OVER = ROOT_FOLDER + "Sound/UIOver.mp3";
	var FILE_NAME_DOWN = ROOT_FOLDER + "Sound/UIDown.mp3";
	var FILE_NAME_UP = ROOT_FOLDER + "Sound/UIUp.mp3";
	
	var FILE_NAME_BUILD = ROOT_FOLDER + "Sound/UIBuild.mp3";
	var FILE_NAME_SELL = ROOT_FOLDER + "Sound/UISell.mp3";
	var FILE_NAME_START_WAVE = ROOT_FOLDER + "Sound/UIStartWave.mp3";
	
	var DELAY = 200;
	var soundCoolDown = 0;
	
	
	this.Load = function () {
		if (AUDIO_ENABLE) {
			g_soundManager.LoadSound (FILE_NAME_OVER);
			g_soundManager.LoadSound (FILE_NAME_DOWN);
			g_soundManager.LoadSound (FILE_NAME_UP);
			
			g_soundManager.LoadSound (FILE_NAME_BUILD);
			g_soundManager.LoadSound (FILE_NAME_SELL);
			g_soundManager.LoadSound (FILE_NAME_START_WAVE);
		}
	}
	
	this.PlayOver = function () {
		if (AUDIO_ENABLE && soundCoolDown == 0) {
			var source = g_soundManager.CreateSource (FILE_NAME_OVER);
			g_soundManager.ConnectToUI (source);
			source.start(0);
			soundCoolDown = DELAY;
		}
	}
	this.PlayDown = function () {
		if (AUDIO_ENABLE) {
			var source = g_soundManager.CreateSource (FILE_NAME_DOWN);
			g_soundManager.ConnectToUI (source);
			source.start(0);
		}
	}
	this.PlayUp = function () {
		if (AUDIO_ENABLE) {
			var source = g_soundManager.CreateSource (FILE_NAME_UP);
			g_soundManager.ConnectToUI (source);
			source.start(0);
		}
	}
	
	this.PlayBuild = function () {
		if (AUDIO_ENABLE) {
			var source = g_soundManager.CreateSource (FILE_NAME_BUILD);
			g_soundManager.ConnectToUI (source);
			source.start(0);
		}
	}
	this.PlaySell = function () {
		if (AUDIO_ENABLE) {
			var source = g_soundManager.CreateSource (FILE_NAME_SELL);
			g_soundManager.ConnectToUI (source);
			source.start(0);
		}
	}
	this.PlayStartWave = function () {
		if (AUDIO_ENABLE) {
			var source = g_soundManager.CreateSource (FILE_NAME_START_WAVE);
			g_soundManager.ConnectToUI (source);
			source.start(0);
		}
	}
	
	
	
	this.Update = function (deltaTime) {
		if (soundCoolDown > 0) {
			soundCoolDown -= deltaTime;
			if (soundCoolDown < 0) soundCoolDown = 0;
		}
	}
	
	this.Clear = function () {
	
	}
	
	if (AUDIO_ENABLE) {
		g_soundManager.AddSoundNode (this);
	}
}