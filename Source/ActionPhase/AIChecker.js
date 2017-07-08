var AI_CHECKER_NONE = 0;
var AI_CHECKER_HP = 1;
var AI_CHECKER_SPEED = 2;
var AI_CHECKER_ARMOUR = 3;
var AI_CHECKER_RANK = 4;
var AI_CHECKER_RANGE = 5;
var AI_CHECKER_DISTANCE = 6;
var AI_CHECKER_CLUSTER = 7;
var AI_CHECKER_STATUS = 8;

var AI_CHECKER_SELF = 9;
var AI_CHECKER_AMMUNITION = 10;
var AI_CHECKER_ENERGY = 11;

var AI_ACTION_NONE = 0;
var AI_ACTION_ATTACK = 1;
var AI_ACTION_SPECIAL = 2;
var AI_ACTION_IDLE = 3;
var AI_ACTION_NEXT = 4;


AI_CHECKER_RANGE_NEAREST = 3;
AI_CHECKER_SELF_HAVE_TARGET = 1;

function AIChecker (battle, turret) {
	this.m_conditionType = 0;
	this.m_conditionValue = 0;
	this.m_actionType = 0;
	
	
	this.CloneFromThisAI = function (rhs) {
		this.m_conditionType = rhs.m_conditionType;
		this.m_conditionValue = rhs.m_conditionValue;
		this.m_actionType = rhs.m_actionType;
	}
	
	var enemy = null;
	var result = null;
	this.Check = function (enemyList) {
		enemy = enemyList;
		result = new Array();
		for (var i=0; i<enemy.length; i++) {
			result[i] = enemy[i];
		}
		
		switch (this.m_conditionType) {
			case AI_CHECKER_HP:
				this.CheckHP ();
				break;
			case AI_CHECKER_SPEED:
				this.CheckSpeed ();
				break;
			case AI_CHECKER_ARMOUR:
				this.CheckArmour ();
				break;
			case AI_CHECKER_RANK:
				this.CheckRank ();
				break;
			case AI_CHECKER_RANGE:
				this.CheckRange ();
				break;
			case AI_CHECKER_DISTANCE:
				this.CheckDistance ();
				break;
			case AI_CHECKER_CLUSTER:
				this.CheckCluster ();
				break;
			case AI_CHECKER_STATUS:
				this.CheckStatus ();
				break;
			case AI_CHECKER_SELF:
				this.CheckSelf ();
				break;
			case AI_CHECKER_AMMUNITION:
				this.CheckAmmunition ();
				break;
			case AI_CHECKER_ENERGY:
				this.CheckEnergy ();
				break;
		}
		
		return result;
	}
	
	this.CheckHP = function () {
		if (this.m_conditionValue >= 1 && this.m_conditionValue <= 4) {
			var value = 0;
			if      (this.m_conditionValue == 1) value = 0.8;
			else if (this.m_conditionValue == 2) value = 0.6;
			else if (this.m_conditionValue == 3) value = 0.4;
			else if (this.m_conditionValue == 4) value = 0.2;
			
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_HP / result[i].m_maxHP > value) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue >= 5 && this.m_conditionValue <= 8) {
			var value = 0;
			if      (this.m_conditionValue == 5) value = 0.8;
			else if (this.m_conditionValue == 6) value = 0.6;
			else if (this.m_conditionValue == 7) value = 0.4;
			else if (this.m_conditionValue == 8) value = 0.2;
			
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_HP / result[i].m_maxHP < value) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 9) {
			var minHP = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				if (minHP == -1 || result[i].m_HP < minHP) {
					minHP = result[i].m_HP;
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
		else if (this.m_conditionValue == 10) {
			var maxHP = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				if (maxHP == -1 || result[i].m_HP > maxHP) {
					maxHP = result[i].m_HP;
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
	}
	
	this.CheckSpeed = function () {
		if (this.m_conditionValue == 1) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].GetCurrentSpeed() < SPEED_DEF_FAST) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 2) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].GetCurrentSpeed() > SPEED_DEF_FAST || result[i].GetCurrentSpeed() < SPEED_DEF_SLOW) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 3) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].GetCurrentSpeed() > SPEED_DEF_SLOW) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 4) {
			var maxSpeed = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				if (maxSpeed == -1 || result[i].GetCurrentSpeed() > maxSpeed) {
					maxSpeed = result[i].GetCurrentSpeed();
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
		else if (this.m_conditionValue == 5) {
			var minSpeed = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				if (minSpeed == -1 || result[i].GetCurrentSpeed() < minSpeed) {
					minSpeed = result[i].GetCurrentSpeed();
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
	}
	
	this.CheckArmour = function () {
		if (this.m_conditionValue == 1) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_armor < ARMOUR_DEF_HEAVY) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 2) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_armor > ARMOUR_DEF_HEAVY || result[i].m_armor < ARMOUR_DEF_LIGHT) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 3) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_armor > ARMOUR_DEF_LIGHT) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 4) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_armor > 0) {
					result.splice(i, 1);
				}
			}
		}
	}
	
	this.CheckRank = function () {
		for (var i=result.length-1; i>=0; i--) {
			if (result[i].m_rank != this.m_conditionValue) {
				result.splice(i, 1);
			}
		}
	}
	
	this.CheckRange = function () {
		if (this.m_conditionValue >= 1 && this.m_conditionValue <= 2) {
			for (var i=result.length-1; i>=0; i--) {
				var range = CalculateRangeBetweenTwoPoint(result[i].m_x,result[i].m_y, turret.m_x, turret.m_y);
				
				if (this.m_conditionValue == 1) {
					var value = 0.5;
					if (range / turret.m_range > value) {
						result.splice(i, 1);
					}
				}
				else if (this.m_conditionValue == 2) {
					var value = 0.5;
					if (range / turret.m_range < value) {
						result.splice(i, 1);
					}
				}
			
			}
		}
		else if (this.m_conditionValue == 3) {
			var minRange = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				var range = CalculateRangeBetweenTwoPoint(result[i].m_x,result[i].m_y, turret.m_x, turret.m_y);
				if (minRange == -1 || range < minRange) {
					minRange = range;
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
		else if (this.m_conditionValue == 4) {
			var maxRange = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				var range = CalculateRangeBetweenTwoPoint(result[i].m_x,result[i].m_y, turret.m_x, turret.m_y);
				if (maxRange == -1 || range > maxRange) {
					maxRange = range;
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
	}
	
	this.CheckDistance = function () {
		if (this.m_conditionValue == 1) {
			var minStep = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				var stepLeft = 1 - result[i].GetProgress();
				if (minStep == -1 || stepLeft < minStep) {
					minStep = stepLeft;
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
		else if (this.m_conditionValue == 2) {
			var minStep = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				var stepMoved = result[i].GetProgress();
				if (minStep == -1 || stepMoved < minStep) {
					minStep = stepMoved;
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
	}
	
	this.CheckCluster = function () {
		var clusterNumber = new Array();
		for (var i=0; i<result.length; i++) {
			clusterNumber[i] = 0;
			for (var j=0; j<result.length; j++) {
				if (i != j) {
					var range = CalculateRangeBetweenTwoPoint(result[i].m_x,result[i].m_y, result[j].m_x, result[j].m_y);
					if (range < RANGE_DEF_CLUSTER) {
						clusterNumber[i] ++;
					}
				}
			}
		}
		
		if (this.m_conditionValue == 1) {
			for (var i=result.length-1; i>=0; i--) {
				if (clusterNumber[i] > 0) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 5) {
			var maxNumber = -1;
			var target = null;
			for (var i=0; i<result.length; i++) {
				if (maxNumber == -1 || clusterNumber[i] > maxNumber) {
					maxNumber = clusterNumber[i];
					target = result[i];
				}
			}
			result = new Array();
			if (target != null)
				result[0] = target;
		}
		else {
			var value = 0;
			if (this.m_conditionValue == 2) value = 0;
			else if (this.m_conditionValue == 3) value = 2;
			else if (this.m_conditionValue == 4) value = 4;
			
			for (var i=result.length-1; i>=0; i--) {
				if (clusterNumber[i] <= value) {
					result.splice(i, 1);
				}
			}
		}
	}
	
	this.CheckStatus = function () {
		if (this.m_conditionValue == 1) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_kineticShield == true) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 2) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_kineticShield == false) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 3) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_energyShield == true) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 4) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_energyShield == false) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 5) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_acidDuration > 0) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 6) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_acidDuration <= 0) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 7) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_LEDuration > 0) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 8) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_LEDuration <= 0) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 9) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_DBDuration > 0) {
					result.splice(i, 1);
				}
			}
		}
		else if (this.m_conditionValue == 10) {
			for (var i=result.length-1; i>=0; i--) {
				if (result[i].m_DBDuration <= 0) {
					result.splice(i, 1);
				}
			}
		}
	}
	
	this.CheckSelf = function () {
		if (this.m_conditionValue == 1) {
			result = new Array();
			if (turret.m_target != null) {
				result[0] = turret.m_target;
			}
		}
		
		return result;
	}
	this.CheckAmmunition = function () {
		if (this.m_conditionValue >= 1 && this.m_conditionValue <= 4) {
			var value = 0;
			if      (this.m_conditionValue == 1) value = 800;
			else if (this.m_conditionValue == 2) value = 600;
			else if (this.m_conditionValue == 3) value = 400;
			else if (this.m_conditionValue == 4) value = 200;
			
			if (battle.m_ammunition > value) {
				result = new Array();
			}
		}
		else if (this.m_conditionValue >= 5 && this.m_conditionValue <= 8) {
			var value = 0;
			if      (this.m_conditionValue == 5) value = 800;
			else if (this.m_conditionValue == 6) value = 600;
			else if (this.m_conditionValue == 7) value = 400;
			else if (this.m_conditionValue == 8) value = 200;
			
			if (battle.m_ammunition < value) {
				result = new Array();
			}
		}
		
		return result;
	}
	this.CheckEnergy = function () {
		if (this.m_conditionValue >= 1 && this.m_conditionValue <= 4) {
			var value = 0;
			if      (this.m_conditionValue == 1) value = 800;
			else if (this.m_conditionValue == 2) value = 600;
			else if (this.m_conditionValue == 3) value = 400;
			else if (this.m_conditionValue == 4) value = 300;
			
			if (battle.m_energy > value) {
				result = new Array();
			}
		}
		else if (this.m_conditionValue >= 5 && this.m_conditionValue <= 8) {
			var value = 0;
			if      (this.m_conditionValue == 5) value = 800;
			else if (this.m_conditionValue == 6) value = 600;
			else if (this.m_conditionValue == 7) value = 400;
			else if (this.m_conditionValue == 8) value = 200;
			
			if (battle.m_energy < value) {
				result = new Array();
			}
		}
		
		return result;
	}
	
}