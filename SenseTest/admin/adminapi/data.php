<?php

class Data {
	public $dbc;

	// constructor - open DB connection
	public function __construct() {

		include(dirname(dirname(dirname(__FILE__)))."/config.php");

		try {
			$this->dbc = new PDO('mysql:host='.$db['host'].';dbname='.$db['dbname'], $db['username'], $db['password']);
			$this->dbc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch (PDOException $e) {
			echo "could not connect to database";
			$this->send_response(500);
			exit();
		}

	}

	public function __destruct() {
		$this->dbc = null;
	}

	public function list_tables(){

		$results = array();

		try {
			$sql = "show tables";
			$stmt = $this->dbc->prepare($sql);
			$stmt->execute();
			while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
			    $table = $row[0];
				$stmt2 = $this->dbc->query("SHOW COLUMNS FROM $table");
				$results[$table] = array();
				while($r = $stmt2->fetch(PDO::FETCH_NUM)){
					$results[$table][] = $r;
				}

			}
		} catch (\PDOException $e) {
			return json_encode($e);
		}

		return $results;

	}

	public function isEmpty($array) {
		@$array = array();
		foreach ($array as $element) {
			if ($element=="") {
				// element is empty
				return false;
			}
		}
		// if no elements are empty
		return true;
	}

	public function paths($url) {
		$uri = parse_url($url);
		return $uri['path'];
	}

	public static function get_status_code_message($status) {
		$codes = Array (
			200 => 'OK',
			201 => 'Created',
			400 => 'Bad Request',
			401 => 'Unauthorized',
			404 => 'Not Found',
			405 => 'Method Not Allowed',
			409 => 'Conflict',
			429 => 'Too Many Requests',
			500 => 'Internal Server Error'
		);

		return (isset($codes[$status])) ? $codes[$status] : '';
	}

	// helper method to send a HTTP response code/message
	public function send_response($status = 200, $body = '', $content_type = 'text/html') {
		$status_header = 'HTTP/1.1 ' . $status . ' ' . $this->get_status_code_message($status);
		header($status_header);
		header('Content-type: ' . $content_type);
		echo $body;
	}
}
?>
