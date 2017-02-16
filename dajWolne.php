<?php
		$search  = array('Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż','ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż');
		$replace = array('\\u0104', '\\u0106', '\\u0118', '\\u0141', '\\u0143', '\\u00d3', '\\u015a', '\\u0179', '\\u017b', '\\u0105', '\\u0107', '\\u0119', '\\u0142', '\\u0144', '\\u00f3', '\\u015b', '\\u017a', '\\u017c');

		header('Content-type: text/plain; charset=iso-8859-2');
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
		if (!$conn) {
				echo "{success: false, message: 'Błąd podłączenia do bazy'}";
				exit;
		}			
		$result = pg_query($conn, 
				"SELECT 
						d.numer AS numer, d.powierzchnia AS powierzchnia, o.nazwa || '(' || o.parcela || ')' AS ogrod, m.nazwa AS miasto, ST_AsGeoJSON(ST_Transform(d.the_geom, 900913),5) AS geom 
				FROM 
						dzialki d, ogrody o, miasta m
				WHERE 
						d.wolna = true AND d.id_ogrodu = o.gid AND o.id_miasta = m.gid");
		while ($row = pg_fetch_row($result)) {
				$arr[]=array(
						"type" => "Feature",
						"properties" 	=> array(
								"numer" 				=> str_replace($search, $replace, $row[0]),
								"powierzchnia" 	=> str_replace($search, $replace, $row[1]),
								"ogrod" 				=> str_replace($search, $replace, $row[2]),
								"miasto" 				=> str_replace($search, $replace, $row[3]),
						),
						"geometry" 		=> $row[4]
				);	
		}
		$json = str_replace("\"{", "{", json_encode($arr));
		$json = str_replace("}\"", "}", $json);
		$json = stripslashes($json);
		echo '{"type":"FeatureCollection","features":'.$json.'}';
?>