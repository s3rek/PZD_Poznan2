<?php
		header('Content-type: text/html');
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
		if (!$conn) 
		{
			  echo "Wystapil blad podczas podlaczenia do bazy kolego.\n"; 
			  exit;
		}		
		$result = pg_query($conn, "SELECT u.id, r.rodzaj, r.do_czego, r.dostep FROM uzytkownicy u INNER JOIN uprawnienia r ON u.id=r.id_uzytkownika WHERE u.nazwa='".$_POST['uzytkownik']."' AND u.haslo='".$_POST['haslo']."'");
		if(pg_num_rows($result) > 0) 
		{		
				$poz2_upr = " ";	
				while ($row = pg_fetch_row($result))
				{
						$poz2_usr = $row[0];
						//zapisuje w formie u_7894.o|o|z|z|z|b,o_20.z|o|z|z|z|o      %7C to |      %2C to ,
						$poz2_upr = str_ireplace(" ",",",ltrim($poz2_upr." ".$row[1]."_".$row[2].".".$row[3]));						
				}
				//	"/GeoExtRod/" zamienic na "/"
				setcookie("poz2_usr", $poz2_usr, time()+1800, "/", "");
				setcookie("poz2_upr", $poz2_upr, time()+1800, "/", "");
				//$eee = (time()+3600)*1000;
				setcookie("poz2_time_to_log",time()+1800,time()+1800,"/","");
				pg_free_result($result);
    		pg_close($conn);
				echo "{success: true}";
		}
		else 
		{
				//tu mozna zrezygnowac z usuwania ciasteczka
				//setcookie("uzytkownik","",time()-3600,"/","127.0.0.1");
				//setcookie("haslo","",time()-3600,"/","127.0.0.1");
				echo "{failure: true}";
		}				
?> 