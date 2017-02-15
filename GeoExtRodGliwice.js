//zabazpieczenie java skrypt przed xmlhttprequest ze zdalnej domeny
OpenLayers.ProxyHost= "proxy.php?url=";

//trzeba zdefiniowac uklad
Proj4js.defs["EPSG:2180"] = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs";

//no-comment
var mapPanel, warstwyPanel, warstwyDodatkowe, map, wfsDzialki, wfsOgrody, measureControls, desc, logBttn, _usr, _upr, popup, aktywnyOgrod, nenene, mapPanel1, printDialog;



document.onmousedown = log_now;

function log_now(){ 
	if((getCookie('upr')) && (getCookie('usr'))){
		now = new Date();
		setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
		setCookie('usr',getCookie('usr'),(15*60*1000));
		setCookie('upr',getCookie('upr'),(15*60*1000));
	}

}
var wyjsciowyHTML =         
		"<div id=\"pomoc\">"+ 	      		
    		"<h1>Jak zacz¹æ?</h1>"+
	         "<p>"+
	           		"Wybieraj¹c odpowiedni panel (po prawej stronie) ekranu odnajdŸ ogród.</br></br>"+
	           		"Wybieraj¹c panel warstw w³¹czasz lub wy³¹czasz elementy mapy.</br></br>"+
	           		"Wybieraj¹c panel analiz zadasz pytania mapie.</br></br>"+
	           		"Po zalogowaniu siê uzyskasz dostêp do dodatkowych funkcji."+
	           "</p>"+
	   "</div>";

var analizaDzialkiWolneHTML = 
		"<div id=\"Pomoc\">"+ 	      		
    		"<h1>Wyszukiwanie wolnych dzia³ek</h1>"+
	         "<p>"+
	           		"Wybieraj¹c zak³adke 'Dzia³kiWolne' przechodzisz do tabeli dzia³ek wolnych.</br></br>"+
	           		"Mo¿esz sprawdziæ gdzie znajduj¹ siê wolne dzia³ki i odszukaæ je korzystaj¹c z panelu akcji.</br></br>"+
	           		"Warstwe dzia³ek wolnych mo¿na w³¹czaæ/wy³¹czaæ w panelu warstw.</br></br>"+
	           "</p>"+
	   "</div>";
	   
var analizaDzialkiNiewymiaroweHTML = 
		"<div id=\"Pomoc\">"+ 	      		
    		"<h1>Wyszukiwanie niewymiarowych dzia³ek (powy¿ej 500 m&sup2) </h1>"+
	         "<p>"+
	           		"Wybieraj¹c zak³adke 'Dzia³kiNiewymiarowe' przechodzisz do tabeli dzia³ek niewymiarowych.</br></br>"+
	           		"Mo¿esz sprawdziæ gdzie znajduj¹ siê niewymiarowe dzia³ki i odszukaæ je korzystaj¹c z panelu akcji.</br></br>"+
	           		"Warstwe dzia³ek niewymiarowych mo¿na w³¹czaæ/wy³¹czaæ w panelu warstw.</br></br>"+
	           "</p>"+
	   "</div>";

var analizaDokumentyHTML = 
		"<div id=\"Pomoc\">"+ 	      		
    		"<h1>Podgl¹d dokumentów dotycz¹cych ogrodu </h1>"+
	         "<p>"+
					"Wybieraj¹c zak³adkê 'DokumentyOgrodu' przechodzisz do listy dostêpnych dokumentów dotycz¹cych aktywnego ogrodu.</br></br>"+
	           		"Mo¿esz wybraæ interesuj¹cy Ciê dokument aby podejrzeæ jego zawartoœæ w nowej karcie przegl¹darki.</br></br>"+
	           		"Po zmianie aktywnego ogrodu zak³adka 'DokumentyOgrodu' zniknie.</br></br>"+
	           		
	           		
	           "</p>"+
	   "</div>";
var dodawanieZdjecHTML = 
		"<div id=\"Pomoc\">"+ 	      		
    		"<h1>Dodawanie zdjêæ</h1>"+
	         "<p>"+
	           		"Aby dodaæ zdjêcie nale¿y wybraæ kierunek w jakim by³o ono robione.</br></br>"+
	           		"Kolejnym krokiem jest wybranie pliku znajduj¹cego siê na dysku oraz dodanie opisu.</br></br>"+
					"Zdjêcie mo¿e zostaæ dodane tylko na obszarze ogrodu.</br></br>"+
					"Dodawane zdjêcie nie mo¿e przekroczyæ wielkoœci 5MB.</br></br>"+
	           "</p>"+
	   "</div>";
	   
//definiujemy klase kontrolki do zdarzen 'klik'
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
		defaultHandlerOptions: {
				'single': false,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
		},
		handleRightClicks:true,
		initialize: function(options) {
				this.handlerOptions = OpenLayers.Util.extend(
						{}, this.defaultHandlerOptions
				);
				OpenLayers.Control.prototype.initialize.apply(
						this, arguments
        ); 
        this.handler = new OpenLayers.Handler.Click(
        		//this.handler = new OpenLayers.Handler.Click(this, this.eventMethods, this.handlerOptions)
        		this, {
            		'click': this.onClick,
                'dblclick': this.onDblclick,
                'rightclick': this.onRightclick
						}, this.handlerOptions
				);
		},
		onRightclick: function(e) {
				//zrob cos (klikniecie prawym przyciskiem myszy)
		}
});


	




function setCookie(name,value,days) {
	//alert(days);
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}


	
function liczCzas() {
now = new Date();
rok = now.getFullYear();
miesiac = now.getMonth();
dzien = now.getDate();
godzina = now.getHours();
minuty = now.getMinutes();
sekundy = now.getSeconds();
minuty = minuty+65;
time_to = getCookie('time_to_log');
//alert(time_to);
if(((time_to*1000) - now.getTime())>0 && time_to!=null){
	;
}else{	
	
	if(getCookie('zatrzymaj')!='stop'){
		loginRepeat.show();
	}
}
time_to = getCookie('time_to_log');
to = new Date(rok,miesiac,dzien,godzina,minuty,sekundy);
ile = (time_to*1000) - now.getTime();


godzin = Math.floor(ile / (1000 * 60 * 60));
minut = Math.floor(ile / (1000 * 60)-godzin*60);
sekund = Math.floor(ile / 1000 - godzin*60*60 - minut*60);

if (ile > 0) {
document.getElementById('time').innerHTML = 'Zostaniesz wylogowany za: '+minut+' minut, '+sekund+' sekund';
} else {
document.getElementById('time').innerHTML = 'Nie jesteœ zalogowany';
}

}
if((getCookie('upr')) && (getCookie('usr'))){
	var animeInt;
	clearInterval(animeInt);
	animeInt = setInterval("liczCzas()", 1000);	 

}
	
	var login3 = new Ext.FormPanel({  
 
    defaults:{xtype:'textfield'},   //component by default of the form  
    bodyStyle:'padding: 10px', //adding padding for the components of the form  
    html: 'Jeœli chcesz nadal korzystaæ z dodatkowych funkcji portalu zaloguj siê ponownie', //<-- in the next step we will remove this property  
	buttons:[{        	        	
            text:'Zamknij',
            formBind: true,
            handler:function(){
			now = new Date();
						setCookie('zatrzymaj','stop',0);
						//wczytanieDodatkowe();   	
				        loginRepeat.hide();
				         document.location.reload();       
        		}
        }]
});  
  

var loginRepeat = new Ext.Window({
    	title:'Zosta³eœ wylogowany',
        layout: 'fit',
        width: 250,
        height: 135,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [login3]
    });   

//definiujemy klase usuwania elementu
var DeleteFeature = OpenLayers.Class
(
		OpenLayers.Control, 
		{
				onDelete: function() {},
				initialize: function(layers, options) 
				{
						OpenLayers.Control.prototype.initialize.apply(this, [options]);
		       	this.initLayer(layers);
		       	this.handler = new OpenLayers.Handler.Feature
						(
								this, this.layer, {click: this.clickFeature}
						);
		    },
		    //root container - warstwa ktora z tablicy warstw tworzy jedna (logiczna) aby przypisac jadna kontrolke
				initLayer: function(layers) {
		        if(OpenLayers.Util.isArray(layers)) {
		            this.layers = layers;
		            this.layer = new OpenLayers.Layer.Vector.RootContainer(
		                this.id + "_container", {
		                    layers: layers
		                }
		            );
		        } else {
		            this.layer = layers;
		        }
		    },	    
				clickFeature: function(feature) 
				{
		    		if(feature.fid == undefined) 
		     		{
								this.layer.destroyFeatures([feature]);
		      	} 
		      	else 
		      	{
		      			feature.state = OpenLayers.State.DELETE;
		      			//ten trigger zalatwia wszystko (wyrzucenie elementu z flaga DELETE)
		        		feature.layer.events.triggerEvent
		        		(
		        				"afterfeaturemodified",
		          			{feature: feature}
								);
						}
						this.onDelete.call(this.scope, feature);
				},
				setMap: function(map) 
				{
						this.handler.setMap(map);
						OpenLayers.Control.prototype.setMap.apply(this, arguments);
				},
		    CLASS_NAME: "OpenLayers.Control.DeleteFeature"
		}
);
		
		
		

 




//klasa uprawnienia
function uprawnienia(upr){
		this.upr  = upr;
		
		//oddaj liste 'gid' rozdzielonych przecinkami z uprawnien
		//w zaleznosci od rodzaju uprawnien (u,o,d)
		this.getGid = function(rodzaj_gid) {  
				var uprArr = this.upr.split(",");
				var zestGid = 0;
				for (var i = 0; i < uprArr.length; i++) {
						var r = uprArr[i].charAt(0);
						if (r == rodzaj_gid)
						{
								var gid = uprArr[i].substring(uprArr[i].indexOf('_') + 1, uprArr[i].indexOf('.'));
								zestGid = zestGid + "," + gid
						}
				}
				return zestGid;
	  }
	  
	  //oddaj tablice gdzie rekordem jest tablica [poziom, rodzaj uprawnien]
	  //[[gid_delegatury, rodzaj_uprawnien],[1, 'z']]
		//parametr idx_rodzaj_upr (patrz baza danych): 0-dzialki, 1-ogrody, 2-inneElementy
	  this.getGidUpr = function(rodzaj_gid, idx_rodzaj_upr) {
	  		var uprArr = this.upr.split(",");
	  		var zestGidUpr = new Array();	
	  		for (var i = 0; i < uprArr.length; i++) {
						var r = uprArr[i].charAt(0);
						if (r == rodzaj_gid)
						{
								//kroi dla poszczegolnych rekordow uprArr stringa "z|o|o|o|z|b" i wrzuca do tabeli rodzajUprArr
								//po idx_rodzaj_upr rozrozniamy czego sie tycza upranienia
								/*
											z| - edycja atrybutów dzia³ek
											o| - odczyt atrybutów ogrodu
											o| - odczyt atrybutów obiektow wrysowanych
											z| - tworzenie zjdec i geometrii w buforze
											z| - edycja geometrii 
											b| - raporty
											
											z-edycja, o-odczyt, b-brak
											
								*/
								var rodzajUprArr = uprArr[i].substring(uprArr[i].indexOf('.') + 1).split("|");
																
								var g = uprArr[i].substring(uprArr[i].indexOf('_') + 1, uprArr[i].indexOf('.'));
								var u = rodzajUprArr[idx_rodzaj_upr];
								
								//wrzuca do tablicy dwuwymiarowej gid elementu (np. gid delegatury)
								//oraz uprawnienia do konkretnej dziedziny (np. edycja dzialek rodzinnych)
								var gNu = [g, u];	
								
								//wrzuca powyzsza tablice do tablicy wynikowej															
								zestGidUpr.push(gNu);
						}
				}
				return zestGidUpr;
	  }
	  
	  //dam ci gid, rodzaj_obiektu(d,o,u), do_czego (pozycja w tablicy uprawnien patrz wyzej 0 - dzialka 1 - ogrod itp) a ty mi zwroc uprawnienia
	  this.getUprEl = function(gid, rodzaj_gid, idx_rodzaj_upr){
	  		var wynik = "b";
	  		var uprArr = this.upr.split(",");  		
	  		//alert(uprArr);
	  		for (var i = 0; i < uprArr.length; i++) {
						var r = uprArr[i].charAt(0);
						var g = uprArr[i].substring(uprArr[i].indexOf('_') + 1, uprArr[i].indexOf('.'));
						if ((r == rodzaj_gid) && (g == gid))
						{
								var rodzajUprArr = uprArr[i].substring(uprArr[i].indexOf('.') + 1).split("|");																								
								wynik = rodzajUprArr[idx_rodzaj_upr];
						}
				}
				return wynik;	  			
	  }
}








showSpinner = function(){
		//wchodzi tu gdy zaczyna mielic ajax.request
		var loadingMask = Ext.get('loading-mask');
		loadingMask.setOpacity(0.5);
		Ext.get('loading').show();
		loadingMask.show();			
}

hideSpinner = function(){
		//wchodzi tu gdy konczy mielic ajax.request
		Ext.get('loading').hide();
		Ext.get('loading-mask').fadeOut({remove:false});		
}
		



//po wczytaniu wszytkich obiektow DOM - ExtJS rusza
Ext.onReady(function() {
		//wczytywanie strony loading mask
		//setTimeout(function(){
				//Ext.get('loading').remove();
				//Ext.get('loading-mask').fadeOut({remove:true});
				//Ext.get('loading').hide();
				//Ext.get('loading-mask').fadeOut({remove:false});				
		//}, 1250);


		function addLay(){
		//alert('a');
		Ext.Ajax.request({
			url: 'test2.php',
			success: function(objServerResponse, opts) {
				var odp = Ext.decode(objServerResponse.responseText);
				//alert('ssa');
			}
		})
	}
		//addLay();
	//	Ext.Msg.alert('Status', warstwyDodatkowe, function(btn, text){			 				                					                    
	//				                });	
		//oprogramowanie zdarzen ajax.request
    Ext.Ajax.on('beforerequest', showSpinner, this);
    Ext.Ajax.on('requestcomplete', hideSpinner, this);
    Ext.Ajax.on('requestexception', hideSpinner, this);


	//parser warstw dodatkowych z cookie
	if( getCookie('warstwa')){
		
		var warstwazcookie = getCookie('warstwa');
		var arraywarstwa = warstwazcookie.split("");
		
		var tempwarstwa = "";
		var wararray = new Array();
		var numarray = 0;
		for(var a=0;a<arraywarstwa.length;a++){
			if(arraywarstwa[a]!="*"){
				tempwarstwa +=arraywarstwa[a];
			}else{
				wararray[numarray] = tempwarstwa;
				numarray++;
				tempwarstwa = "";
			}
		}
	

		var wmszcookie = getCookie('WMS');
		var arraywms = wmszcookie.split("");

		var tempwms = "";
		var wmsarray = new Array();
		numarray = 0;

		for(var a=0;a<arraywms.length;a++){
			if(arraywms[a]!="*"){
				tempwms +=arraywms[a];
			}else{
				wmsarray[numarray] = tempwms;
				numarray++;
				tempwms = "";
			}
		}

		var layerzcookie = getCookie('podwarstwy');
		//alert(layerzcookie);
		var arraylayer = layerzcookie.split("");
		//alert(layerzcookie.split(""));

		var templayer = "";
		var templayersmall = "";
		var layerarray = new Array();
		numarray = 0;
		numarraysmall = 0;
		for(var a=0;a<arraylayer.length;a++){
			if(arraylayer[a]!="%"){
				templayer +=arraylayer[a];
			}else{
				if(arraylayer[a+1]=="2"){
					
					templayer = templayer.split("");
					layerarray[numarray] = new Array();
					//alert(templayer[1]);
					
					for(var b = 0;b<templayer.length;b++){
						if(templayer[b]!="%"){
							templayersmall = templayersmall + templayer[b];
						}
						else{
							//alert(templayersmall);
							layerarray[numarray][numarraysmall] = templayersmall;
							b+=2;
							
							numarraysmall++;
							templayersmall = "";
						}
						
					}
					templayersmall = "";
					a+=2;
					//layerarray[numarray] = templayer;
					numarray++;
					numarraysmall=0;
					templayer = "";
				}else{
					templayer +=arraylayer[a];
				}
			}
		}
	}
	
		//alert(layerarray[0]);
		//		alert(layerarray[1]);


		//uaktywnianie opcji z dymkami pomocy 'tooltip'
		Ext.QuickTips.init();	      
        
        
        
        
	  //kontrolka siatki kartograficznej       	
		var siatka = new OpenLayers.Control.Graticule
		(
				{
						//displayInLayerSwitcher: false,						
			      numPoints: 2, 
			      labelled: true,
			      labelFormat: 'dms',
			      labelSymbolizer:
			      {
				      	fontColor: "DarkBlue",
				        fontFamily: "sans-serif, tahoma",
				        fontSize: "10px",
				        fontWeight: "normal"
						},
						visible: false,
						layerName: 'Siatka Kartograficzna',
						targetSize: 800
				}
		);
		
		
		
		
		
		//wylaczenie zoom-in po double-klik
		var nawigacja = new OpenLayers.Control.Navigation({
			defaultDblClick: function(event) { return; }
		});
		
		
		
		
		
		
		//ustawienia inicjalizujace mapy
		var opcjeMapy = 
		{ 
				projection: 'EPSG:900913',
				displayProjection: new OpenLayers.Projection("EPSG:4326"),
				maxResolution: 156543.0339,
				maxExtent: new OpenLayers.Bounds
				(
						-128*156543.0339, 
						-128*156543.0339, 
						128*156543.0339, 
						128*156543.0339
				),
				units: 'm',			
				numZoomLevels: 22,
				allOverlays: false,	
				controls: 
				[
						siatka,
						nawigacja,
						new OpenLayers.Control.Scale(),
						new OpenLayers.Control.MouseDefaults(), 
						new OpenLayers.Control.MousePosition()
						//new OpenLayers.Control.KeyboardDefaults({autoActive: false}),							
				]									
		};		
		
		
		
		
		
		//deklaracja mapy
		map	=	new	OpenLayers.Map(opcjeMapy);
	
		

		
		
		

		
		
		//mierzenie		
		
		
/*

            var sketchSymbolizers = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#333333"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    strokeDashstyle: "dash"
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "white",
                    fillOpacity: 0.3
                }
            };
            var style = new OpenLayers.Style();
            style.addRules([
                new OpenLayers.Rule({symbolizer: sketchSymbolizers})
            ]);
            var styleMap = new OpenLayers.StyleMap({"default": style});
            
*/
		
		
		
		
	
	
		
		
		
		desc = document.getElementById('desc');
            	
            	
     	
        	
            	
            	
            		
		function handleMeasurements(event) {				
				var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var out = "";
        if(order == 1) {
        		out += "d³ugoœæ: " + measure.toFixed(3) + " " + units;
        } else {
        		out += "powierzchnia: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
        }
        Ext.getCmp('okno-mierzenia').update(out);
		}



		var winMeasure = new Ext.Window(
    {
    	  id: 'okno-mierzenia',
    		title:'Pomiar',
        layout: 'fit',
        width: 170,
        height: 70,
        resizable: false,
        modal: false,
        closeAction: 'hide'
    });



    





		///DRUKOWANIE!!!!!!



    /*var printProvider = new GeoExt.data.PrintProvider({
        method: "GET", // "POST" recommended for production use
        capabilities: printCapabilities, // from the info.json script in the html
        customParams: {
            mapTitle: "Printing Demo"
        },
        listeners:{
        		"print": function(printProvider,url) {
            		alert("Mapa wygenerowana pomyœlnie.");
						},
            "printexception": function(printProvider,response) {
            		alert("Wyst¹pi³ b³ad: " + response.statusText);
            }
        } 
    });
	*/
	var printProvider = new GeoExt.data.PrintProvider({
        method: "GET", // "POST" recommended for production use
        capabilities: printCapabilities, // provide url instead for lazy loading
        customParams: {
            mapTitle: "GeoExt Printing Demo",
            comment: "This demo shows how to use GeoExt.PrintMapPanel"
        }
    });
    
    
    printPage = new GeoExt.data.PrintPage({
        printProvider: printProvider
    });

    var pageLayer = new OpenLayers.Layer.Vector
    ("RamkaDruk", 
    		{
    			projection: new OpenLayers.Projection('EPSG:4326'),
    			displayInLayerSwitcher: false,
    			visibility: false
    		}
    );
    
    pageLayer.addFeatures(printPage.feature);

		
		function druk()	{
				//alert('rozpoczecie drukowania')
				pageLayer.setVisibility(true)
				rightPanel.contentEl = "";
				drukPanel.show();
				var _drukPanel = drukPanel.cloneConfig();
				rightPanel.add(drukPanel.cloneConfig());
				rightPanel.doLayout();
				Ext.getCmp('panel-pomocy').update(
						"<div id=\"pomoc\">"+ 	      		
		        		"<h1>Drukowanie</h1>"+
					         "<p>"+
					           		"Wybieraj¹c opdowiednie opcje z panelu 'Drukowanie' dostosuj wydruk.</br></br>"+
					           		"Na mapie pojawia siê prostok¹t symbolizuj¹cy obszar wydruku.</br></br>"+
					           		"(Us³uga w budowie).</br></br>"+
					           "</p>"+
					   "</div>");
				
				//var bounds = printPage.feature.geometry.getBounds();
        //map.zoomToExtent(bounds);
		}
		
		function dedruk() {
				rightPanel.remove(rightPanel.getComponent("panel-drukowania"));
				Ext.getCmp('panel-pomocy').update(wyjsciowyHTML);
				pageLayer.setVisibility(false)
		}
		
		
		//panel drukowania
    var drukPanel = new Ext.form.FormPanel({
    		itemId: "panel-drukowania",
        title: "Drukowanie",
        bodyStyle: "padding:20px",
				bodyBorder: false,
        labelAlign: "top",
        defaults: {anchor: "100%"},
        items: [{
            xtype: "textarea",
            name: "Comment",
            value: "",
            fieldLabel: "Komentarz",
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: printPage
            })
        }, {
            xtype: "combo",
            store: printProvider.layouts,
            displayField: "name",
            fieldLabel: "Papier",
            typeAhead: true,
            mode: "local",
            triggerAction: "all",
            plugins: new GeoExt.plugins.PrintProviderField({
                printProvider: printProvider
            })
        }, {
            xtype: "combo",
            store: printProvider.dpis,
            displayField: "name",
            fieldLabel: "Rozdzielczoœæ",
            tpl: '<tpl for="."><div class="x-combo-list-item">{name} dpi</div></tpl>',
            typeAhead: true,
            mode: "local",
            triggerAction: "all",
            plugins: new GeoExt.plugins.PrintProviderField({
                printProvider: printProvider
            }),
            // the plugin will work even if we modify a combo value
            setValue: function(v) {
                v = parseInt(v) + " dpi";
                Ext.form.ComboBox.prototype.setValue.apply(this, arguments);
            }
        }, {
            xtype: "combo",
            store: printProvider.scales,
            displayField: "name",
            fieldLabel: "Skala",
            typeAhead: true,
            mode: "local",
            triggerAction: "all",
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: printPage
            })
        }, {
            xtype: "textfield",
            name: "rotation",
            fieldLabel: "Obrót",
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: printPage
            })
        }],
        buttons: [{
            text: "Stwórz PDF",
            handler: function() {
            		//printPage.fit(mapPanel, true);
                printProvider.print(mapPanel, printPage);
            }
        }]
    });

    map.events.register('moveend', this, function() {
    		printPage.fit(mapPanel, {mode: "screen"});
    });
    
    
    
    
    
    		
		

		
		//wybieralnik skali w pasku dolnym mapy
    var scaleStore = new GeoExt.data.ScaleStore({map: map});
	
    var zoomSelector = new Ext.form.ComboBox({
        store: scaleStore,
        emptyText: "Zoom Level",
        tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
        editable: false,
        triggerAction: 'all', // needed so that the combo box doesn't filter by its current content
        mode: 'local' // keep the combo box from forcing a lot of unneeded data refreshes
    });
    zoomSelector.on('select', 
        function(combo, record, index) {
            map.zoomTo(record.data.level);
        },
        this
    );     
    map.events.register('zoomend', this, function() {
        var scale = scaleStore.queryBy(function(record){
            return this.map.getZoom() == record.data.level;
        });

        if (scale.length > 0) {
            scale = scale.items[0];
            zoomSelector.setValue("1 : " + parseInt(scale.data.scale));
        } else {
            if (!zoomSelector.rendered) return;
            zoomSelector.clearValue();
        }
    });
			
		
		
		
		
		
		
		
		//narzedziowka
		//narzedzia podstawowe - dostepne dla wszystkich (podpinamy czesc kontrolek)
		var n1 = new Ext.ButtonGroup({
				xtype: 'buttongroup',
		    title: 'Narzêdzia Podstawowe',
		    region: 'east',
		    items: [		    
						new GeoExt.Action({
								//control: new OpenLayers.Control.Navigation({	defaultDblClick: function(event) { return; }	}),
								control: new OpenLayers.Control.DragPan({	isDefault: true	}),
								map: map,				
								scale: 'large',
								iconCls: 'pan-icon',
								iconAlign: 'top',
								toggleGroup: 'nawigacja',
								tooltip: 'Przesuwanie Mapy',
								allowDepress: false	
						}),
				{
		        scale: 'large',
		        iconCls: 'select-icon',
		        iconAlign: 'top',
		        toggleGroup: 'nawigacja',
		        tooltip: 'Wybór Elementu',
		        allowDepress: false,
		        pressed: true,
		        toggleHandler: function(e){
		        		//wlaczanie lub wylaczanie kontrolek odpowiedzialnych za podswietlanie klikanie elementow
		        		toggleSelectControls()
		        }
				},
						new GeoExt.Action({
								control: new OpenLayers.Control.ZoomBox(),
								map: map,
				        scale: 'large',
				        iconCls: 'zoom-in-icon',
				        iconAlign: 'top',
				        toggleGroup: 'nawigacja',
				        tooltip: 'Przybli¿anie',
				        allowDepress: false
				        //group: 'draw'
				    }),
						new GeoExt.Action({
								control: new OpenLayers.Control.ZoomBox({	out: true	}),
								map: map,
				        scale: 'large',
				        iconCls: 'zoom-out-icon',
				        iconAlign: 'top',
				        toggleGroup: 'nawigacja',
				        tooltip: 'Oddalanie',
				        allowDepress: false
				    }),		        
						new GeoExt.Action({
								control: new OpenLayers.Control.Measure(
										OpenLayers.Handler.Path, {
												persist: true,
												handlerOptions: 
												{
														layerOptions: 
														{
																//renderers: renderer,
																//styleMap: styleMap
														}
												},
												eventListeners:
												{
                    				measure: handleMeasurements,
                    				measurepartial: handleMeasurements														
												},
												geodesic: true
										}									
								),
								map: map,
								scale: 'large',
				        iconCls: 'length-measure-icon',
				        iconAlign: 'top',
				        toggleGroup: 'nawigacja',
				        tooltip: 'Zmierz D³ugoœæ',
				        allowDepress: false,
				        toggleHandler: function(button, state){
				        		if (state == true ) {	
				        				//Ext.getCmp('okno-mierzenia').update("mierz..."); 
				        				winMeasure.show() }
				        		else { winMeasure.hide() }
		        		}
				    }),		        
						new GeoExt.Action({			
								control: new OpenLayers.Control.Measure(
										OpenLayers.Handler.Polygon, {
												persist: true,
												handlerOptions: 
												{
														layerOptions: 
														{
																//renderers: renderer,
																//styleMap: styleMap
														}
												},
												eventListeners:
												{
                    				measure: handleMeasurements,
                    				measurepartial: handleMeasurements														
												},
												geodesic: true
										}									
								),							
								map: map,	
								scale: 'large',
				        iconCls: 'area-measure-icon',
				        iconAlign: 'top',
				        toggleGroup: 'nawigacja',
				        tooltip: 'Zmierz Powierzchniê',
				        allowDepress: false,
				        toggleHandler: function(button, state){
				        		if (state == true ) {	
				        				winMeasure.show() }
				        		else { winMeasure.hide() }
		        		}				        
				    }),				        
				{
						scale: 'large',
		        iconCls: 'print-icon',
		        iconAlign: 'top',
		        toggleGroup: 'nawigacja',
		        toggleHandler: function(button, state){
		        		if (state == true ) {	druk()	}
		        		else { dedruk() }
		        },
		        tooltip: 'Drukowanie Mapy',
		        allowDepress: false
				},
				{
		        scale: 'large',
		        iconCls: 'help-icon',
		        iconAlign: 'top',
		        tooltip: 'Pomoc',
		        enableToggle: true,
		        toggleHandler: function(button, state){
		        		if (state == true ) {
										rightPanel.add(pomocPanel);  			
		        				pomocPanel.show()
		        		}
		        		else { 
		        				rightPanel.remove(pomocPanel, false);
		        				pomocPanel.hide() 
		        		}
		        },
		        pressed: true
				}]		
		});

		
		
		
		
		
		
		function tabPomoc() {
						pomocPanel.show()
		}
				
		
		
		
		
		
		
		
		function detabPomoc() {
				//rightPanel.remove(rightPanel.getComponent("panel-pomocy"));
				//Ext.getCmp('panel-pomocy').update(wyjsciowyHTML);
				//pageLayer.setVisibility(false)
		}
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
		
		
		
		
		
		
		
		
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! STYLE
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/			
		
		
		
		
		
		
		     
		
		
		
		//style renderowania feature'ów
		stylTemp = new OpenLayers.Style({	strokeWidth: 3, strokeOpacity: 1, strokeColor: "#00ccff", fillColor: "#CCCCFF", fillOpacity: 0.5	});
		stylSelect = new OpenLayers.Style({	strokeColor: "#00ccff", strokeWidth: 5, fillOpacity: 0 });
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
	            strokeColor: "#000000",
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
		
		var stylVector = new OpenLayers.StyleMap(
		(
			{
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
			}
		));
		
		var stylBuffer = new OpenLayers.StyleMap(
				new OpenLayers.Style({
						strokeWidth: 1,
	          strokeOpacity: 0.5,
	          strokeColor: "#FF0000",
	          strokeDashstyle: 'longdashdot',
	          fillColor: "#FF0000",
	          fillOpacity: 0.05
				})
		);		

		var stylAnalizy = new OpenLayers.StyleMap({
			  "default": new OpenLayers.Style({
						strokeWidth: 10,
	          strokeOpacity: 0.5,
	          strokeColor: "#9900FF",
	          strokeDashstyle: 'dash',
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

    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Nasz WMS
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/			
		
		
		
		
		
		//warstwy
		//Warstwy do warstwy grupowej
		var	unimap_wms = new OpenLayers.Layer.WMS
		( 
				"Unimap WMS", 
				"http://unimap.dyndns.biz/cgi-bin/mapserv?map=/gis01/unimap.map", 
				{				
						layers:	[
								'gminy_slask',
								'gminy', 
								'powiaty', 
								'wojewodztwa'					
						],
						format: 'image/gif',					
						'transparent': true,
						tileSize: new OpenLayers.Size(400,400)
				}, 
				{
						visibility: false,
						isBaseLayer: false,
						displayInLayerSwitcher: false
				}
		);
		
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
				

		/*		var	um_wms0 = new OpenLayers.Layer.WMS
				( 
					"UM Gliwice1", 
					"http://msip-mapa.um.gliwice.pl/portal/isdp/scripts/isdp.dll/wms/1.1.1", 
					{				
							layers:	[								
									'ulice',
									'eg_dzialki',
									'pkt_adr_auto',
									'vec_gr_miasta',
									'eg_budynki',
									'eg_obreb',
									'vec_osiedle'
									
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
					}
				);
*/
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
		
		var	um_wms = new OpenLayers.Layer.WMS
		( 
				"UM Gliwice", 
				"http://msip-mapa.um.gliwice.pl/portal/isdp/scripts/isdp.dll/wms/1.3.0", 
				{				
						layers:	[								
								'ulice',
								'eg_dzialki',
								'pkt_adr_auto',
								'vec_gr_miasta',
								'eg_budynki',
								'eg_obreb',
								'vec_osiedle'
								
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
				}
		);
		/*
		var	um_wms1 = new OpenLayers.Layer.WMS
		( 
				"UM Gliwice1", 
				"http://msip-mapa.um.gliwice.pl/portal/isdp/scripts/isdp.dll/wms/1.1.1", 
				{				
						layers:	[								
								'ulice',
								'eg_dzialki',
								'pkt_adr_auto',
								'vec_gr_miasta',
								'eg_budynki',
								'eg_obreb',
								'vec_osiedle'
								
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
				}
		);
		*/
		
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Podklady mapowe
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/			
		
		
		
		
		

			
			
			
		var gmap_d = new OpenLayers.Layer.Google
		(
				"Google Drogi", 
				{
						isBaseLayer: true,
						visibility: false
				}
		);
		var gmap_h = new OpenLayers.Layer.Google
		(
				"Google Hybryda", 
				{
						type: google.maps.MapTypeId.HYBRID, 
						isBaseLayer: true
				}
		);		
		var	topo50_wms = new OpenLayers.Layer.WMS
		( 
				"Mapa Topograficzna", 
				"http://unimap.dyndns.biz/cgi-bin/mapserv?map=/gis01/unimap.map", 
				{				
						layers:	'topo50', 
						format: 'image/gif',					
						'transparent': true,
						tileSize: new OpenLayers.Size(400,400)
				}, 
				{
						isBaseLayer: true,
						visibility: false
				}
		);



				
				
				
				
				
				
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Dzialki, ogrody
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/					
				
				
				
		//warstwy 
		//warstwa dzia³ek 
	 	var saveStrategyDzialki = new OpenLayers.Strategy.Save({auto: true});
		wfsDzialki = new OpenLayers.Layer.Vector
		("Dzia³ki Rodzinne", 
				{
			  		strategies: [new OpenLayers.Strategy.Fixed(), saveStrategyDzialki],
			    	projection: new OpenLayers.Projection('EPSG:2180'),
			    	styleMap: stylDzialki,
			    	minScale: 20000,
			    	visibility: true,
			    	opacity: 0.5,  				
			    	protocol: new OpenLayers.Protocol.WFS
			    	(
				    		{
					      		version: "1.0.0",
					        	srsName: "EPSG:2180",
					        	url: "http://127.0.0.1:8081/geoserver/wfs",
					        	featureType: "dzialki",
					        	featureNS: "RODPOZNAN"
				      	}
			    	),
			    	isBaseLayer: false,
			    	filter: new OpenLayers.Filter.Comparison
						(
								{
		            		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		              	property: "id_ogrodu",
		              	value: "null"
								}
						)	    					                                    	
				}
		);
		
		
		
		
		
		
		
		
		
		
		//warstwa ogrodow 
	 	var saveStrategyOgrody = new OpenLayers.Strategy.Save({auto: true});
		
		wfsOgrody = new OpenLayers.Layer.Vector
		("Ogrody Rodzinne", 
				{
			  		strategies: [new OpenLayers.Strategy.Fixed(), saveStrategyOgrody],
			    	projection: new OpenLayers.Projection('EPSG:2180'),
						styleMap: stylOgrody,
			    	visibility: true,
			    	opacity: 0.5,  				
			    	protocol: new OpenLayers.Protocol.WFS
			    	(
				    		{
					      		version: "1.0.0",
					        	srsName: "EPSG:2180",
					        	url: "http://127.0.0.1:8081/geoserver/wfs",
					        	featureType: "ogrody",
					        	featureNS: "RODPOZNAN"
				      	}
			    	),
			    	filter: new OpenLayers.Filter.Comparison
						(
								{
		            		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		              	property: "id_miasta",
		              	value: "null"
								}
						),
            eventListeners: {
                "featuresadded": ogrodyLoaded
            },						
			    	isBaseLayer: false	    		    		    	                                       	
				}
		);	
		
		
		
		
		
		
		
		//powieksz do zasiegu warstwy (rowniez po zmianie filtra)
		function ogrodyLoaded(){
				map.zoomToExtent(wfsOgrody.getDataExtent());
		}

		



    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! COOOKKKKIEEEEE
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/	


 //czyta ciasteczko o nazwie name
		function readCookie(name)
		{
			console.log("Czytam cookie (readCookie): "+name)
	    var cookiename = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++)
	    {
	    	var c = ca[i];    	 
	    	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	    	if (c.indexOf(cookiename) == 0) return c.substring(cookiename.length,c.length);
	    }
	    return null;
		}



		 

    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Zaczytywane/wyrzucane zostaja dodatkowe
				! panele, funkcje, taby, bufor itp
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/	


		
		//opcje po zaczytaniu ustawien domyslnych (te ustawienia zalezne sa od ciasteczek)
		function wczytanieDodatkowe(){
		//alert("A");
		
		//console.log(readCookie('upr'));
		//console.log(readCookie('usr'));
		console.log("wczytaniedodatkowe()");
		
				//jest ciasteczko z uprawnieniami oraz z uzytkownikiem - wczytujemy dodatkowe opcje
		    if ((readCookie('upr')) && (readCookie('usr'))) { 
		    	logBttn.setText('Wyloguj');
				  logBttn.setIconClass('logout-icon');
				  
				  //znaczki w hex w caisteczku sie zapisaly
					var upr = readCookie('upr');
					upr = upr.replace(/%7C/g, '|');
					upr = upr.replace(/%2C/g, ',');
					//alert(upr);
					var usr = readCookie('usr');
					
					_upr = new uprawnienia(upr);
					
					//obiekt z uzytkownika tez mozna zrobic
					_usr = usr;			
					
					//wczytanie bufora edycji
					var adres = 'dajBufor.php?iddeleg=' + _upr.getGid('d') + '&idogr=' + _upr.getGid('o') + '&iddz=' + _upr.getGid('u');
					Ext.Ajax.request({
							url: adres,
							success: function(objServerResponse, opts) {									
									var odp = Ext.decode(objServerResponse.responseText);
									var _wkt = odp.message;																	
									var _feature = new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT(_wkt).transform(new OpenLayers.Projection("EPSG:2180"), map.getProjectionObject()));
									bufferLyr.removeAllFeatures();
									bufferLyr.addFeatures([_feature])									
							}
					});
					
					mapPanel.getBottomToolbar().remove(mapPanel.getBottomToolbar().getComponent("narzedzia-edycyjne"));
					rightPanel.remove(rightPanel.getComponent("panel-dokumentow"));
					//dodanie paneli
					mapPanel.getBottomToolbar().add(n2.cloneConfig());
					mapPanel.doLayout();
					console.log("Zalogowa³em DM");
		    }
		    //nie ma ciasteczka z uprawnieniami oraz z uzytkownikiem - usuwamy dodatkowe opcje
		    else {
				   console.log("Wylogowuje DM");
						logBttn.setText('Zaloguj');
						logBttn.setIconClass('login-icon');	
						login.getForm().reset();
						
						_upr = undefined;
						_usr = undefined;
						
						bufferLyr.removeAllFeatures();
						
						n1.getComponent(1).toggle(true);
						
						//odlaczenie paneli paneli
						mapPanel.getBottomToolbar().remove(mapPanel.getBottomToolbar().getComponent("narzedzia-edycyjne"));
						rightPanel.remove(rightPanel.getComponent("panel-dokumentow"));
		    }		    	
		}



		
		
		
		
		
		
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Guzik logowania (kluczyk)
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/			
		
	if ((readCookie('upr')) && (readCookie('usr'))) {	

		var logBttn = new Ext.Button({
			
				text: 'Wyloguj',
			
				border: true,
				iconCls: 'login-icon',
				//wchodzi w procedure logowania/wylogowywania sie
				handler: function(e){					
					if (this.getText() == 'Zaloguj') {
								//logowanie - pokazuje sie formularz logowania stamtad uruchomiona zostanie wczytanieDodatkowe()
		    				winLogin.show();
		    		}		    		
		    		else {
		    				//wywalamy ciasteczko
								var days = 3;
								var date = new Date();
								date.setTime(date.getTime ()+(days*24*60*60*1000));
								var cookies = document.cookie.split(";");
								for (var i = 0; i < cookies.length; i++) 
								{
						    	var cookie = cookies[i];   	
						    	var eqPos = cookie.indexOf("=");   	
						    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
						    	document.cookie = name + "=;";
								
								}
								
						   	//odswiezamy zawartosc dodatkowa strony
		    				wczytanieDodatkowe();    				
		    		}
		    }
		});
		
		}else{
			var logBttn = new Ext.Button({
			
				text: 'Zaloguj',
			
				border: true,
				iconCls: 'login-icon',
				//wchodzi w procedure logowania/wylogowywania sie
				handler: function(e){					
					if (this.getText() == 'Zaloguj') {
								//logowanie - pokazuje sie formularz logowania stamtad uruchomiona zostanie wczytanieDodatkowe()
		    				winLogin.show();
		    		}		    		
		    		else {
		    				//wywalamy ciasteczko
								var days = 3;
						  	var date = new Date();
								date.setTime(date.getTime ()+(days*24*60*60*1000));
								var cookies = document.cookie.split(";");
								for (var i = 0; i < cookies.length; i++) 
								{
						    	var cookie = cookies[i];   	
						    	var eqPos = cookie.indexOf("=");   	
						    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
						    	document.cookie = name + "=;";
								}
						   	//odswiezamy zawartosc dodatkowa strony
		    				wczytanieDodatkowe();    				
		    		}
		    }
		});
		}
		
		
		
		
		

		
		var addToolsBttn = new Ext.Button({
			
				text: 'Wczytaj narzêdzia edycyjne',
			
				border: true,
				iconCls: 'tools-icon',
				//wchodzi w procedure logowania/wylogowywania sie
				handler: function(e){		
					if (readCookie('usr')){
						wczytanieDodatkowe();    				
					}else{
						Ext.Msg.alert('Niepowodzenie!', 'Aby wczytaæ narzêdzia edycyjne zaloguj siê');
					}	
					
		    }
		});
		
		
		var addFileBttn = new Ext.Button({
			
				text: 'Dodaj pliki',
			
				border: true,
				iconCls: 'upload-icon',
				//wchodzi w procedure logowania/wylogowywania sie
				handler: function(e){			
					if (readCookie('usr')){
						winWgrajPlik.show();
					}else{
						Ext.Msg.alert('Niepowodzenie!', 'Aby dodaæ plik zaloguj siê');
					}
		    		
		    }
		});

		var addWMSBttn = new Ext.Button({
			
				text: 'Dodaj WMS',
			
				border: true,
				iconCls: 'upload-icon',
				//wchodzi w procedure logowania/wylogowywania sie
				handler: function(e){			
					if (readCookie('usr')){
						winWgrajWMS.show();
					}else{
						Ext.Msg.alert('Niepowodzenie!', 'Aby dodaæ plik zaloguj siê');
					}
		    		
		    }
		});
			
			
			
		
		
		
			
	
			
			
			
			
					
		
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! panel logowania dodawany do 'winLogin'
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/		
		
		
				
		
    var login = new Ext.FormPanel({
        labelWidth:80,
        url:'login.php',
        frame:true,
        defaultType:'textfield',
        width:300,
        height:150,
        monitorValid:true,
        items:[{
            fieldLabel:'U¿ytkownik',
            name:'uzytkownik',
            allowBlank:false
        },{
            fieldLabel:'Has³o', 
            name:'haslo',
            inputType:'password',
            allowBlank:false
        }],
        buttons:[{        	        	
            text:'Loguj',
            formBind: true,
            handler:function(){
		            login.getForm().submit({	 
		                method:'POST',
		                success: function(){
				                Ext.Msg.alert('Status', 'Poprawnie Zalogowano!', function(btn, text){		
									var animeInt;
									clearInterval(animeInt);
									animeInt = setInterval("liczCzas()", 1000);	 
				                    //if (btn == 'ok'){
				                    //    window.location = '';  //ta lokalizacja w ktorej teraz jestesmy 'zdjecia' przeniosloby do http://127.0.0.1/zdjecia
				                    //}
									//alert("aaa");
									//eraseCookie('zatrzymaj');
									setCookie('zatrzymaj',"",-1);
				                    winLogin.hide();
									alert("Zalogowa³em siê i dalej bêdzie wczytanie dodatkowe")
				                    wczytanieDodatkowe();  
				                });		 
		            		},
				            failure: function(form, action){
				                if (action.failureType == 'server') {				 
				                    Ext.Msg.alert('Niepowodzenie!', 'z³e has³o i/lub login');
				                } 
				                else {
				                    Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText);
				                }
				                login.getForm().reset();				                
				            }		 
		            });
        		}
        }]
    });		
		//login.render('loginForm');
		
		
		var winLogin = new Ext.Window(
    {
    		title:'Zaloguj siê',
        layout: 'fit',
        width: 250,
        height: 135,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [login]
    });

		
		

		




		
		
		
		


			var pointLyr = new OpenLayers.Layer.Vector
			("Warstwa Punktowa", 
					{
				    	projection: new OpenLayers.Projection('EPSG:2180'),
				    	styleMap: stylVector,
				    	visibility: true,
				    	opacity: 0.5,
				    	isBaseLayer: false
					}
			);			

			var lineLyr = new OpenLayers.Layer.Vector
			("Warstwa Liniowa", 
					{
				    	projection: new OpenLayers.Projection('EPSG:2180'),
				    	styleMap: stylVector,
				    	visibility: true,
				    	opacity: 0.5,
				    	isBaseLayer: false
					}
			);		
		
			var polyLyr = new OpenLayers.Layer.Vector
			("Warstwa Powierzchniowa", 
					{
				    	projection: new OpenLayers.Projection('EPSG:2180'),
				    	styleMap: stylVector,
				    	visibility: true,
				    	opacity: 0.5,
				    	isBaseLayer: false
					}
			);

			var kierunekLyr = new OpenLayers.Layer.Vector
			("Tymczasowa Warstwa Kierunku", 
					{
				    	projection: new OpenLayers.Projection('EPSG:2180'),
				    	visibility: true,
				    	opacity: 0.5,
				    	isBaseLayer: false,
				    	displayInLayerSwitcher: false
					}
			);



		
		var analizyLyr = new OpenLayers.Layer.Vector
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
		
		
		
		var dsAnalizyWD = new GeoExt.data.FeatureStore({
				layer: analizyLyr,
				fields: [
						{name: 'numer', type: 'string'},
						{name: 'powierzchnia', type: 'string'},
						{name: 'ogrod', type: 'string'},
						{name: 'miasto', type: 'string'},
						{name: 'delegatura', type: 'string'}
				], proxy: new GeoExt.data.ProtocolProxy({
						protocol: new OpenLayers.Protocol.HTTP({
								url: "dajWolne.php",
								format: new OpenLayers.Format.GeoJSON()
						})
				}), autoLoad: true
		}); 
			
    var gridDzialkWolnePanel = new Ext.grid.GridPanel({
    		itemId: "panel-wolnych-dzialek",
        title: "Dzia³kiWolne",
        store: dsAnalizyWD,
        //autoWidth: true,
        border: true,
        //layout: 'fit',
        columns: [{
            header: "Nr",
            width: 40,
        		sortable: true,  
            dataIndex: "numer"
        },{
            header: "Pow.",
            width: 40,
            dataIndex: "powierzchnia"
        },{
            header: "Ogród",
            width: 100,
            sortable: true,
            dataIndex: "ogrod"
        },{
            header: "Miasto",
            sortable: true,
            width: 80,
            dataIndex: "miasto"
        },{
            header: "Delegatura",
            sortable: true,
            width: 80,
            dataIndex: "delegatura"
        }],
        listeners: {
        		rowclick: function(gridObj, rowIndex, eventObj) {
        				var record = gridObj.store.getAt(rowIndex);
        				var _dzialka = record.get("feature");
        				var c = _dzialka.geometry.getCentroid();
        				map.moveTo(new OpenLayers.LonLat(c.x, c.y), 17);
        		}
        }
	
    });
 
 
		function encodeRFC5987ValueChars (str) {
			return encodeURIComponent(str).replace(/['()]/g, escape).replace(/\*/g, '%2A').replace(/%(?:7C|60|5E)/g, unescape);
		}
 
 
    


		var dsAnalizyDN = new GeoExt.data.FeatureStore({
				layer: analizyLyr,
				fields: [
						{name: 'numer', type: 'string'},
						{name: 'powierzchnia', type: 'string'},
						{name: 'ogrod', type: 'string'},
						{name: 'miasto', type: 'string'},
						//{name: 'delegatura', type: 'string'}
				], proxy: new GeoExt.data.ProtocolProxy({
						protocol: new OpenLayers.Protocol.HTTP({
								url: "dajNiewymiarowe.php",
								format: new OpenLayers.Format.GeoJSON(),
								headers: {
										//"Content-Type": "text/plain; charset=WINDOWS-1250"
								}
						})
				}), autoLoad: true
		}); 
			
    var gridDzialkNiewymiarowePanel = new Ext.grid.GridPanel({
    		itemId: "panel-niewymiarowych-dzialek",
        title: "Dzia³kiNiewymiarowe",
        store: dsAnalizyDN,
        border: true,
        width: 320,
        columns: [{
            header: "Nr",
            width: 40,
            sortable: true,
            dataIndex: "numer"
        },{
            header: "Pow.",
            width: 40,
            sortable: true,
            dataIndex: "powierzchnia"
        },{
            header: "Ogród",
            width: 100,
            sortable: true,
            dataIndex: "ogrod"
        },{
            header: "Miasto",
            width: 80,
            sortable: true,
            dataIndex: "miasto"
        }//,{
            //header: "Delegatura",
            //width: 80,
            //sortable: true,
            //dataIndex: "delegatura"
        //}
		],
        listeners: {
        		rowclick: function(gridObj, rowIndex, eventObj) {
        				var record = gridObj.store.getAt(rowIndex);
        				var _dzialka = record.get("feature");
        				var c = _dzialka.geometry.getCentroid();
        				map.moveTo(new OpenLayers.LonLat(c.x, c.y), 17);
        		}
        }                       
    });

    
    
 		
 

		function dajDokumentyPanel(activeGarden){
				var dokumentyPanel = new Ext.tree.TreePanel({
		        border: true,	
		    		title: 'DokumentyOgrodu',
		        itemId: "panel-dokumentow",
		        userArrows: true,
		    		animate: true,
		      	rootVisible: false,
		    		loader: new Ext.tree.TreeLoader({
		         		url  : 'jsonTreeDok.php?dir='+activeGarden
		  	    }),
		    		root: new Ext.tree.AsyncTreeNode({
		    				id: 'isroot',
		    				expanded: true,
		    				text: 'root'
		    		}),
		    		listeners: {
		    				"click": { fn: wyswietlPdf }
		    				//"beforeexpandnode": { fn: collapseNodes },
		    				//"expandnode": { fn: expandMiasto }
		    		}
		    });
		    return dokumentyPanel;
  	}
	
	function dajDokumentyPozostalePanel(id){
		
				var dokumentyPanel = new Ext.tree.TreePanel({

		        border: true,	
		    		title: 'Dokumenty',
		        itemId: "panel-pozostale-dokumenty",
		        userArrows: true,
		    		animate: true,
		      	rootVisible: false,
		    		loader: new Ext.tree.TreeLoader({
		         		url  : 'jsonTreeOtherDok.php'
		  	    }),
		    		root: new Ext.tree.AsyncTreeNode({
		    				id: 'isroot',
		    				expanded: true,
		    				text: 'root'
		    		}),
		    		listeners: {
		    				"click": { fn: wyswietlPdf }
		    				//"beforeexpandnode": { fn: collapseNodes },
		    				//"expandnode": { fn: expandMiasto }
		    		}
		    });
		    return dokumentyPanel;
  	}
	
	function dajWlascicielePanel(activeGarden){
				var dokumentyPanel = new Ext.tree.TreePanel({
		        border: true,	
		    		title: 'U¿ytkownicy Dzia³ek Ogrodu',
		        itemId: "panel-wlascicieli",
		        userArrows: true,
		    		animate: true,
		      	rootVisible: false,
				enableDD: true,
				autoScroll: true,
		    		loader: new Ext.tree.TreeLoader({
		         		url  : 'jsonTreeOwner.php?gid='+activeGarden
		  	    }),
		    		root: new Ext.tree.AsyncTreeNode({
		    				id: 'isroot',
		    				expanded: true,
		    				text: 'root'
		    		}),
		    		listeners: {
		    				//"click": { fn: wyswietlPdf }
		    				//"beforeexpandnode": { fn: collapseNodes },
		    				//"expandnode": { fn: expandMiasto }
		    		}
		    });
		    return dokumentyPanel;
  	}













 

 
 
 
    
    
    
 		//panel boczny prawy
		var pomocPanel = new Ext.Panel({
        //contentEl: "desc",
        html: wyjsciowyHTML,
        id: 'panel-pomocy',
        bodyStyle: {"padding": "5px"},
				title: "Pomoc"
		}); 
		
		
		
		
		
		
		
		var rightPanel = new Ext.TabPanel({
        region: "east",
        bodyStyle: {"padding": "5px"},
        collapsible: true,
        collapseMode: "mini",
        split: true,
        width: 350,
				title: "Panel Wsparcia",
				items: [pomocPanel],
				activeTab: 0
		});



    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! 'auto' dziala przed dodaniem z kodu elementu badz skasowaniem 
				! trzeba element oflagowac odpowiednio ('DELETE', 'INSERT', 'UPDATE')
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/



		//warstwa zdjec 
	 	var saveStrategyZdjecia = new OpenLayers.Strategy.Save({auto: true});
		wfsZdjecia = new OpenLayers.Layer.Vector
		("Zdjêcia Dzia³kowców", 
				{
			  		strategies: [new OpenLayers.Strategy.BBOX(), saveStrategyZdjecia],
			    	projection: new OpenLayers.Projection('EPSG:4326'),
						styleMap: stylZdjecia,
			    	visibility: true,			
			    	protocol: new OpenLayers.Protocol.WFS
			    	(
				    		{
					      		version: "1.0.0",
					        	srsName: "EPSG:4326",
					        	url: "http://127.0.0.1:8081/geoserver/wfs",
					        	featureType: "zdjecia",
					        	featureNS: "RODPOZNAN"
				      	}
			    	),
            eventListeners: {
                featureadded: zdjecieLoaded,
                featureremoved: zdjecieRemove
            },						
			    	isBaseLayer: false	    		    		    	                                       	
				}
		);	
		
		



		var bufferLyr = new OpenLayers.Layer.Vector(
				"Obszar Edycyjny",
				{
						projection: new OpenLayers.Projection('EPSG:2180'),
						styleMap: stylBuffer,
					  visibility: true,
					  opacity: 0.5,
					  isBaseLayer: false,
					  displayInLayerSwitcher: true
				}
		);










    
    
    
    
    
    
    
    
    
    
    








    var wgrajZdjeciePanel = new Ext.FormPanel({
    	
    	
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Panel dodawany jest do okienka 'winWgrajZdjecie'
				!	Na formatke zwracane sa dane potrzebne do zasilenia bazy.
				!	Wczesniej wczytanie punktu realizowane bylo przez UPDATE (wgrajFoty.php).
				! Zmienilem to na dodanie lopatologiczne "feature'a".
				! Skrypt wgrajFoty1.php zwraca w json'ie sciezke do wgranego przez niego zdjecia
				! Zwraca tez mozliwy nastepny gid elementu (nwzwa zdjecia bez rozszerzenia)
				! Dodanie klucza jest jednak realizowane przez geoserver(?) 
				! na podobnej zasadzie (najwiekszy od tabeli + 1)
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
    		
    		
    		fileUpload: true,
        labelWidth:70,
        frame:true,
        items:[{
        		xtype: 'hidden',
            name: 'heading',
            id: 'um_heading'
        },{
        		xtype: 'hidden',
            name: 'user',
            id: 'um_user'
        },{
        		xtype: 'hidden',
            name: 'punkt',
            id: 'um_punkt'
        },{
        		xtype: 'textarea',
            fieldLabel:'Komentarz',
            name: 'komentarz',
            id: 'um_komentarz',
            maxLength: 255,
            maxLengthText: 'Maksymalna liczba znaków dla tego pola to 255',
            width: 200,
            height: 80
        },{
        		xtype: 'fileuploadfield',
        		id: 'file',
        		emptyText: 'Wybierz plik...',
            fieldLabel:'Plik',
            name:'file',
            buttonText: 'Przegl¹daj',
            width: 260,
            allowBlank: false
        }],
        buttons:[{
            text:'Wgraj!',
            formBind: true,
            handler:function(){
            		if(wgrajZdjeciePanel.getForm().isValid()){
				            wgrajZdjeciePanel.getForm().submit({
				            		url:'wgrajFoty1.php',
				                //method:'POST',
				                waitMsg: 'Wgrywanie twojego zdjêcia...',
				                success: function(form, action){
				                		var resulttext = Ext.decode(action.response.responseText);	
				                		//dodanie na warstwe zdjec punktu z atrybutami odpowiednimi
								            var _feature = new OpenLayers.Feature.Vector(
								                OpenLayers.Geometry.fromWKT(
								                		wgrajZdjeciePanel.getForm().findField('um_punkt').getValue()
								                ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())
								            );
				                		_feature.attributes['sciezka'] = resulttext.sciezka;				                		
				                		_feature.attributes['heading'] = wgrajZdjeciePanel.getForm().findField('um_heading').getValue();
				                		_feature.attributes['komentarz'] = wgrajZdjeciePanel.getForm().findField('um_komentarz').getValue();
				                		_feature.attributes['id_uzytkownika'] = wgrajZdjeciePanel.getForm().findField('um_user').getValue();				                		
				                		_feature.state = OpenLayers.State.INSERT;
				                		wfsZdjecia.addFeatures([_feature]);				                						                						                		
						                Ext.Msg.alert('Status', resulttext.message, function(btn, text){			 				                					                    
						                });
						                wgrajZdjeciePanel.getForm().reset();
						                winWgrajZdjecie.hide();
				            		},
						            failure: function(form, action){
						            		var resulttext = Ext.decode(action.response.responseText);
						                Ext.Msg.alert('Status', resulttext.message, function(btn, text){			 				                					                    
						                });				            		
						            }		 
				            });
				    		}
        		}
        },{
        		text: 'Odrzuæ',
        		handler: function(){
        				//porzucenie wgrywania zdjecia (usuniecie kierunku) - dodatkowa procedura
        				wgrajZdjeciePanel.getForm().reset();
        				winWgrajZdjecie.hide();
        		}
        }]
    });		
		
		
		var winWgrajZdjecie = new Ext.Window(
    {
    		title:'Uprasza siê o wybranie zdjêcia',
        layout: 'fit',
        width: 370,
        height: 200,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [wgrajZdjeciePanel]
    });




	var wgrajPlikPanel = new Ext.FormPanel({
    	
    	
    
    		
    		
    		fileUpload: true,
        labelWidth:70,
        frame:true,
        items:[{
        		xtype: 'hidden',
            name: 'heading',
            id: 'um_heading'
        },{
        		xtype: 'hidden',
            name: 'user',
            id: 'um_user'
        },{
        		xtype: 'hidden',
            name: 'punkt',
            id: 'um_punkt'
        },{
        		xtype: 'textarea',
            fieldLabel:'Opis pliku',
            name: 'komentarz',
            id: 'um_komentarz',
            maxLength: 255,
            maxLengthText: 'Maksymalna liczba znaków dla tego pola to 255',
            width: 200,
            height: 80
        },{
        		xtype: 'fileuploadfield',
        		id: 'file',
        		emptyText: 'Wybierz plik...',
            fieldLabel:'Plik',
            name:'file',
            buttonText: 'Przegl¹daj',
            width: 260,
            allowBlank: false
        }],
        buttons:[{
            text:'Wgraj!',
            formBind: true,
            handler:function(){
            		if(wgrajPlikPanel.getForm().isValid()){
					abc = wgrajPlikPanel.getForm().findField('um_komentarz').getValue();
				            wgrajPlikPanel.getForm().submit({
							//abc = "aaa",//wgrajPlikPanel.getForm().findField('um_komentarz').getValue(),
				            		url:'wgrajPlik.php?nazwa='+wgrajPlikPanel.getForm().findField('um_komentarz').getValue()+'&id='+getCookie('usr'),
				                //method:'POST',
				                waitMsg: 'Wgrywanie twojego pliku...',
								
								/*Ext.Ajax.request({
							      		url: adres,
							          success: function(form, action){
							          		var odp = Ext.decode(form.responseText);
							           		Ext.Msg.alert('Statuls', odp.message, function(btn, text){			 				                					                    
													  });	
							          }
							      }),
								*/
				                 success: function(form, action){
				                		var resulttext = Ext.decode(action.response.responseText);	
										Ext.Msg.alert('Status', resulttext.message, function(btn, text){			 				                					                    
													  });
				                		//dodanie na warstwe zdjec punktu z atrybutami odpowiednimi
								    /*       var _feature = new OpenLayers.Feature.Vector(
								                OpenLayers.Geometry.fromWKT(
								                		wgrajPlikPanel.getForm().findField('um_punkt').getValue()
								                ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())
								            );
				                		_feature.attributes['sciezka'] = resulttext.sciezka;				                		
				                		_feature.attributes['heading'] = wgrajPlikPanel.getForm().findField('um_heading').getValue();
				                		_feature.attributes['komentarz'] = wgrajPlikPanel.getForm().findField('um_komentarz').getValue();
				                		_feature.attributes['id_uzytkownika'] = wgrajPlikPanel.getForm().findField('um_user').getValue();				                		
				                		_feature.state = OpenLayers.State.INSERT;
				                		wfsZdjecia.addFeatures([_feature]);				                						                						                		
						                Ext.Msg.alert('Status', resulttext.message, function(btn, text){			 				                					                    
						                });
										Ext.Msg.alert('Statss', resulttext.message);*/
						                wgrajPlikPanel.getForm().reset();
						                winWgrajPlik.hide();
				            		},
						            failure: function(form, action){
						            		var resulttext = Ext.decode(form.responseText);
						                Ext.Msg.alert('Statuss', 'resulttext.message', function(btn, text){										
						                });		
						            }		 
				            });
				    		}
        		}
        },{
        		text: 'Odrzuæ',
        		handler: function(){
        				//porzucenie wgrywania zdjecia (usuniecie kierunku) - dodatkowa procedura
        				wgrajPlikPanel.getForm().reset();
        				winWgrajPlik.hide();
        		}
        }]
    });		
		
		
		
		
		
		
	 	
		
		
	var winWgrajPlik = new Ext.Window(
    {
    		title:'Uprasza siê o wybranie pliku',
        layout: 'fit',
        width: 370,
        height: 200,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [wgrajPlikPanel]
    });
    
	function asd(){
	//	alert('a');
		Ext.Ajax.request({
			url: 'test2.php',
			success: function(objServerResponse, opts) {
				var odp = Ext.decode(objServerResponse.responseText);
			//	alert('ssa');
			}
		});


		
						/*		qwe = odp.message;
								if(getCookie('layers')){
									layers_wms = getCookie('warstwa')+nazwa_wms+"*";
									
								}else{
									layers_wms = layers_wms+"*";
									adr_wms = adr_wms+"*";
								}
								setCookie('layers',odp.message);*/
							
	}

	var wgrajWMSPanel = new Ext.FormPanel({
    	
    	
    
    		
    		
    		fileUpload: true,
        labelWidth:70,
        frame:true,
        items:[
        		{
        		xtype: 'textfield',
            fieldLabel:'Opis WMS',
            name: 'WMS',
            id: 'um1_WMS',
            maxLength: 255,
            maxLengthText: 'Maksymalna liczba znaków dla tego pola to 255',
            width: 250,
            height: 40
        },
		{
        	xtype: 'textfield',
            fieldLabel:'Adres WMS',
            name: 'WMS',
            id: 'adr_WMS',
            maxLength: 255,
            maxLengthText: 'Maksymalna liczba znaków dla tego pola to 255',
            width: 250,
            height: 40
        }],


       buttons:[{
            text:'Wgraj!',
            formBind: true,
			
            handler:function(){
					
					//asd();
					
					var nazwa_wms = "";
					var adr_wms = "";
					var layers_wms = "";
            		if(wgrajWMSPanel.getForm().isValid()){
						nazwa_wms = wgrajWMSPanel.getForm().findField('um1_WMS').getValue();
						adr_wms = wgrajWMSPanel.getForm().findField('adr_WMS').getValue();
						//var yy = "kkk";
						
						Ext.Ajax.request({
			url: 'dajWMSLayers.php?msg='+adr_wms,
			success: function(objServerResponse, opts) {
				var odp = Ext.decode(objServerResponse.responseText);
				
				//setCookie('ooooo',odp.message,(525600*60*1000));
				alert(odp.message);

			},
			failure: function(){ alert('B£¥D');}
			})
						wgrajWMSPanel.getForm().submit({
							//abc = "aaa",//wgrajPlikPanel.getForm().findField('um_komentarz').getValue(),
				            		//url:'wgrajPlik.php?nazwa='+wgrajWMSPanel.getForm().findField('um_komentarz').getValue()+'&id='+getCookie('usr'),
				                //method:'POST',
				               // waitMsg: 'Wgrywanie twojego pliku...',
								
								
							          		
							           		
							      
			//url: 'test2.php',
			//method:'POST',
		//	success: function(form, opts) {
				//var odp = Ext.decode(objServerResponse.responseText);
			//	alert('UUUU');
				//setCookie('layers','aaa');

			//}
			
								
				                 success: function(form, action){
				                		var resulttext = Ext.decode(action.response.responseText);	
										Ext.Msg.alert('Status', resulttext.message, function(btn, text){			 				                					                    
													  });
								 }
				                		//dodanie na warstwe zdjec punktu z atrybutami odpowiednimi
								    /*       var _feature = new OpenLayers.Feature.Vector(
								                OpenLayers.Geometry.fromWKT(
								                		wgrajPlikPanel.getForm().findField('um_punkt').getValue()
								                ).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject())
								            );
				                		_feature.attributes['sciezka'] = resulttext.sciezka;				                		
				                		_feature.attributes['heading'] = wgrajPlikPanel.getForm().findField('um_heading').getValue();
				                		_feature.attributes['komentarz'] = wgrajPlikPanel.getForm().findField('um_komentarz').getValue();
				                		_feature.attributes['id_uzytkownika'] = wgrajPlikPanel.getForm().findField('um_user').getValue();				                		
				                		_feature.state = OpenLayers.State.INSERT;
				                		wfsZdjecia.addFeatures([_feature]);				                						                						                		
						                Ext.Msg.alert('Status', resulttext.message, function(btn, text){			 				                					                    
						                });
										Ext.Msg.alert('Statss', resulttext.message);*/
						/*                wgrajWMSPanel.getForm().reset();
						                winWgrajWMS.hide();
				            		},
						            failure: function(form, action){
						            		var resulttext = Ext.decode(form.responseText);
						                Ext.Msg.alert('Statuss', 'resulttext.message', function(btn, text){										
						                });		
										winWgrajWMS.hide();
						            }	*/	 
				            });
				    		}
							alert("gggg");
							if(getCookie('warstwa')){
								nazwa_wms = getCookie('warstwa')+nazwa_wms+"*";
								adr_wms = getCookie('WMS')+adr_wms+"*";
							}else{
								nazwa_wms = nazwa_wms+"*";
								adr_wms = adr_wms+"*";
							}
							setCookie('warstwa',nazwa_wms,(525600*60*1000));
							setCookie('WMS',adr_wms,(525600*60*1000));
							
			
							warDodatkowe(),
								addLay();
							document.location="http://unimap.homenet.org/gliwice.html"
							//Ext.Msg.alert('Status', warstwyDodatkowe, function(btn, text){			 				                					                    
						    //            });	

        		}
				
        },{
        		text: 'Odrzuæ',
        		handler: function(){
        				//porzucenie wgrywania zdjecia (usuniecie kierunku) - dodatkowa procedura
        				wgrajWMSPanel.getForm().reset();
        				winWgrajWMS.hide();
        		}
        }]
    });			




	var winWgrajWMS = new Ext.Window(
    {
    		title:'Wpisz WMS',
        layout: 'fit',
        width: 370,
        height: 200,
        resizable: false,
        modal: true,
        closeAction: 'hide',
        items: [wgrajWMSPanel]
    });
    
    
    
    
    
    
    		
		
		
		function zdjecieLoaded(obj){
			  /*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!	Wchodzi tu po dodaniu kazdego elementu z osobna.
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
		}
		
		function zdjecieRemove(obj){
				/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!	Wchodzi tu zawsze skurwiel jak tylko 
				! odswiezy sie obraz (strategy.BBOX(), warstwa.refresh())
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
    		
				//var adres = 'wywalZdjecie.php?sciezka='+obj.feature.attributes['sciezka'];
       	//Ext.Ajax.request({
        //		url: adres,
        //   	success: function(objServerResponse, opts) {
        //   			var odp = objServerResponse.responseText.message;
        //   			Ext.Msg.alert('Status', odp, function(btn, text){			 				                					                    
				//		  	});	
        //   	}
       	//});		
		}
		
		
		
		
		
		

		//narzedzia edycyjne 
		var n2 = new Ext.ButtonGroup({
				itemId: "narzedzia-edycyjne",
				xtype: 'buttongroup',
		    title: 'Narzêdzia Edycyjne',
		    region: 'east',
		    autoDestroy: false,
		    items: [		    
						new GeoExt.Action({
								control: new OpenLayers.Control.DrawFeature
								(
									pointLyr, OpenLayers.Handler.Point,
									{
									  title: "Rysuj punkt",
									  multi: false,
									  featureAdded: onPointInsert
									}
								),
								map: map,
								scale: 'large',
								iconCls: 'point-icon',
								iconAlign: 'top',
								toggleGroup: 'nawigacja',
								tooltip: 'Wstawianie Obiektu Punktowego',
								allowDepress: false
						}),
						new GeoExt.Action({
								control: new OpenLayers.Control.DrawFeature
								(
									lineLyr, OpenLayers.Handler.Path,
									{
									  title: "Rysuj liniê",
									  multi: false,
									  featureAdded: onLineInsert
									}
								),
								map: map,
								scale: 'large',
								iconCls: 'line-icon',
								iconAlign: 'top',
								toggleGroup: 'nawigacja',
								tooltip: 'Wstawianie Obiektu Liniowego',
								allowDepress: false
						}),
						new GeoExt.Action({
								control: new OpenLayers.Control.DrawFeature
								(
									polyLyr, OpenLayers.Handler.Polygon,
									{
									  title: "Rysuj obszar",
									  multi: false,
									  featureAdded: onPolyInsert
									}
								),
								map: map,
								scale: 'large',
								iconCls: 'poly-icon',
								iconAlign: 'top',
								toggleGroup: 'nawigacja',
								tooltip: 'Wstawianie Obiektu Powierzchniowego',
								allowDepress: false
						}),
						new GeoExt.Action({
								control: new OpenLayers.Control.DrawFeature
								(
									kierunekLyr, 
									OpenLayers.Handler.Path,
									{
									  title: "Wstaw Zdjêcie",
									  featureAdded: onKierInsert,
									  handlerOptions: {freehand: false, multi: false, maxVertices: 2}
									}
								),
								map: map,
								scale: 'large',
								iconCls: 'camera-icon',
								iconAlign: 'top',
								toggleGroup: 'nawigacja',
								tooltip: 'Wstawianie Zdjêæ',
								allowDepress: false,
								toggleHandler: function(e){
										Ext.getCmp("panel-pomocy").update(dodawanieZdjecHTML);	
								}
						}),
						new GeoExt.Action({
								control: new DeleteFeature
								(
									[wfsZdjecia, pointLyr, lineLyr, polyLyr], 
									{
										onDelete: onFeatureDelete,
									  title: "Kasuj Obiekt"
									}
								),
								map: map,
								scale: 'large',
								iconCls: 'del-icon',
								iconAlign: 'top',
								toggleGroup: 'nawigacja',
								tooltip: 'Kasowanie Obiektów',
								allowDepress: false
								//wylaczy sie kontrolki potem wlaczy i juz chuj, nic nie dziala
								//,
								//toggleHandler: function(e){
								//		toggleSelectControls();	
								//}
						})
				]
		});
	
	
	// DM to nie wiem po co by³o ...
	// if ((readCookie('upr')) && (readCookie('usr'))) {}
	
	
	
		//sprawdzanie czy wszystkie wierzcholki obiektu leza w wyznaczonym buforze
		function isInsideBuffer(feature) {
				var vertexArr = (feature.geometry).getVertices();
				for (var i=0;i<vertexArr.length;i++) {
						if (!vertexArr[i].intersects(bufferLyr.features[0].geometry)) {
								return false;
								//exit;							
						}
				}
				
				return true;			
		}
						
						
						
						
						
						
		function onPointInsert(feature){				
				if (!isInsideBuffer(feature)) {
						Ext.Msg.alert('Status', 'Obiekt punktowy musi byc umiejscowiony w dozwolonym obszarze!', function(btn, text){			 				                					                    
						});
						feature.destroy();
				} else {
					
				}
		}
		
		
		
		
		
		
		
		function onLineInsert(feature){
				if (!isInsideBuffer(feature)) {
						Ext.Msg.alert('Status', 'Obiekt liniowy musi byc umiejscowiony w dozwolonym obszarze!', function(btn, text){			 				                					                    
						});
						feature.destroy();
				} else {
					
				}
		}
		
		
		
		
		
		
		
		function onPolyInsert(feature){
				if (!isInsideBuffer(feature)) {
						Ext.Msg.alert('Status', 'Obiekt powierzchniowy musi byc umiejscowiony w dozwolonym obszarze!', function(btn, text){			 				                					                    
						});
						feature.destroy();
				} else {
					
				}
		}		
			
			
			
			
			
			
			
		function onKierInsert(feature){
				
				/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Dodano kierunek, w ktorym zostalo zrobione zdjecie
				!	Wrzuca do 'wgrajZdjeciaPanel' (do pol ukrytych tez)
				! dane: heading, punkt(wkt), uzytkownik (ze zmiennej globalnej), 
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
					
				var punktyArr = (feature.geometry).getVertices();		
				var azym = azymut(punktyArr[0], punktyArr[1]);
				//na warstwie bufferLyr znajduje sie jeden obiekt (lub zaden)																		
				if (punktyArr[0].intersects(bufferLyr.features[0].geometry)){	
				//jest uzytkownik przypisany w zmiennej globalnej				
						if ((_usr) && (_upr)) {
								wgrajZdjeciePanel.getForm().findField('um_heading').setValue(azym);
								wgrajZdjeciePanel.getForm().findField('um_user').setValue(_usr);
								//trzeba przetransformowac z google mercator do wgs84
								wgrajZdjeciePanel.getForm().findField('um_punkt').setValue((punktyArr[0].transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))).toString());
								winWgrajZdjecie.show();
						} else {
								Ext.Msg.alert('Status', 'Nie zalogowano!', function(btn, text){			 				                					                    
								});
								wczytanieDodatkowe();
						}
				} else {
						Ext.Msg.alert('Status', 'Próba wstawienia zdjêcia poza dozwolonym obszarem!', function(btn, text){			 				                					                    
						});																
				}									
				feature.destroy();
		}
			
			
			
			
			
			
			
			
			
			
			
			
			
				/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! przy kasowaniu obiektu mozemy pobrac dane o warstwie i wtedy 
				!	zastosowac odpowiednia procedure (np. skrypt wyrzucajacy zdjecie z dysku)
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
			
			
		function onFeatureDelete(feature){
				if (feature.layer){
						switch (feature.layer.name)
						{
								case 'Zdjêcia Dzia³kowców':
										var adres = 'wywalZdjecie.php?sciezka='+feature.attributes['sciezka'];
							      Ext.Ajax.request({
							      		url: adres,
							          success: function(objServerResponse, opts) {
							          		var odp = Ext.decode(objServerResponse.responseText);
							           		Ext.Msg.alert('Status', odp.message, function(btn, text){			 				                					                    
													  });	
							          }
							      });
							  break;
							  case 'Warstwa Powierzchniowa':				    
						  	break;
						  	case 'Warstwa Liniowa':				    
						  	break;
							  case 'Warstwa Punktowa':				    
						  	break;				  		
						  	default: var s = "";		
						}
				}
		}

			
			
			
			
			
			
		function azymut(punktP, punktK){
				var dy = punktK.x - punktP.x;
				var dx = punktK.y - punktP.y;
				var arT = (Math.atan(dy/dx))*(180/Math.PI);
				var a;
				if ((dy > 0) && (dx > 0)) {
						a = arT;
				} else if ((dy < 0) && (dx > 0)) {
						a = arT + 360;		
				} else	{
						a = arT + 180;			
				}
				return Math.round(a);
		}
			
			
			
			
			
			
			
			
			
			
					
		











		//narzedzia operacje na danych
		var n3 = new Ext.ButtonGroup({
				xtype: 'buttongroup',
		    title: 'Narzêdzia Danych',
		    region: 'east',
		    items: [
		    		{
				        scale: 'large',
				        iconCls: 'kml-icon',
				        iconAlign: 'top',
				        tooltip: 'Eksport do KML',
				        handler: function(e){
				        		alert('eksport do kml w budowie')
				        }
						},
						{
				        scale: 'large',
				        iconCls: 'wms-icon',
				        iconAlign: 'top',
				        tooltip: 'Wczytanie warstwy WMS',
				        handler: function(e){
				        		if (readCookie('usr')){
									winWgrajWMS.show();
								}else{
									Ext.Msg.alert('Niepowodzenie!', 'Aby dodaæ plik zaloguj siê');
								}
				        }
						},
						{
				        scale: 'large',
				        iconCls: 'shp-icon',
				        iconAlign: 'top',
				        tooltip: 'Wczytanie warstwy SHP',
				        handler: function(e){
				        		alert('wczytywanie SHP w budowie')
				        }
						}
				]
		});
		
		
		
		
		
		
		
		
	
		
		
		
		
	//alert(wararray);		
		//alert(um_wms_tab[0]);
		//podpinanie warstw pod okno
		var layers_mp_panel = "[gmap_d,gmap_h,kierunekLyr,bufferLyr,wfsOgrody,wfsDzialki,polyLyr,lineLyr,wfsZdjecia,pointLyr,topo50_wms,unimap_wms,um_wms,pageLayer";
		if(wararray){
			for(u=0;u<wararray.length;u++){
				layers_mp_panel += "," + um_wms_tab[u];
			}
		}
		//alert(layers_mp_panel);
		layers_mp_panel += "]";
		eval('var obj1='+layers_mp_panel);

	
		//mapka
		mapPanel = new GeoExt.MapPanel({
				//title: "PanelMapy",
				//border: false,
				region: "center",
				map: map,
				center: [2099582.00, 6496019.00],
				zoom: 14,
				bbar: [n1, n3], //,{xtype: 'tbfill'} - daje nam przesuniecie na prawo elementu
				layers: obj1,
        items: [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 300,
            x: 10,
            y: 20,
            plugins: new GeoExt.ZoomSliderTip()
        }],
				//toolbar - wyswietla sie na gorze
				tbar: [
						logBttn,
						addToolsBttn,
						addFileBttn,
						//addWMSBttn
						{
            text: "Print...",
            handler: function(){
                // A window with the PrintMapPanel, which we can use to adjust
                // the print extent before creating the pdf.
                printDialog = new Ext.Window({
                    title: "Print Preview",
                    layout: "fit",
                    width: 350,
                    autoHeight: true,
                    items: [{
                        xtype: "gx_printmappanel",
                        sourceMap: mapPanel,
                        printProvider: printProvider
                    }],
                    bbar: [{
                        text: "Create PDF",
                        handler: function(){ printDialog.items.get(0).print(); }
                    }]
                });
                printDialog.show();
            }
        }
				]
		});


	mapPanel1 = new GeoExt.MapPanel({
    //    renderTo: "content",
        width: 500,
        height: 350,
		center: [2099582.00, 6496019.00],
        map: map,
        layers: [new OpenLayers.Layer.WMS("Mapa topograficzna 1:10000",
            "http://unimap.homenet.org:8081/geoserver/wms",
            {layers: "dm_workspace:gp_topo_10"},
            {singleTile: true, numZoomLevels: 21})],
        //center: [146.56, -41.56],
        //zoom: 0,
        bbar: [{
            text: "Print...",
            handler: function(){
                // A window with the PrintMapPanel, which we can use to adjust
                // the print extent before creating the pdf.
                printDialog = new Ext.Window({
                    title: "Print Preview",
                    layout: "fit",
                    width: 350,
                    autoHeight: true,
                    items: [{
                        xtype: "gx_printmappanel",
                        sourceMap: mapPanel,
                        printProvider: printProvider
                    }],
                    bbar: [{
                        text: "Create PDF",
                        handler: function(){ printDialog.items.get(0).print(); }
                    }]
                });
                printDialog.show();
            }
        }]
    });



			
			
		//ustaw filtr dzialek rodzinnych na id_ogrodu='id_ogrodu' (null dla odznaczenia dzialek)
		function wyswietlDzialki(id_ogrodu)
		{
    		wfsDzialki.filter = new OpenLayers.Filter.Comparison
				(
						{
		        		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		            property: "id_ogrodu",
		            value: id_ogrodu
						}
				); 
				wfsDzialki.refresh({force: true});			
		}











			
		//kasowanie wyborow we wszystkich kontrolkach 'OpenLayers.Control.SelectFeature'
		function wybierzNic()
		{
				var kontrolki = map.getControlsByClass('OpenLayers.Control.SelectFeature');
				for(var i=0;i<kontrolki.length;i++){ kontrolki[i].unselectAll(); }
		}
		








				/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! funkcja zwracajaca typ uprawnien do obiektu (feature'a)
				!	parser stringa _upr - wydlubuje z niego informacje dotyczace danego obiektu
				! z - zapis
				! o - odczyt
				! b - brak [ogrod, nazwa, parcela], dzialka[numer, powierzchnia]
				! (-zapis ogrodu daje zapis dzialek jego
				! (-odczyt delegatury daje zapis	alert(_upr.getGidUpr('o', 0));		
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/

		function properAttrWin(feature){					
				
				var _gid = feature.attributes.gid;
				
				
				
				//aliasy warstw
				var _lname = feature.layer.name;								
				if (_lname == "Dzia³ki Rodzinne"){ _lname = 'dz' } 
						else if ( _lname == "Ogrody Rodzinne"){ _lname = 'o'}
								else if ( _lname == "Warstwa Powierzchniowa"){ _lname = 'wpow'} 
										else if ( _lname == "Warstwa Punktowa"){ _lname = 'wpkt'}
												else if ( _lname == "Warstwa Liniowa"){ _lname = 'wlin'}
														else if ( _lname == "Zdjêcia Dzia³kowców"){ _lname = 'wzd'}
				
								
				//if (_upr){
				if((readCookie('upr')) && (readCookie('usr'))){
					console.log("DM tu ustawiamy uprawnienia z cookies");
					_usr = readCookie('usr');
					var upr = readCookie('upr');
					upr = upr.replace(/%7C/g, '|');
					upr = upr.replace(/%2C/g, ',');
					_upr = new uprawnienia(upr);
						//sa uprawnienia
											
						//zapytaje sie do bazy w zaleznosci od warstwy
						//zwraca odpowiednie informacje	np. (gid_miasta, gid_delegatury, gid_ogrodu, gid_wojewodztwa, "kto wstawil zdjecie")
						Ext.Ajax.request({
								url: "infoDodatkowe.php?lname="+_lname+"&gid="+_gid,
								success: function(objServerResponse, opts) {									
										var odp = Ext.decode(objServerResponse.responseText);
										
												
												
										//w zaleznosci od warstwy elementu		
										switch (_lname){
												case "dz":
												
														//pobieramy odpowiedz z serwera
														var deleg = odp.iddeleg;
														var ogrod = odp.idogr;
														
														//dam ci gid, rodzaj_obiektu(d,o,u), do_czego a ty mi zwroc uprawnienia 98-b,111-o,122-z
														var uprD = _upr.getUprEl(deleg, 'd', 0).charCodeAt(0);
														var uprO = _upr.getUprEl(ogrod, 'o', 0).charCodeAt(0);
														var uprU = _upr.getUprEl(_gid, 'u', 0).charCodeAt(0);
														
														//sprawdzamy ktore sa najwieksze
														var wynik = 0;
														if (uprD > wynik){ wynik = uprD }
														if (uprO > wynik){ wynik = uprO }
														if (uprU > wynik){ wynik = uprU }
														
														switch (wynik){
																case 98:
																		//wyswietlenie okienka podgladu ograniczonego
																		createPopup(feature, selectDzialki, 'createPopupDzialkiFormB', 'Dzia³ki');
																break;
																case 111:
																		//wyswietlenie okienka podgladu
																		createPopup(feature, selectDzialki, 'createPopupDzialkiFormO', 'Dzia³ki');
																break;
																case 122:
																		//wyswietlenie okienka edycji
																		createPopup(feature, selectDzialki, 'createPopupDzialkiFormZ', 'Dzia³ki');
																break
																default: alert(wynik);
														}
														
												break;
												case "o":
												
														//pobieramy odpowiedz z serwera
														var deleg = odp.iddeleg;
														
														var uprD = _upr.getUprEl(deleg, 'd', 1).charCodeAt(0);
														var uprO = _upr.getUprEl(_gid, 'o', 1).charCodeAt(0);														
														
														//sprawdzamy ktore sa najwieksze
														var wynik = 0;
														if (uprD > wynik){ wynik = uprD }
														if (uprO > wynik){ wynik = uprO }
														
														switch (wynik){
																case 98:
																		//wyswietlenie okienka podgladu ograniczonego
																		createPopup(feature, selectOgrody, 'createPopupOgrodyFormB', 'Ogrody');
																break;
																case 111:
																		//wyswietlenie okienka podgladu
																		createPopup(feature, selectOgrody, 'createPopupOgrodyFormO', 'Ogrody');
																break;
																case 122:
																		//wyswietlenie okienka edycji
																		createPopup(feature, selectOgrody, 'createPopupOgrodyFormZ', 'Ogrody');
																break
																default: alert(wynik);
														}
														
												break;
												default:
														if ((_lname = "wpow") || (_lname = "wpkt") || (_lname = "wlin")){
														}	
										}												
								}
						});															
				} else {
					
					//nie ma uprawnien (tylko okienka do podlgladu)
					
					switch (_lname){
							case "dz":
									createPopup(feature, selectDzialki, 'createPopupDzialkiFormB', 'Dzia³ki');																										
							break;
							case "o":	
									createPopup(feature, selectOgrody, 'createPopupOgrodyFormB', 'Ogrody');								
							break;	
							default:
									alert("okienko do podgladu atrybutow obiektu warstwy" + _lname);
					}						
				}
		}






























				/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! kontrolki select, highlight, click
				!	przy wylaczeniu highlight i wlaczeniu tracimy mozliwosc usuwania (delete)?????? 
				! nie wiem o co chodzi, do naprawy
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/




	
		
		//podswietlenie po najechaniu (warstwy ogrodow i warstwy dzialek)
		var highlight = new OpenLayers.Control.SelectFeature
		(
				[wfsOgrody, wfsDzialki, wfsZdjecia, pointLyr, lineLyr, polyLyr],
				{
						multiple: false,
			    	hover: true,
			    	highlightOnly: true,
			    	//renderIntent: "temporary",
			    	//selectStyle: stylTemp,
			    	eventListeners: 
				    {
				    		//beforefeaturehighlighted: report,
				   			//featurehighlighted: report,
				    		featureunhighlighted: function(e){
				    				//this.unselectAll();
				    				//alert('dupa');
				    		}
				    }
			  }
		);
		map.addControl(highlight);
	
	
	
	
	
	

 


			
		//oprogramowanie klikniec na mapie OpenLayers.Control.Click - patrze poczatek skryptu
		//dodanie zdarzenia klikniecia podwojnego
		var dbclick =	new OpenLayers.Control.Click({
    		handlerOptions: {
        		"single": false,
            "double": true
				},
				onDblclick: function(e) {
						//odklikniecie zaznaczonych elementow	
						usunPopup();		
						wyswietlDzialki(null);
						wybierzNic();
						aktywnyOgrod = undefined;
						mapPanel.getTopToolbar().remove(mapPanel.getTopToolbar().getComponent("label-aktywny-ogrod"));
						rightPanel.remove(rightPanel.getComponent("panel-dokumentow"));
				}
		});                
		map.addControl(dbclick);
		
		
		
		var labelLogTime = new Ext.form.Label({
		        		itemId: 'label-log-time',
		        		border: true,
						id: 'time',
		        		text: 'Pozosta³o: ',
		            style: {
		            		'color': '#FF0000',
		            		'font-weight': 'bold', 
		            		'border-radius': '2px 0pt 0pt 2px'
		            }
		});
		mapPanel.getTopToolbar().add([{xtype: 'tbfill'}, labelLogTime]);
		
		
		
		
		//dodanie zdarzenia klikniecia pojedynczego //zdarzenie wywolywane jest po zdarzeniu wfsOgrodyHandelr click (opoznienie - czeka na dblclick)
		var sclick =	new OpenLayers.Control.Click({
    		handlerOptions: {
        		"single": true
				},
				onClick: function(e) {
						usunPopup();
				}
		});
		map.addControl(sclick);
		
			
			
			
			
			
			
			
			
			
			
			
		//kontrolka select dla warstwy ogrodow
		//kontrolki nieuaktywniamy bo przestaje byc aktywny highlight i nie dziala wfsOgrodyhandler
		selectOgrody = new OpenLayers.Control.SelectFeature(
				wfsOgrody, {
			    		//onUnselect: usunPopup,
			    		clickout: true
				}
    ); 
		map.addControl(selectOgrody);					
								
   		
    				
		//zdarzenia dla warstwy ogrodow (podobne zdarzenia trzeba zrobic dla warswty dzialek)
		var wfsOgrodyCallbacks =
    {
    		"click": function (feature)	
    		{
    				doubleClick = false;
    				
    				//opozniacz - jesli minie ustalony czas wlaczany jest popup z ogrodami 
    				//(jesli 'doubleClik' nie zostal ustawiony na 'true' w 'dbclick')
    				var t = setTimeout(
    						function(){ 
    								if (!doubleClick){
    										usunPopup();
    										properAttrWin(feature)    										    										
    								} 
    						}, 
    				500);    					
    		},
    		"dblclick": function(feature)
        {
        	  doubleClick = true;
        	  
        	  //odselekt zaznaczonych elementow
        		wybierzNic();
        		
        		//wybierany jest element i wywolywana jest funkcja onSelect       		
        		selectOgrody.select(feature);
        		var bounds = feature.geometry.getBounds();
        		var fid = feature.fid;
        		var gid = fid.substring(fid.indexOf('.', 0) + 1);
        		map.zoomToExtent(bounds);        		
        		wyswietlDzialki(gid);
        		
        		//ustaw aktywny ogrod
        		mapPanel.getTopToolbar().remove(mapPanel.getTopToolbar().getComponent("label-aktywny-ogrod"));
        		aktywnyOgrod = gid;
				now = new Date();
				//(now.getTime()+(60*60*1000))/1000,(60*60*1000)
				setCookie('aktywnyOgrod',gid,(15*60*1000));//,now.getTime()+(15*60*1000));
		 				var labelAktywnyOgrod = new Ext.form.Label({
		        		itemId: 'label-aktywny-ogrod',
		        		border: true,
		        		text: 'Aktywny ogród: '+feature.attributes.nazwa+'('+feature.attributes.parcela+')',
		            style: {
		            		'color': '#FF0000',
		            		'font-weight': 'bold', 
		            		'border-radius': '2px 0pt 0pt 2px'
		            }
		        });
		        mapPanel.getTopToolbar().add([{xtype: 'tbfill'}, labelAktywnyOgrod]);
		        rightPanel.remove(rightPanel.getComponent("panel-dokumentow"));
		        mapPanel.doLayout();
        },
        "out": function(feature)
        {
        		//rob cos;
        },
        "over": function(feature)
        {
        		//document.getElementById("map").style.cursor="pointer";
        }
	}; 

		var wfsOgrodyHandler = new OpenLayers.Handler.Feature
    (
        {
          	map: map,
          	stopClick: false
        },
        wfsOgrody,
        wfsOgrodyCallbacks
		);
  
		   


		   
		   
		   
		   
	  
		   
		   
		   
		   
		   
		   
		   
	
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   


		   
		
    // stworz kontrolke select dla dzialek
    var selectDzialki = new OpenLayers.Control.SelectFeature(
    		wfsDzialki, {
		    		eventListeners: { 
		    				//featurehighlighted: 
		    				//featureunhighlighted:
		    				//featureselected:
		    				//featureunselected:
		    		},
		    		onSelect: function (feature){
		    				//przechodzi do procedury wybierajacej odpowiednie okienko do wyswietlenia
		    				properAttrWin(feature);	
		    		},
		    		onUnselect: usunPopup,
		    		clickout: true
		    }
    );    		
    map.addControl(selectDzialki);		   
		   
		
		
		
		   
		   
		   
		   
		var selectZdjecia = new OpenLayers.Control.SelectFeature
		(
				wfsZdjecia,
		    {
		    		onSelect: function (feature){
		    				dymekZdjecia(feature)	
		    		},
		    		clickout: true
		    }
		);
		map.addControl(selectZdjecia);


	   
	   
	   












		//dobrze by bylo to tez wrzucic do toggle
		highlight.activate();
		dbclick.activate();
		sclick.activate();
		wfsOgrodyHandler.activate();	
		selectDzialki.activate();
		selectZdjecia.activate();
		
		//wlacza lub wylacza podswietlanie
		function toggleSelectControls()
		{
				if (dbclick.active == true) {	
						dbclick.deactivate();
						sclick.deactivate();
						wfsOgrodyHandler.deactivate();
						selectDzialki.deactivate();
						selectZdjecia.deactivate()

				} else {	
						dbclick.activate();
						sclick.activate();
						wfsOgrodyHandler.activate();	
						selectDzialki.activate();
						selectZdjecia.activate()
				}
		}		   
		   
		   
		   
		   
		   
    		/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				! Panele popup do konkretnych warstw
				! i konkretnych typow uprawnien
				! przekazujemy to w konrolce select warstwy
				!	(onSelect) do funcji createPopup, ktora generuje
				! okienko popup VOILA!
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/		   
		   
		   
		   
		   
		   
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		   
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		   
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		   

//TO TRZEBA WRZUCIC JAKO PANEL (createPopupZdjeciaForm)I ZASTAPIC FUNKCJA CREATE POPUP


		function dymekZdjecia(feature) {    	
    		var tresc = 
    				"<div>" +
    						feature.attributes['komentarz'] +"<img src=\""+feature.attributes['sciezka']+"\" width=370>" +
			  		"</div>";  	
        popupWindow = new GeoExt.Popup({            
            title: 'Info',
            location: feature,
            width:400,
            height:300,
            autoScroll: true,
            html: tresc,
            maximizable: false,
            collapsible: true,
            shadow: true,
            map: map
        });
        popupWindow.on({
            close: function() {
                    selectZdjecia.unselectAll();
                    console.log('kasujemy okno');
                    wfsZdjeciaUnSelected(feature);
            }
        });
        popupWindow.show();
    }

		var wfsZdjeciaUnSelected = function(feature)
		{
				if (feature.popup != null)
				{
						map.removePopup(feature.popup);
						feature.popup.destroy();
						feature.popup = null;
				}
			if (popupWindow != null)
				{
						popupWindow.destroy();
	    			popupWindow=null;
				}
   	};
   	
   	
   	
   	
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   	
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   	
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  	
   	
   	
   	
   	
   	
   		
   	

		function createPopupOgrodyFormB(feature){
				var idmiasta = feature.attributes['id_miasta'];
				var iddeleg = feature.attributes['id_deleg'];				
				
				Ext.Ajax.request({
						url: "dajPoIndexie.php?co=miastodeleg&iddeleg="+iddeleg+"&idmiasta="+idmiasta,
						success: function(objServerResponse, opts) {									
								var odp = Ext.decode(objServerResponse.responseText);
								Ext.getCmp('pofB_miasto').setText(odp.miasto);
								Ext.getCmp('pofB_deleg').setText(odp.deleg);
						}
				});
				
				var nazwa = feature.attributes['nazwa'];	
				var parcela = feature.attributes['parcela'];
				var popupOgrodyForm = new Ext.FormPanel({
		        labelWidth:80,
		        frame:true,
		        defaultType:'label',
		        autoWidth: true,
		        autoHeight: true,
		        items:[{
		        		fieldLabel:'Nazwa',
		            text: nazwa
		        },{
		        		fieldLabel:'Parcela',
								text: parcela
		        },{
		        		id: 'pofB_miasto',
		        		fieldLabel:'Miasto'
		        },{
		        		id: 'pofB_deleg',
		        		fieldLabel:'Delegatura'
		        }],
		        buttons:[{        	        	
		            text:'OK',
		            handler:function(){											
										selectOgrody.unselect(feature);
								    usunPopup();							          	
		        		}
		        }]
		     });
		     return popupOgrodyForm    					
		}		  













		function createPopupOgrodyFormO(feature){
				var idmiasta = feature.attributes['id_miasta'];
				var iddeleg = feature.attributes['id_deleg'];				
				
				Ext.Ajax.request({
						url: "dajPoIndexie.php?co=miastodeleg&iddeleg="+iddeleg+"&idmiasta="+idmiasta,
						success: function(objServerResponse, opts) {									
								var odp = Ext.decode(objServerResponse.responseText);
								Ext.getCmp('pofB_miasto').setText(odp.miasto);
								Ext.getCmp('pofB_deleg').setText(odp.deleg);
						}
				});
				
				var nazwa = feature.attributes['nazwa'];
				var parcela = feature.attributes['parcela'];
				var prezes = feature.attributes['prezes'];
				var telefon = feature.attributes['telefon'];
								
				var popupOgrodyForm = new Ext.FormPanel({
		        labelWidth:80,
		        frame:true,
		        defaultType:'label',
		        autoWidth: true,
		        autoHeight: true,
		        items:[{
		        		fieldLabel:'Nazwa',
		            text: nazwa
		        },{
		        		fieldLabel:'Parcela', 
								text: parcela
		        },{
		        		fieldLabel:'Prezes', 
		            text: prezes
		        },{
		        		fieldLabel:'Telefon', 
		            text: telefon
		        },{
		        		id: 'pofB_miasto',
		        		fieldLabel:'Miasto'
		        },{
		        		id: 'pofB_deleg',
		        		fieldLabel:'Delegatura'
		        }],
		        buttons:[{        	        	
		            text:'OK',
		            handler:function(){											
										selectOgrody.unselect(feature);
								    usunPopup();							          	
		        		}
		        }]
		     });
		     return popupOgrodyForm    					
		}	
		
		
		
		








		

		   
		function createPopupOgrodyFormZ(feature){
				/*//mode: 'local',
				var delegStore = new Ext.data.SimpleStore({
						fields: ['gid', 'nazwa'],
						data: [['1', 'Zabrze'],['2', 'Gliwice'],['3', 'Warszawa']]
				});				
				*/
				
				//pobieramy liste miast do comboboxa
				var miastaStore = new Ext.data.Store({
						reader: new Ext.data.JsonReader({
								fields: ['gid', 'nazwa'],
								root: 'rows'
						}),
						proxy: new Ext.data.HttpProxy({
								url: 'dajSlownik.php?rodzaj=miasto'
						}),
						autoLoad: true,
						listeners: {
								"load": function(store, rekordy, opcje) {
										popupOgrodyForm.getForm().findField("id_miasta").setValue(id_miasta);
								}
						}
				});
				
				//pobieramy liste delegatur do comboboxa				
				var delegStore = new Ext.data.Store({
						reader: new Ext.data.JsonReader({
								fields: ['gid', 'nazwa'],
								root: 'rows'
						}),
						proxy: new Ext.data.HttpProxy({
								url: 'dajSlownik.php?rodzaj=deleg'
						}),
						autoLoad: true,
						listeners: {
								"load": function(store, rekordy, opcje) {
										popupOgrodyForm.getForm().findField("id_deleg").setValue(id_deleg);
								}
						}
				});

				
				var nazwa = feature.attributes['nazwa'];	
				var parcela = feature.attributes['parcela'];
				var prezes = feature.attributes['prezes'];
				var telefon = feature.attributes['telefon'];
				var id_miasta = feature.attributes['id_miasta'];
				var id_deleg = feature.attributes['id_deleg'];

				var popupOgrodyForm = new Ext.FormPanel({
		        labelWidth:80,
		        frame:true,
		        defaultType:'textfield',
		        autoWidth: true,
		        autoHeight: true,
		        monitorValid:true,
		        items:[{
		            fieldLabel:'Nazwa',
		            name:'nazwa',
		            value: nazwa,
		            allowBlank:false
		        },{
		            fieldLabel:'Parcela', 
		            name:'parcela',
								value: parcela,
		            allowBlank:false
		        },{
		            fieldLabel:'Prezes', 
		            name:'prezes',
								value: prezes,
		            allowBlank:true
		        },{
		            fieldLabel:'Telefon', 
		            name:'telefon',
								value: telefon,
		            allowBlank:true
		        },{
		        		xtype: 'combo',
		        		fieldLabel: 'Miasto',
		        		name: 'id_miasta',
		        		mode: 'local',
		        		triggerAction: 'all',
		        		store: miastaStore,
		        		displayField: 'nazwa',
		        		valueField: 'gid',
		        		width: 129
		        },{
		        		xtype: 'combo',
		        		fieldLabel: 'Delegatura',
		        		name: 'id_deleg',
		        		mode: 'local',
		        		//mode: 'remote', //czyta za kazdym razem jak sie wdepnie w rozwijanie
		        		triggerAction: 'all',
		        		store: delegStore,
		        		displayField: 'nazwa',
		        		valueField: 'gid',
		        		width: 129
		        }],
		        buttons:[{        	        	
		            text:'Aktualizuj',
		            formBind: true,
		            handler:function(){
		            		var f = popupOgrodyForm.getForm();
										if(f.isValid()){									
												feature.attributes.nazwa = f.findField("nazwa").getValue();
								    		feature.attributes.parcela = f.findField("parcela").getValue();
								    		feature.attributes.prezes = f.findField("prezes").getValue();
								    		feature.attributes.telefon = f.findField("telefon").getValue();
								    		feature.attributes.id_miasta = f.findField("id_miasta").getValue();
												feature.attributes.id_deleg = f.findField("id_deleg").getValue();
								    									    		
								    		//ustawiamy stan feature'a na zaktualizowany								    		
								    		feature.state = OpenLayers.State.UPDATE;
								    		
								    		//trzeba dac znac, ze cos sie zmienilo
								    		feature.layer.events.triggerEvent( "afterfeaturemodified", {feature: feature} );
								    		selectOgrody.unselect(feature);
								    		usunPopup();	
										}		            	
		        		}
		        }]
		    });

		    //zwracamy foremke jako wynik funkcji
		    return popupOgrodyForm
		}		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		function createPopupDzialkiFormB(feature){
				var numer = feature.attributes['numer'];
    		var powierzchnia = feature.attributes['powierzchnia'];
    		
    		//tworzymy foremke i wypelniamy ja wartosciami
				var popupDzialkiForm = new Ext.FormPanel({
		        labelWidth:80,
		        frame:true,
		        defaultType:'label',
		        autoWidth: true,
		        autoHeight: true,
		        items:[{
		        		fieldLabel:'Numer',
		        		text: 'Brak uprawnieñ'
		            //text: numer
		        },{
		        		fieldLabel:'Powierzchnia', 
		        		text: 'Brak uprawnieñ'
								//text: powierzchnia
		        }],
		        buttons:[{        	        	
		            text:'OK',
		            handler:function(){											
										selectDzialki.unselect(feature);
								    usunPopup();							          	
		        		}
		        }]
		     });
		     return popupDzialkiForm    					
		}		   
		   
		   
		   











		function createPopupDzialkiFormO(feature){
				var numer = feature.attributes['numer'];
    		var powierzchnia = feature.attributes['powierzchnia'];
    		var uzytkownik = feature.attributes['uzytkownik'];
    		var telefon = feature.attributes['telefon'];
    		var adres = feature.attributes['adres'];
    		var legitymacja = feature.attributes['legitymacja'];
    		var wolna = (feature.attributes['wolna'] == "true")? "TAK": "NIE";
    		var prad = (feature.attributes['prad'] == "true")? "TAK": "NIE";
    		var woda = (feature.attributes['woda'] == "true")? "TAK": "NIE";
    		var gaz = (feature.attributes['gaz'] == "true")? "TAK": "NIE";		    		
    		
    		
    		//tworzymy foremke i wypelniamy ja wartosciami
				var popupDzialkiForm = new Ext.FormPanel({
		        labelWidth:80,
		        frame:true,
		        defaultType:'label',
		        autoWidth: true,
		        autoHeight: true,
		        items:[{
		        		fieldLabel:'Numer',
		            text: numer
		        },{
		        		fieldLabel:'Powierzchnia', 
								text: powierzchnia
		        },{
		        		fieldLabel:'U¿ytkownik', 
								text: uzytkownik
		        },{
		        		fieldLabel:'Telefon', 
								text: telefon
		        },{
		        		fieldLabel:'Adres', 
								text: adres
		        },{
		        		fieldLabel:'Legitymacja', 
								text: legitymacja
		        },{
		        		fieldLabel:'Wolna', 
								text: wolna
		        },{
		        		fieldLabel:'Prad', 
								text: prad
		        },{
		        		fieldLabel:'Woda', 
								text: woda
		        },{
		        		fieldLabel:'Gaz', 
								text: gaz
		        }],
		        buttons:[{        	        	
		            text:'OK',
		            handler:function(){											
										selectDzialki.unselect(feature);
								    usunPopup();							          	
		        		}
		        }]
		     });
		     return popupDzialkiForm    					
		}		
		
		
		
		
		
		
		
		
		
		
		
		
				   
		   
		   
		   
		   
		//tworzymy foremke z atrybutami do edycji (dzialki)   
		function createPopupDzialkiFormZ(feature){
				//pobieramy wartosci atrybutów dzialki i przekazujemy je do formularza
				var numer = feature.attributes['numer'];
    		var powierzchnia = feature.attributes['powierzchnia'];
    		var uzytkownik = feature.attributes['uzytkownik'];
    		var telefon = feature.attributes['telefon'];
    		var adres = feature.attributes['adres'];
    		var legitymacja = feature.attributes['legitymacja'];
    		var wolna = feature.attributes['wolna'] == "true";
    		var prad = feature.attributes['prad'] == "true";
    		var woda = feature.attributes['woda'] == "true";
    		var gaz = feature.attributes['gaz'] == "true";		
    		
    		//tworzymy foremke i wypelniamy ja wartosciami
				var popupDzialkiForm = new Ext.FormPanel({
		        labelWidth:80,
		        frame:true,
		        defaultType:'textfield',
		        autoWidth: true,
		        autoHeight: true,
		        monitorValid:true,
		        items:[{
		            fieldLabel:'Numer',
		            name:'numer',
		            value: numer,
		            allowBlank:false
		        },{
		            fieldLabel:'Powierzchnia', 
		            name:'powierzchnia',
								value: powierzchnia,
		            allowBlank:false,
		            readOnly: true
		        },{
								fieldLabel: 'U¿ytkownik',
								name: 'uzytkownik',
								value: uzytkownik
		        },{
								fieldLabel: 'Telefon',
								name: 'telefon',
								value: telefon		        	
		        },{
								fieldLabel: 'Adres',
								name: 'adres',
								value: adres				        	
		        },{
								fieldLabel: 'Legitymacja',
								name: 'legitymacja',
								value: legitymacja		        	
		        },{
		        		xtype: 'checkbox',
		        		fieldLabel: 'Wolna',
		        		name: 'wolna',
		        		checked: wolna			        	
		        },{
		        		xtype: 'checkbox',
		        		fieldLabel: 'Pr¹d',
		        		name: 'prad',
		        		checked: prad
		        },{
		        		xtype: 'checkbox',
		        		fieldLabel: 'Woda',
		        		name: 'woda',
		        		checked: woda		        	
		        },{
		        		xtype: 'checkbox',
		        		fieldLabel: 'Gaz',
		        		name: 'gaz',
		        		checked: gaz  	
		        }],
		        buttons:[{        	        	
		            text:'Aktualizuj',
		            formBind: true,
		            handler:function(){
		            		var f = popupDzialkiForm.getForm();
										if(f.isValid()){
											
												//mozna dostac sie do pola na dwa sposoby, albo po nazwie albo po indeksie												
												var pola = popupDzialkiForm.getForm().items;											
												feature.attributes.numer = f.findField("numer").getValue();
								    		feature.attributes.powierzchnia = f.findField("powierzchnia").getValue();
								    		feature.attributes.uzytkownik = f.findField("uzytkownik").getValue();
								    		feature.attributes.telefon = f.findField("telefon").getValue();
								    		feature.attributes.adres = f.findField("adres").getValue();
								    		feature.attributes.legitymacja = f.findField("legitymacja").getValue();
								    		feature.attributes.wolna = pola.items[6].checked.toString();
								    		feature.attributes.prad = pola.items[7].checked.toString();
								    		feature.attributes.woda = pola.items[8].checked.toString();
								    		feature.attributes.gaz = pola.items[9].checked.toString();	
								    		
								    		//ustawiamy stan feature'a na zaktualizowany								    		
								    		feature.state = OpenLayers.State.UPDATE;
								    		
								    		//trzeba dac znac, ze cos sie zmienilo
								    		feature.layer.events.triggerEvent( "afterfeaturemodified", {feature: feature} );
								    		selectDzialki.unselect(feature);
								    		usunPopup();							
										}		            	
		        		}
		        }]
		    });
		    
		    //zwracamy foremke jako wynik funkcji
		    return popupDzialkiForm
		}   
		   
		   

    
    
    
    		   
		   
		   







		function checkBrowser(){
				var browser = navigator.appName;
				if (browser == 'Microsoft Internet Explorer'){
						return 'ie';
				} else {
						return 'other';
				}
		}
		
		
				   


		
		


    
    


    function createPopup(feature, _selectControl, nazwaFunkcjiGenForm, _title) {
    		//var _form = form.cloneConfig();
    		var genForm = eval(nazwaFunkcjiGenForm)(feature);
    		//pozycja okienka popup
    		var leftOffset = 170, topOffset = 350, rightOffset = 150;
    		var reso = map.getResolution();
    		var mapExtent = map.getExtent();
    		var mapXCenter = mapExtent.getCenterPixel().x;
    		var featureXPos = feature.geometry.getBounds().getCenterPixel().x;
    		var bLeft = featureXPos >= mapXCenter;
    		var popupPos;
    		    		
    		if(bLeft){ popupPos = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(mapExtent.left + (leftOffset * reso), mapExtent.top - (topOffset * reso))) } 
    		else { popupPos = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(mapExtent.right - (rightOffset * reso), mapExtent.top - (topOffset * reso))) }    		
    		
        popup = new GeoExt.Popup({
        		id: 'popup-atrybuty-' + checkBrowser(),
            title: _title,
            layout: 'fit',
            location: popupPos,
            //autoScroll: true,
            //maximizable: false,
            collapsible: true,
            resizable: false,
            draggable: true,
            shadow: true,
            items: [genForm],
            map: map
        });
        popup.on({
            close: function(){
            		_selectControl.unselect(feature);
            		usunPopup();
            }
        });
        popup.show();
    }
    
		






		
		//usuwa okno popup z mapy i od featurea odczepia
		function usunPopup(){
				if (popup != null){
						popup.destroy();
						popup = null;
				}
		}
















		
/*		
		//kontrolka select dla warstwy (dwa podejscia)
		select = new OpenLayers.Control.SelectFeature
		(
				[wfsOgrody], 
				{
					
				}
		);
		map.addControl(select);
		select.activate();
				
		select.handlers['feature'].stopDown =false;
		select.handlers['feature'].stopUp = false;			
		//wfsOgrody.events.register('featureselected', wfsOgrody, function(evt) { alert('click-dupa');});
		wfsOgrody.events.on({
		    featureselected: function(event) {
		    	alert("ble");
		        var feature = event.feature;
		        var area = feature.geometry.getArea();
		        var id = feature.attributes.key;
		        var output = "ogrod: " + id + " powierzchnia: " + area.toFixed(2);		        
		    }
		});		
					
*/	
			
			
					
		
		
		
		
		// create our own layer node UI class, using the TreeNodeUIEventMixin ??? - nie rozumie tego
		var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
    
    
    // using OpenLayers.Format.JSON to create a nice formatted string of the
    // configuration for editing it in the UI

	/*var temp_s = ',{
        nodeType: "gx_layer",
        expanded: true,
        layer: "UM Gliwice",
        isLeaf: false,
        // create subnodes for the layers in the LAYERS param. If we assign
        // a loader to a LayerNode and do not provide a loader class, a
        // LayerParamLoader will be assumed.
        loader: {
            param: "LAYERS"	
        }
    }';*/
    var treeConfig = new OpenLayers.Format.JSON().write([{
        nodeType: "gx_baselayercontainer",
        text: "Warstwy Podkladowe",
        expanded: true
    }, {
        nodeType: "gx_overlaylayercontainer",
        text: "Warstwy Wektorowe",
        expanded: true,
        // render the nodes inside this container with a radio button,
        // and assign them the group "foo".
        loader: {
            baseAttrs: {
                radioGroup: "foo",
                uiProvider: "layernodeui"
            },
            createNode: function(attr) {
            		//dodaj legende do wezelka
            		attr.component = {
            				xtype: "gx_vectorlegend",
            				layerRecord: mapPanel.layers.getByLayer(attr.layer),
            				showTitle: false,
            				cls: "legend",
            				untitledPrefix: ""
            		}
            		return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);	
            }
        }
    }, {
        nodeType: "gx_layer",
        expanded: true,
        layer: "Unimap WMS",
        isLeaf: false,
        // create subnodes for the layers in the LAYERS param. If we assign
        // a loader to a LayerNode and do not provide a loader class, a
        // LayerParamLoader will be assumed.
        loader: {
            param: "LAYERS"	
        }
    },{
        nodeType: "gx_layer",
        expanded: true,
        layer: "UM Gliwice",
        isLeaf: false,
        // create subnodes for the layers in the LAYERS param. If we assign
        // a loader to a LayerNode and do not provide a loader class, a
        // LayerParamLoader will be assumed.
        loader: {
            param: "LAYERS"	
        }
    }
	], true);
    
    
	
    
   // treeConfig = treeConfig + treeConfig1;
    
    
    
    
    
    
    
    // create the tree with the configuration from above - moznaby konfiguracje zaczytywac z JSONA
    warstwyPanel = new Ext.tree.TreePanel({
        title: "Warstwy",
        plugins: [
            new GeoExt.plugins.TreeNodeRadioButton({
                listeners: {
                    "radiochange": function(node) {
                        //alert(node.text + " jest teraz aktywna warstwa.");
                        //layer.setZIndex
                        
                    }
                }
            }),
            {	ptype: "gx_treenodecomponent"	}
        ],
        loader: new Ext.tree.TreeLoader({
            // applyLoader has to be set to false to not interfer with loaders
            // of nodes further down the tree hierarchy
            applyLoader: false,
            uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
            nodeType: "async",
            // the children property of an Ext.tree.AsyncTreeNode is used to
            // provide an initial set of layer nodes. We use the treeConfig
            // from above, that we created with OpenLayers.Format.JSON.write.
            //children: Ext.decode(treeConfig,treeConfig1),
			children: Ext.decode(treeConfig)
        },
	   
        listeners: {
            "radiochange": function(node){
                alert(node.layer.name + " jest teraz aktywna warstwa.");
            }
        },
        rootVisible: false,
        collapsed: true,
        iconCls: 'warstwy-icon'
       
        
    });  






function warDodatkowe(){



/*var treeConfig1 = new OpenLayers.Format.JSON().write([ {
        nodeType: "gx_layer",
        expanded: true,
        layer: "UM Gliwice",
        isLeaf: false,
        // create subnodes for the layers in the LAYERS param. If we assign
        // a loader to a LayerNode and do not provide a loader class, a
        // LayerParamLoader will be assumed.
        loader: {
            param: "LAYERS"	
        }
    },{
        nodeType: "gx_layer",
        expanded: true,
        layer: "UM Gliwice1",
        isLeaf: false,
        // create subnodes for the layers in the LAYERS param. If we assign
        // a loader to a LayerNode and do not provide a loader class, a
        // LayerParamLoader will be assumed.
        loader: {
            param: "LAYERS"	
        }
    }
	], true);*/
	//alert("dddd");
	if(wararray){
		var u = 0;
		var tabtree = new Array();
		for(var i=0;i<wararray.length;i++){
				u=i+1;
				eval('var treeConfig'+u+' = new OpenLayers.Format.JSON().write([	{	nodeType: "gx_layer",		expanded: true,	layer: wararray[i],	isLeaf: false,		loader: {		param: "LAYERS"		}	}], true);');
				tabtree[i] = 'treeConfig'+u;
		}
		//alert(tabtree);
		//Ext.Msg.alert('Status', 'sadfsadasasassasaassasa', function(btn, text){			 				                					                    
		//						                });
		
		



		//tworzenie warstw dodatkowych 

		//tworzenie obiektu z nazwami warstw
		var string = "[";
		for(var i=0;i<wararray.length;i++){
			string+="{text:'"+wararray[i]+"',	children: Ext.decode("+tabtree[i]+")}";
			if(i<(wararray.length-1)){
				string += ",";
			}
		}
		string += "]";
		eval('var obj='+string);
	
//dopisywanie do zak³adki warstw dodatkowych
	warstwyDodatkowe = new Ext.tree.TreePanel({
        title: "Warstwy dodatkowe",
        plugins: [
            new GeoExt.plugins.TreeNodeRadioButton({
                listeners: {
                    "radiochange": function(node) {
                        //alert(node.text + " jest teraz aktywna warstwa.");
                        //layer.setZIndex
                        
                    }
                }
            }),
            {	ptype: "gx_treenodecomponent"	}
        ],
        loader: new Ext.tree.TreeLoader({
            // applyLoader has to be set to false to not interfer with loaders
            // of nodes further down the tree hierarchy
            applyLoader: false,
            uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
            nodeType: "async",
            // the children property of an Ext.tree.AsyncTreeNode is used to
            // provide an initial set of layer nodes. We use the treeConfig
            // from above, that we created with OpenLayers.Format.JSON.write.
            //children: Ext.decode(treeConfig,treeConfig1),
			children: obj
        },
	   
        listeners: {
            "radiochange": function(node){
                alert(node.layer.name + " jest teraz aktywna warstwa.");
            }
        },
        rootVisible: false,
        collapsed: true,
        iconCls: 'warstwy-icon'
       
        
    });
	}
	
}
    
    
    
    
    
    
    
    
    
    
    function wybOgrZListy(node, e) {
		//console.log(wfsOgrody);

    		var _id = node.attributes["gid"];
						
    		if (_id.substr(0, 1) == 'o') {
    				_id = _id.substr(2);
					console.log(_id)
    				//wybieranie elementu o danym gid
    				for (fid in wfsOgrody.features) {
    						var feature = wfsOgrody.features[fid];
							console.log(feature.attributes);
    						var _gid = feature.attributes.gid;
							console.log(_gid);
							//alert(_id);
    						if (_gid == _id) {
    								var bounds = feature.geometry.getBounds();
        						map.zoomToExtent(bounds);
    						}
    				}
    		}    	
    }
    
    



		function wyswietlPdf(node, e){
				var path = node.attributes["fullpath"];
				//myTempWindow = window.open(path,'','left=10000,screenX=10000');
				//myTempWindow.document.execCommand('SaveAs','null','download.pdf');
				//myTempWindow.close();
				window.open(path);
		}



    
    

    
    
    
    function collapseNodes(node, deep, anim)
    {
    		miastaOgrody.collapseAll();
    }
    
    
    
     
    
    
    
    
    
    //na poczatku sie odpala bo root sie rozwija
    function expandMiasto(node)
    {
		
    		wfsOgrody.filter = new OpenLayers.Filter.Comparison
				(
						{
		        		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		            property: "id_miasta",
		            value: (node.attributes["gid"]).substr(2)
						}
				); 
				console.log(wfsOgrody);
				wfsOgrody.refresh({force: true});
				//console.log(wfsOgrody);
				//jeszcze nie sa wczytane ogrody - w funkcji 'ogrodyLoaded' jest powiekszenie do maksymalnego rozmiaru warstwy      
    }
    
    
/*        
    function expandDelegatura(node)
    {
    		wfsOgrody.filter = new OpenLayers.Filter.Comparison
				(
						{
		        		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		            property: "id_deleg",
		            value: (node.attributes["gid"]).substr(2)
						}
				); 
				wfsOgrody.refresh({force: true});
    }
*/    
    
    
    
    
    //panel miasta ogrody
    miastaOgrody = new Ext.tree.TreePanel({
    		title: "Miasta-Ogrody",
    		userArrows: true,
    		animate: true,
    		rootVisible: false,
    		loader: new Ext.tree.TreeLoader({
         		url  : 'jsonTreeOgr.php'	
  	    }),
    		root: new Ext.tree.AsyncTreeNode({
    				id: 'isroot',
    				expanded: true,
    				text: 'root'
    		}),
    		listeners: {
    				"click": { fn: wybOgrZListy },
    				"beforeexpandnode": { fn: collapseNodes },
    				"expandnode": { fn: expandMiasto }
    		},
    		collapsed: true,
    		iconCls: 'mo-icon'
    });    







    
    
    
/*    
    
    //panel delegatury ogrody
    delegOgrody = new Ext.tree.TreePanel({
    		title: "Delegatury-Ogrody",
    		userArrows: true,
    		//animate: true,
    		//autoscroll: true,
    		//scroll: false,
    		//containerScroll: true,
    		rootVisible: false,
    		// auto create TreeLoader
   			//dataUrl: 'get-nodes.php',

    		loader: new Ext.tree.TreeLoader({
         		url  : 'jsonTreeDel.php'
  	    }),
    		root: new Ext.tree.AsyncTreeNode({
    				id: 'isroot',
    				expanded: true,
    				text: 'root'
    		}),
    		listeners: {
    				"click": { fn: wybOgrZListy },
    				"beforeexpandnode": { fn: collapseNodes },
    				"expandnode": { fn: expandDelegatura }
    		},
    		collapsed: true,
    		iconCls: 'do-icon'
    });
    
*/    
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
    
    
    
		var analizy = new Ext.tree.TreePanel({
    		title: "Analizy",
    		userArrows: true,
    		animate: true,
    		autoscroll: true,
    		containerScroll: true,
    		rootVisible: false,
    		loader: new Ext.tree.TreeLoader({
         		dataUrl  : 'analizy.json',
         		baseParams: {format: 'json'}
  	    }),
    		root: new Ext.tree.AsyncTreeNode({
    				id: 'isroot',
    				expanded: true,
    				text: 'root'
    		}),
    		listeners: {
    				"click": { fn: dajAnalize }
    		},
    		collapsed: true,
    		iconCls: 'analysis-icon'
    });    
    
    







    function dajAnalize(node, e){
    		var funkcja = eval(node.attributes["akcja"]);
    		//iteracja przez wszystkie nody i wylaczenie tabek
    		analizy.getRootNode().cascade(function(){
    				if (this.attributes.itemid){
    						var funkcja2 = eval(this.attributes["akcja"]);
    						funkcja2(false);
    				}
    		});
    		funkcja(true);
    }
    
    
    
    
    
 
    
    
    
    
    function analizaWolnychDzialek(_exe){
			if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
			}
    		if (_exe == true) {
						//now = new Date();
						//setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
						rightPanel.add(gridDzialkWolnePanel.cloneConfig());	
						rightPanel.setActiveTab(rightPanel.items.length - 1);					
						Ext.getCmp("panel-pomocy").update(analizaDzialkiWolneHTML);	
						dsAnalizyWD.reload();
						map.addLayer(analizyLyr);
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-wolnych-dzialek"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);    				    				
		    				dsAnalizyWD.removeAll();
		    				map.removeLayer(analizyLyr);
		    		} catch(err) {}
		    }
    }
	
	function analizaWlascicieleDzialek2(_exe){
			
				//alert(gid);
				
				if (_exe == true) {
				if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
					if (aktywnyOgrod){
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
						rightPanel.add(gridWlascicielePanel.cloneConfig());	
						rightPanel.setActiveTab(rightPanel.items.length - 1);					
						Ext.getCmp("panel-pomocy").update(analizaDzialkiWolneHTML);	
						dsWlascicieleWD.reload();
						map.addLayer(wlascicieleLyr);
					} else {
		    						Ext.Msg.alert('Niepowodzenie!', 'Brak aktywnego ogrodu, wybierz ogród i kliknij dwukrotnie w jego obrêbie');	
		    		}
				} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Podgl¹d dokumentów dostêpny tylko dla zalogowanych u¿ytkowników');		
		    	}
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-wolnych-dzialek"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);    				    				
		    				dsWlascicieleWD.removeAll();
		    				map.removeLayer(wlascicieleLyr);
		    		} catch(err) {}
		    }
    }
    
    
    
 
 
    

    
 
    function analizaNiewymiarowychDzialek(_exe){
			if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
			}
    		if (_exe == true) {
					rightPanel.add(gridDzialkNiewymiarowePanel.cloneConfig());	
					rightPanel.setActiveTab(rightPanel.items.length - 1);						
					Ext.getCmp("panel-pomocy").update(analizaDzialkiNiewymiaroweHTML);	
					dsAnalizyDN.reload();
					map.addLayer(analizyLyr);
				
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-niewymiarowych-dzialek"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);    				    				
		    				dsAnalizyDN.removeAll();
		    				map.removeLayer(analizyLyr);
		    		} catch(err) {}
		    }    		
    }









		function analizaPozostaleDokumenty(_exe){
			//now = new Date();
			//setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
    		if (_exe == true) {
					if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
			
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
		    				
				    				Ext.Ajax.request({
												url: "infoDodatkowe.php?lname=us&user="+_usr,
												success: function(objServerResponse, opts) {
														var odp = Ext.decode(objServerResponse.responseText);
														//Ext.Msg.alert('Niepowodzenie!', 'Nie masz uprawnieñ do wyœwietlanie dokumentów');
														var user = odp.id;
														//var uprD = _upr.getUprEl(deleg, 'd', 5);
														//var uprO = _upr.getUprEl(aktywnyOgrod, 'o', 5);
														//if ((uprD == 'o') || (uprO == 'o')) {
																//alert(uprD); //o
																//alert(uprO); //b															
																rightPanel.add(dajDokumentyPozostalePanel(user));
																rightPanel.setActiveTab(rightPanel.items.length - 1);
																Ext.getCmp("panel-pomocy").update(analizaDokumentyHTML);
														//} else {
																//alert(uprD); //undefined
																//alert(uprO); //b
																//Ext.Msg.alert('Niepowodzenie!', 'Nie masz uprawnieñ do wyœwietlanie dokumentów');
														//}
												}
										});   						
		    				
		    		} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Podgl¹d dokumentów dostêpny tylko dla zalogowanych u¿ytkowników');		
		    		}
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-dokumentow"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);
		    		} catch(err) {}    			
    		}				
		}
		
		
		
		
		function analizaPokazDokumenty(_exe){
			//now = new Date();
			//setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
    		if (_exe == true) {
					if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
			
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
		    				if (aktywnyOgrod){
				    				Ext.Ajax.request({
												url: "infoDodatkowe.php?lname=o&gid="+aktywnyOgrod,
												success: function(objServerResponse, opts) {
														var odp = Ext.decode(objServerResponse.responseText);
														var deleg = odp.iddeleg;
														var uprD = _upr.getUprEl(deleg, 'd', 5);
														var uprO = _upr.getUprEl(aktywnyOgrod, 'o', 5);
														if ((uprD == 'o') || (uprO == 'o')) {
																//alert(uprD); //o
																//alert(uprO); //b															
																rightPanel.add(dajDokumentyPanel(aktywnyOgrod));
																rightPanel.setActiveTab(rightPanel.items.length - 1);
																Ext.getCmp("panel-pomocy").update(analizaDokumentyHTML);
														} else {
																//alert(uprD); //undefined
																//alert(uprO); //b
																Ext.Msg.alert('Niepowodzenie!', 'Nie masz uprawnieñ do wyœwietlanie dokumentów');
														}
												}
										});   						
		    				} else {
		    						Ext.Msg.alert('Niepowodzenie!', 'Brak aktywnego ogrodu, wybierz ogród i kliknij dwukrotnie w jego obrêbie');	
		    				}
		    		} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Podgl¹d dokumentów dostêpny tylko dla zalogowanych u¿ytkowników');		
		    		}
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-dokumentow"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);
		    		} catch(err) {}    			
    		}				
		}
		
		
		
		
		
		
		
		
		
		
		
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
 
	var eeeee = 330;
	//if(!aktywnyOgrod){ eeeee=329; }else{ eeeee=aktywnyOgrod; }
	
	var dsWlascicieleWD = new GeoExt.data.FeatureStore({
				layer: wlascicieleLyr,
				fields: [
						{name: 'numer', type: 'string'},
						{name: 'powierzchnia', type: 'string'},
						{name: 'name', type: 'string'},
						{name: 'nazwa', type: 'string'},
						{name: 'miasto', type: 'string'}
				], proxy: new GeoExt.data.ProtocolProxy({
						
						protocol: new OpenLayers.Protocol.HTTP({
								refresh:true,
								url: 'dajWlascicieli.php',
								format: new OpenLayers.Format.GeoJSON()
						})
				}), autoLoad: false
		}); 
	
	
	var gridWlascicielePanel = new Ext.grid.GridPanel({
    		itemId: "panel-wlascicieli2",
        title: "Uzytkownicy",
        store: dsWlascicieleWD,
        //autoWidth: true,
        border: true,
        //layout: 'fit',
        columns: [{
            header: "Nr",
            width: 70,
        		sortable: true,  
            dataIndex: "numer"
        },{
            header: "Pow.",
            width: 40,
            dataIndex: "powierzchnia"
        },{
            header: "Nazwisko i imiê",
            width: 150,
            sortable: true,
            dataIndex: "name"
        },{
            header: "Nazwa ogr",
            width: 150,
            sortable: true,
            dataIndex: "nazwa"
        },{
            header: "Miasto",
            width: 120,
            sortable: true,
            dataIndex: "miasto"
        }],
        listeners: {
        	rowclick: function(gridObj, rowIndex, eventObj) {
        				var record = gridObj.store.getAt(rowIndex);
        				var _dzialka = record.get("feature");
        				var c = _dzialka.geometry.getCentroid();
						//map.addLayer(wlascicieleShowLyr);
						//map.addControl
						var layers = map.getLayersByName('Markers');
						for(var layerIndex = 0; layerIndex<layers.length;layerIndex++){
							map.removeLayer(layers[layerIndex]);
						}
						var markers = new OpenLayers.Layer.Markers( 'Markers' );
						
						map.addLayer(markers);

						var size = new OpenLayers.Size(21,25);
						var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
						var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
						//markers.destroy();
						markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(c.x, c.y),icon));

						
        				map.moveTo(new OpenLayers.LonLat(c.x, c.y), 18);
        		}	
				
        }

    });
		
		
		
		
		
		
		function uploadFile(){
			
    	
			
    				if((getCookie('upr')) && (getCookie('usr'))){
						
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
						
	    				Ext.Ajax.request({
							url: "fileupload/file-upload.html",
							success: function(objServerResponse, opts) {
								var odp = Ext.decode(objServerResponse.responseText);
								Ext.Msg.alert('OK', odp);
							}
						});					
		    		} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Mo¿liwoœæ dodawanie tylko przez zalogowanych u¿ytkowników');		
		    		}
    					
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		function analizaWlascicieleDzialek(_exe){
    		if (_exe == true) {
    				if((readCookie('upr')) && (readCookie('usr'))){
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
					//if (_upr){
		    				if (aktywnyOgrod){
				    				Ext.Ajax.request({
												url: "listaWlascicieli.php?lname=o&gid="+aktywnyOgrod,
												success: function(objServerResponse, opts) {
														var odp = Ext.decode(objServerResponse.responseText);
														//Ext.Msg.alert('Niepowodzenie!', odp.msg);
														
														//if ((uprD == 'o') || (uprO == 'o')) {
																//alert(uprD); //o
																//alert(uprO); //b	
																//Ext.Msg.alert('Niepowodzenie!', 'TU');																
																rightPanel.add(dajWlascicielePanel(aktywnyOgrod));
																rightPanel.setActiveTab(rightPanel.items.length - 1);
																Ext.getCmp("panel-pomocy").update(analizaDokumentyHTML);
														//} else {
																//alert(uprD); //undefined
																//alert(uprO); //b
														//		Ext.Msg.alert('Niepowodzenie!', 'Nie masz uprawnieñ do wyœwietlanie dokumentów');
														//}
												}
										});   						
		    				} else {
		    						Ext.Msg.alert('Niepowodzenie!', 'Brak aktywnego ogrodu, wybierz ogród i kliknij dwukrotnie w jego obrêbie');	
		    				}
		    		} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Podgl¹d dokumentów dostêpny tylko dla zalogowanych u¿ytkowników');		
		    		}
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-wlascicieli"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);
		    		} catch(err) {}    			
    		}				
		}
		
		
		function analizaWlascicieleDzialekPDF(_exe){
			//now = new Date();
			//setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
    		if (_exe == true) {
					if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
			
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
    				//if (_upr){
		    				if (aktywnyOgrod){
				    			window.open('listaWlascicieliPDF.php?&gid='+aktywnyOgrod,'','scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');
		    				} else {
		    						Ext.Msg.alert('Niepowodzenie!', 'Brak aktywnego ogrodu, wybierz ogród i kliknij dwukrotnie w jego obrêbie');	
		    				}
		    		} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Podgl¹d dokumentów dostêpny tylko dla zalogowanych u¿ytkowników');		
		    		}
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-wlascicieli"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);
		    		} catch(err) {}    			
    		}				
		}
		
		function analizaWlascicieleDzialekExcel(_exe){
			//now = new Date();
			//setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
    		if (_exe == true) {
					if((readCookie('upr')) && (readCookie('usr'))){
					now = new Date();
					setCookie('time_to_log',(now.getTime()+(15*60*1000))/1000,(15*60*1000));
					setCookie('usr',readCookie('usr'),(15*60*1000));
					setCookie('upr',readCookie('upr'),(15*60*1000));
						_usr = readCookie('usr');
						var upr = readCookie('upr');
						upr = upr.replace(/%7C/g, '|');
						upr = upr.replace(/%2C/g, ',');
						_upr = new uprawnienia(upr);
						console.log(_upr);
    				//if (_upr){
		    				if (aktywnyOgrod){
				    			window.open('listaWlascicieliExcel2.php?&gid='+aktywnyOgrod,'','scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');
		    				} else {
		    						Ext.Msg.alert('Niepowodzenie!', 'Brak aktywnego ogrodu, wybierz ogród i kliknij dwukrotnie w jego obrêbie');	
		    				}
		    		} else {
		    				Ext.Msg.alert('Niepowodzenie!', 'Podgl¹d dokumentów dostêpny tylko dla zalogowanych u¿ytkowników');		
		    		}
    		} else {
		    		try {
		    				rightPanel.remove(rightPanel.getComponent("panel-wlascicieli"));
		    				Ext.getCmp("panel-pomocy").update(wyjsciowyHTML);
		    		} catch(err) {}    			
    		}				
		}

















   
    if(getCookie('warstwa')){
		//if(warstwyDodatkowe){
		//lewy panel
		//alert('aaa');
		warDodatkowe();
		//Ext.Msg.alert('Niepowodzenie!', warstwyDodatkowe);
		leftPanel = new Ext.Panel({
        region: "west",      
        //split: true,
        width: 310,      
        layout: 'accordion',
        //collapsible: true,
        //collapseMode: "mini", 
        //autoscroll: true,
        title: "PANEL AKCJI",
        defaults: {
        		autoScroll: true
        }, 
					//items: [warstwyPanel, miastaOgrody, analizy]
        items: [warstwyPanel, miastaOgrody, analizy, warstwyDodatkowe]
    });

	}else{
		//alert('aada');
    //lewy panel
		leftPanel = new Ext.Panel({
        region: "west",      
        //split: true,
        width: 310,      
        layout: 'accordion',
        //collapsible: true,
        //collapseMode: "mini", 
        //autoscroll: true,
        title: "PANEL AKCJI",
        defaults: {
        		autoScroll: true
        },       
        items: [warstwyPanel, miastaOgrody, analizy]
    });
      
    }
      
      
      
      
      
      
      
     
      
      
      
 
 
 
    //VIEWPORT - organizacja kontenerow w oknie przegladarki
    new Ext.Viewport({	
        layout: "fit",
        hideBorders: true,
        items: {
            layout: "border",
            deferredRender: false,
            items: [mapPanel, leftPanel, rightPanel, {
            		contentEl: "header",
            		region: "north"
            }]
        }
    });  
 
 
 
 
 
 
 
 
 		/*
              
    // dialog for editing the tree configuration
    var treeConfigWin = new Ext.Window({
        layout: "fit",
        hideBorders: true,
        closeAction: "hide",
        width: 300,
        height: 400,
        title: "Tree Configuration",
        items: [{
            xtype: "form",
            layout: "fit",
            items: [{
                id: "treeconfig",
                xtype: "textarea"
            }],
            buttons: [{
                text: "Save",
                handler: function() {
                    var value = Ext.getCmp("treeconfig").getValue()
                    try {
                        var root = warstwyPanel.getRootNode();
                        root.attributes.children = Ext.decode(value);
                        warstwyPanel.getLoader().load(root);
                    } catch(e) {
                        alert("Invalid JSON");
                        return;
                    }
                    treeConfig = value;
                    treeConfigWin.hide();
                }
            }, {
                text: "Cancel",
                handler: function() {
                    treeConfigWin.hide();
                }
            }]
        }]
    });
 
		*/
 
 
 


		

    
    

    
            
    
    		   
		    

    
    
    
    
    
    
    
    

    








		//Wylaczenie defaultowego menu kontekstowego w oknie mapy
		//document.getElementById('ext-gen13').oncontextmenu = function(e){
		//		e = e?e:window.event;
		//		if (e.preventDefault) e.preventDefault(); //non-IE browsers.
		//		else return false; // For IE browsers.
		//};        
     		
});