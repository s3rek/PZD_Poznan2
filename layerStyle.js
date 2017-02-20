	//style renderowania feature'ów
		var stylTemp = new OpenLayers.Style({
			strokeWidth: 3,
			strokeOpacity: 1,
			strokeColor: "#00ccff",
			fillColor: "#CCCCFF",
			fillOpacity: 0.5	
			});
			
		var stylSelect = new OpenLayers.Style({
			strokeColor: "#00ccff",
			strokeWidth: 5,
			fillOpacity: 0 });
	
		var stylDzialki = new OpenLayers.StyleMap({
	    	"default": new OpenLayers.Style({
							strokeWidth: 2,
	            strokeOpacity: 1,
	            strokeColor: "#000000",
	            fillColor: "#e0e0e0",
	            fillOpacity: 0.3
				}),
				"select": stylSelect,
	      "temporary": stylTemp
		});
				
		var stylOgrody = new OpenLayers.StyleMap({
	    	"default": new OpenLayers.Style({
							strokeWidth: 2,
	            strokeOpacity: 1,
	            strokeColor: "#008000",
	            fillColor: "#e0e0e0",
	            fillOpacity: 0.3                                		                
				}),
				"select": stylSelect,
	      "temporary": stylTemp
		});
		
		var stylZdjecia = new OpenLayers.StyleMap({
	    	"default": new OpenLayers.Style({
							externalGraphic: "ikony/fullsize/${heading}.png",
							graphicHeight: 20,
							graphicWidth: 20,
							graphicOpacity: 1
				}),
				"temporary": new OpenLayers.Style({
							externalGraphic: "ikony/fullsize/${heading}.png",
							graphicHeight: 22,
							graphicWidth: 22,
							graphicOpacity: 1			
				}),
	      "select": new OpenLayers.Style({
							externalGraphic: "ikony/fullsize/${heading}.png",
							graphicHeight: 24,
							graphicWidth: 24,
							graphicOpacity: 1
				})						
		});
		
		var stylVector = new OpenLayers.StyleMap(({
	    	"default": new OpenLayers.Style
	    	(
	    		null, 
	    		{
	        	rules: 
	        	[
	          	new OpenLayers.Rule
	          	(
	          		{
	              	symbolizer: 
	              	{
	                	"Point": 
	                	{
	                  	pointRadius: 5,
	                    graphicName: "square",
	                    fillColor: "red",
	                    fillOpacity: 0.25,
	                    strokeWidth: 1,
	                    strokeOpacity: 1,
	                    strokeColor: "#333333"
	                  },
										"Line": 
										{
	                  	strokeWidth: 3,
	                  	strokeOpacity: 1,
	                  	strokeColor: "#666666"
	                  },
	                  "Polygon": 
	                  {
											strokeWidth: 2,
	                    strokeOpacity: 1,
	                    strokeColor: "#000000",
	                    fillColor: "#e0e0e0",
	                    fillOpacity: 0.3                                		
	                	}                  
									}
	              }
	            )
						]
					}
				),
				"select": stylSelect,
	      "temporary": stylTemp
			}));
		
		var stylBuffer = new OpenLayers.StyleMap(
			new OpenLayers.Style({
				strokeWidth: 1,
				strokeOpacity: 0.5,
				strokeColor: "#FF0000",
				strokeDashstyle: 'longdashdot',
				fillColor: "#FF0000",
				fillOpacity: 0.05
			}));		

		var stylAnalizy = new OpenLayers.StyleMap({
			  "default": new OpenLayers.Style({
						strokeWidth: 6,
	          strokeOpacity: 0.8,
	          strokeColor: "#9900FF",
	          strokeDashstyle: 'solid',
	          fillColor: "#FF0000",
	          fillOpacity: 0
				}),
				"temporary": new OpenLayers.Style({
						strokeWidth: 4,
	          strokeOpacity: 0.5,
	          strokeColor: "#6666FF",
	          strokeDashstyle: 'dash',
	          fillColor: "#FF0000",
	          fillOpacity: 0.0
				}),
				"select": new OpenLayers.Style({
						strokeWidth: 14,
	          strokeOpacity: 0.6,
	          strokeColor: "#6666FF",
	          strokeDashstyle: 'dashdot',
	          fillColor: "#FF0000",
	          fillOpacity: 0.0
				})
		});	