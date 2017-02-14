<?php
header('Content-type: text/html; charset=windows-1250');
$conn = pg_connect("host=127.0.0.1 port=5432 dbname=dm_t user=postgres password=postgres");
if (!$conn) {
		echo "{rows:[{\"gid\": \"1\", \"nazwa\": \"B³¹d pod³¹czenia do bazy\"}]}";
		exit;
}
switch ($_GET['rodzaj']){
	case "kategoria":
		$result = pg_query($conn, "SELECT id, nazwa_kategorii FROM slo_kat_obiektu");
	break;
	case "gmina":
		$result = pg_query($conn, "SELECT id, nazwa_gminy FROM slo_gminy");
	break;
	default:
		echo "{}";
		exit;
	break;
}
if (pg_num_rows($result) > 0) {
		while ($obj = pg_fetch_object($result)) {
				$arr[] = $obj;
		}
}
echo '{rows:'.json_encode($arr).'}';
?> 