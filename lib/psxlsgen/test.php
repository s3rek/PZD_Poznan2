<?php
/****************************************************************
* Script         : Simple test example for PhpSimpleXlsGen
* Project        : PHP SimpleXlsGen
* Author         : Erol Ozcan <eozcan@superonline.com>
* Version        : 0.2
* Copyright      : GNU LGPL
* URL            : http://psxlsgen.sourceforge.net
* Last modified  : 18 May 2001
******************************************************************/
include( "psxlsgen.php" );

$myxls = new PhpSimpleXlsGen();
$myxls->totalcol = 2;
$myxls->InsertText( "Erol" );
$myxls->InsertText( "Ozcan" );
$myxls->InsertText( "Thisœ³oœê¹ text should be at (3,0) if header was used, otherwise at (1,0)" );
$myxls->ChangePos(4,0);
$myxls->InsertText( "You must pay" );
$myxls->InsertNumber( 20.48 );
$myxls->WriteText_pos(4,2, "USD to use this class :-))" );         // hidden costs :-))
$myxls->SendFile();
?>