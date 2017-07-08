var AUDIO_ENABLE = false;


window.AudioContext = (
	window.AudioContext ||
	window.webkitAudioContext ||
	null
);
if (AudioContext && PLATFORM != "TEST") {
	AUDIO_ENABLE = true;
}

function SoundManager () {
	this.m_disableActionSound = false;
	this.m_disableAmbientSound = false;
	
	if (AUDIO_ENABLE) {
		var ctx = new AudioContext();
		var sfxVolume = ctx.createGain(); sfxVolume.connect(ctx.destination);
		var musicVolume = ctx.createGain(); musicVolume.connect(ctx.destination);
		var uiVolume = ctx.createGain(); uiVolume.connect(ctx.destination);
		
		
		var numberOfSound = 0;
		var numberOfSoundLoaded = 0;
		
		
		var soundNodeArray = new Array();
		var bufferArray = new Array();
		
		this.LoadSound = function (path) {
			if (bufferArray[path] == null) {
				var request = new XMLHttpRequest();
				request.open("GET", path, true);
				request.responseType = "arraybuffer";
				request.onload = function(e) {
					ctx.decodeAudioData(
						request.response,
						function(buffer) {
							if (!buffer) {
								return;
							}
							bufferArray [path] = buffer;
							numberOfSoundLoaded ++;
						},
						function(error) {
							console.error('decodeAudioData error', error);
						}
					);
				};
				request.send();
				bufferArray[path] = 0;
				numberOfSound ++;
			}
		}
		
		this.CreateSource = function (path) {
			var source = ctx.createBufferSource();
			source.buffer = bufferArray[path];
			return source;
		}
		this.CreateVolume = function () {
			return ctx.createGain();
		}
		this.CreatePanner = function () {
			return ctx.createPanner();
		}
		
		this.ConnectToSFX = function (node) {
			node.connect(sfxVolume);
		}
		this.ConnectToMusic = function (node) {
			node.connect(musicVolume);
		}
		this.ConnectToUI = function (node) {
			node.connect(uiVolume);
		}
		
		this.AddSoundNode = function (node) {
			soundNodeArray.push (node);
		}
		this.StopSoundNode = function () {
			for (var i=0; i<soundNodeArray.length; i++) {
				soundNodeArray[i].Clear();
			}
		}
		
		
		
		
		
		var normalSoundNodeArray = new Array();
		this.LoadNormalSound = function (filename) {
			var audio = new Audio();
			audio.src = filename;
			audio.play();
			audio.pause();
			audio.oncanplaythrough = function () {
				numberOfSoundLoaded ++;
			}
			numberOfSound ++;
			return audio;
		}
		this.AddNormalSound = function (sound) {
			normalSoundNodeArray.push (sound);
		}
		
				
		
		
		this.GetProgress = function () {
			if (numberOfSound > 0) {
				return numberOfSoundLoaded / numberOfSound;
			}
			else {
				return 1;
			}
		}
		this.SetVolume = function (sfx, music, ui) {
			sfxVolume.gain.value = sfx;
			musicVolume.gain.value = music;
			uiVolume.gain.value = ui;
			
			for (var i=0; i<normalSoundNodeArray.length; i++) {
				normalSoundNodeArray[i].SetVolume(music);
			}
		}
		this.Update = function (deltaTime) {
			for (var i=0; i<soundNodeArray.length; i++) {
				soundNodeArray[i].Update(deltaTime);
			}
			for (var i=0; i<normalSoundNodeArray.length; i++) {
				normalSoundNodeArray[i].Update(deltaTime);
			}
		}
	}
	else {
		this.LoadSound = function (path) {
		
		}
		this.GetProgress = function () {
			return 1;
		}
		this.CreateSource = function (path) {
		
		}
		this.CreateVolume = function () {
			
		}
		this.CreatePanner = function () {
			
		}
		this.ConnectToSFX = function (node) {
		
		}
		this.ConnectToMusic = function (node) {
		
		}
		this.ConnectToUI = function (node) {
		
		}
		this.AddSoundNode = function (node) {
		
		}
		this.Update = function (deltaTime) {
		
		}
		this.StopSoundNode = function () {
		
		}
		this.SetVolume = function (sfx, music, ui) {
		
		}
	}
}