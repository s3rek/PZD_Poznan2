<?php

ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);


//zmienic na utf-8 po wgraniu na serwer
header('Content-type: text/html; charset=windows-1250');

function getExt($str) 
{
	while (($pos=strpos($str, "."))) {
		$str=substr($str, $pos+1);		
	}
	return $str;	
}

if ((($_FILES["file"]["type"] == "image/gif")
|| ($_FILES["file"]["type"] == "image/jpeg")
|| ($_FILES["file"]["type"] == "image/pjpeg")
|| ($_FILES["file"]["type"] == "image/jpg")
|| ($_FILES["file"]["type"] == "image/png")))
//&& ($_FILES["file"]["size"] < 10000000000))
  {
  if ($_FILES["file"]["error"] > 0)
  {
    echo "{success: false, message: 'Zwrócony kod: ".$_FILES["file"]["error"]."'}";
  }
  else
    {    
      $conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
			if (!$conn) {
				echo "{success: false, message: 'B³¹d pod³¹czenia do bazy'}";
  			exit;
			}
			$result = pg_query($conn, "SELECT gid FROM zdjecia ORDER BY gid DESC LIMIT 1");
			if(pg_num_rows($result) > 0)
			{
				$row = pg_fetch_row($result);
				$id = (int)$row[0] + 1;
			}
			else
			{
				$id = 1;
			}
			$image = $_FILES["file"]["name"];
			$uploadedfile = $_FILES["file"]["tmp_name"];
			$ext = getExt(stripslashes($_FILES["file"]["name"]));
			$ext = strtolower($ext);
			$docelowy = "dane/zdjecia/" . $id . "." . $ext;
			if($ext=="jpg" || $ext=="jpeg")
			{
				$src = imagecreatefromjpeg($uploadedfile);
			} else if ($ext=="png")
				{
					$src = imagecreatefrompng($uploadedfile);
				} else if ($ext=="gif")
					{
						$src = imagecreatefromgif($uploadedfile);
					} else
						{
							exit;
						}
			list($width,$height)=getimagesize($uploadedfile);
			if ($width < 400) {
				imagejpeg($src,$docelowy,100);
			} else {
				$newwidth=400;
				$newheight=($height/$width)*$newwidth;
				$tmp=imagecreatetruecolor($newwidth,$newheight);
				imagecopyresampled($tmp,$src,0,0,0,0,$newwidth,$newheight,$width,$height);			
	      imagejpeg($tmp,$docelowy,100);	      
	      imagedestroy($tmp);
    	}
      imagedestroy($src);
      pg_free_result($result);
      pg_close($conn); 
      unlink($_FILES["file"]["tmp_name"]);
      echo "{success: true, message: 'Wgranie powiod³o siê!', sciezka: '".$docelowy."', gid: '".$id."'}";
      
    }     
  }
else
{
	echo "{success: false, message: 'tNiew³aœciwy plik ".$_FILES["file"]["type"]."'}";
}
exit;
?> 