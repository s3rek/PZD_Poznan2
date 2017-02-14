<?php
		header('Content-type: text/html; charset=UTF-8');	
		include 'array2json.php';			
		$dir = "dokumenty/".$_GET['dir']."/";		
		$files = glob($dir."*.pdf");
		if (!$files) {
		  echo 'Nic nie ma w katalogu: ';
		  echo $directory;
		  exit;
		}
		$id=1;	
		foreach($files as $file)
		{
				$arr[]=array(
						'id'				=> $id++,
						'leaf'			=> true,
						'text'			=> basename($file, ".pdf"),
						'fullpath'	=> "RODGliwice/".$file
				);	  		
		};
		$json = array2json($arr);
		$json = stripslashes($json);		
		echo $json;
?>