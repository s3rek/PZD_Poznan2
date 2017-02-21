<?php
	$search  = array('�', '�', '�', '�', '�', '�', '�', '�', '�','�', '�', '�', '�', '�', '�', '�', '�', '�');
	$replace = array('\\u0104', '\\u0106', '\\u0118', '\\u0141', '\\u0143', '\\u00d3', '\\u015a', '\\u0179', '\\u017b', '\\u0105', '\\u0107', '\\u0119', '\\u0142', '\\u0144', '\\u00f3', '\\u015b', '\\u017a', '\\u017c');

header( 'Content-type: text/plain' );
include( 'lib/fpdf17/fpdf.php' );
define( 'FPDF_FONTPATH', 'lib/fpdf17/font/' );
$conn = pg_connect( "host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres" );
if ( !$conn ) {
				echo "{success: false, message: 'B��d pod��czenia do bazy'}";
				exit;
} //!$conn
$garden = pg_query( $conn, "SELECT nazwa, miasto, parcela FROM ogrody WHERE gid=" . $_GET[ "gid" ] );
while ( $row = pg_fetch_row( $garden ) ) {
				$gardenName   = $row[ 0 ];
				$gardenCity   = $row[ 1 ];
				$gardenParcel = $row[ 2 ];
} //$row = pg_fetch_row( $garden )
$pdf = new FPDF( 'P', 'mm', 'A4' );
$pdf->Open(); //otwiera nowy dokument
$pdf->AddPage(); //dodaje now� stron� do dokumentu
$pdf->AddFont( 'arialpl', 'B', 'arialpl.php' );
$pdf->SetFont( 'arialpl', 'B', 12 );
//$pdf->Image('img/to_pdf/gliwice_herb.png', 13, 3, 10.5, 12, 'PNG');
$pdf->Text( 25, 10, 'Ogr�d: ' . iconv( "utf-8", "iso-8859-2", strtoupper( $gardenName ) ) . ', parcela: ' . strtoupper( iconv( "utf-8", "iso-8859-2", $gardenParcel ) ) . ' - ' . iconv( "utf-8", "iso-8859-2", mb_strtoupper( $gardenCity ) ) );
$pdf->Text( 150, 10, 'Data: ' . date( "Y-m-d" ) );
$pdf->Image( 'img/to_pdf/pzd.png', 184, 3, 14, 12, 'PNG' );
$iks   = $pdf->GetX();
$igrek = $pdf->GetY();
$pdf->Line( $iks + 15, $igrek + 2, 182, $igrek + 2 ); //wstawia lini� 2mm pod tekstem, o d�ugo�ci 200mm.
$iks   = $pdf->GetX();
$igrek = $pdf->GetY();
$pdf->Text( $iks + 10, $igrek + 10, 'Lista dzia�kowicz�w:' );
$iks   = $pdf->GetX();
$igrek = $pdf->GetY();
$pdf->Line( $iks + 10, $igrek + 11, 57, $igrek + 11 );
$iks   = $pdf->GetX();
$igrek = $pdf->GetY();
$pdf->SetXY( $iks + 10, $igrek + 20 );
$pdf->Cell( 50, 15, strtoupper( 'Numer dzia�ki' ), 1, 0, 'C' );
$pdf->Cell( 50, 15, strtoupper( 'Powierzchnia (m2)' ), 1, 0, 'C' );
$pdf->Cell( 70, 15, strtoupper( 'U�ytkownik' ), 1, 1, 'C' );
$iks   = $pdf->GetX();
$igrek = $pdf->GetY();
$pdf->SetXY( $iks, $igrek + 5 );
$users = pg_query( $conn, "SELECT numer, powierzchnia, uzytkownik FROM dzialki WHERE id_ogrodu=" . $_GET[ "gid" ] . "ORDER BY uzytkownik ASC" );
while ( $row = pg_fetch_row( $users ) ) {
				$iks   = $pdf->GetX();
				$igrek = $pdf->GetY();
				$pdf->SetXY( $iks + 10, $igrek );
				$str = '';
				$str = $row[ 2 ];
				$pdf->Cell( 50, 10, iconv( "utf-8", "iso-8859-2", $row[ 0 ] ), 1, 0, 'C' );
				$pdf->Cell( 50, 10, iconv( "utf-8", "iso-8859-2", $row[ 1 ] ), 1, 0, 'C' );
				$pdf->Cell( 70, 10, iconv( "utf-8", "iso-8859-2", $str ), 1, 1, 'C' );
} //$row = pg_fetch_row( $users )
//$pdf->AddPage(); //dodaje now� stron�.
$garden = pg_query( $conn, "SELECT gid FROM ogrody WHERE gid=" . $_GET[ "gid" ] );
//$garden = pg_query($conn, "select nr_ogrodu FROM ogrody WHERE gid=".$_GET["gid"]);
while ( $row = pg_fetch_row( $garden ) ) {
				$garden1 = pg_query( $conn, "select gid, parcela, miasto, nazwa FROM ogrody WHERE gid=" . $row[ 0 ] );
				if ( pg_num_rows( $garden1 ) > 1 ) {
								while ( $row1 = pg_fetch_row( $garden1 ) ) {
												if ( $row1[ 0 ] != $_GET[ "gid" ] ) {
																$pdf->AddPage();
																//$pdf->Image('img/to_pdf/gliwice_herb.png', 13, 3, 10.5, 12, 'PNG');
																$pdf->Text( 25, 10, 'Ogr�d: ' . iconv( "utf-8", "iso-8859-2", strtoupper( $row1[ 3 ] ) ) . ', parcela: ' . iconv( "utf-8", "iso-8859-2", strtoupper( $row1[ 1 ] ) ) . ' - ' . iconv( "utf-8", "iso-8859-2", strtoupper( $row1[ 2 ] ) ) );
																$pdf->Text( 150, 10, 'Data: ' . date( "Y-m-d" ) );
																$pdf->Image( 'img/to_pdf/pzd.png', 184, 3, 14, 12, 'PNG' );
																$iks   = $pdf->GetX();
																$igrek = $pdf->GetY();
																$pdf->Line( $iks + 15, $igrek + 2, 182, $igrek + 2 ); //wstawia lini� 2mm pod tekstem, o d�ugo�ci 200mm.
																$iks   = $pdf->GetX();
																$igrek = $pdf->GetY();
																$pdf->Text( $iks + 5, $igrek + 10, 'Lista dzia�kowicz�w:' );
																$iks   = $pdf->GetX();
																$igrek = $pdf->GetY();
																$pdf->Line( $iks + 5, $igrek + 11, 52, $igrek + 11 );
																$iks   = $pdf->GetX();
																$igrek = $pdf->GetY();
																$pdf->SetXY( $iks + 10, $igrek + 20 );
																$pdf->Cell( 50, 15, strtoupper( 'Numer dzia�ki' ), 1, 0, 'C' );
																$pdf->Cell( 50, 15, strtoupper( 'Powierzchnia (m^2)' ), 1, 0, 'C' );
																$pdf->Cell( 70, 15, strtoupper( 'U�ytkownik' ), 1, 1, 'C' );
																$users1 = pg_query( $conn, "SELECT numer, powierzchnia, uzytkownik FROM dzialki WHERE id_ogrodu=" . $row1[ 0 ] . "ORDER BY uzytkownik ASC" );
																while ( $row2 = pg_fetch_row( $users1 ) ) {
																				$iks   = $pdf->GetX();
																				$igrek = $pdf->GetY();
																				$pdf->SetXY( $iks + 10, $igrek );
																				$str = '';
																				$str = iconv( "utf-8", "iso-8859-2", $row2[ 2 ] );
																				$pdf->Cell( 50, 10, iconv( "utf-8", "iso-8859-2", $row2[ 0 ] ), 1, 0, 'C' );
																				$pdf->Cell( 50, 10, iconv( "utf-8", "iso-8859-2", $row2[ 1 ] ), 1, 0, 'C' );
																				$pdf->Cell( 70, 10, iconv( "utf-8", "iso-8859-2", $str ), 1, 1, 'C' );
																} //$row2 = pg_fetch_row( $users1 )
												} //$row1[ 0 ] != $_GET[ "gid" ]
								} //$row1 = pg_fetch_row( $garden1 )
				} //pg_num_rows( $garden1 ) > 1
				//$gardenId = $row[0];
} //$row = pg_fetch_row( $garden )
$pdf->SetCompression( true ); //w��cza kompresj� dokumentu
/* a poni�sze tylko dla ambitnych */
$pdf->SetAuthor( 'Unimap' ); //ustawia autora dokumentu
$pdf->SetCreator( 'Dokument generowany przy pomocy skryptu' ); //ustawia generator dokumentu
$pdf->SetKeywords( 's�owo_kluczowe1, s�owo_kluczowe2' ); //ustawia s�owa kluczowe dokumentu
$pdf->SetSubject( 'Nauka dynamicznego tworzenia PDF�w' ); //ustawia temat dokumentu
$tytul = mb_convert_encoding( 'Lista u�ytkownik�w dzia�ek', "iso-8859-2", "utf-8" );
$pdf->SetTitle( $tytul ); //ustawia tytu� dokumentu
$pdf->SetDisplayMode( 100 ); //domy�lne powi�kszenie dokumentu w przegl�darce
$pdf->SetMargins( 20, 20, 20 ); //ustawia marginesy dla dokumentu
/* ko�czy zabaw� i generuje dokument */
$pdf->Output(); //zamyka i generuje dokument
?> 