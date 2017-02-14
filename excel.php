<?php
include_once 'lib/Spreadsheet/Excel/Writer.php';

// Tworzymy "plik"
$workbook = new Spreadsheet_Excel_Writer();

// plik wysy�amy do przegl�darki (generujemy nag��wki)
$workbook->send('plik.xls');

// Tworzmy arkusz
$worksheet =& $workbook->addWorksheet('M�j Arkusz');

// Podajemy jakie� dane
$worksheet->write(0, 0, 'Imi�');
$worksheet->write(0, 1, 'Wiek');
$worksheet->write(1, 0, 'Adam Ma�ysz');
$worksheet->write(1, 1, '30');
$worksheet->write(2, 0, iconv('UTF-8','ISO-8859-2','Adam Ma�ysz'));
$worksheet->write(2, 1, '31');
$worksheet->write(3, 0, 'Andrzej Lepper');
$worksheet->write(3, 1, '32');

// ko�czymy operacje
$workbook->close();