<h1>Export to CSV</h1>

<div id="export">
<?php

  $tables = $this->data_obj->list_tables();
	foreach($tables as $table => $content){
    echo "<button ng-click=\"download('$table')\">download: $table </button><br>";
	}

?>
</div>