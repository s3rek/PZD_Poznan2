<?php
header( 'Content-type: text/html' );
$conn = pg_connect( "host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres" );
if ( !$conn ) {
				echo "{success: false, message: 'B��d pod��czenia do bazy'}";
				exit;
} //!$conn
$messageCd = "";
switch ( $_GET[ 'lname' ] ) {
				case "dz":
								$result = pg_query( $conn, "SELECT u.id_ogrodu FROM ogrody o INNER JOIN dzialki u ON u.id_ogrodu=o.gid WHERE u.gid=" . $_GET[ "gid" ] );
								if ( pg_num_rows( $result ) > 0 ) {
												while ( $row = pg_fetch_row( $result ) ) {
																$messageCd = $messageCd . ", idogr: " . $row[ 0 ];
												} //$row = pg_fetch_row( $result )
								} //pg_num_rows( $result ) > 0
								/*break;
								case "o":
								$result = pg_query($conn, "SELECT id_deleg FROM ogrody WHERE gid=".$_GET["gid"]);
								if(pg_num_rows($result) > 0) 
								{			
								while ($row = pg_fetch_row($result))
								{
								$messageCd = $messageCd.", iddeleg: ".$row[0];
								}
								}*/
								break;
				case "us":
								$result = pg_query( $conn, "SELECT id FROM uzytkownicy WHERE id=" . $_GET[ "user" ] );
								if ( pg_num_rows( $result ) > 0 ) {
												while ( $row = pg_fetch_row( $result ) ) {
																$messageCd = $messageCd . ", id: " . $row[ 0 ];
												} //$row = pg_fetch_row( $result )
								} //pg_num_rows( $result ) > 0
								break;
				case "wpow":
								$messageCd = ", message: 'Edycja poligon�w'";
								break;
				case "wlin":
								$messageCd = ", message: 'Edycja linii'";
								break;
				case "wpkt":
								$messageCd = ", message: 'Edycja punkt�w'";
								break;
				case "wzd":
								$messageCd = ", message: 'Edycja zdj��'";
								break;
				default:
								$messageCd = ", message: 'Edycja nieobs�ugiwanego elementu";
								break;
} //$_GET[ 'lname' ]
if ( $messageCd != "" ) {
				echo "{success: true" . $messageCd . "}";
} //$messageCd != ""
else {
				echo "{failure: true}";
}
?> 