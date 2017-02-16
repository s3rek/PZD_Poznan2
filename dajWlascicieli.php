<?php
		header('Content-type: text/html');
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
				
				
				
					// $out=false;
					//  $encoding=array("ASCII","ISO-8859-1","ISO-8859-2","ISO-8859-3","ISO-8859-4","ISO-8859-5","ISO-8859-7","ISO-8859-9","ISO-8859-10","ISO-8859-13","ISO-8859-14","ISO-8859-15","ISO-8859-16","KOI8-R","KOI8-U","KOI8-RU","CP1250","CP1251","CP1252","CP1253","CP1254","CP1257","CP850","CP866","Mac Roman","Mac CentralEurope","Mac Iceland","Mac Croatian","Mac Romania","Mac Cyrillic","Mac Ukraine","Mac Greek","Mac Turkish", "Macintosh","ISO-8859-6","ISO-8859-8", "CP1255","CP1256", "CP862","Mac Hebrew","Mac Arabic","EUC-JP", "SHIFT_JIS", "CP932", "ISO-2022-JP", "ISO-2022-JP-2", "ISO-2022-JP-1","EUC-CN","HZ","GBK","GB18030","EUC-TW","BIG5","CP950","BIG5-HKSCS","ISO-2022-CN","ISO-2022-CN-EXT","EUC-KR","CP949","ISO-2022-KR","JOHAB","ARMSCII-8","Georgian-Academy","Georgian-PS","KOI8-T","TIS-620","CP874","MacThai","MuleLao-1","CP1133","VISCII","TCVN","CP1258","HP-ROMAN8","NEXTSTEP","UTF-8","UCS-2","UCS-2BE","UCS-2LE","UCS-4","UCS-4BE","UCS-4LE","UTF-16","UTF-16BE","UTF-16LE","UTF-32","UTF-32BE","UTF-32LE","UTF-7","C99","JAVA","UCS-2-INTERNAL","UCS-4-INTERNAL","CP437","CP737","CP775","CP852","CP853","CP855","CP857","CP858","CP860","CP861","CP863","CP865","CP869","CP1125","CP864","EUC-JISX0213","Shift_JISX0213","ISO-2022-JP-3","TDS565","RISCOS-LATIN1");
					//  foreach($encoding as $v){
					//	iconv($v, "utf-8", $row[2]);
					//  }
					
				
					//$str = iconv("utf-8", "ISO-8859-2", $row[2]);
					//$str = mb_convert_encoding($row[2],"EUC-CN");
					//$str = str_replace('ś',addslashes('u015b'),$row[2]);
					//echo ($str);
					
					$arr[]=array(
					
							"type" => "Feature",
							"properties" 	=> array(
									"numer" 				=> $row[0],
									"powierzchnia" 	=> $row[1],
									"name" 				=> str_replace('ś','\u015b',$row[2]),
									"nazwa"	=> $row2[0],
									"miasto"	=> $row2[1]
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