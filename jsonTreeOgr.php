<?php
ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);
header('Content-Type: application/json');
$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
if (!$conn) {
  echo "Wystapil blad podczas podlaczenia do bazy kolego.\n"; 
  exit;
}
$id=1;
$miasta = pg_query($conn, "SELECT gid, nazwa, id_gminy FROM miasta");
$liczba_miast = pg_num_rows($miasta);
echo "[";
for ($i=1;$i<=$liczba_miast;$i++) {	
	$row_miasta = pg_fetch_row($miasta);
	$ogrody = pg_query($conn, "SELECT nazwa, parcela, gid FROM ogrody WHERE id_miasta=".$row_miasta[0]." ORDER BY nazwa ASC, parcela ASC");
	$liczba_ogrodow = pg_num_rows($ogrody);
	echo "{id:".$id++.",gid:'m_".$row_miasta[0]."',text:'".$row_miasta[1]."',gmina:".$row_miasta[2];
	if ($liczba_ogrodow > 0) {
		echo ",children:[";
	  for ($x=1;$x<=$liczba_ogrodow;$x++) { 
	  	$row_ogrody = pg_fetch_row($ogrody);
	  	echo "{id:".$id++.",gid:'o_".$row_ogrody[2]."',leaf:true,text:'".$row_ogrody[0];
	  	if ($row_ogrody[1] <> '-') { 
	  		echo "(".$row_ogrody[1].")'}"; 
	  	}
	  	else { 
	  		echo "'}"; 
	  	}
	  	if ($x < $liczba_ogrodow) { echo ","; }
	  }
	  echo "]";
	}
	else { echo ",leaf:true"; }
	echo "}";
  if ($i < $liczba_miast) { echo ","; }
}
echo "]";
?>