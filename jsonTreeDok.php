<?php
$search  = array('Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż','ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż');
$replace = array('\\u0104', '\\u0106', '\\u0118', '\\u0141', '\\u0143', '\\u00d3', '\\u015a', '\\u0179', '\\u017b', '\\u0105', '\\u0107', '\\u0119', '\\u0142', '\\u0144', '\\u00f3', '\\u015b', '\\u017a', '\\u017c');


header('Content-type: text/plain; charset=iso-8859-2');
include 'array2json.php';
$dir   = "dokumenty/" . $_GET['dir'] . "/";
$files = glob($dir . "*.pdf");
if (!$files) {
				echo 'Nic nie ma w katalogu: ';
				echo $directory;
				exit;
}
$id = 1;
foreach ($files as $file) {
				//echo $file;
				$arr[] = array(
								'id' => $id++,
								'leaf' => true,
								'text' => str_replace( $search, $replace, basename($file, ".pdf")),//
								'fullpath' => $file
				);
}
$json = array2json($arr);
$json = stripslashes($json);
echo $json;
?>