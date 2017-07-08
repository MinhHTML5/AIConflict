<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST');  
	
	$api_key = "134b75f0-a5e6-4f0f-8451-0c0279b0bb72";
	
	//$user_id = "5709115";
	//$user_auth = "f95b33c9c4cdf96e608bba27129aa1094b7c9ef4b5f3768561c3b4c3b29d63f1";
	$user_id = $_GET['user_id'];
	$user_auth = $_GET['user_auth'];
	$user_cred = "kg:".$user_id;
	
	$inventory_url = "http://www.kongregate.com/api/user_items.json";
	$consume_url = "http://www.kongregate.com/api/use_item.json";
	
	// Retrieve inventory
	$ch = curl_init($inventory_url."?api_key=".$api_key."&user_id=".$user_id);
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_POST, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec( $ch );
	if(curl_errno($ch))	{
		echo "CURL_ERROR:".curl_error($ch);		
		return;
	}
	curl_close($ch);
	
	// Parse inventory
	$inventory = json_decode($response);
	$success = $inventory->success;
	if ($success == true) {
		mysql_connect("localhost:3306", "babyraptor", "Redruby1988");
		mysql_select_db("aiconflict");
		
		$result = mysql_query("SELECT upgradePoint, realUpgradePoint FROM user_list WHERE cred = '".$user_cred."'");
		$row = mysql_fetch_array($result);
		$upgradePoint = $row["upgradePoint"];
		$realUpgradePoint = $row["realUpgradePoint"];
		
		foreach ($inventory->items as $item) {
			$pack = 0;
			$status = "completed";
			$requestID = "kg:".$item->id;
			if ($item->identifier == "small_pack") {
				$pack = 1;
				$upgradePoint += 10;
				$realUpgradePoint += 10;
			}
			else if ($item->identifier == "medium_pack") {
				$pack = 2;
				$upgradePoint += 20;
				$realUpgradePoint += 20;
			}
			else if ($item->identifier == "large_pack") {
				$pack = 3;
				$upgradePoint += 50;
				$realUpgradePoint += 50;
			}
			else if ($item->identifier == "complete_pack") {
				$pack = 4;
				$upgradePoint += 100;
				$realUpgradePoint += 100;
			}
			
			$query = "INSERT INTO transaction_list (transaction_id, user_id, pack, status) VALUES ('".$requestID."', '".$user_cred."', ".$pack.", '".$status."')";
			mysql_query($query);
			
			$ch = curl_init($consume_url."?api_key=".$api_key."&user_id=".$user_id."&game_auth_token=".$user_auth."&id=".$item->id);
			curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt( $ch, CURLOPT_POST, 0);
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

			$response = curl_exec( $ch );
			if(curl_errno($ch))	{
				echo "CURL_ERROR:".curl_error($ch);		
				return;
			}
			curl_close($ch);
		}
		
		$query = "UPDATE user_list SET upgradePoint = ".$upgradePoint.", realUpgradePoint = ".$realUpgradePoint." WHERE cred = '".$user_cred."'";;
		mysql_query($query);
	}
	
	
?>