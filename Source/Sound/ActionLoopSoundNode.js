function ActionLoopSoundNode (filename, delay, gain, maxGain) {
	var camera = null;
	var soundLooping = false;
	
	var panner;
	var volume;
	var source;
	
	var soundCoolDown = 0;
	var soundRequestX = new Array();
	var soundRequestY = new Array();
	
	this.Load = function () {
		if (AUDIO_ENABLE) {
			g_soundManager.LoadSound (filename);
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
					
					if (soundLooping == false) {
						panner = g_soundManager.CreatePanner();
						panner.setPosition(panValue, 0, (zoomGain) * 1);
						
						volume = g_soundManager.CreateVolume();
						volume.connect(panner);
						volume.gain.value = gainValue * zoomGain;
						
						
						source = g_soundManager.CreateSource (filename);
						source.connect(volume);
						source.loop = true;
						source.start(0);
						
						soundLooping = true;
						
						g_soundManager.ConnectToSFX (panner);
					}
					else {
						panner.setPosition(panValue, 0, (zoomGain) * 1);
						volume.gain.value = gainValue * zoomGain;
					}
					
					soundRequestX = new Array();
					soundRequestY = new Array();
				}
				else {
					if (soundLooping == true) {
						soundLooping = false;
						if (source != null) {
							if (source.playbackState == source.PLAYING_STATE) {
								try {
									source.stop();
								}
								catch (e) {
								
								}
							}
						}
					}
				}
			}
		}
	}
	
	
	this.Clear = function () {
		if (AUDIO_ENABLE) {
			soundRequestX = new Array();
			soundRequestY = new Array();
			if (source != null) {
				if (source.playbackState == source.PLAYING_STATE) {
					source.stop();
				}
			}
		}
	}
	
	if (AUDIO_ENABLE) {
		g_soundManager.AddSoundNode (this);
	}
}