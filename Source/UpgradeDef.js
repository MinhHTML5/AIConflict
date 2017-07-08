function Upgrade (price) {
	this.enable = false;
	this.image = null;
	this.name = "";
	this.desc = "";
	this.price = 0;
}








var UPGRADE_GATLING = 0;
var UPGRADE_CANNON = 1;
var UPGRADE_MISSILE = 2;
var UPGRADE_ACID = 3;
var UPGRADE_LASER = 4;
var UPGRADE_WAVE = 5;
var UPGRADE_GAUSS = 6;
var UPGRADE_STATIC = 7;
var UPGRADE_BASE_1 = 8;
var UPGRADE_BASE_2 = 9;

var UPGRADE_TIER_1 = 0;
var UPGRADE_TIER_2 = 1;
var UPGRADE_TIER_3 = 2;



var UPGRADE_GATLING_RECOIL = 2;
var UPGRADE_GATLING_PIERCING = 0.2;
var UPGRADE_GATLING_COST_MULTIPLER = 0.75;

var UPGRADE_CANNON_PR_FUSE = 1500;
var UPGRADE_CANNON_PROJECTILE_SPEED = 1.5;
var UPGRADE_CANNON_SHARPNEL_MULTIPLIER = 0.2;

var UPGRADE_MISSILE_HOMING = 2;
var UPGRADE_MISSILE_SLOW_DURATION = 1000;

var UPGRADE_ACID_ARMOUR_REDUCTION = 0.2;
var UPGRADE_ACID_ADDITIONAL_TIME = 1000;
var UPGRADE_LE_DAMAGE_MULTIPLIER = 1.5;

var UPGRADE_LASER_VS_KINETIC_MULTIPLIER = 1.5;
var UPGRADE_LASER_POWER_CONSUMPTION_MULTIPLIER = 0.75;

var UPGRADE_WAVE_ADDITIONAL_RANGE = 50;
var UPGRADE_WAVE_RIP_DAMAGE_MULTIPLIER = 1.2;
var UPGRADE_WAVE_BOUNTY_MULTIPLIER = 2;

var UPGRADE_GAUSS_DAMAGE_REDUCTION = 0.1;
var UPGRADE_GAUSS_CRITICAL_CHANCE = 0.2;
var UPGRADE_GAUSS_CRITICAL_DAMAGE_MULTIPLIER = 2;
var UPGRADE_GAUSS_SHATTER_THRESHOLD = 0.1;

var UPGRADE_STATIC_ADDITIONAL_TIME = 1000;
var UPGRADE_STATIC_ADDITIONAL_AOE = 0.2;
var UPGRADE_STATIC_DAMAGE_PER_ENEMY = 0.1;

var UPGRADE_BASE_SELL_COST = 0.75;
var UPGRADE_BASE_RESUPPLY_MULTIPLIER = 2;
var UPGRADE_BASE_NEW_MONEY_REWARD = 1.15;

var UPGRADE_BASE_ROTATE_SPEED_MODIFIER = 2;


var g_upgradeData = null


function InitUpgradeDef () {
	g_upgradeData = new Array();
	for (var i=0; i<10; i++) {
		g_upgradeData[i] = new Array();
		for (var j=0; j<3; j++) {
			g_upgradeData[i][j] = new Upgrade();
			g_upgradeData[i][j].image = g_graphicEngine.LoadImage(ROOT_FOLDER + "Image/MainMenu/UpgradeIcon/" + (i + 1) + "" + (j + 1) + ".png");
		}
	}
	


	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_1].name = "Force absorbing grip";
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_1].desc = "Upgrade special composite grip around the barrel which can absorb the recoil force from the Gatling Turret. This make the Gatling turret shoot with more accuracy.";
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_1].price = 1;
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_2].name = "Depleted uranium round";
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_2].desc = "Upgrade the Gatling turret ammunition to depleted uranium rounds, which can penetrate light armour. Add 20% armour penetration to Gatling rounds.";
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_2].price = 2;
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_3].name = "Industrial manufacture";
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_3].desc = "Investing in industrial technology to mass produce Gatling turret. This decrease Gatling turret cost by 25%.";
	g_upgradeData[UPGRADE_GATLING][UPGRADE_TIER_3].price = 5;

	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_1].name = "Titanium drill";
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_1].desc = "Penetration rounds shot by the cannon take less time to drill through the enemy's armour plating, reduce the delay between impact and detonation.";
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_1].price = 1;
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_2].name = "Additional propulsion module";
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_2].desc = "By adding a small expendable jet engine to each round, all rounds shot by the cannon now have better speed, increasing the accuracy.";
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_2].price = 2;
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_3].name = "Piercing shrapnel";
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_3].desc = "Each cannon shell now contain hard metal shrapnel which can penetrate light armour. Splash damage have 20% armour piercing. (Not applied to a direct hit).";
	g_upgradeData[UPGRADE_CANNON][UPGRADE_TIER_3].price = 3;

	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_1].name = "Vectored thrust";
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_1].desc = "The upgrade module to the thruster make all missiles to have better steering, make them easier to chase fast flying targets.";
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_1].price = 4;
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_2].name = "Enemy recognition module";
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_2].desc = "This upgrade allow the missiles to set their own target if their primary target is destroyed, or missed, thus not wasting the missiles.";
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_2].price = 4;
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_3].name = "Engine interruption pulse";
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_3].desc = "Null missiles now emit a special pulse which can interrupt enemies' propulsion system. Slow enemies by 50% for 1 second in the nullified area.";
	g_upgradeData[UPGRADE_MISSILE][UPGRADE_TIER_3].price = 4;

	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_1].name = "Weakening acid";
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_1].desc = "This new kind of acid not only disintegrate enemy armour where they impact, but also make the whole armour structure soften. Reduce enemies' armour by 20% when in effect.";
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_1].price = 2;
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_2].name = "Condensed acid";
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_2].desc = "Make acid last longer on enemies' hull. Extend acid effective duration by 1 second.";
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_2].price = 2;
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_3].name = "Chemical technology";
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_3].desc = "Liquid explosive deal additional 50% damage.";
	g_upgradeData[UPGRADE_ACID][UPGRADE_TIER_3].price = 4;

	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_1].name = "Magnetize particle";
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_1].desc = "Focal laser deal additional 50% damage to enemies with kinetic shield.";
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_1].price = 2;
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_2].name = "Energy saving technology";
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_2].desc = "Laser turret cost 33% less energy to operate.";
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_2].price = 2;
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_3].name = "Refraction enhancer";
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_3].desc = "Refractive laser can refract to the 3rd target around the impact point. Damage dealt to the added target is equal to the others.";
	g_upgradeData[UPGRADE_LASER][UPGRADE_TIER_3].price = 4;

	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_1].name = "High wave length";
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_1].desc = "Effective range of both ripping wave and disrupting wave increase. Waves now travel further before diminished. Does not affect target acquiring range of wave tower.";
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_1].price = 2;
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_2].name = "Advance ripping wave";
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_2].desc = "Ripping wave have the ability to tear existing cracks and breaches on enemies' hull, deal additional 20% damage to enemies which have HP below 50%.";
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_2].price = 4;
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_3].name = "Debris collector";
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_3].desc = "When an enemy is destroyed within a wave tower's range, its fragment and debris will be collected and recycle, giving double the bounty value. Multiple wave tower does not stack.";
	g_upgradeData[UPGRADE_WAVE][UPGRADE_TIER_3].price = 10;

	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_1].name = "Heavy gauss projectile";
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_1].desc = "Upgrading the gauss cannon projectile to a heavier one. The momentum of the heavy projectile will help it to reduce speed lost after passing an enemy. Reduce damage loss after passing an enemy to 10%.";
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_1].price = 3;
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_2].name = "Weak spot seeker";
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_2].desc = "Attach the nano guidance system to the gauss projectiles, which automatically seek for weak points on the enemy's hull. Add 20% chance to deal double damage on each enemy they pass through.";
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_2].price = 4;
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_3].name = "Shattering Beam";
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_3].desc = "Upgrade the disintegrate beam, able to corrupt heavy damaged enemies, and instantly destroy them. Instantly kill enemy have HP below 10%.";
	g_upgradeData[UPGRADE_GAUSS][UPGRADE_TIER_3].price = 3;

	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_1].name = "Current Stabilizer";
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_1].desc = "Attach a current stabilizer module to the static ball shell, which allow the static ball to last longer on the space environment. Add 1 second to encased static ball life time.";
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_1].price = 2;
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_2].name = "High Potential Charge";
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_2].desc = "Charge the static ball with a higher voltage, to create a higher potential, which can go further in space environment. Increase static ball shock range by 20%.";
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_2].price = 3;
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_3].name = "Flow Alternating Module";
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_3].desc = "Add a special module to the static ball, which can alternate enemies' energy to make itself stronger. Each enemy inside a static ball range, will increase its base damage by 10%.";
	g_upgradeData[UPGRADE_STATIC][UPGRADE_TIER_3].price = 4;

	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_1].name = "Additional memory module";
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_1].desc = "Turret's can remember and execute more command. Increase AI command slot from 3 to 6.";
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_1].price = 2;
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_2].name = "Dismantle technology";
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_2].desc = "Dismantle a built turret let you reclaim 75% of the constructing price instead of 50%.";
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_2].price = 2;
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_3].name = "Real-time programming software";
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_3].desc = "New software integrated into a turret's operating system, allow the commander to re-program its AI and strategy even in the middle of the combat. Now you can modify turrets' AI while you pause the game.";
	g_upgradeData[UPGRADE_BASE_1][UPGRADE_TIER_3].price = 5;

	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_1].name = "Advance resupply technology";
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_1].desc = "Base ammunition and energy regeneration doubled.";
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_1].price = 3;
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_2].name = "Advance recycle technology";
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_2].desc = "You get 15% more of current material after each wave, instead of 10%.";
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_2].price = 10;
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_3].name = "Active rotor";
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_3].desc = "Double turret rotating speed, make them react faster to enemies that they are not currently aiming at.";
	g_upgradeData[UPGRADE_BASE_2][UPGRADE_TIER_3].price = 1;
}