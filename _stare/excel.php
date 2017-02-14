<?php
include_once 'lib/Spreadsheet/Excel/Writer.php';

// Tworzymy "plik"
$workbook = new Spreadsheet_Excel_Writer();

// plik wysy³amy do przegl¹darki (generujemy nag³ówki)
$workbook->send('plik.xls');

// Tworzmy arkusz
$worksheet =& $workbook->addWorksheet('Mój Arkusz');

// Podajemy jakieœ dane
$worksheet->write(0, 0, 'Imiê');
$worksheet->write(0, 1, 'Wiek');
$worksheet->write(1, 0, 'Adam Ma³ysz');
$worksheet->write(1, 1, '30');
$worksheet->write(2, 0, iconv('UTF-8','ISO-8859-2','Adam Ma³ysz'));
$worksheet->write(2, 1, '31');
$worksheet->write(3, 0, 'Andrzej Lepper');
$worksheet->write(3, 1, '32');

// koñczymy operacje
$workbook->close();