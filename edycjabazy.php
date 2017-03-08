<?php

//zmienic na utf-8 po wgraniu na serwer
header('Content-type: text/html; charset=utf-8');
//echo "{success: true, message: 'Wgranie powiod³o siê!'}";

	$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
	if (!$conn) {
		echo "{success: true, message: 'B³¹d pod³¹czenia do bazy'}";
		exit;
	}
		
	switch ($_GET['obiekt']){			
		case 'ogrod':
				$ogrody = json_decode(json_encode($_POST['json']),true);
				$feature = json_decode($ogrody);
				//$update = pg_query( $conn, 'UPDATE ogrody SET telefon='.$feature->telefon.'WHERE gid=' .$feature->gid);
				$update = pg_query( $conn, 'UPDATE ogrody SET 
															telefon=\''.$feature->telefon .
															'\', nazwa=\''. $feature->nazwa .
															'\', prezes=\''. $feature->prezes .
															'\', miasto=\''. $feature->miasto .
															'\', parcela=\''. $feature->parcela .
											'\' WHERE gid=' .$feature->gid);
		break;
		case 'dzialki':
				$dzialki = json_decode(json_encode($_POST['json']),true);
				$feature = json_decode($dzialki);
				$update = pg_query( $conn, 'UPDATE ogrody SET 
															telefon=\''.$feature->telefon .
															'\', nazwa=\''. $feature->nazwa .
															'\', adres=\''. $feature->adres .
															'\', uzytkownik=\''. $feature->uzytkownik .
															'\', legitymacja=\''. $feature->legitymacja .
															'\', powierzchnia=\''. $feature->powierzchnia .
															'\', numer=\''. $feature->numer .
															'\', wolna=\''. $feature->wolna .
															'\', prad=\''. $feature->prad .
															'\', woda=\''. $feature->woda .
															'\', gaz=\''. $feature->gaz .
											'\' WHERE gid=' .$feature->gid);
		break;
	}
?> 
