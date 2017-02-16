<?php
		header('Content-type: text/plain; charset=iso-8859-2');
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
		if (!$conn) {
				echo "{success: false, message: 'Błąd podłączenia do bazy'}";
				exit;
		}
		$result = pg_query($conn, 
				"SELECT 
						d.numer AS numer, 
						d.powierzchnia AS powierzchnia, 
						o.nazwa || '(' || o.parcela || ')' AS ogrod, 
						m.nazwa AS miasto,
						ST_AsGeoJSON(ST_Transform(d.the_geom, 900913)) AS geom 
				FROM 
						dzialki d, 
						ogrody o, 
						miasta m 
				WHERE 
						d.powierzchnia > 500 AND 
						position('al' in lower(d.numer)) = 0 AND 
						d.id_ogrodu = o.gid AND 
						o.id_miasta = m.gid");
		while ($row = pg_fetch_row($result)) {
				$arr[]=array(
						"type" => "Feature",
						"properties" 	=> array(
								"numer" 				=> $row[0],
								"powierzchnia" 	=> $row[1],
								"ogrod" 				=> $row[2],
								"miasto" 				=> str_replace('ń','\u0144',$row[3]),
							),
						"geometry" 		=> $row[4]						
				);
				//echo pg_client_encoding($conn);
				//echo gettype($arr);
		}
		$json = json_encode($arr);
		$json = str_replace("\"{", "{", $json);
		$json = str_replace("}\"", "}", $json);
		$json = stripslashes($json);
		
		echo '{"type":"FeatureCollection","features":'.$json.'}';
?>