<h1>Admin Overview</h1>

<label>
	DATABASE:<Br><Br>
	<?php
		echo "Database name: ".$this->db['dbname']."<br>";
		echo "Database user: ".$this->db['username']."<br>";
	?>
</label>

<?php

	$tables = $this->data_obj->list_tables();

	$prepdb = prep_db(true);

	foreach($prepdb as $table => $content){
		if(!array_key_exists($table,$tables)){
			echo "<div class='table error'><h4>missing table: $table</h4></div>";
		} else {
			$res = $this->data_obj->dbc->query("SELECT COUNT(*) FROM $table");
			$count = $res->fetchall()[0][0];
			echo "<div class='table'><h4>$table</h4><br>$count rows</div>";
		}
	}

?>
