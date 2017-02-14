<?php
	header('Content-type: text/html');
	include('lib/excelexport.php');

	$xls = new ExcelExport();

	
	$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
	if (!$conn) 
	{
		echo "{success: false, message: 'Błąd podłączenia do bazy'}"; 
		exit;
	}
	$xls->addRow(Array(iconv("utf-8", "iso-8859-2", "Numer dzia�ki"),"imi� i nazwisko"));
	$users = pg_query($conn, "SELECT numer, uzytkownik FROM dzialki WHERE id_ogrodu=".$_GET["gid"]."ORDER BY uzytkownik ASC");
	while ($row = pg_fetch_row($users))
	{
		$aa = iconv("utf-8", "iso-8859-2", $row[1]);
		//$xls->addRow(Array($aa,$aa));	
		//$xls->addRow(Array($row[0],$row[1]));
	}
	$xls->download("websites.xls");
	

?> 