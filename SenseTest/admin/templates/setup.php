<h1>SETUP DATABASE</h1>

<button ng-click="api('setup all')" ng-class="{'loading':setup_loading}">SETUP DATABASE</button>
<BR><BR>

<label>
	Clicking "SETUP DATABASE" will compare current database to collected info from config.json of all tests. This is the result of prep_db() defined in /api/functions.php.<Br><Br>
	<i>When changes found:</i><BR>
	- create tables (if not exists)<br>
	- insert missing table columns (existing column datatypes are not checked)<Br>
</label>

<?php

	$tables = $this->data_obj->list_tables();

	$prepdb = prep_db(true);

	// echo "<pre>"; print_r($tables); echo "</pre>";
	// echo "<pre>"; print_r($prepdb); echo "</pre>";

	foreach($prepdb as $table => $content){
		$prep = array();
		$new = array();
		$class = "table ";

		if(!array_key_exists($table,$tables)){
			echo "<div class='table error'><h4>missing table: $table</h4></div>";
		}

	}; ?>


	<?php
	foreach($tables as $table => $content){
		$prep = array();
		$new = array();
		$class = "table ";
		if(!array_key_exists($table,$prepdb)){
			$class = $class."unused ";
		} else {
			$prep = (array)$prepdb[$table];
			$new = (array)$prepdb[$table];
		}
		?>

		<div id='t' class='<?php echo $class;?>'>
			<h4><?php echo $table;?></h4>
			<div id='buttons'>
				<button ng-click="api('drop <?php echo $table;?>')">drop table</button>
			</div>

			<div id='columns'>
				<div id='toggle' ng-click='show_content($event)'>columns</div>
				<div id='content'>
					<?php
					foreach($content as $k => $column){
						echo "<span>".$column[0]."</span>: ".$column[1]."<Br>";
						unset($new[$column[0]]);
					};
					// $notset = implode(array_keys($new),", ");
					?>
				</div>
				<?php
					$notset = count($new);
					if($notset){
						echo "<span class='error'><b>Missing columns:</b> $notset <br>".implode(array_keys($new),"<br>")."</span>";
					}
				?>
			</div>
		</div>

	<?php }; ?>




<div id='compile'>

	<div id='item' ng-repeat='(k,item) in content'>
		<label>{{k}}</label>
		<p compile="item"></p>
	</div>

</div>
