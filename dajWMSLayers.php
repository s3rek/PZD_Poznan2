<?php
function xmlToArray( $xml, $ns = null )
{
				$a   = array( );
				$r   = array( );
				$str = "";
				for ( $xml->rewind(); $xml->valid(); $xml->next() ) {
								$key = $xml->key();
								$t   = 0;
								foreach ( $xml->getChildren() as $name => $data ) {
												if ( $name == "Name" ) {
																setcookie( "jkl", $data, time() + 900, "/", "" );
																$t++;
												} //$name == "Name"
								} //$xml->getChildren() as $name => $data
								if ( $xml->key() == "Name" ) {
												$str = $_COOKIE[ "jkl" ];
												$str = $str . $xml->getChildren() . " - ";
								} //$xml->key() == "Name"
								if ( !isset( $a[ $key ] ) ) {
												$a[ $key ] = array( );
												$i         = 0;
								} //!isset( $a[ $key ] )
								else
												$i = count( $a[ $key ] );
								$simple = true;
								foreach ( $xml->current()->attributes() as $k => $v ) {
												$a[ $key ][ $i ][ $k ] = (string) $v;
												$simple                = false;
								} //$xml->current()->attributes() as $k => $v
								if ( $ns )
												foreach ( $ns as $nid => $name ) {
																foreach ( $xml->current()->attributes( $name ) as $k => $v ) {
																				$a[ $key ][ $i ][ $nid . ':' . $k ] = (string) $v;
																				$simple                             = false;
																} //$xml->current()->attributes( $name ) as $k => $v
												} //$ns as $nid => $name
								if ( $xml->hasChildren() ) {
												if ( $simple ) {
																$a[ $key ][ $i ] = xmlToArray( $xml->current(), $ns );
												} //$simple
												else {
																$a[ $key ][ $i ][ 'content' ] = xmlToArray( $xml->current(), $ns );
												}
								} //$xml->hasChildren()
								else {
												if ( $simple )
																$a[ $key ][ $i ] = strval( $xml->current() );
												else
																$a[ $key ][ $i ][ 'content' ] = strval( $xml->current() );
								}
								$i++;
								//}
				} //$xml->rewind(); $xml->valid(); $xml->next()
				return $a;
}
$dd         = $_GET[ "msg" ];
$dd         = $dd . '&request=GetCapabilities&service=WMS';
$xml        = new SimpleXmlIterator( $dd, null, true );
$namespaces = $xml->getNamespaces( true );
$ww         = xmlToArray( $xml, $namespaces );
$mm         = print_r( $ww, true );
//echo $mm;
//setcookie("iii", $mm, time()+9000, "/", "");
$rr         = 0;
$pos        = 0;
$pos        = strpos( (string) $mm, "[Name]" );
while ( strpos( $mm, " " ) ) {
				$mm = str_replace( ' ', '', $mm );
} //strpos( $mm, " " )
$temp_str  = $mm;
$r         = 0;
$x         = 0;
$tab_name  = array( );
$temp_name = "";
for ( $x = 0; $x < strlen( $mm ); $x++ ) {
				if ( $mm[ $x ] == "[" && $mm[ $x + 1 ] == "N" && $mm[ $x + 2 ] == "a" && $mm[ $x + 3 ] == "m" && $mm[ $x + 4 ] == "e" && $mm[ $x + 5 ] == "]" ) {
								for ( $x = $x + 21; $x < strlen( $mm ); $x++ ) {
												if ( $mm[ $x ] != ")" ) {
																$temp_name = $temp_name . $mm[ $x ];
												} //$mm[ $x ] != ")"
												else {
																$tab_name[ $rr ] = $temp_name;
																$temp_name       = "";
																break;
												}
								} //$x = $x + 21; $x < strlen( $mm ); $x++
								$rr++;
				} //$mm[ $x ] == "[" && $mm[ $x + 1 ] == "N" && $mm[ $x + 2 ] == "a" && $mm[ $x + 3 ] == "m" && $mm[ $x + 4 ] == "e" && $mm[ $x + 5 ] == "]"
} //$x = 0; $x < strlen( $mm ); $x++
$str_to = "";
for ( $y = 0; $y < count( $tab_name ); $y++ ) {
				//	echo $tab_name[$y];
				//	echo "<BR>";
				$str_to = $str_to . "|" . trim( $tab_name[ $y ] );
} //$y = 0; $y < count( $tab_name ); $y++
$str_to = trim( $str_to );
if ( $_COOKIE[ 'podwarstwy' ] ) {
				$str_to = $_COOKIE[ 'podwarstwy' ] . $str_to . "*";
				setcookie( "podwarstwy", $str_to, time() + 9000, "/", "" );
} //$_COOKIE[ 'podwarstwy' ]
else {
				$str_to = $str_to . "*";
				setcookie( "podwarstwy", $str_to, time() + 9000, "/", "" );
}
echo "{success: true, message: 'iop'}";
?>