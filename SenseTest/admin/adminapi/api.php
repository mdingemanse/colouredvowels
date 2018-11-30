<?php

include_once('../../api/functions.php');

class API {
	private $data_obj;
	private $user_id;
	private $outside_username = null;
	private $outside_password = null;

	private $url = array(); // request url
	private $db = array(); // config database
	private $tables = array(); // config tables

	public function __construct() {

		// include config
		include (dirname(__FILE__).'/../../config.php');
		// put config params in class
		$this->db = $db;

		// include mysql api class
		include ('data.php');
		$this->data_obj = new Data;

		// api url
		$this->seturl();

		header("Access-Control-Allow-Methods: *");
		header("Content-Type: application/json");

	}

    public function run() {

		if($this->url[0]=="checkconfig") {
			$this->data_obj->send_response(200, json_encode(array("message"=>"ok")));
			// if ($this->db) { echo 'ok'; exit(); // $this->data_obj->send_response(400,'Database is not setup properly.');
			// } else {
			// 	echo 'done';
			// 	exit();
			// }
		}
		if($this->url[0]=="overview") $this->stats();
		if($this->url[0]=="setup") $this->setup();
		if($this->url[0]=="render") $this->render();
		if($this->url[0]=="template") $this->template();
		if($this->url[0]=="drop") $this->drop();
		if($this->url[0]=="update") $this->update();
		if($this->url[0]=="export") $this->export();

		if($this->url[0]=="test") $this->test();

		if($this->url[0]=="lijst") $this->lijst();

    }

	public function setup(){

		// plan: compare database with prepdb, backup database, if new drop and create tables

    	$result = array();

		$prepdb = prep_db(true);

		// compare current database with setup

			// collect current database tables/columns
			$db_now = array();
			$dbname = $this->db['dbname'];
			$res = $this->data_obj->dbc->query("SELECT * FROM information_schema.columns where table_schema = '$dbname'");
			$arr = $res->fetchAll();
			foreach($arr as $k => $v){
				$table = $v['TABLE_NAME'];
				$column = $v['COLUMN_NAME'];
				if(!array_key_exists($table,$db_now)) $db_now[$table] = array();
				$db_now[$table][] = $column;
			}

			// collect latest prepared tables/columns
			$prep_db_now = array();
			foreach($prepdb as $table => $v){
				foreach($v as $column => $type){
					if(!array_key_exists($table,$prep_db_now)) $prep_db_now[$table] = array();
					$prep_db_now[$table][] = $column;
				}
			}

			// find differences, columns to delete or to insert
			$to_delete = array();
			$to_insert = array();
			foreach($db_now as $table => $content){

				$diffdel = array_diff($content,$prep_db_now[$table]);
				$diffins = array_diff($prep_db_now[$table],$content);
				if(!empty($diffdel)){
					if(!array_key_exists($table,$to_delete)) $to_delete[$table] = array();
					$to_delete[$table] = $diffdel;
				}
				if(!empty($diffins)){
					if(!array_key_exists($table,$to_insert)) $to_insert[$table] = array();
					$to_insert[$table] = $diffins;
				}
			}

			$tables_to_add = array();
			foreach($prepdb as $table => $content){
				if(!array_key_exists($table,$db_now)){
					$tables_to_add[] = $table;
				}
			}

		// check for changes or EXIT()

		if(empty($to_insert) && empty($to_delete) && empty($tables_to_add)){
			$this->data_obj->send_response(200, json_encode(array("message"=>"nothing to change")));
			exit();
		}

		// delete unused columns
		// if(!empty($to_delete)){
		// 	foreach($to_delete as $table => $columns){
		// 		if(!empty($columns)){
		// 			foreach($columns as $k => $column){$columns[$k] = "DROP COLUMN ".$column;};
		// 			$query = "ALTER TABLE $table ".implode($columns,", ");
		// 			error_log($query);
		// 			$res = $this->data_obj->dbc->query($query);
		// 		}
		// 	}
		// }

		// insert new columns
		if(!empty($to_insert)){
			foreach($to_insert as $table => $columns){
				if(!empty($columns)){
					foreach($columns as $k => $column){$columns[$k] = "ADD COLUMN ".$column." ".$prepdb[$table][$column];};
					$query = "ALTER TABLE $table ".implode($columns,", ");
					// error_log($query);
					$res = $this->data_obj->dbc->query($query);
				}
			}
		}

		// create all new tables
		if(!empty($tables_to_add)){
			foreach($tables_to_add as $table){
	    		$columns = $this->join_columns($prepdb[$table]);
				$q = $this->data_obj->dbc->query("CREATE TABLE IF NOT EXISTS $table ($columns)");
				if($q){
					$result[$table] = success("table $table successfully created");
				} else {
					$result[$table] = error("table $table not created. ".print_R($this->data_obj->dbc->errorInfo()));
				}
			}
		}

		$this->data_obj->send_response(200, json_encode($result));
    }

	public function drop(){
			$table = $this->url[1] ? $this->url[1] : "";
			if(!$table) $this->data_obj->send_response(400,json_encode($result));

			// drop table
			try {
				$sql = "DROP TABLE $table";
				$stmt = $this->data_obj->dbc->query($sql);
				$this->data_obj->send_response(200);
			} catch (\PDOException $e) {
				$this->data_obj->send_response(400);
			}

	}
	public function template(){

		$template = dirname(dirname(__FILE__))."/templates/".$this->url[1];

		if(is_file($template)){
			ob_start();
			include($template);
			$content = ob_get_contents();
			ob_end_clean();
			$result['template'] = $content;
			$this->data_obj->send_response(200,json_encode($result));
		} else {
			$this->data_obj->send_response(404);
		}

	}

    public function stats(){

    	$result = array();

    	$res = $this->data_obj->dbc->query("SHOW TABLES");
		if($res){
			while ($row = $res->fetch(PDO::FETCH_NUM)) {
				$table = $row[0];
				$content = "";
				if ($res2 = $this->data_obj->dbc->query("SELECT COUNT(*) FROM $table")) {
					$count = $res2->fetchColumn();
				} else {
					$count = -1;
				}
				$content = "rows: $count<br>";
				$result["table $table"] = $content;
			}
			$this->data_obj->send_response(200, json_encode($result));
		} else {
			$this->data_obj->send_response(500);
		}
    }

	public function test(){

		// $this->data_obj->send_response(200,"<pre>".print_R($arr,true)."</pre>");

		$this->data_obj->send_response(200,"<pre>".print_R($result,true)."</pre>");

	}

    public function render(){

    	render_html();

		prep_db(true);

    	$this->data_obj->send_response(200,json_encode(array("render html"=>"done.")));

    }

	// prepare config
	public function lijst(){
		header('Content-Type: text/html; charset=utf-8');
		?>
		<!DOCTYPE html>
		<html xmlns="http://www.w3.org/1999/xhtml" ng-app='app'>
		<head>

			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		</head>
		<body>
			<?php

			$list = array("A","B","C","D","E","F","G","I","K","M","N","X","Y","3","5","6");
			$list = array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9","0");
			$list = array("Januari","February","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December");
			$list = array("Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag");
			$list = array("0","1","2","3","4","5","6","7","8","9");
			$list = array("Ё","Ђ","Ѓ","Є","Ѕ","І","Ї","Ј","Љ","Њ","Ћ","Ќ","Ѝ","Ў","Џ","А","Б","В","Г","Д","Е","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я");
			$list = array("0","1","2","3","4","5","6","7","8","9","10","½","¾","12","30","85","425");
			$list = array("А","К","M","O","В","Н","Р","С","Д","Ж","И","Л","Ч","Щ","Ю","Я");

			$list = array();
			$round = array();
			$pointy = array();
			$combined = array();
			$folder = "../../data/tests/02. klankenvorm/images/";
			$dir = scandir($folder);
			foreach($dir as $file){
				$x = pathinfo($file)['extension'];
				if($x=="png" && $file[0]=="R"){
					$round[] = $file;
				}
				if($x=="png" && $file[0]=="P"){
					$pointy[] = $file;
				}
			}

			shuffle($pointy);
			shuffle($round);

			foreach($pointy as $k => $v){
				$r = rand(0,1);
				if($r==1) $combined[] = array($round[$k],$v);
				else $combined[] = array($v,$round[$k]);
			}

			$folder = "../../data/tests/02. klankenvorm/mp3/";
			$dir = scandir($folder);
			foreach($dir as $file){
				$x = pathinfo($file)['extension'];
				if($x=="mp3"){
					$list[] = $file;
				}
			}
			shuffle($list);
			// foreach($list as $v){
			// 	$list[] = $v;
			// 	$list[] = $v;
			// }
			// shuffle($list);
			foreach($list as $k => $v){

				echo "{\"file\":\"$v\",\"choose\":[\"".$combined[$k][0]."\",\"".$combined[$k][1]."\"]},<Br>\n";

			}
		echo "</body></html>";
		exit();
	}


	// class functions ----------

	private function export(){

		// make csv
		$a = $this->makecsv($_GET['table']);
		exit;
	}
	private function makecsv($tablename){
		if (ob_get_level()) {
				ob_end_clean();
		}

		$csv = "$tablename.csv";
		header( "Content-Type: text/csv;charset=utf-8" );
		header( "Content-Disposition: attachment;filename=\"$csv\"" );
		header( "Pragma: no-cache" );
		header( "Expires: 0" );

		flush(); 

		$array = array();

		$query = "SELECT * FROM $tablename";
		$res = $this->data_obj->dbc->query($query);
		$qw = $this->data_obj->dbc->query("DESCRIBE $tablename");
		$q = $qw->fetchAll(PDO::FETCH_COLUMN);
		$array[] = $q;
		while($row = $res->fetch(PDO::FETCH_NUM)){
			$array[] = $row;
		}

		$fp = fopen('php://output', 'w');
		fputcsv($fp, array_keys($array), ';', '"');
		foreach ($array as $i => $fields) {
				fputcsv($fp, $fields, ';', '"');
				if ($i % 100 == 0) {
						flush();
				}
		}
		fclose($fp);
	}
	private function seturl(){

		$uri = $_SERVER['REQUEST_URI'];
		$method = $_SERVER['REQUEST_METHOD'];
		$paths = explode('/', $this->data_obj->paths($uri));

		if (end($paths)=="") { array_pop($paths); }
		if ($paths[0]=="") { array_shift($paths); }
		foreach($paths as $p){
			if($p!="adminapi"){
				array_shift($paths);
			} else {
				array_shift($paths);
				break;
			}
		}
		$this->url = $paths;
	}
	private function join_columns($columns){
    	$list = array();
    	foreach($columns as $k => $v){
    		$list[] = "$k $v";
    	}
    	$string = implode($list,", ");
    	return $string;

	}
}

function error($message){
	return "<error>$message</error>";
}

function success($message){
	return "<success>$message</success>";
}

$api = new API;
$api->run();

?>
