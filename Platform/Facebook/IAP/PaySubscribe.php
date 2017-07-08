<?php
	$verify_token = '0917631188';

	if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['hub_mode'])
	&& $_GET['hub_mode'] == 'subscribe' && isset($_GET['hub_verify_token'])
	&& $_GET['hub_verify_token'] == $verify_token) {
		echo $_GET['hub_challenge'];
	}
	else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
		$post_body = file_get_contents('php://input');
		$obj = json_decode($post_body, true);
		
		if ($obj["object"] == "payments") {
			$paymentID = $obj["entry"][0]["id"];
			
			$url = "https://graph.facebook.com/".$paymentID."?access_token=1416241065312513|SruGuFY--FndUrmxrDo_8tznfig";
			
			$ch = curl_init();

			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
			curl_setopt($ch, CURLOPT_USERAGENT , "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)");
			curl_setopt($ch, CURLOPT_URL, $url);

			$return = curl_exec($ch);
			curl_close($ch);
			
			$transactionData = json_decode($return, true);
			
			$userID = "fb:".$transactionData["user"]["id"];
			$requestID = "fb:".$transactionData["request_id"];
			$status = $transactionData["actions"][0]["status"];
			$pack = substr($requestID, 0, 1);
			
			mysql_connect("localhost:3306", "babyraptor", "Redruby1988");
			mysql_select_db("aiconflict");
			
			$query = "INSERT INTO transaction_list (transaction_id, user_id, pack, status) VALUES ('".$requestID."', '".$userID."', ".$pack.", '".$status."')";
			mysql_query($query);
			
			if ($status == "completed") {
				$result = mysql_query("SELECT upgradePoint, realUpgradePoint FROM user_list WHERE cred = '".$userID."'");
				$row = mysql_fetch_array($result);
				$upgradePoint = $row["upgradePoint"];
				$realUpgradePoint = $row["realUpgradePoint"];
				if ($pack == "1") {
					$upgradePoint += 10;
					$realUpgradePoint += 10;
				}
				else if ($pack == "2") {
					$upgradePoint += 20;
					$realUpgradePoint += 20;
				}
				else if ($pack == "3") {
					$upgradePoint += 50;
					$realUpgradePoint += 50;
				}
				else if ($pack == "4") {
					$upgradePoint += 100;
					$realUpgradePoint += 100;
				}
				
				$query = "UPDATE user_list SET upgradePoint = ".$upgradePoint.", realUpgradePoint = ".$realUpgradePoint." WHERE cred = '".$userID."'";;
				mysql_query($query);
			}
		}
	}
?>