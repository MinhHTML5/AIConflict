function ActionRandomSoundNode (delay, gain, maxGain) {
	var camera = null;
	var soundCoolDown = 0;
	var soundRequestX = new Array();
	var soundRequestY = new Array();
	var fileNameArray = new Array();
	
	
	this.AddFileName = function (path) {
		if (AUDIO_ENABLE) {
			fileNameArray.push (path);
			g_soundManager.LoadSound (path);
		}
	}
	
	this.Load = function () {
		if (AUDIO_ENABLE) {
			for (var i=0; i<fileNameArray.length; i++) {
				g_soundManager.LoadSound (fileNameArray[i]);
			}
		}
	}
	
	this.Play = function (x, y) {
		if (AUDIO_ENABLE) {
			if (g_soundManager.m_disableActionSound == false) {
				soundRequestX.push (x);
				soundRequestY.push (y);
			}
		}
	}
	
	this.SetCameraHandler = function (c) {
		if (AUDIO_ENABLE) {
			camera = c;
		}
	}
	
	this.Update = function (deltaTime) {
		if (AUDIO_ENABLE) {
			soundCoolDown += deltaTime;
			if (soundCoolDown >= delay) {
				soundCoolDown -= delay;
				if (soundRequestX.length > 0) {
					var panValue = 0;
					var gainValue = 0;
					var cameraCenterX = camera.x + camera.w * 0.5;
					var cameraCenterY = camera.y + camera.h * 0.5;
					var listenRange = camera.w * 0.6;
					var zoomGain = CANVAS_W / camera.w;
					
					for (var i=0; i<soundRequestX.length; i++) {
						var tempPanValue = (soundRequestX[i] - cameraCenterX) / (listenRange);
						if (tempPanValue < -1) tempPanValue = -1;
						if (tempPanValue > 1) tempPanValue = 1;
						
						var tempDistance = CalculateRangeBetweenTwoPoint(soundRequestX[i], soundRequestY[i], cameraCenterX, cameraCenterY);
						var tempGainValue = 1 - tempDistance / listenRange;
						if (tempGainValue < 0) tempGainValue = 0;
						
						panValue += tempPanValue * tempGainValue;
						gainValue += tempGainValue * gain;
						if (gainValue > maxGain) gainValue = maxGain;
					}
					
					var panner = g_soundManager.CreatePanner();
					panner.setPosition(panValue, 0, (zoomGain) * 1);
					
					var volume = g_soundManager.CreateVolume();
					volume.connect(panner);
					volume.gain.value = gainValue * zoomGain;
					
					var random = (Math.random() * fileNameArray.length) >> 0;
					var source = g_soundManager.CreateSource (fileNameArray[random]);
					g_soundManager.ConnectToSFX (panner);
					source.connect(volume);
					source.start(0);
					
					soundRequestX = new Array();
					soundRequestY = new Array();
				}
			}
		}
	}
	
	this.Clear = function () {
		if (AUDIO_ENABLE) {
			soundRequestX = new Array();
			soundRequestY = new Array();
		}
	}
	
	if (AUDIO_ENABLE) {
		g_soundManager.AddSoundNode (this);
	}
}