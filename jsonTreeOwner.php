<?php
header( 'Content-type: text/html; charset=UTF-8' );
$conn = pg_connect( "host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres" );
if ( !$conn ) {
				echo "{success: false, message: 'Błąd podłączenia do bazy'}";
				exit;
} //!$conn
include 'array2json.php';
$id     = 1;
$result = pg_query( $conn, "SELECT uzytkownik FROM dzialki WHERE id_ogrodu=" . $_GET[ "gid" ] );
if ( pg_num_rows( $result ) > 0 ) {
				while ( $row = pg_fetch_row( $result ) ) {
								$arr[ ] = array(
												 'id' => $id++,
												'leaf' => true,
												'text' => basename( $row[ 0 ] ) 
								);
				} //$row = pg_fetch_row( $result )
				$json = array2json( $arr );
				$json = stripslashes( $json );
				echo $json;
} //pg_num_rows( $result ) > 0
?>