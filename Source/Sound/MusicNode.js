function MusicNode (filename) {
	var FADE_SPEED = 0.001;
	
	var audio;
	var playing = false;
	var masterVolume = 0;
	var channelVolume = 0;
	var loop = false;
	
	this.SetVolume = function (vol) {
		masterVolume = vol;
		audio.volume = masterVolume * channelVolume;
	}
	
	
	
	this.Load = function () {
		if (AUDIO_ENABLE) {
			audio = g_soundManager.LoadNormalSound(filename);
			audio.addEventListener('ended', OnAudioEnd, false);
			g_soundManager.AddNormalSound(this);
		}
	}
	
	this.Play = function (mustLoop) {
		if (AUDIO_ENABLE) {
			if (playing == false) {
				channelVolume = 0;
				audio.currentTime = 0;
				audio.play();
				//audio.loop = mustLoop;
			}
		}
		loop = mustLoop;
		
		playing = true;
	}
	
	this.Stop = function () {
		playing = false;
	}
	
	this.Update = function (deltaTime) {
		if (playing == true) {
			if (channelVolume < 1) {
				channelVolume += deltaTime * FADE_SPEED;
				if (channelVolume > 1) channelVolume = 1;
				audio.volume = masterVolume * channelVolume;
			}
		}
		else if (playing == false) {
			if (channelVolume > 0) {
				channelVolume -= deltaTime * FADE_SPEED;
				if (channelVolume < 0) {
					channelVolume = 0;
					audio.pause();
				}
				audio.volume = masterVolume * channelVolume;
			}
		}
	}
	
	this.SkipFadeIn = function () {
		if (playing == true) {
			channelVolume = 0.99;
			audio.volume = masterVolume * channelVolume;
		}
	}
	
	
	function OnAudioEnd() {
		if (AUDIO_ENABLE) {
			audio.currentTime = 0;
			audio.play();
			if (!loop) {
				playing = false;
				channelVolume = 0;
				audio.pause();
			}
		}
	}
}