<?php
		header('Content-type: text/html; charset=UTF-8');	
		include 'array2json.php';			
		$dir = "dane/pliki_uz/";		
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
						'fullpath'	=> "dane/pliki_uz/"
				);	  		
		};
		$json = array2json($arr);
		$json = stripslashes($json);		
		echo $json;
?>
