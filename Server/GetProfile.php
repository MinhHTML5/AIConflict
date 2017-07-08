<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');  

	// Get credential from the Post param
	$cred = $_POST['cred'];

	// Conntect to DB
	mysql_connect("localhost:3306", "babyraptor", "Redruby1988");
	mysql_select_db("aiconflict");
	
	// Select user list with that cred
	$result = mysql_query("SELECT * FROM user_list WHERE cred = '".$cred."'");
	$row = mysql_fetch_array($result);

	// Fetch result
	if ($row["cred"] == null) {
		// Not found
		$response = '';
		$response["success"] = false;
		$response["cred"] = "";
		$response["setting"] = "";
		$response["upgradePoint"] = 0;
		
		echo json_encode($response);
	}
	else {
		// Found
		$response = '';
		$response["success"] = true;
		$response["cred"] = $row["cred"];
		$response["setting"] = $row["setting"];
		$response["upgradePoint"] = $row["upgradePoint"];
		
		echo json_encode($response);
	}
?>
