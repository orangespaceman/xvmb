<?php 
/*
 * database calls class
 *
 */
class dbCalls {
	
	var $dbCon;
	
	/**
	 * The constructor.
	 */
	function __construct() {
		global $dbCon;
		$this->dbCon = $dbCon;	
	}



	/*
	 * get xvmb
	 */
	function getLiveNoteCount() {
		$sql = "SELECT count(what) as notecount FROM `xvmb` WHERE `islive` = '1'";
		$result = $this->dbCon->selectQuery($sql);
		return $result;
	}
	
	
	/*
	 * get xvmb
	 */
	function getTotalNoteCount() {
		$sql = "SELECT count(what) as notecount FROM `xvmb`";
		$result = $this->dbCon->selectQuery($sql);
		return $result;
	}
	

	/*
	 * get xvmb
	 */
	function getNote() {
		$sql = "SELECT * FROM `xvmb` WHERE `islive` = '1' ORDER BY rand() limit 0,1";
		$result = $this->dbCon->selectQuery($sql);
		return $result;
	}

	
	/*
	 * add xvmb
	 */
	function addNote($post) {
		
		// sanitise
		foreach($post as $key => $postitem) {
			$postitem = strip_tags($postitem);
			$postitem = mysql_real_escape_string($postitem);
			$post[$key] = $postitem;
		}
		
		// error check
		$basicFields = array('who', 'what', 'where', 'when');
		$errors = array();
		foreach ($basicFields as $field) {
			if (empty($post[$field])) {
				array_push($errors, $field);
			}
		}
		
		
		if (count($errors) > 0) {
			$errorString = "";
			foreach ($errors as $error) {
				$errorString .=  $error . ", ";
			}
			
			$errorString = substr($errorString,0,-2);
			return array(
				'success' => false,
				'message' => 'There were errors with the following fields: ' . $errorString
			);
		} else {
		
			$isLive = $this->canAddBollocks();
		
			//insert 
			$sql = "INSERT into `xvmb` 
				(`who`, `what`, `where`, `when`, `ip`, `islive`, `dateadded`) values (
					'".stripslashes($post['who'])."', 
					'".stripslashes($post['what'])."',
					'".stripslashes($post['where'])."', 
					'".stripslashes($post['when'])."', 
					'".$_SERVER['REMOTE_ADDR']."', 
					'".$isLive."', 
					 NOW()
				)";

			$result = $this->dbCon->addQuery($sql);
			
			if ($isLive) {
				$message = '<p>Actioned!</p>';
				$mailed = 'no need!';
			} else {
				$message = '<p>Queued as a next step delivery!</p>';
				$mailed = $this->mailMe($post);
			}
			
			return array( 
				'success' => true,
				'message' => $message,
				'mailed' => $mailed
//				'details' => $post,
//				'sql' => $sql
			);
		}
	}
	
	
	
	/*
	 * Can add bollocks?
	 */
	function canAddBollocks() {
		
		$ini_array = parse_ini_file(dirname(__FILE__)."/../../config.ini.php", true);
		
		if ($ini_array['config']['restrictIp']) {
			foreach($ini_array['ip']['ip'] as $ip) {
				if ($ip == $_SERVER['REMOTE_ADDR']) {
					return 1;
				}
			}
			return 0;
		} else {
			return 1;
		}
	}
	
	
	/*
	 *
	 */
	function mailMe($post) {
		$ini_array = parse_ini_file(dirname(__FILE__)."/../../config.ini.php", true);
		if ($ini_array['config']['mailme'] && isset($ini_array['config']['emailTo']) && isset($ini_array['config']['emailFrom'])) {
			
			$to      = $ini_array["config"]["emailTo"];
			$subject = "New XVMB message added";
			$message = "Who: " .$post["who"]. "\r\n" .
			"What:" .$post["what"]. "\r\n" .
			"Where:" .$post["where"]. "\r\n" .
			"When: " .$post["when"]. "\r\n";
			
			$headers = "From: XVMB <" .$ini_array["config"]["emailFrom"]. ">\r\n" .
			    "Reply-To: ". $ini_array["config"]["emailFrom"] . "\r\n" .
			    "X-Mailer: PHP/" . phpversion();

			return mail($to, $subject, $message, $headers);
			
		}
	}
}
?>