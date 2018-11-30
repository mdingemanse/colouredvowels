<?php

include_once("functions.php");

class API {
	private $data_obj;
	private $url;

	public function __construct() {

		// include global config
		include (dirname(dirname(__FILE__)).'/config.php');

		// + put config params in class
		$this->db = $db;

		// insert prep db
		$this->prepdb = prep_db();

		// include mysql api class
		include ('data.php');
		$this->data_obj = new Data;

		// api url
		$this->seturl();

		header("Access-Control-Allow-Methods: *");
		header("Content-Type: application/json");

	}

    public function api_go() {

		if($this->url[0]=="put") $this->put();

		if($this->url[0]=="defaultstorage") defaultstorage("print");

		if($this->url[0]=="questions") $this->questions();

		if($this->url[0]=="test"){

			$var = "";

			echo "empty: ".empty($var)."\n";
			echo "!: ".!$var."\n";

		}

    }

	public function put(){

		$DATA = json_decode(file_get_contents('php://input'));
		$LINK = count($this->url)>1 ? $this->url[1] : false;
		$PROFILEID = count($this->url)>2 ? $this->url[2] : false;

		// create profile if no ID given
		$new = false;
		if(!$PROFILEID){

			// use postdata for new profile if link is 'profile'
			$pdata = ($LINK=="profile") ? $DATA : false;

			$PROFILEID = $this->create_profile($pdata);

			$new = true;

		}

		// put profile or testdata
		if($LINK=="profile"){
			$this->put_profile($PROFILEID,$DATA,$new);
		} else {
			$this->put_testdata($LINK,$PROFILEID,$DATA);
		}

	}

	private function put_profile($PROFILEID,$DATA,$new){

		$result['PROFILEID'] = $PROFILEID;

		// UPDATE
		if(!$new && !empty($PROFILEID)){

			$update = array();

			$pq = $this->prep_update_query($DATA);

			$query = "UPDATE profile SET $pq[0] WHERE PROFILEID='".$PROFILEID."'";

			$error = false;
			try {
				// error_log($query);
				$stmt = $this->data_obj->dbc->prepare($query);
				$stmt->execute($pq[1]);
				if($stmt->rowCount()<1){
					$DATA->PROFILEID = $PROFILEID;
					$DATA = (array) $DATA;
					$pq = $this->prep_insert_query($DATA);
					$query = "INSERT INTO profile " . $pq[0];
					$stmt = $this->data_obj->dbc->prepare($query);
					$stmt->execute($pq[1]);
				};
			} catch (\PDOException $e) {
				error_log("error: ".$e->getMessage());
				exit();
			}

			$result['updated_profile'] = true;

		}

		$this->data_obj->send_response(200,json_encode($result));

	}

	private function put_testdata($TESTID,$PROFILEID,$data){

		$result['PROFILEID'] = $PROFILEID;

		// INSERT TEST DATA
		$status = array();
		// prepare query to INSERT data
		$q = array();
		// convert
		foreach($data as $k => $v){
			if($k!="questions"){
				if(array_key_exists($k,$this->prepdb[$TESTID])){
					$q[$k] = $v;
				}
			} else {
				foreach($v as $kk => $vv){
					foreach($vv as $name => $value){
						$column_name = make_column($name,$kk+1);
						if(array_key_exists($column_name,$this->prepdb[$TESTID])){
							if($value=="nocolor" && preg_match("/^color.*/",$column_name)) $value = "------";
							if($value!==""){
								$q[$column_name] = $value;
							}
						}
					}
				}
			}
		}

		$q['PROFILEID'] = $PROFILEID;
		$q['IP'] = get_ip_address();
		$query = "INSERT INTO $TESTID ".$this->make_query($q);
		try {
			// error_log($query);
			$stmt = $this->data_obj->dbc->query($query);

		} catch (\PDOException $e) {
			error_log($query);
			error_log("error: ".$e->getMessage());
			exit();
		}

		$result['status'][$TESTID] = true;

		$this->data_obj->send_response(200,json_encode($result));

	}

	public function questions(){

		$testid = $this->url[1];

		// return when no testid
		if(empty($testid)) $this->data_obj->send_response(400,"no test id");

		$file = dirname(dirname(__FILE__))."/temp/sets.json";
		$json = json_decode(file_get_contents($file));

		foreach($json as $id => $content){
			if($id==$testid){
				$content = (array)$content;
				$c = count($content)-1;
				$r = rand(0,$c);
				$name = array_keys($content)[$r];
				$questions = array_values($content)[$r];

				$res = array();
				$res['name'] = array_keys($content)[$r];
				$res['questions'] = $questions;
				$this->data_obj->send_response(200,json_encode($res));
			}
		}

	}

	public function get_data($PROFILEID){
		if(!$PROFILEID) return false;
		$tables = array_keys($this->prepdb,true);
		$result = array();
		foreach($tables as $table){
			$query = "SELECT * FROM $table WHERE PROFILEID = '$PROFILEID'";
			$stmt = $this->data_obj->dbc->query($query);
			$r = $stmt->fetchAll();
			$r = count($r)>0 ? $r[0] : false;
			$result[$table] = $r;
		}

		return $result;

	}

	public function create_profile($data){

		$put_array = array();

		// check data with tables
		if($data){
			foreach($this->prepdb['profile'] as $k=>$v){
				if(@property_exists($data,$k) && $data->$k!=="") $put_array[$k] = $data->$k;
			}
		}

		// create PUBLIC ID
		$put_array['PROFILEID'] = pretty_unique();

		// get IP
		$put_array['IP'] = get_ip_address();

		// prepare query

		$pq = $this->prep_insert_query($put_array);
		$query = "INSERT INTO profile " . $pq[0];

		// INSERT
		try {
			$stmt = $this->data_obj->dbc->prepare($query);
			$stmt->execute($pq[1]);
		} catch (\PDOException $e) {
			error_log($query);
			error_log("error: ".$e->getMessage());
			exit();
		}

		return $put_array['PROFILEID'];
	}

	private function prep_insert_query($array){

		$result = array();
		$keys = array();
		$qs = array();
		$values = array();

		foreach($array as $k => $v){
			$keys[] = $k;
			$qs[] = "?";
			$values[] = $v;
		}

		if(!empty($keys)){
			$string = "(".implode($keys,", ").")";
			$string .= " VALUES ";
			$string .= "(".implode($qs,", ").")";
		}

		return array($string,$values);

	}

	private function prep_update_query($array){

		$result = array();
		$placeholders = array();
		$values = array();

		foreach($array as $k => $v){
			$placeholders[] = "$k=:$k";
			$values[":$k"] = $v;
		}

		$string = implode($placeholders,", ");

		return array($string,$values);

	}

	private function make_query($array){

		foreach($array as $k =>$v){
			if("'$v'"!=="''"){
				$array[$k] = "'$v'";
			} else {
				unset($array[$k]);
			}
		}

		$columns = implode(array_keys($array),",");
		$values = implode($array,",");

		return "($columns) VALUES ($values)";


	}

	private function seturl(){

		$uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];
        $paths = explode('/', $this->data_obj->paths($uri));

		if (end($paths)=="") { array_pop($paths); }
		if ($paths[0]=="") { array_shift($paths); }
		foreach($paths as $p){
			if($p!="api"){
				array_shift($paths);
			} else {
				array_shift($paths);
				break;
			}
		}
		$this->url = $paths;
	}

}
$api = new API;
$api->api_go();
?>
