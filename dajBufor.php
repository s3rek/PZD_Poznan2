<?php

ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);


//zmienic na utf-8 po wgraniu na serwer
header('Content-type: text/html; charset=windows-1250');  
$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
if (!$conn) {
		echo "{success: false, message: 'B³¹d pod³¹czenia do bazy'}";
		exit;
}
$result = pg_query($conn, 
		"SELECT st_astext(
		  st_buffer(
		    st_union(
		      ARRAY[
		        st_union(
		          ARRAY(SELECT the_geom FROM ogrody WHERE gid IN (".$_GET['idogr']."))
		        ),
		        st_union(
		          ARRAY(SELECT the_geom FROM dzialki WHERE gid IN (".$_GET['iddz']."))
		        )
		      ]
		    ), 10, 'endcap=round join=round'
		  )   
		)");
while ($row = pg_fetch_row($result)) {
  echo "{success: false, message: '".$row[0]."'}";
}
?> 