<?php
		$search  = array('Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż','ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż');
		$replace = array('\\u0104', '\\u0106', '\\u0118', '\\u0141', '\\u0143', '\\u00d3', '\\u015a', '\\u0179', '\\u017b', '\\u0105', '\\u0107', '\\u0119', '\\u0142', '\\u0144', '\\u00f3', '\\u015b', '\\u017a', '\\u017c');

		header('Content-type: text/plain');
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
		if (!$conn) {
				echo "{success: false, message: 'Błąd podłączenia bazy'}";
				exit;
		}			
		//$result = pg_query($conn, "SELECT numer, powierzchnia, uzytkownik FROM dzialki where id_ogrodu=".$_GET["gid"]);
		
		$result = pg_query($conn, "SELECT numer, powierzchnia, uzytkownik, id_ogrodu, ST_AsGeoJSON(ST_Transform(the_geom, 900913)) AS geom FROM dzialki where id_ogrodu=".$_COOKIE['aktywnyOgrod']);
		while ($row = pg_fetch_row($result)) {
			$ogr = pg_query($conn, "SELECT nazwa, miasto FROM ogrody where gid=".$row[3]);
				while ($row2 = pg_fetch_row($ogr)) {
				
					$arr[]=array(
					
							"type" => "Feature",
							"properties" 	=> array(
									"numer" 				=> str_replace($search, $replace, $row[0]),
									"powierzchnia" 	=> str_replace($search, $replace, $row[1]),
									"name" 				=> str_replace($search, $replace, $row[2]),
									"nazwa"	=> str_replace($search, $replace, $row2[0]),
									"miasto"	=> str_replace($search, $replace, $row2[1])
							),
							"geometry" 		=> $row[4]
					);	
				}
		}
		$json = str_replace("\"{", "{", json_encode($arr));
		$json = str_replace("}\"", "}", $json);
		$json = stripslashes($json);

		echo '{"type":"FeatureCollection","features":'.$json.'}';
?>