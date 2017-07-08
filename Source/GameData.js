
// =======================================================================================================
// GAMEPLAY
// =======================================================================================================
var SPAWNING_INTERVAL = 1000;
var MAX_AMMUNITION = 1000;
var MAX_ENERGY = 1000;
var BASE_AMMUNITION_PRODUCE_RATE = 50;
var BASE_ENERGY_PRODUCE_RATE = 50;
var AMMUNITION_PRODUCE_RATE = 30;
var ENERGY_PRODUCE_RATE = 30;
var MONEY_REWARD_RATIO = 1.1;

var TURRET_SELL_COST = 0.5;

var NUMBER_OF_AI_CHECK = 6;
var NUMBER_OF_FREE_AI_CHECK = 3;
var INTERVAL_OF_AI_CHECK = 200;

var SPEED_DEF_FAST = 0.15;
var SPEED_DEF_SLOW = 0.1;

var ARMOUR_DEF_HEAVY = 0.7;
var ARMOUR_DEF_LIGHT = 0.4;

var RANK_DEF_FIGHTER = 1;
var RANK_DEF_CORVETTE = 2;
var RANK_DEF_FRIGATE = 3;
var RANK_DEF_CRUISER = 4;

var RANGE_DEF_CLUSTER = 30;

var ACID_BULLET_MAX_SCALE = 3;
var ACID_BUFF_DURATION = 5000;
var ACID_BUFF_DPS = 110;

var LIQUID_EXPLOSIVE_DURATION = 5000;
var LIQUID_EXPLOSIVE_DAMAGE_MULTIPLIER = 0.5;
var LIQUID_EXPLOSIVE_AOE = 150;

var SLOW_BUFF_DURATION = 4000;
var SLOW_BUFF_AMOUNT = 0.5;

var LASER_SPECIAL_REFRACTION_DAMAGE_MULTIPLIER = 0.5;

var GAUSS_DAMAGE_LOSS = 0.2;

var ENCASE_STATIC_BALL_LIFE_TIME = 3000;

var KINETIC_SHIELD_PENALTY_TO_PHYSIC_DAMAGE = 0.25;
var ENERGY_SHIELD_PENALTY_TO_ENERGY_DAMAGE = 0.25;

var DISINTEGRATE_ENERGY_COST_PER_SECOND = 10;
var DISINTEGRATE_AMPLIFY_MULTIPLIER = 4;
var DISINTEGRATE_DURATION = 100;


var FIGHTER_REGEN_AMOUNT = 0.02;
var FIGHTER_INVISIBLE_DURATION = 5000;
var FIGHTER_INVISIBLE_COOLDOWN = 12000;

var CORVETTE_HEAL_AMOUNT = 50;
var CORVETTE_SPEED_BUFF_FACTOR = 1.5;
var CORVETTE_SPEED_BUFF_DURATION = 3000;
var CORVETTE_INVISIBLE_DURATION = 3000;


var FRIGATE_PROVOKE_DURATION = 100;
var FRIGATE_DISABLE_DURATION = 1000;
var FRIGATE_ENERGY_DRAIN_PER_SEC = 120;
var FRIGATE_ENERGY_DRAIN_MULTIPLIER = 30;
var FRIGATE_RANGE_REDUCE_DURATION = 100;
var FRIGATE_RANGE_REDUCE_MULTIPLIER = 0.5;
// =======================================================================================================







// =======================================================================================================
// TURRET
// =======================================================================================================
var ENUM_TURRET_GATLING = 1;
var ENUM_TURRET_CANNON = 2;
var ENUM_TURRET_MISSILE = 3;
var ENUM_TURRET_ACID = 4;
var ENUM_TURRET_LASER = 5;
var ENUM_TURRET_SHOCKWAVE = 6;
var ENUM_TURRET_GAUSS = 7;
var ENUM_TURRET_STATIC = 8;
var ENUM_BUILDING_AMMUNITION = 9;
var ENUM_BUILDING_ENERGY = 10;

var g_turretData = new Array();
function TurretData () {
	this.m_name = 0;
	this.m_cost = 0;
	this.m_range = 0;
	this.m_rateOfFire = 0;
	this.m_rotateSpeed = 0;
	this.m_ammoCost = 0;
	this.m_energyCost = 0;
}


g_turretData[ENUM_TURRET_GATLING] = new TurretData();             // 60 DPS, 10 APS
g_turretData[ENUM_TURRET_GATLING].m_name = TEXT_TURRET_NAME_1;
g_turretData[ENUM_TURRET_GATLING].m_range = 400;
g_turretData[ENUM_TURRET_GATLING].m_rateOfFire = 100;
g_turretData[ENUM_TURRET_GATLING].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_GATLING].m_cost = 20;
g_turretData[ENUM_TURRET_GATLING].m_ammoCost = 1;
g_turretData[ENUM_TURRET_GATLING].m_energyCost = 0;
g_turretData[ENUM_TURRET_GATLING].m_desc =TEXT_TURRET_DESC_1;
g_turretData[ENUM_TURRET_GATLING].m_tips = TEXT_TURRET_TIPS_1;

g_turretData[ENUM_TURRET_CANNON] = new TurretData();              // 70 DPS main target, splash can be more, 20 APS
g_turretData[ENUM_TURRET_CANNON].m_name = TEXT_TURRET_NAME_2;
g_turretData[ENUM_TURRET_CANNON].m_range = 600;
g_turretData[ENUM_TURRET_CANNON].m_rateOfFire = 2000;
g_turretData[ENUM_TURRET_CANNON].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_CANNON].m_cost = 50;
g_turretData[ENUM_TURRET_CANNON].m_ammoCost = 40;
g_turretData[ENUM_TURRET_CANNON].m_energyCost = 0;
g_turretData[ENUM_TURRET_CANNON].m_desc = TEXT_TURRET_DESC_2;
g_turretData[ENUM_TURRET_CANNON].m_tips = TEXT_TURRET_TIPS_2;

g_turretData[ENUM_TURRET_MISSILE] = new TurretData();             // 100 DPS, splash can be more, 30 APS
g_turretData[ENUM_TURRET_MISSILE].m_name = TEXT_TURRET_NAME_3;
g_turretData[ENUM_TURRET_MISSILE].m_range = 800;
g_turretData[ENUM_TURRET_MISSILE].m_rateOfFire = 3000;
g_turretData[ENUM_TURRET_MISSILE].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_MISSILE].m_cost = 100;
g_turretData[ENUM_TURRET_MISSILE].m_ammoCost = 90;
g_turretData[ENUM_TURRET_MISSILE].m_energyCost = 0;
g_turretData[ENUM_TURRET_MISSILE].m_desc =	TEXT_TURRET_DESC_3;
g_turretData[ENUM_TURRET_MISSILE].m_tips = TEXT_TURRET_TIPS_3;

g_turretData[ENUM_TURRET_ACID] = new TurretData();                // Acid DPS currently 100, ignore armor, 40 APS
g_turretData[ENUM_TURRET_ACID].m_name = TEXT_TURRET_NAME_4;
g_turretData[ENUM_TURRET_ACID].m_range = 170;
g_turretData[ENUM_TURRET_ACID].m_rateOfFire = 50;
g_turretData[ENUM_TURRET_ACID].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_ACID].m_cost = 250;
g_turretData[ENUM_TURRET_ACID].m_ammoCost = 2;
g_turretData[ENUM_TURRET_ACID].m_energyCost = 0;
g_turretData[ENUM_TURRET_ACID].m_desc =	TEXT_TURRET_DESC_4;
g_turretData[ENUM_TURRET_ACID].m_tips = TEXT_TURRET_TIPS_4;

g_turretData[ENUM_TURRET_LASER] = new TurretData();               // 40 DPS, 10 EPS
g_turretData[ENUM_TURRET_LASER].m_name = TEXT_TURRET_NAME_5;
g_turretData[ENUM_TURRET_LASER].m_range = 400;
g_turretData[ENUM_TURRET_LASER].m_rateOfFire = 50;
g_turretData[ENUM_TURRET_LASER].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_LASER].m_cost = 25;
g_turretData[ENUM_TURRET_LASER].m_ammoCost = 0;
g_turretData[ENUM_TURRET_LASER].m_energyCost = 0.5;
g_turretData[ENUM_TURRET_LASER].m_desc = TEXT_TURRET_DESC_5;
g_turretData[ENUM_TURRET_LASER].m_tips = TEXT_TURRET_TIPS_5;

g_turretData[ENUM_TURRET_SHOCKWAVE] = new TurretData();           // 70 DPS, 20 EPS
g_turretData[ENUM_TURRET_SHOCKWAVE].m_name = TEXT_TURRET_NAME_6;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_range = 180;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_rateOfFire = 2000;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_rotateSpeed = 0;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_cost = 150;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_ammoCost = 0;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_energyCost = 40;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_desc = TEXT_TURRET_DESC_6;
g_turretData[ENUM_TURRET_SHOCKWAVE].m_tips = TEXT_TURRET_TIPS_6;

g_turretData[ENUM_TURRET_GAUSS] = new TurretData();                // 80 DPS each target, 33.33 EPS
g_turretData[ENUM_TURRET_GAUSS].m_name = TEXT_TURRET_NAME_7;
g_turretData[ENUM_TURRET_GAUSS].m_range = 1000;
g_turretData[ENUM_TURRET_GAUSS].m_rateOfFire = 3000;
g_turretData[ENUM_TURRET_GAUSS].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_GAUSS].m_cost = 200;
g_turretData[ENUM_TURRET_GAUSS].m_ammoCost = 0;
g_turretData[ENUM_TURRET_GAUSS].m_energyCost = 100;
g_turretData[ENUM_TURRET_GAUSS].m_desc = TEXT_TURRET_DESC_7;
g_turretData[ENUM_TURRET_GAUSS].m_tips = TEXT_TURRET_TIPS_7;

g_turretData[ENUM_TURRET_STATIC] = new TurretData();                // DPS 100 each target, if the bullet can follow them in 1 sec though, 20 EPS
g_turretData[ENUM_TURRET_STATIC].m_name = TEXT_TURRET_NAME_8;
g_turretData[ENUM_TURRET_STATIC].m_range = 700;
g_turretData[ENUM_TURRET_STATIC].m_rateOfFire = 5000;
g_turretData[ENUM_TURRET_STATIC].m_rotateSpeed = 0.2;
g_turretData[ENUM_TURRET_STATIC].m_cost = 180;
g_turretData[ENUM_TURRET_STATIC].m_ammoCost = 0;
g_turretData[ENUM_TURRET_STATIC].m_energyCost = 100;
g_turretData[ENUM_TURRET_STATIC].m_desc = TEXT_TURRET_DESC_8;
g_turretData[ENUM_TURRET_STATIC].m_tips = TEXT_TURRET_TIPS_8;

g_turretData[ENUM_BUILDING_AMMUNITION] = new TurretData();
g_turretData[ENUM_BUILDING_AMMUNITION].m_name = TEXT_TURRET_NAME_9;
g_turretData[ENUM_BUILDING_AMMUNITION].m_cost = 40;
g_turretData[ENUM_BUILDING_AMMUNITION].m_desc = TEXT_TURRET_DESC_9;
g_turretData[ENUM_BUILDING_AMMUNITION].m_tips = TEXT_TURRET_TIPS_9;

g_turretData[ENUM_BUILDING_ENERGY] = new TurretData();
g_turretData[ENUM_BUILDING_ENERGY].m_name = TEXT_TURRET_NAME_10;
g_turretData[ENUM_BUILDING_ENERGY].m_cost = 40;
g_turretData[ENUM_BUILDING_ENERGY].m_desc = TEXT_TURRET_DESC_10;
g_turretData[ENUM_BUILDING_ENERGY].m_tips = TEXT_TURRET_TIPS_10;
// =======================================================================================================








// =======================================================================================================
// BULLET
// =======================================================================================================
var ENUM_PROJECTILE_GATLING = 1;
var ENUM_PROJECTILE_CANNON = 2;
var ENUM_PROJECTILE_MISSILE = 3;
var ENUM_PROJECTILE_ACID = 4;
var ENUM_PROJECTILE_LASER = 5;
var ENUM_PROJECTILE_SHOCKWAVE = 6;
var ENUM_PROJECTILE_GAUSS = 7;
var ENUM_PROJECTILE_STATIC = 8;
var ENUM_PROJECTILE_PENETRATOR = 9;
var ENUM_PROJECTILE_LIQUID_EXPLOSIVE = 10;
var ENUM_PROJECTILE_SUPER_LASER = 11;
var ENUM_PROJECTILE_NULL_MISSILE = 12;
var ENUM_PROJECTILE_SLOW_SHOCKWAVE = 13;
var ENUM_PROJECTILE_ENCASE_STATIC = 14;
var ENUM_PROJECTILE_DISINTEGRATE_BEAM = 15;


function BulletData () {
	this.m_speed = 0;
	this.m_damage = 0;
	this.m_armorPierce = 0;
	this.m_homingSpeed = 0;
	this.m_areaOfEffect = 0;
}

var g_bulletData = new Array();
g_bulletData[ENUM_PROJECTILE_GATLING] = new BulletData();
g_bulletData[ENUM_PROJECTILE_GATLING].m_speed = 0.7;
g_bulletData[ENUM_PROJECTILE_GATLING].m_damage = 7;
g_bulletData[ENUM_PROJECTILE_GATLING].m_armorPierce = 0;
g_bulletData[ENUM_PROJECTILE_GATLING].m_areaOfEffect = 0;

g_bulletData[ENUM_PROJECTILE_CANNON] = new BulletData();
g_bulletData[ENUM_PROJECTILE_CANNON].m_speed = 0.4;
g_bulletData[ENUM_PROJECTILE_CANNON].m_damage = 160;
g_bulletData[ENUM_PROJECTILE_CANNON].m_armorPierce = 0.4;
g_bulletData[ENUM_PROJECTILE_CANNON].m_areaOfEffect = 80;

g_bulletData[ENUM_PROJECTILE_MISSILE] = new BulletData();
g_bulletData[ENUM_PROJECTILE_MISSILE].m_speed = 0.4;
g_bulletData[ENUM_PROJECTILE_MISSILE].m_damage = 330;
g_bulletData[ENUM_PROJECTILE_MISSILE].m_armorPierce = 0;
g_bulletData[ENUM_PROJECTILE_MISSILE].m_homingSpeed = 0.05;
g_bulletData[ENUM_PROJECTILE_MISSILE].m_areaOfEffect = 100;

g_bulletData[ENUM_PROJECTILE_ACID] = new BulletData();
g_bulletData[ENUM_PROJECTILE_ACID].m_speed = 0.2;
g_bulletData[ENUM_PROJECTILE_ACID].m_damage = 0;
g_bulletData[ENUM_PROJECTILE_ACID].m_armorPierce = 1;

g_bulletData[ENUM_PROJECTILE_LASER] = new BulletData();
g_bulletData[ENUM_PROJECTILE_LASER].m_speed = 0;
g_bulletData[ENUM_PROJECTILE_LASER].m_damage = 3;
g_bulletData[ENUM_PROJECTILE_LASER].m_armorPierce = 0.2;

g_bulletData[ENUM_PROJECTILE_SHOCKWAVE] = new BulletData();
g_bulletData[ENUM_PROJECTILE_SHOCKWAVE].m_speed = 0.4;
g_bulletData[ENUM_PROJECTILE_SHOCKWAVE].m_damage = 150;
g_bulletData[ENUM_PROJECTILE_SHOCKWAVE].m_armorPierce = 0;

g_bulletData[ENUM_PROJECTILE_GAUSS] = new BulletData();
g_bulletData[ENUM_PROJECTILE_GAUSS].m_speed = 5;
g_bulletData[ENUM_PROJECTILE_GAUSS].m_damage = 270;
g_bulletData[ENUM_PROJECTILE_GAUSS].m_armorPierce = 1;

g_bulletData[ENUM_PROJECTILE_STATIC] = new BulletData();
g_bulletData[ENUM_PROJECTILE_STATIC].m_speed = 0.2;
g_bulletData[ENUM_PROJECTILE_STATIC].m_damage = 0.25;
g_bulletData[ENUM_PROJECTILE_STATIC].m_armorPierce = 0;
g_bulletData[ENUM_PROJECTILE_STATIC].m_areaOfEffect = 120;

g_bulletData[ENUM_PROJECTILE_PENETRATOR] = new BulletData();
g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_speed = 0.4;
g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_damage = 250;
g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_armorPierce = 1;
g_bulletData[ENUM_PROJECTILE_PENETRATOR].m_areaOfEffect = 0;

g_bulletData[ENUM_PROJECTILE_LIQUID_EXPLOSIVE] = new BulletData();
g_bulletData[ENUM_PROJECTILE_LIQUID_EXPLOSIVE].m_speed = 0.2;
g_bulletData[ENUM_PROJECTILE_LIQUID_EXPLOSIVE].m_damage = 0;
g_bulletData[ENUM_PROJECTILE_LIQUID_EXPLOSIVE].m_armorPierce = 0;

g_bulletData[ENUM_PROJECTILE_SUPER_LASER] = new BulletData();
g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_speed = 0;
g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_damage = 1.8;
g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_armorPierce = 0;
g_bulletData[ENUM_PROJECTILE_SUPER_LASER].m_areaOfEffect = 120;

g_bulletData[ENUM_PROJECTILE_NULL_MISSILE] = new BulletData();
g_bulletData[ENUM_PROJECTILE_NULL_MISSILE].m_speed = 0.4;
g_bulletData[ENUM_PROJECTILE_NULL_MISSILE].m_damage = 0;
g_bulletData[ENUM_PROJECTILE_NULL_MISSILE].m_armorPierce = 0;
g_bulletData[ENUM_PROJECTILE_NULL_MISSILE].m_homingSpeed = 0.06;
g_bulletData[ENUM_PROJECTILE_NULL_MISSILE].m_areaOfEffect = 80;

g_bulletData[ENUM_PROJECTILE_SLOW_SHOCKWAVE] = new BulletData();
g_bulletData[ENUM_PROJECTILE_SLOW_SHOCKWAVE].m_speed = 0.4;
g_bulletData[ENUM_PROJECTILE_SLOW_SHOCKWAVE].m_damage = 0;
g_bulletData[ENUM_PROJECTILE_SLOW_SHOCKWAVE].m_armorPierce = 0;

g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC] = new BulletData();
g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_speed = 0.3;
g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_damage = 0.25;
g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_armorPierce = 0;
g_bulletData[ENUM_PROJECTILE_ENCASE_STATIC].m_areaOfEffect = 120;

g_bulletData[ENUM_PROJECTILE_DISINTEGRATE_BEAM] = new BulletData();
g_bulletData[ENUM_PROJECTILE_DISINTEGRATE_BEAM].m_speed = 0;
g_bulletData[ENUM_PROJECTILE_DISINTEGRATE_BEAM].m_damage = 0;
g_bulletData[ENUM_PROJECTILE_DISINTEGRATE_BEAM].m_armorPierce = 0;


// =======================================================================================================






// =======================================================================================================
// EXPLOSION
// =======================================================================================================
var ENUM_GATLING_EXPLOSION = 1;
var ENUM_SMALL_EXPLOSION = 2;
var ENUM_SMALL_EXPLOSION_DEBRIS = 3;
var ENUM_FIRE_EXPLOSION = 4;
var ENUM_SHOCKWAVE_EXPLOSION = 5;
var ENUM_STATIC_EXPLOSION = 6;
var ENUM_BULLET_DESTROY_EXPLOSION = 7;
var ENUM_STATIC_DESTROY_EXPLOSION = 8;
// =======================================================================================================





// =======================================================================================================
// ENEMY
// =======================================================================================================
var g_enemyTierHPMultilpier = [1, 2, 3, 4, 5];

function EnemyData() {
	this.m_bounty = 0;
	this.m_damage = 0;
	this.m_speed = 0;
	this.m_maxHP = 0;
	this.m_armor = 0;
	this.m_rank = RANK_DEF_FIGHTER;
}

// abc: a = rank, b = type, c = tier;

var g_enemyData = new Array();


// Normal drone
g_enemyData[11] = new EnemyData();
g_enemyData[11].m_bounty = 1;
g_enemyData[11].m_damage = 1;
g_enemyData[11].m_speed = 0.11;
g_enemyData[11].m_maxHP = 100;
g_enemyData[11].m_armor = 0;
g_enemyData[11].m_name = TEXT_ENEMY_NAME_1;
g_enemyData[11].m_desc = TEXT_ENEMY_DESC_1;
// Tough drone
g_enemyData[12] = new EnemyData();
g_enemyData[12].m_bounty = 1;
g_enemyData[12].m_damage = 1;
g_enemyData[12].m_speed = 0.07;
g_enemyData[12].m_maxHP = 150;
g_enemyData[12].m_armor = 0.5;
g_enemyData[12].m_name = TEXT_ENEMY_NAME_2;
g_enemyData[12].m_desc = TEXT_ENEMY_DESC_2;
// Fast drone
g_enemyData[13] = new EnemyData();
g_enemyData[13].m_bounty = 1;
g_enemyData[13].m_damage = 1;
g_enemyData[13].m_speed = 0.2;
g_enemyData[13].m_maxHP = 70;
g_enemyData[13].m_armor = 0;
g_enemyData[13].m_name = TEXT_ENEMY_NAME_3;
g_enemyData[13].m_desc = TEXT_ENEMY_DESC_3;
// Regen drone
g_enemyData[14] = new EnemyData();
g_enemyData[14].m_bounty = 2;
g_enemyData[14].m_damage = 1;
g_enemyData[14].m_speed = 0.12;
g_enemyData[14].m_maxHP = 130;
g_enemyData[14].m_armor = 0.2;
g_enemyData[14].m_name = TEXT_ENEMY_NAME_4;
g_enemyData[14].m_desc = TEXT_ENEMY_DESC_4;
// Invisible drone
g_enemyData[15] = new EnemyData();
g_enemyData[15].m_bounty = 2;
g_enemyData[15].m_damage = 1;
g_enemyData[15].m_speed = 0.14;
g_enemyData[15].m_maxHP = 110;
g_enemyData[15].m_armor = 0.2;
g_enemyData[15].m_name = TEXT_ENEMY_NAME_5;
g_enemyData[15].m_desc = TEXT_ENEMY_DESC_5;



// Healer corvette
g_enemyData[21] = new EnemyData();
g_enemyData[21].m_bounty = 5;
g_enemyData[21].m_damage = 2;
g_enemyData[21].m_speed = 0.11;
g_enemyData[21].m_maxHP = 200;
g_enemyData[21].m_armor = 0.2;
g_enemyData[21].m_coolDown = 4000;
g_enemyData[21].m_range = 200;
g_enemyData[21].m_name = TEXT_ENEMY_NAME_6;
g_enemyData[21].m_desc = TEXT_ENEMY_DESC_6;
// K-Shield corvette
g_enemyData[22] = new EnemyData();
g_enemyData[22].m_bounty = 5;
g_enemyData[22].m_damage = 2;
g_enemyData[22].m_speed = 0.07;
g_enemyData[22].m_maxHP = 400;
g_enemyData[22].m_armor = 0.5;
g_enemyData[22].m_coolDown = 5000;
g_enemyData[22].m_range = 200;
g_enemyData[22].m_name = TEXT_ENEMY_NAME_7;
g_enemyData[22].m_desc = TEXT_ENEMY_DESC_7;
// E-Shield corvette
g_enemyData[23] = new EnemyData();
g_enemyData[23].m_bounty = 5;
g_enemyData[23].m_damage = 2;
g_enemyData[23].m_speed = 0.07;
g_enemyData[23].m_maxHP = 400;
g_enemyData[23].m_armor = 0.5;
g_enemyData[23].m_coolDown = 5000;
g_enemyData[23].m_range = 200;
g_enemyData[23].m_name = TEXT_ENEMY_NAME_8;
g_enemyData[23].m_desc = TEXT_ENEMY_DESC_8;
// Speed buff corvette
g_enemyData[24] = new EnemyData();
g_enemyData[24].m_bounty = 5;
g_enemyData[24].m_damage = 2;
g_enemyData[24].m_speed = 0.2;
g_enemyData[24].m_maxHP = 150;
g_enemyData[24].m_armor = 0.0;
g_enemyData[24].m_coolDown = 4000;
g_enemyData[24].m_range = 200;
g_enemyData[24].m_name = TEXT_ENEMY_NAME_9;
g_enemyData[24].m_desc = TEXT_ENEMY_DESC_9;
// Invisible buff corvette
g_enemyData[25] = new EnemyData();
g_enemyData[25].m_bounty = 5;
g_enemyData[25].m_damage = 2;
g_enemyData[25].m_speed = 0.2;
g_enemyData[25].m_maxHP = 250;
g_enemyData[25].m_armor = 0.2;
g_enemyData[25].m_coolDown = 7000;
g_enemyData[25].m_range = 200;
g_enemyData[25].m_name = TEXT_ENEMY_NAME_10;
g_enemyData[25].m_desc = TEXT_ENEMY_DESC_10;


// Protector Frigate
g_enemyData[31] = new EnemyData();
g_enemyData[31].m_bounty = 30;
g_enemyData[31].m_damage = 5;
g_enemyData[31].m_speed = 0.06;
g_enemyData[31].m_maxHP = 1200;
g_enemyData[31].m_armor = 0.2;
g_enemyData[31].m_coolDown = 0;
g_enemyData[31].m_range = 200;
g_enemyData[31].m_name = TEXT_ENEMY_NAME_11;
g_enemyData[31].m_desc = TEXT_ENEMY_DESC_11;
// Tanker Frigate
g_enemyData[32] = new EnemyData();
g_enemyData[32].m_bounty = 40;
g_enemyData[32].m_damage = 5;
g_enemyData[32].m_speed = 0.05;
g_enemyData[32].m_maxHP = 1500;
g_enemyData[32].m_armor = 0.9;
g_enemyData[32].m_coolDown = 0;
g_enemyData[32].m_range = 500;
g_enemyData[32].m_name = TEXT_ENEMY_NAME_12;
g_enemyData[32].m_desc = TEXT_ENEMY_DESC_12;
// Drainer Frigate
g_enemyData[33] = new EnemyData();
g_enemyData[33].m_bounty = 30;
g_enemyData[33].m_damage = 5;
g_enemyData[33].m_speed = 0.06;
g_enemyData[33].m_maxHP = 1000;
g_enemyData[33].m_armor = 0.3;
g_enemyData[33].m_coolDown = 0;
g_enemyData[33].m_range = 0;
g_enemyData[33].m_name = TEXT_ENEMY_NAME_13;
g_enemyData[33].m_desc = TEXT_ENEMY_DESC_13;
// Jammer Frigate
g_enemyData[34] = new EnemyData();
g_enemyData[34].m_bounty = 30;
g_enemyData[34].m_damage = 5;
g_enemyData[34].m_speed = 0.06;
g_enemyData[34].m_maxHP = 1000;
g_enemyData[34].m_armor = 0.3;
g_enemyData[34].m_coolDown = 0;
g_enemyData[34].m_range = 700;
g_enemyData[34].m_name = TEXT_ENEMY_NAME_14;
g_enemyData[34].m_desc = TEXT_ENEMY_DESC_14;
// Hacker Frigate
g_enemyData[35] = new EnemyData();
g_enemyData[35].m_bounty = 70;
g_enemyData[35].m_damage = 5;
g_enemyData[35].m_speed = 0.07;
g_enemyData[35].m_maxHP = 1000;
g_enemyData[35].m_armor = 0.5;
g_enemyData[35].m_coolDown = 0;
g_enemyData[35].m_range = 400;
g_enemyData[35].m_name = TEXT_ENEMY_NAME_15;
g_enemyData[35].m_desc = TEXT_ENEMY_DESC_15;




// 1st Cruiser
g_enemyData[41] = new EnemyData();
g_enemyData[41].m_bounty = 500;
g_enemyData[41].m_damage = 100;
g_enemyData[41].m_speed = 0.02;
g_enemyData[41].m_maxHP = 300000;
g_enemyData[41].m_armor = 0.7;
g_enemyData[41].m_coolDown = 2000;
g_enemyData[41].m_range = 400;
g_enemyData[41].m_name = TEXT_ENEMY_NAME_16;
g_enemyData[41].m_desc = TEXT_ENEMY_DESC_16;

// 2nd Cruiser
g_enemyData[42] = new EnemyData();
g_enemyData[42].m_bounty = 500;
g_enemyData[42].m_damage = 100;
g_enemyData[42].m_speed = 0.02;
g_enemyData[42].m_maxHP = 500000;
g_enemyData[42].m_armor = 0.3;
g_enemyData[42].m_coolDown = 3000;
g_enemyData[42].m_range = 400;
g_enemyData[42].m_name = TEXT_ENEMY_NAME_17;
g_enemyData[42].m_desc = TEXT_ENEMY_DESC_17;

// 2nd Cruiser
g_enemyData[43] = new EnemyData();
g_enemyData[43].m_bounty = 10000;
g_enemyData[43].m_damage = 100;
g_enemyData[43].m_speed = 0.02;
g_enemyData[43].m_maxHP = 600000;
g_enemyData[43].m_armor = 0.5;
g_enemyData[43].m_coolDown = 0;
g_enemyData[43].m_range = 0;
g_enemyData[43].m_name = TEXT_ENEMY_NAME_18;
g_enemyData[43].m_desc = TEXT_ENEMY_DESC_18;

// =======================================================================================================