<?php

$version = "2.0";

// render inline html/js

function render_html($echo = false){

	// some basic vars
	$tests = load_tests();

	ob_start();

	include(dirname(dirname(__FILE__))."/templates/index.php");

	$content = ob_get_contents();

	ob_end_clean();

	file_put_contents(dirname(dirname(__FILE__))."/index.html",$content);

	if($echo) echo $content;

}

function minify_html($buffer) {

    $search = array(
        '/\>[^\S ]+/s',  // strip whitespaces after tags, except space
        '/[^\S ]+\</s',  // strip whitespaces before tags, except space
        '/(\s)+/s'       // shorten multiple whitespace sequences
    );

    $replace = array('>','<','\\1');

    $buffer = preg_replace($search, $replace, $buffer);

    return $buffer;
}

function templates(){

	$templates = array();

	$root = dirname(dirname(__FILE__));

	include_once($root."/api/parsedown-master/Parsedown.php");
	$parsedown = new Parsedown();

	// load pages
	$pagesdir = $root."/data/pages";
	$pages = scandir($pagesdir);
	foreach($pages as $file){
		$p = pathinfo($file);
		if($p['extension']=="md"){
			$name = $p['filename'];
			$content = file_get_contents($pagesdir."/$file");
			$content = $parsedown->text($content);
			$templates["pages/$name"] = $content;
		};
	}

	// load test templates
	$tests = load_tests();
	$testsdir = $root."/data/tests/";
	foreach($tests as $k => $m){

		// template
		$template = $testsdir.$k."/template.php";
		ob_start();
		include($template);
		$content = ob_get_contents();
		ob_end_clean();

		$templates["test/$m->ID"] = $content;

		// result
		$template = $testsdir.$k."/results.php";
		if(is_file($template)){
			ob_start();
			include_once($template);
			$content = ob_get_contents();
			ob_end_clean();

			$templates["results/$m->ID"] = $content;
		}

	}

	// load all text files
	$words = (array)json_decode(file_get_contents($root."/data/texts/words.json"));
	$textsdir = $root."/data/texts/";
	foreach(scandir($textsdir) as $file){
		$pi = pathinfo($file);
		if($pi['extension']=="md"){
			$texts[$pi['filename']] = $parsedown->text(file_get_contents($textsdir.$file));
		}
	}

	// load templates folder
	$tmpldir = $root."/templates/";
	foreach(scandir($tmpldir) as $file){
		$pi = pathinfo($file);
		if($pi['extension']=="php" && $pi['basename'] !== "index"){
			ob_start();
			include_once($tmpldir.$file);
			$content = ob_get_contents();
			ob_end_clean();
			$templates["templates/".$pi['filename']] = $content;
		}
	}

	// print all templates
	foreach($templates as $name => $tmpl){
		echo "<script type='text/ng-template' id='$name'>".minify_html($tmpl)."</script>";
	}

}

function getBaseUrl() 
{
    // output: /myproject/index.php
    $currentPath = $_SERVER['PHP_SELF']; 

    // output: Array ( [dirname] => /myproject [basename] => index.php [extension] => php [filename] => index ) 
    $pathInfo = pathinfo($currentPath); 

    // output: localhost
    $hostName = $_SERVER['HTTP_HOST']; 

    // output: http://
    $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,5))=='https'?'https':'http';

    // return: http://localhost/myproject/
    return $protocol.'://'.$hostName.$pathInfo['dirname']."/";
}

function base(){
	$filename = dirname(dirname(__FILE__));
	$replace = preg_quote($_SERVER['DOCUMENT_ROOT'],"/");
	$base = preg_replace("/$replace/","",$filename);
	echo $base;
}

function info($type){
	$global_config = json_decode(file_get_contents(dirname(dirname(__FILE__))."/data/global_config.json"));
	switch($type){
		case 'title':
			echo $global_config->title;
			break;
		case 'description':
			echo $global_config->description;
			break;
		case 'keywords':
			echo $global_config->keywords;
			break;
		case 'image':
			echo $global_config->image;
			break;
	}
}

function testinfo(){

	// preload test info
	$tests = load_tests();
	$testinfo = array();

	foreach($tests as $name => $test){
		// error_log(print_r($test,true));
		$testinfo[$test->ID] = array();
		$testinfo[$test->ID]['ID'] = $test->ID;
		$testinfo[$test->ID]['type'] = @$test->type;
		$testinfo[$test->ID]['link'] = @$test->link;
		$testinfo[$test->ID]['relation'] = @$test->relation;
		$testinfo[$test->ID]['dirname'] = $name;
		$testinfo[$test->ID]['titles'] = $test->titles;
		$testinfo[$test->ID]['disabled'] = @$test->disabled;
		$testinfo[$test->ID]['social'] = @$test->social;
		$testinfo[$test->ID]['resultinfo'] = @$test->resultinfo;
		$testinfo[$test->ID]['percentage'] = @$test->percentage;
		$testinfo[$test->ID]['wow'] = @$test->wow;
		$testinfo[$test->ID]['icons'] = array($test->icon,$test->iconh);

		// load audiofile references
		$audiofiles = array();
		$audiodir = dirname(dirname(__FILE__))."/data/tests/".$name."/mp3/";
		if(is_dir($audiodir)){
			$scan = scandir($audiodir);
			foreach($scan as $file){
				$pi = pathinfo($audiodir.$file);
				if($pi['extension']=="mp3" && $file[0]!="."){
					$audiofiles[] = $file;
				}
			}
		}
		if(count($audiofiles)>0) $testinfo[$test->ID]['audiofiles'] = $audiofiles;

		// load imagefile references
		$imagefiles = array();
		$imagedir = dirname(dirname(__FILE__))."/data/tests/".$name."/images/";
		if(is_dir($imagedir)){
			$scan = scandir($imagedir);
			foreach($scan as $file){
				$pi = pathinfo($imagedir.$file);
				if(preg_match("/(jpg|jpeg|png|gif)/i",$pi['extension']) && $file[0]!="."){
					$imagefiles[] = $file;
				}
			}
		}
		if(count($imagefiles)>0) $testinfo[$test->ID]['imagefiles'] = $imagefiles;

	}

	echo "<script> var testinfo = ".json_encode($testinfo).";</script>";
}

function print_testmenu($testid){

	$tests = load_tests();

	foreach($tests as $m){
		if(!empty($m) && $m->ID == $testid){
			$ID = $m->ID;
			$link = "test/".$m->titles->link;
			$menu = $m->titles->menu;
			$icon = $m->icon;
			$iconh = $m->iconh;
			$menushort = $m->titles->menushort;
			$klas = "length_".count($tests);
			echo "<li id='$ID' class='test $klas'><a href='$link'><i icon='$ID'></i><span class='short'>$menushort</span><span class='long'>$menu</span></a></li>";
		}
	}
}

function json_talen(){

	$talen = file_get_contents(dirname(dirname(__FILE__))."/temp/talen.json");
	// $landen = file_get_contents(dirname(dirname(__FILE__))."/temp/landen.json");
	// echo "<script> var talen = ".$talen."; var landen = ".$landen.";</script>";
	echo "<script> var talen = ".$talen."; </script>";
}

// collect info

function load_tests(){

	$datafolder = dirname(dirname(__FILE__))."/data/tests/";
	$config = array();

	$filename = dirname(dirname(__FILE__))."/data/tests/";
	$replace = preg_quote($_SERVER['DOCUMENT_ROOT'],"/");
	$reldatafolder = preg_replace("/$replace/","",$filename);

	// get modules
	$content = scandir($datafolder);
	foreach($content as $folder){
		if(is_dir($datafolder.$folder) && $folder[0]!="."){
			// vars
			$testfold = $datafolder.$folder."/";
			$reltestfold = $reldatafolder.$folder."/";
			// get config
			$config[$folder] = json_decode(file_get_contents($testfold."config.json"));
			// set static vars
			$config[$folder]->icon = $reltestfold."icon_a.png";
			$config[$folder]->iconh = $reltestfold."icon_h.png";
			$config[$folder]->folder = $reltestfold;
		}
	}

	return $config;

}

function defaultstorage($print=false){

	$default = array(); // default json object prepared for angularjs storage

	$sets = array(); // default sets rendered into file for api

	$sets_json_file = dirname(dirname(__FILE__))."/temp/sets.json";

	// set version -----------------------------------------------------

	global $version;
	$default['version'] = $version;

	// set profile -----------------------------------------------------

	$default["profile"] = array();
	$usersconfig = dirname(dirname(__FILE__))."/data/profile.json";
	$users = json_decode(file_get_contents($usersconfig));

	$NOT_PUBLIC = array("ID","IP","TIMESTAMP","EMAILID");

	foreach($users as $k => $v){
		if(!in_array($k,$NOT_PUBLIC)){
			$default['profile'][$k] = "";
			// set mailinglist default true
			if($k=="MAILINGLIST"){
				$default['profile'][$k] = true;
			}
		}
	}

	// set tests -------------------------------------------------------

	$default['tests'] = array();

	$testsdir = dirname(dirname(__FILE__))."/data/tests";
	$tests = scandir($testsdir);

	foreach($tests as $t){
		$configfile = $testsdir."/".$t."/config.json";
		if(is_file($configfile)){

			// load test config
			$config = json_decode(file_get_contents($configfile));

			// array
			$default['tests'][$config->ID] = array();
			$TEST = $default['tests'][$config->ID];

			// add status param
			$TEST['status'] = array(
									"done" => false,
									"stored" => false
									);

			// add global params
			if(@$config->global){
				foreach($config->global as $k => $v){
					$TEST[$k] = "";
				}
			}

			// render sets to array

			$question_defaults = @$config->default;

			if(@$config->sets){
				foreach($config->sets as $setid => $values){

					$questions = array();

					foreach($values as $key => $question){
						// add default fields
						$q = array();
						if($question_defaults){
							foreach($question_defaults as $k => $v){
								$q[$k] = "";
							}
						}
						if($config->everyquestion){
							foreach($config->everyquestion as $k => $v){
								$q[$k] = "";
							}
						}
						if(is_object($question)){
							foreach($question as $k => $v){
								$q[$k] = $v;
							}
						} else {
							$q["symbol"] = $question;
						}
						$questions[] = $q;
					}
					// add questions to $sets
					$sets[$config->ID][$setid] = $questions;
				}
			}

			$default['tests'][$config->ID] = $TEST;
		}
	}

	if(!empty($sets)){
		file_put_contents($sets_json_file,json_encode($sets));
	}

	if(!$print) return $default;

	echo json_encode($default);

}

// database

function prep_db($refresh=false){

	/* get tables and columns for DB */

	$json_buffer_file_uri = dirname(dirname(__FILE__))."/temp/db.json";

	// load buffered collection (default)

	if(!$refresh){
		$prepdb = json_decode(file_get_contents($json_buffer_file_uri));
		return (array)$prepdb;
	}

	$testsdir = dirname(dirname(__FILE__))."/data/tests";
	$tests = scandir($testsdir);

	$tables = array();

	// profile
	$default["profile"] = array();
	$profileconfig = dirname(dirname(__FILE__))."/data/profile.json";
	$profile = json_decode(file_get_contents($profileconfig));

	foreach($profile as $k => $v){
		$default['profile'][$k] = $v;
	}

	// tests
	foreach($tests as $t){
		$configfile = $testsdir."/".$t."/config.json";
		if(is_file($configfile)){

			// load test config
			$json = json_decode(file_get_contents($configfile));

			// vars
			$default[$json->ID] = array();
			$question_defaults = @$json->everyquestion;

			foreach($json->DB as $k => $v){
				$default[$json->ID][$k] = $v;
			}

			if(@$json->global){
				foreach($json->global as $k => $v){
					$default[$json->ID][$k] = $v;
				}
			}

			// add profile ID
			$default[$json->ID]["PROFILEID"] = "TEXT";

			// render questions to array
			$max = $json->maxsetlength;

			for($i=1;$i<=$max;$i++){
				if($question_defaults){
					foreach($question_defaults as $k => $v){
						$combined = make_column($k,$i);
						$default[$json->ID][$combined] = $v;
					}
				}
			}
		}
	}
	if(!empty($default)){
		file_put_contents($json_buffer_file_uri,json_encode($default));
	}
	return $default;
}

function make_column($k,$i){
	$ii = $i>9 ? $i : "0".$i;
	return $k.$ii;
}

function pretty_unique(){
	return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

	// 32 bits for "time_low"
	mt_rand(0, 0xffff), mt_rand(0, 0xffff),

	// 16 bits for "time_mid"
	mt_rand(0, 0xffff),

	// 16 bits for "time_hi_and_version",
	// four most significant bits holds version number 4
	mt_rand(0, 0x0fff) | 0x4000,

	// 16 bits, 8 bits for "clk_seq_hi_res",
	// 8 bits for "clk_seq_low",
	// two most significant bits holds zero and one for variant DCE1.1
	mt_rand(0, 0x3fff) | 0x8000,

	// 48 bits for "node"
	mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
	);
}

// IP

function get_ip_address() {
    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');

    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                // trim for safety measures
                $ip = trim($ip);
                // attempt to validate IP
                if (validate_ip($ip)) {
                    return $ip;
                }
            }
        }
    }

    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : false;
}

function validate_ip($ip){
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
        return false;
    }
    return true;
}
