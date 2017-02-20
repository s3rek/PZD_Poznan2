<?php
/*	header('Content-type: text/html charset=UTF-8');
	include('lib/excelexport.php');

	$xls = new ExcelExport();

	
	$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
	if (!$conn) 
	{
		echo "{success: false, message: 'B³¹d pod³¹czenia do bazy'}"; 
		exit;
	}
	$xls->addRow(Array(iconv("utf-8", "iso-8859-2", "Numer dzia³ki"),iconv("utf-8", "iso-8859-2", "imiê nazwisko")));
	$users = pg_query($conn, "SELECT numer, uzytkownik FROM dzialki WHERE id_ogrodu=".$_GET["gid"]."ORDER BY uzytkownik ASC");
	while ($row = pg_fetch_row($users))
	{
		$aa = iconv("utf-8", "iso-8859-2", $row[1]);
		//$xls->addRow(Array($aa,$aa));	
		//$xls->addRow(Array(iconv("utf-8", "iso-8859-2", $row[0]),iconv("utf-8", "iso-8859-2", $row[1])));
		$xls->addRow(Array($row[0],$row[1]));
	}
	$xls->download("websites.xls");
*/	
	/****************************************************************
* Script         : Simple test example for PhpSimpleXlsGen
* Project        : PHP SimpleXlsGen
* Author         : Erol Ozcan <eozcan@superonline.com>
* Version        : 0.2
* Copyright      : GNU LGPL
* URL            : http://psxlsgen.sourceforge.net
* Last modified  : 18 May 2001
******************************************************************/
header('Content-type: text/html charset=UTF-8');

include( "lib/psxlsgen/psxlsgen.php" );

$myxls = new PhpSimpleXlsGen();

$myxls->totalcol = 2;

$myxls->InsertText( "NUMER DZIA£KI" );
$myxls->InsertText( "IMIÊ I NAZWISKO" );

$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
if (!$conn) 
{
	echo "{success: false, message: 'B³¹d pod³¹czenia do bazy'}"; 
	exit;
}

$users = pg_query($conn, "SELECT numer, uzytkownik FROM dzialki WHERE id_ogrodu=".$_GET["gid"]."ORDER BY uzytkownik ASC");

while ($row = pg_fetch_row($users))
{
$myxls->InsertText( iconv("utf-8", "windows-1250", $row[0]) );
$myxls->InsertText( iconv("utf-8", "windows-1250", $row[1]) );
}


$myxls->SendFile();




?> 