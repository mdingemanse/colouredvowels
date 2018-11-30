<h1>check config files</h1>

<label>Basic check if config.json for each test is readable.</label><Br>

<Br><br>

<?php

$testsfolder = dirname(dirname(dirname(__FILE__)))."/data/tests/";
$scan = scandir($testsfolder);

foreach($scan as $uri){
    if(is_dir($testsfolder.$uri) && $uri[0]!="."){
        $configfile = $testsfolder.$uri."/config.json";
        $config = json_decode(file_get_contents($configfile));
        echo "<div class='table'>";
            echo "<h4>$uri</h4>";
            echo "<label>ID/tablename:</label> ".$config->ID."<br>";
            echo "<label>link:</label> ".$config->link." <label>= /tests/".$config->link."</label><br>";
            echo "<label>type:</label> ".$config->type."<br>";
        echo "</div>";
    }
}

?>
