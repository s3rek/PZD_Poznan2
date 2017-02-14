<?php
		header('Content-type: text/html');
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
		if (!$conn) 
		{
			  echo "{success: false, message: 'Błąd podłączenia do bazy'}"; 
			  exit;
		}
		
		$messageCd="";
		$r=0;
/*		switch ($_GET['lname']){
			
			case "o":
					$result = pg_query($conn, "SELECT uzytkownik FROM dzialki WHERE id_ogrodu=".$_GET["gid"]);
					if(pg_num_rows($result) > 0) 
					{			
						while ($row = pg_fetch_row($result))
						{
							$hhh = $row[0];
							$messageCd = $messageCd.", ".$hhh;
						}
						$messageCd = ", msg: '".$messageCd."'";
								
					}							
			break;
				
		}	

		
		if ($messageCd!="")
		{	
				echo "{success: true".$messageCd."}";
				//echo "{success: true, msg: 'To jest wartość'}";
		}
		else 
		{
				echo "{failure: true}";
		}
		*/
		$qwe = 2;
		echo $qwe;
		
?> 