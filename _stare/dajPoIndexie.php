<?php
		header('Content-type: text/html');
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=ROD_Gliwice user=postgres password=postgres");
		if (!$conn) 
		{
			  echo "{success: false, message: 'B³¹d pod³¹czenia do bazy'}"; 
			  exit;
		}
		
		$messageCd="";
		
		switch ($_GET['co']){
			case "deleg":
					$result = pg_query($conn, "SELECT nazwa FROM delegatury WHERE gid=".$_GET["iddeleg"]);
					if(pg_num_rows($result) > 0) 
					{			
							while ($row = pg_fetch_row($result))
							{
									$messageCd = $messageCd.", deleg: '".$row[0]."'";
							}
					}
			break;
			case "miasto":
					$result = pg_query($conn, "SELECT nazwa FROM miasta WHERE gid=".$_GET["idmiasta"]);
					if(pg_num_rows($result) > 0) 
					{			
							while ($row = pg_fetch_row($result))
							{
									$messageCd = $messageCd.", miasto: '".$row[0]."'";
							}
					}
			
			break;
			case "miastodeleg":
					$result = pg_query($conn, "SELECT m.nazwa, d.nazwa FROM miasta m, delegatury d WHERE m.gid=".$_GET["idmiasta"]." AND d.gid=".$_GET["iddeleg"]);
					if(pg_num_rows($result) > 0) 
					{			
							while ($row = pg_fetch_row($result))
							{
									$messageCd = $messageCd.", miasto: '".$row[0]."', deleg: '".$row[1]."'";
							}
					}
			
			break;
			default:
					$messageCd=", message: 'Index nieobs³ugiwanego elementu";
			break;		
		}	
		
		if ($messageCd!="")
		{	
				echo "{success: true".$messageCd."}";
		}
		else 
		{
				echo "{failure: true}";
		}
		
?> 