		//warstwy
		//Warstwy do warstwy grupowej
		var	unimap_wms = new OpenLayers.Layer.WMS( "PRG", "http://unimap.homenet.org:8081/geoserver/wms", {				
				layers:	[
					'prg_powiaty'
					],
				format: 'image/png',					
				transparent: true,
				tileSize: new OpenLayers.Size(400,400)
				}, 
				{
				visibility: false,
				isBaseLayer: false,
				displayInLayerSwitcher: false
				}
		);
	
	//dodawanie WMS-a???
		if(wararray!=null){

			var um_wms_tab = new Array();
			for(var i=0;i<wararray.length;i++){
				eval('var um_wms'+i+' = ""');
			var adresWMS = 'dajWMSLayers.php';
			
			}
			
			//alert(getCookie('layers'));
			//alert("------------"+getCookie('layers'));
			for(var ii=0;ii<wararray.length;ii++){
				var temp_layer = 'layers: [';
				//if(i==0)]
				
				for(var t=1;t<layerarray[ii].length;t++){
					temp_layer = temp_layer + '"' + layerarray[0][t];
					if(t<25){
						 temp_layer = temp_layer + '",';
					}else{
						temp_layer = temp_layer + '"';
					}
				}
				
				temp_layer = temp_layer + ']';
				
				//temp_layer = 'layers:	["ulice","eg_dzialki","pkt_adr_auto","vec_gr_miasta","eg_budynki","eg_obreb","vec_osiedle"]';
				//alert("IIIIIIII - " + temp_layer);
				//	eval('var um_wms'+i+' = new OpenLayers.Layer.WMS( "'+wararray[i]+'", "'+ wmsarray[i]+'", {	layers:	["ulice","eg_dzialki","pkt_adr_auto","vec_gr_miasta","eg_budynki","eg_obreb","vec_osiedle"],	projection: new OpenLayers.Projection("EPSG:900913"),"transparent": true}, {visibility: false,	isBaseLayer: false,displayInLayerSwitcher: false }	);');
				//	eval('var um_wms'+i+' = new OpenLayers.Layer.WMS( "'+wararray[i]+'", "'+ wmsarray[i]+'", {	layers:	["gminy","powiaty","wojewodztwa"],	projection: new OpenLayers.Projection("EPSG:900913"),"transparent": true}, {visibility: false,	isBaseLayer: false,displayInLayerSwitcher: false }	);');
				//eval('var um_wms'+i+' = new OpenLayers.Layer.WMS( "'+wararray[i]+'", "'+ wmsarray[i]+'", {	layers: ["WMS","SerwerWMSfirmyUNIMAPbyPiotrLukaszczuk","orto2009","orto2009-zakresy","topo10","topo10-zakresy","topo10g","topo10g-zakresy_01","default","topo10_42g","topo10g-zakresy_02","default","topo50","topo50-zakresy","topo100","topo100-zakresy","ogrody","ROD_dzialki","gminy_slask","default","gminy","default","powiaty","default","wojewodztwa"],	projection: new OpenLayers.Projection("EPSG:900913"),"transparent": true}, {visibility: false,	isBaseLayer: false,displayInLayerSwitcher: false }	);');
				eval('var um_wms'+ii+' = new OpenLayers.Layer.WMS( "'+wararray[ii]+'", "'+ wmsarray[ii]+'", {	'+ temp_layer +',	projection: new OpenLayers.Projection("EPSG:900913"),"transparent": true}, {visibility: false,	isBaseLayer: false,displayInLayerSwitcher: false }	);');
				//alert((string)um_wmso0);
				
					um_wms_tab[ii] = 'um_wms'+ii;
					
				//if(i==1)
				//	eval("var um_wms"+i+" = new OpenLayers.Layer.WMS( '"+wararray[i]+"', 'http://msip-mapa.um.gliwice.pl/portal/isdp/scripts/isdp.dll/wms/1.1.1', {	layers:	['ulice','eg_dzialki','pkt_adr_auto','vec_gr_miasta','eg_budynki','eg_obreb','vec_osiedle'],	projection: new OpenLayers.Projection('EPSG:900913'),'transparent': true}, {visibility: false,	isBaseLayer: false,displayInLayerSwitcher: false }	);");
			}
			
			
		}
		//alert(um_wms);
		
		
		
		var	um_wms = new OpenLayers.Layer.WMS( "UM Gliwice", "http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer", {				
						layers:	[								
								 'ORTOFOTO'
								
						],
						projection: new OpenLayers.Projection("EPSG:900913"),
						//format: 'image/jpg',					
						'transparent': true
						//tileSize: new OpenLayers.Size(400,400)
				}, 
				{
						visibility: false,
						isBaseLayer: false,
						displayInLayerSwitcher: false
				});
		var gmap_d = new OpenLayers.Layer.Google("Google Drogi", {
						isBaseLayer: true,
						visibility: false
				});
				
		var gmap_h = new OpenLayers.Layer.Google("Google Hybryda", {
						type: google.maps.MapTypeId.HYBRID, 
						isBaseLayer: true
				});
				
		var	topo50_wms = new OpenLayers.Layer.WMS( "Mapa Topograficzna", "http://unimap.homenet.net:8081/geoserver/server", {				
						layers:	'topo50', 
						format: 'image/gif',					
						'transparent': true,
						tileSize: new OpenLayers.Size(400,400)
				}, {
						isBaseLayer: true,
						visibility: false
				});