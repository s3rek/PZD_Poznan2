<?php
header('Content-type: text/html; charset=windows-1250');
$filename=$_GET['sciezka'];
unlink($filename);
echo "{success: true, message: 'Usuniêcie zdjêcia powiod³o siê!'}"
?> 