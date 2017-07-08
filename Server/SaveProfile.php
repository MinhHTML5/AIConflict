<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');  
	
	// Get credential from the Post param
	$cred = $_POST['cred'];
	$setting = $_POST['setting'];
	$upgradePoint = $_POST['upgradePoint'];

	$price = array(
		array(1, 2, 5),
		array(1, 2, 3),
		array(4, 4, 4),
		array(2, 2, 4),
		array(2, 2, 4),
		array(2, 4, 10),
		array(3, 4, 3),
		array(2, 3, 4),
		array(2, 2, 5),
		array(3, 10, 1)
	);
	
	$data = json_decode($setting);
	$upgrade = $data->upgrade;
	
	$totalPoint = 0;
	for ($i=0; $i<10; $i++) {
		for ($j=0; $j<3; $j++) {
			if ($upgrade[$i][$j] == true) {
				$totalPoint += $price[$i][$j];
			}
		}
	}
	
	$totalPoint += $upgradePoint;
	
	
	$progress = $data->progress;
	$freePoint = 0;
	
	if ($progress < 16) $freePoint = $progress * 3 - 3;
	else if ($progress == 16) $freePoint = 50;

	// Conntect to DB
	mysql_connect("localhost:3306", "babyraptor", "Redruby1988");
	mysql_select_db("aiconflict");
	
	$result = mysql_query("SELECT cred, realUpgradePoint FROM user_list WHERE cred = '".$cred."'");
	$row = mysql_fetch_array($result);
	
	if ($row["cred"] != null) {
		if ($totalPoint <= $row["realUpgradePoint"] + $freePoint) {
			$result = mysql_query("UPDATE user_list SET setting = '".$setting."', upgradePoint = ".$upgradePoint." WHERE cred = '".$cred."'");
		}
	}
	else {
		$result = mysql_query("INSERT INTO user_list (cred, setting, upgradePoint, realUpgradePoint) VALUES ('".$cred."', '".$setting."', 0, 0)");
	}
?>
