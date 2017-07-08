function ProfileData (progress, sfxVol, musicVol, uiVol, upgrade, score) {
	this.progress = progress;
	this.sfxVol = sfxVol;
	this.musicVol = musicVol;
	this.uiVol = uiVol;
	this.upgrade = upgrade;
	this.score = score;
}

function Profile () {
	var instance = this;
	this.hasOfficialData = false;
	this.progress = null;
	this.score = null;
	
	if (PLATFORM == "FACEBOOK") {
		this.cred = "fb:" + FB_userID;
	}
	else if (PLATFORM == "KONGREGATE") {
		this.cred = "kg:" + KG_userID;
	}
	else if (PLATFORM == "FREE") {
		this.cred = "anonymous";
	}
	
	this.Save = function (callback) {
		if (PLATFORM == "FACEBOOK" || (PLATFORM == "KONGREGATE" && KG_isGuest == false)) {
			var data = new ProfileData (instance.progress, instance.sfxVol, instance.musicVol, instance.uiVol, instance.upgrade, instance.score);
			var string = JSON.stringify(data);
			
			var params = "cred=" + instance.cred + "&setting=" + string + "&upgradePoint=" + instance.upgradePoint + "&t=" + new Date().getTime();
			var request = new XMLHttpRequest();
			request.open("POST", "//ai-conflict.com/Server/SaveProfile.php", true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.onload = function(e) {
				if (request.readyState == 4 && request.status == 200) {
					if (callback != null) callback();
				}
			};
			request.send(params);
		}
		else if (PLATFORM == "CLAY") {
			var data = new ProfileData (instance.progress, instance.sfxVol, instance.musicVol, instance.uiVol, instance.upgrade, instance.score);
			var string = JSON.stringify(data);
			Clay.Player.saveUserData( 'setting', string, function(response) {} );
			Clay.Player.saveUserData( 'upgradePoint', instance.upgradePoint, function(response) {} );
		}
		else {
			var data = new ProfileData (instance.progress, instance.sfxVol, instance.musicVol, instance.uiVol, instance.upgrade, instance.score);
			var string = JSON.stringify(data);
			
			localStorage.data = string;
			localStorage.upgradePoint = instance.upgradePoint;
		}
		if (callback != null) callback();
	}
	
	this.Load = function (callback) {
		if (PLATFORM == "FACEBOOK" || (PLATFORM == "KONGREGATE" && KG_isGuest == false)) {
			var params = "cred=" + instance.cred + "&t=" + new Date().getTime();
			var request = new XMLHttpRequest();
			request.open("POST", "//ai-conflict.com/Server/GetProfile.php", true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.onload = function(e) {
				if (request.readyState == 4 && request.status == 200) {
					var data = JSON.parse(request.response);
					var success = data.success;
					if (success == true) {
						instance.hasOfficialData = true;
						instance.upgradePoint = parseInt(data.upgradePoint);
						
						var profileData = JSON.parse(data.setting);
						instance.progress = profileData.progress;
						instance.sfxVol = profileData.sfxVol;
						instance.musicVol = profileData.musicVol;
						instance.uiVol = profileData.uiVol;
						instance.upgrade = profileData.upgrade;
						
						if (profileData.score != null) {
							instance.score = profileData.score;
						}
						else {
							if (instance.progress == 16) {
								instance.upgradePoint += 50;
							}
							else {
								instance.upgradePoint += (instance.progress - 1) * 3;
							}
						}
						
						g_soundManager.SetVolume (instance.sfxVol, instance.musicVol, instance.uiVol);
					}
					else {
						instance.hasOfficialData = true;
						instance.Save();
					}
					
					if (callback != null) callback();
				}
			};
			request.send(params);
		}
		else if (PLATFORM == "CLAY") {
			Clay.Player.fetchUserData( 'upgradePoint', function (response) {
				instance.hasOfficialData = true;
				if (response.data == null) {
					instance.Reset();
					instance.Save();
				}
				else {
					instance.upgradePoint = parseInt(response.data);
					Clay.Player.fetchUserData( 'setting', function(response) {
						var profileData = JSON.parse(response.data);
						instance.progress = profileData.progress;
						instance.sfxVol = profileData.sfxVol;
						instance.musicVol = profileData.musicVol;
						instance.uiVol = profileData.uiVol;
						instance.upgrade = profileData.upgrade;
						
						if (profileData.score != null) {
							instance.score = profileData.score;
						}
								
						g_soundManager.SetVolume (instance.sfxVol, instance.musicVol, instance.uiVol);
						
						if (callback != null) callback();
					} );
				}
			} );
		}
		else {
			var result = localStorage.data;
			if (result != null && result != "") {
				instance.hasOfficialData = true;
				
				var profileData = JSON.parse(result);
				instance.progress = profileData.progress;
				instance.sfxVol = profileData.sfxVol;
				instance.musicVol = profileData.musicVol;
				instance.uiVol = profileData.uiVol;
				instance.upgrade = profileData.upgrade;
				
				if (profileData.score != null) {
					instance.score = profileData.score;
				}
				else {
					if (instance.progress == 16) {
						instance.upgradePoint += 50;
					}
					else {
						instance.upgradePoint += (instance.progress - 1) * 3;
					}
				}
				
				instance.upgradePoint = parseInt(localStorage.upgradePoint);
				
				g_soundManager.SetVolume (instance.sfxVol, instance.musicVol, instance.uiVol);
			}
			else {
				instance.hasOfficialData = true;
				instance.Reset();
				instance.Save();
			}
		}
		
		if (callback != null) callback();
	}
	
	this.Reset = function () {
		this.progress = 1;
		
		this.sfxVol = 0.5;
		this.musicVol = 0.5;
		this.uiVol = 0.5;
		
		this.upgradePoint = 0;
		this.upgrade = new Array();
		
		for (var i=0; i<10; i++) {
			this.upgrade[i] = new Array();
			for (var j=0; j<3; j++) {
				this.upgrade[i][j] = false;
			}
		}
		
		this.score = new Array();
		for (var i=0; i<g_missionData.length; i++) {
			this.score[i] = 0;
		}
		
		g_soundManager.SetVolume (this.sfxVol, this.musicVol, this.uiVol);
	}
	
	this.Reset();
}