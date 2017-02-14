<?php
	header('Content-type: text/html');
	include('lib/fpdf17/fpdf.php');
	define('FPDF_FONTPATH','lib/fpdf17/font/');
	
	$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
	if (!$conn) 
	{
		echo "{success: false, message: 'B³¹d pod³¹czenia do bazy'}"; 
		exit;
	}
		
	$garden = pg_query($conn, "SELECT nazwa, miasto, parcela FROM ogrody WHERE gid=".$_GET["gid"]);	
	while ($row = pg_fetch_row($garden))
	{
		$gardenName = $row[0];
		$gardenCity = $row[1];
		$gardenParcel = $row[2];
	}
		
		
	$pdf=new FPDF('P','mm','A4');
	$pdf->Open();     //otwiera nowy dokument
	$pdf->AddPage();    //dodaje now¹ stronê do dokumentu
	$pdf->AddFont('arialpl','B','arialpl.php');
	$pdf->SetFont('arialpl','B',12);
	$pdf->Image('img/to_pdf/gliwice_herb.png', 13, 3, 10.5, 12, 'PNG');
	$pdf->Text(25,10, 'Ogród: '.iconv("utf-8", "iso-8859-2", strtoupper($gardenName)).', parcela: '.iconv("utf-8", "iso-8859-2", strtoupper($gardenParcel)).' - '.iconv("utf-8", "iso-8859-2", strtoupper($gardenCity))); 
	$pdf->Text(150,10, 'Data: '.date("Y-m-d")); 
	$pdf->Image('img/to_pdf/pzd.png', 184, 3, 14, 12, 'PNG');
	
	
	$iks = $pdf->GetX();
	$igrek = $pdf->GetY();
	$pdf->Line($iks+15, $igrek+2,182, $igrek+2);  //wstawia liniê 2mm pod tekstem, o d³ugoœci 200mm.

	$iks = $pdf->GetX();
	$igrek = $pdf->GetY();
	$pdf->Text($iks+5,$igrek+10, 'Lista dzia³kowiczów:');
	
	$iks = $pdf->GetX();
	$igrek = $pdf->GetY();
	$pdf->Line($iks+5, $igrek+11,52, $igrek+11);
	
	
	$iks = $pdf->GetX();
	$igrek = $pdf->GetY();
	$pdf->SetXY($iks+10, $igrek+20);
	$pdf->Cell(50,15,strtoupper('Numer dzia³ki'),1,0,'C');
	$pdf->Cell(50,15,strtoupper('Powierzchnia (m2)'),1,0,'C');
	$pdf->Cell(70,15,strtoupper('U¯ytkownik'),1,1,'C');
	
	$iks = $pdf->GetX();
	$igrek = $pdf->GetY();
	$pdf->SetXY($iks, $igrek+5);
	
	$users = pg_query($conn, "SELECT numer, powierzchnia, uzytkownik FROM dzialki WHERE id_ogrodu=".$_GET["gid"]."ORDER BY uzytkownik ASC");
	while ($row = pg_fetch_row($users))
	{
		$iks = $pdf->GetX();
		$igrek = $pdf->GetY();
		$pdf->SetXY($iks+10, $igrek);
		$str = '';
		$str = iconv("utf-8", "iso-8859-2", $row[2]);
		$pdf->Cell(50,10,$row[0],1,0,'C');
		$pdf->Cell(50,10,$row[1],1,0,'C');
		$pdf->Cell(70,10,$str,1,1,'C');
	}
	//$pdf->AddPage(); //dodaje now¹ stronê.

	//$garden = pg_query($conn, "SELECT gid FROM ogrody WHERE gid=".$_GET["gid"]);	
	$garden = pg_query($conn, "select nr_ogrodu FROM ogrody WHERE gid=".$_GET["gid"]);
	while ($row = pg_fetch_row($garden))
	{
		$garden1 = pg_query($conn, "select gid, parcela, miasto, nazwa FROM ogrody WHERE nr_ogrodu=".$row[0]);
		if(pg_num_rows($garden1)>1){
			while($row1 = pg_fetch_row($garden1)){
				if($row1[0] != $_GET["gid"]){
					$pdf->AddPage();
					
					$pdf->Image('img/to_pdf/gliwice_herb.png', 13, 3, 10.5, 12, 'PNG');
					$pdf->Text(25,10, 'Ogród: '.iconv("utf-8", "iso-8859-2", strtoupper($row1[3])).', parcela: '.iconv("utf-8", "iso-8859-2", strtoupper($row1[1])).' - '.iconv("utf-8", "iso-8859-2", strtoupper($row1[2]))); 
					$pdf->Text(150,10, 'Data: '.date("Y-m-d")); 
					$pdf->Image('img/to_pdf/pzd.png', 184, 3, 14, 12, 'PNG');
					
					
					$iks = $pdf->GetX();
					$igrek = $pdf->GetY();
					$pdf->Line($iks+15, $igrek+2,182, $igrek+2);  //wstawia liniê 2mm pod tekstem, o d³ugoœci 200mm.

					$iks = $pdf->GetX();
					$igrek = $pdf->GetY();
					$pdf->Text($iks+5,$igrek+10, 'Lista dzia³kowiczów:');
					
					$iks = $pdf->GetX();
					$igrek = $pdf->GetY();
					$pdf->Line($iks+5, $igrek+11,52, $igrek+11);
					
					
					$iks = $pdf->GetX();
					$igrek = $pdf->GetY();
					$pdf->SetXY($iks+10, $igrek+20);
					$pdf->Cell(50,15,strtoupper('Numer dzia³ki'),1,0,'C');
					$pdf->Cell(50,15,strtoupper('Powierzchnia (m2)'),1,0,'C');
					$pdf->Cell(70,15,strtoupper('U¯ytkownik'),1,1,'C');
					
					
					
					
					$users1 = pg_query($conn, "SELECT numer, powierzchnia, uzytkownik FROM dzialki WHERE id_ogrodu=".$row1[0]."ORDER BY uzytkownik ASC");
					while ($row2 = pg_fetch_row($users1))
					{
						$iks = $pdf->GetX();
						$igrek = $pdf->GetY();
						$pdf->SetXY($iks+10, $igrek);
						$str = '';
						$str = iconv("utf-8", "iso-8859-2", $row2[2]);
						$pdf->Cell(50,10,$row2[0],1,0,'C');
						$pdf->Cell(50,10,$row2[1],1,0,'C');
						$pdf->Cell(70,10,$str,1,1,'C');
					}
				}
			
			}
			
		}
		//$gardenId = $row[0];
	}
	
	$pdf->SetCompression(true);  //w³¹cza kompresjê dokumentu
	 
	/* a poni¿sze tylko dla ambitnych */
	$pdf->SetAuthor('Unimap');  //ustawia autora dokumentu
	$pdf->SetCreator('Dokument generowany przy pomocy skryptu');  //ustawia generator dokumentu
	$pdf->SetKeywords('s³owo_kluczowe1, s³owo_kluczowe2');  //ustawia s³owa kluczowe dokumentu
	$pdf->SetSubject('Nauka dynamicznego tworzenia PDFów');  //ustawia temat dokumentu
	$pdf->SetTitle('Lista u¿ytkowników dzia³ek');  //ustawia tytu³ dokumentu
	 
	$pdf->SetDisplayMode(100);  //domyœlne powiêkszenie dokumentu w przegl¹darce
	$pdf->SetMargins(20, 20 , 20);  //ustawia marginesy dla dokumentu
	 
	/* koñczy zabawê i generuje dokument */
	$pdf->Output();  //zamyka i generuje dokument
		

?> 