function ParticleDef () {
	this.CreateBulletSparkEmitter = function () {
		var source = new SourceRect(0, 0, 0, 15, 15);
		source.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/SparkParticle.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.001;
		particle.m_alpha = 0.5;
		particle.m_w = 15;
		particle.m_h = 15;
		particle.m_lifeTime = 500;
		particle.m_drawAdd = false;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 0;
		emitter.m_randomizeRotateSpeedMin = 0;
		emitter.m_randomizeRotateSpeedMax = 0;
		emitter.m_emitRate = 0.05;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateBulletStaticEmitter = function () {
		var source = new SourceRect(0, 0, 0, 15, 15);
		source.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/StaticParticle.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.0005;
		particle.m_alpha = 0.5;
		particle.m_w = 15;
		particle.m_h = 15;
		particle.m_lifeTime = 1000;
		particle.m_drawAdd = false;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 0;
		emitter.m_randomizeRotateSpeedMin = 0;
		emitter.m_randomizeRotateSpeedMax = 0;
		emitter.m_emitRate = 0.05;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateBulletSmokeEmitter = function () {
		var source = new SourceRect(0, 0, 0, 50, 50);
		source.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/SmokeParticle.png");
		
		var particle = new Particle();
		particle.m_sourceRectArray[0] = source;
		particle.m_resistant = 0.05;
		particle.m_fadeSpeed = -0.002;
		particle.m_alpha = 1;
		particle.m_drawAdd = false;
		particle.m_w = 50;
		particle.m_h = 50;
		particle.m_lifeTime = 500;
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle);
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 0;
		emitter.m_randomizeRotateSpeedMin = 0;
		emitter.m_randomizeRotateSpeedMax = 0;
		emitter.m_emitRate = 0.05;
		emitter.Start();
		
		return emitter;
	}
	
	this.CreateExplosionFragEmitter = function () {
		var source1 = new SourceRect(0, 0, 0, 50, 50);
		source1.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle1.png");
		var particle1 = new Particle();
		particle1.m_sourceRectArray[0] = source1;
		particle1.m_resistant = 0;
		particle1.m_fadeSpeed = -0.001;
		particle1.m_alpha = 1;
		particle1.m_drawAdd = false;
		particle1.m_w = 50;
		particle1.m_h = 50;
		particle1.m_lifeTime = 1000;
		
		var source2 = new SourceRect(0, 0, 0, 50, 50);
		source2.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle2.png");
		var particle2 = new Particle();
		particle2.m_sourceRectArray[0] = source2;
		particle2.m_resistant = 0;
		particle2.m_fadeSpeed = -0.001;
		particle2.m_alpha = 1;
		particle2.m_drawAdd = false;
		particle2.m_w = 50;
		particle2.m_h = 50;
		particle2.m_lifeTime = 1000;
		
		var source3 = new SourceRect(0, 0, 0, 50, 50);
		source3.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle3.png");
		var particle3 = new Particle();
		particle3.m_sourceRectArray[0] = source3;
		particle3.m_resistant = 0;
		particle3.m_fadeSpeed = -0.001;
		particle3.m_alpha = 1;
		particle3.m_drawAdd = false;
		particle3.m_w = 50;
		particle3.m_h = 50;
		particle3.m_lifeTime = 1000;
		
		var source4 = new SourceRect(0, 0, 0, 50, 50);
		source4.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle4.png");
		var particle4 = new Particle();
		particle4.m_sourceRectArray[0] = source4;
		particle4.m_resistant = 0;
		particle4.m_fadeSpeed = -0.001;
		particle4.m_alpha = 1;
		particle4.m_drawAdd = false;
		particle4.m_w = 50;
		particle4.m_h = 50;
		particle4.m_lifeTime = 1000;
		
		var source5 = new SourceRect(0, 0, 0, 50, 50);
		source5.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle5.png");
		var particle5 = new Particle();
		particle5.m_sourceRectArray[0] = source5;
		particle5.m_resistant = 0;
		particle5.m_fadeSpeed = -0.001;
		particle5.m_alpha = 1;
		particle5.m_drawAdd = false;
		particle5.m_w = 50;
		particle5.m_h = 50;
		particle5.m_lifeTime = 1000;
		
		
		var source6 = new SourceRect(0, 0, 0, 50, 50);
		source6.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/HotFrag.png");
		var particle6 = new Particle();
		particle6.m_sourceRectArray[0] = source6;
		particle6.m_resistant = 0;
		particle6.m_fadeSpeed = -0.001;
		particle6.m_alpha = 1;
		particle6.m_drawAdd = true;
		particle6.m_w = 50;
		particle6.m_h = 50;
		particle6.m_lifeTime = 1000;
		
		
		
		
		
		
		
		
		
		
		
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle1);
		emitter.SetSampleParticle (particle2);
		emitter.SetSampleParticle (particle3);
		emitter.SetSampleParticle (particle4);
		emitter.SetSampleParticle (particle5);
		emitter.SetSampleParticle (particle6);
		emitter.m_emitForceMin = 0.07;
		emitter.m_emitForceMax = 0.2;
		emitter.m_randomizeScaleMin = 0.3;
		emitter.m_randomizeScaleMax = 1;
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -3;
		emitter.m_randomizeRotateSpeedMax = 3;
		emitter.m_emitRate = 0.1;
		emitter.m_lifeTime = 100;
		emitter.Start();
		
		return emitter;
	}
	
	
	this.CreateDirectionalFragEmitter = function (angle) {
		var source1 = new SourceRect(0, 0, 0, 50, 50);
		source1.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle1.png");
		var particle1 = new Particle();
		particle1.m_sourceRectArray[0] = source1;
		particle1.m_resistant = 0;
		particle1.m_fadeSpeed = -0.001;
		particle1.m_alpha = 1;
		particle1.m_drawAdd = false;
		particle1.m_w = 50;
		particle1.m_h = 50;
		particle1.m_lifeTime = 1000;
		
		var source2 = new SourceRect(0, 0, 0, 50, 50);
		source2.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle2.png");
		var particle2 = new Particle();
		particle2.m_sourceRectArray[0] = source2;
		particle2.m_resistant = 0;
		particle2.m_fadeSpeed = -0.001;
		particle2.m_alpha = 1;
		particle2.m_drawAdd = false;
		particle2.m_w = 50;
		particle2.m_h = 50;
		particle2.m_lifeTime = 1000;
		
		var source3 = new SourceRect(0, 0, 0, 50, 50);
		source3.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle3.png");
		var particle3 = new Particle();
		particle3.m_sourceRectArray[0] = source3;
		particle3.m_resistant = 0;
		particle3.m_fadeSpeed = -0.001;
		particle3.m_alpha = 1;
		particle3.m_drawAdd = false;
		particle3.m_w = 50;
		particle3.m_h = 50;
		particle3.m_lifeTime = 1000;
		
		var source4 = new SourceRect(0, 0, 0, 50, 50);
		source4.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle4.png");
		var particle4 = new Particle();
		particle4.m_sourceRectArray[0] = source4;
		particle4.m_resistant = 0;
		particle4.m_fadeSpeed = -0.001;
		particle4.m_alpha = 1;
		particle4.m_drawAdd = false;
		particle4.m_w = 50;
		particle4.m_h = 50;
		particle4.m_lifeTime = 1000;
		
		var source5 = new SourceRect(0, 0, 0, 50, 50);
		source5.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/FragParticle5.png");
		var particle5 = new Particle();
		particle5.m_sourceRectArray[0] = source5;
		particle5.m_resistant = 0;
		particle5.m_fadeSpeed = -0.001;
		particle5.m_alpha = 1;
		particle5.m_drawAdd = false;
		particle5.m_w = 50;
		particle5.m_h = 50;
		particle5.m_lifeTime = 1000;
		
		var source6 = new SourceRect(0, 0, 0, 50, 50);
		source6.m_id = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/ActionPhase/Particle/HotFrag.png");
		var particle6 = new Particle();
		particle6.m_sourceRectArray[0] = source6;
		particle6.m_resistant = 0;
		particle6.m_fadeSpeed = -0.001;
		particle6.m_alpha = 1;
		particle6.m_drawAdd = true;
		particle6.m_w = 50;
		particle6.m_h = 50;
		particle6.m_lifeTime = 1000;
		
		
		
		
		
		
		
		
		
		
		
		
		
		var emitter = g_particleEngine.CreateEmitter();
		emitter.SetSampleParticle (particle1);
		emitter.SetSampleParticle (particle2);
		emitter.SetSampleParticle (particle3);
		emitter.SetSampleParticle (particle4);
		emitter.SetSampleParticle (particle5);
		emitter.SetSampleParticle (particle6);
		emitter.m_emitForceMin = 0.07;
		emitter.m_emitForceMax = 0.2;
		emitter.m_emitAngleStart = angle - 10;
		emitter.m_emitAngleEnd = angle + 10;
		emitter.m_randomizeScaleMin = 0.3;
		emitter.m_randomizeScaleMax = 1;
		emitter.m_randomizeAngleMin = 0;
		emitter.m_randomizeAngleMax = 360;
		emitter.m_randomizeRotateSpeedMin = -3;
		emitter.m_randomizeRotateSpeedMax = 3;
		emitter.m_emitRate = 0.1;
		emitter.m_lifeTime = 100;
		emitter.Start();
		
		return emitter;
	}
}

var g_particleDef = new ParticleDef();