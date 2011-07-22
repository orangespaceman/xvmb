<?php

	if (isset($_POST) && count($_POST) > 0) {

		// check what to do
		require_once("../../librarymanager.php");
		$model = new Note;
		$method = $model->sanitise($_POST['method']);
		unset($_POST['method']);

		// 
		switch ($method) {

			// save post
			case "addNote":
				$result = $model->addNote($_POST);
				//echo json_encode($result);
				echo $result['message'];
			break;
			
			// error check
			case "getNote":
			 	$result = $model->getNote();
				$return = array(
					"success" => 1,
					"details" => $result
				);
				echo json_encode($return);
			
			break;
			
		}
	}
	
	
	
/**
* Model
*/
class Note
{

	var $dbcalls;

	/*
	 *
	 */
	function __construct() {
		global $dbcalls;
		$this->dbcalls = $dbcalls;
	}
	

	/*
	 * sanitise input
	 */
	public function sanitise($string) {
		$string = strip_tags($string);
		$string = mysql_real_escape_string($string);
		return $string;
	}
	
	
	
	/*
	 * get a new random note
	 */
	public function getNote() {
		return $this->dbcalls->getNote();
	}
	
	
	/**
	 * Saves results
	 * @return boolean
	 */
	public function addNote(array $post)
	{
		// clean the post up
		foreach($post as $key => $postitem) {
			$post[$key] = $this->sanitise($postitem);
		}

		return $this->dbcalls->addNote($post);
	}
}