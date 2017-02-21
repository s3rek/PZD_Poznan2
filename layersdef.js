		var pointLyr = new OpenLayers.Layer.Vector
		("Warstwa Punktowa", {
			    	projection: new OpenLayers.Projection('EPSG:2180'),
			    	styleMap: stylVector,
			    	visibility: true,
			    	opacity: 0.5,
			    	isBaseLayer: false
				});			

		var lineLyr = new OpenLayers.Layer.Vector
		("Warstwa Liniowa", {
			    	projection: new OpenLayers.Projection('EPSG:2180'),
			    	styleMap: stylVector,
			    	visibility: true,
			    	opacity: 0.5,
			    	isBaseLayer: false
				});		
	
		var polyLyr = new OpenLayers.Layer.Vector
		("Warstwa Powierzchniowa", {
			    	projection: new OpenLayers.Projection('EPSG:2180'),
			    	styleMap: stylVector,
			    	visibility: true,
			    	opacity: 0.5,
			    	isBaseLayer: false
				});

		var kierunekLyr = new OpenLayers.Layer.Vector
		("Tymczasowa Warstwa Kierunku", {
			    	projection: new OpenLayers.Projection('EPSG:2180'),
			    	visibility: true,
			    	opacity: 0.5,
			    	isBaseLayer: false,
			    	displayInLayerSwitcher: false
				});

	
		var analizyLyr = new OpenLayers.Layer.Vector
		("Warstwa Analiz", {
    			projection: new OpenLayers.Projection('EPSG:2180'),
    			styleMap: stylAnalizy,
    			visibility: true,
    			opacity: 0.5,
    			isBaseLayer: false,   
    			displayInLayerSwitcher: true  			
    		});
			
		//wlasciciele
		var wlascicieleLyr = new OpenLayers.Layer.Vector
		("Warstwa Analiz", 
    		{
    			projection: new OpenLayers.Projection('EPSG:2180'),
    			styleMap: stylAnalizy,
    			visibility: false,
    			opacity: 0.5,
    			isBaseLayer: false,   
    			displayInLayerSwitcher: true  			
    		}
		);
		var wlascicieleShowLyr = new OpenLayers.Layer.Vector
		("Warstwa Analiz", 
    		{
    			projection: new OpenLayers.Projection('EPSG:2180'),
    			styleMap: stylAnalizy,
    			visibility: true,
    			opacity: 0.5,
    			isBaseLayer: false,   
    			displayInLayerSwitcher: true  			
    		}
		);