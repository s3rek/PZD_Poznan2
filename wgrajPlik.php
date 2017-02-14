<?php

ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);


//zmienic na utf-8 po wgraniu na serwer
header('Content-type: text/html; charset=windows-1250');
//echo "{success: true, message: 'Wgranie powiod³o siê!'}";

if ((($_FILES["file"]["type"] == "application/pdf") || ($_FILES["file"]["type"] == "application/msword") || ($_FILES["file"]["type"] == "application/force-download")) && ($_FILES["file"]["size"] < 6000000)){
	if ($_FILES["file"]["error"] > 0)
	{
		echo "{success: true, message: 'Zwrócony kod: ".$_FILES["file"]["error"]."'}";
	}
	else
    { 
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
		if (!$conn) {
			echo "{success: true, message: 'B³¹d pod³¹czenia do bazy'}";
			exit;
		}
		$result = pg_query($conn, "SELECT id FROM dok ORDER BY id DESC LIMIT 1");
		if(pg_num_rows($result) > 0)
		{
			$row = pg_fetch_row($result);
			$id = (int)$row[0] + 1;
		}
		else
		{
			$id = 1;
		}
	//	move_uploaded_file($_FILES["file"]["tmp_name"],"dane/zdjecia/" . $_FILES["file"]["name"]);
	//	echo "{success: true, message: 'Wgranie powiod³o siê!'}";
		if(move_uploaded_file($_FILES["file"]["tmp_name"],"dane/pliki_uz/" . $_FILES["file"]["name"])){
			//$quest = 'insert into dokumenty(id,"user",sciezka,nazwa)values('.$id.','.$_GET["id"].',"dane/zdjecia/'.$_FILES["file"]["name"].'","'.$_GET["nazwa"].'")';
			$quest = "insert into dok(id,uzytkownik,sciezka,nazwa)values(".$id.",".$_GET['id'].",'dane/pliki_uz/".$_FILES['file']['name']."','".$_GET["nazwa"]."')";
			//$quest = '"'.$quest.'"';
			//$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
			pg_exec($conn,$quest);
			echo '{success: true, message: "Wgranie powiod³o siê!'.$quest.'"}';
		//	echo "{success: true, message: 'Wgranie powiod³o siê!'}";
		}else{
			//echo "{success: false, message: 'Nieoczekiwany b³¹d'}";
			echo "{success: true, message: 'tNiew³aœciwy plik'}";
		}
		
	}
}else
{
	//echo "{success: false, message: 'tNiew³aœciwy plik ".$_FILES["file"]["type"]."'}";
	echo "{success: true, message: 'tuuuuNiew³aœciwy plik".$_FILES["file"]["type"]."'}";
}
//echo "{success: true, message: 'Wgranie powiod³o siê!'}";
//move_uploaded_file($_FILES["file"]["tmp_name"],"dane/zdjecia/" . $_FILES["file"]["name"]);
//echo "{success: true, message: 'Wgranie powiod³o siê!'}";

/*function getExt($str) 
{
	while (($pos=strpos($str, "."))) {
		$str=substr($str, $pos+1);		
	}
	return $str;	
}

if ((($_FILES["file"]["type"] == "application/pdf")
|| ($_FILES["file"]["type"] == "application/msword")))
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
			$result = pg_query($conn, "SELECT id FROM dokumenty ORDER BY id DESC LIMIT 1");
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
*/
?> 
