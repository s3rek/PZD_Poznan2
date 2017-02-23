//zabazpieczenie java skrypt przed xmlhttprequest ze zdalnej domeny
OpenLayers.ProxyHost = "proxy.php?url=";

//trzeba zdefiniowac uklad
Proj4js.defs["EPSG:2180"] = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs";

//no-comment
var mapPanel, warstwyPanel, warstwyDodatkowe, map, wfsDzialki, wfsOgrody, measureControls, desc, logBttn, _usr, _upr, popup, aktywnyOgrod, nenene, mapPanel1, printDialog;


document.onmousedown = reset_timer;

var wyjsciowyHTML =
	"<div id=\"pomoc\">" +
	"<h1>Jak zacz¹æ?</h1>" +
	"<p>" +
	"Wybieraj¹c odpowiedni panel (po prawej stronie) ekranu odnajdŸ ogród.</br></br>" +
	"Wybieraj¹c panel warstw w³¹czasz lub wy³¹czasz elementy mapy.</br></br>" +
	"Wybieraj¹c panel analiz zadasz pytania mapie.</br></br>" +
	"Po zalogowaniu siê uzyskasz dostêp do dodatkowych funkcji." +
	"</p>" +
	"</div>";

var analizaDzialkiWolneHTML =
	"<div id=\"Pomoc\">" +
	"<h1>Wyszukiwanie wolnych dzia³ek</h1>" +
	"<p>" +
	"Wybieraj¹c zak³adke 'Dzia³kiWolne' przechodzisz do tabeli dzia³ek wolnych.</br></br>" +
	"Mo¿esz sprawdziæ gdzie znajduj¹ siê wolne dzia³ki i odszukaæ je korzystaj¹c z panelu akcji.</br></br>" +
	"Warstwe dzia³ek wolnych mo¿na w³¹czaæ/wy³¹czaæ w panelu warstw.</br></br>" +
	"</p>" +
	"</div>";

var analizaDzialkiNiewymiaroweHTML =
	"<div id=\"Pomoc\">" +
	"<h1>Wyszukiwanie niewymiarowych dzia³ek (powy¿ej 500 m&sup2) </h1>" +
	"<p>" +
	"Wybieraj¹c zak³adke 'Dzia³kiNiewymiarowe' przechodzisz do tabeli dzia³ek niewymiarowych.</br></br>" +
	"Mo¿esz sprawdziæ gdzie znajduj¹ siê niewymiarowe dzia³ki i odszukaæ je korzystaj¹c z panelu akcji.</br></br>" +
	"Warstwe dzia³ek niewymiarowych mo¿na w³¹czaæ/wy³¹czaæ w panelu warstw.</br></br>" +
	"</p>" +
	"</div>";

var analizaDokumentyHTML =
	"<div id=\"Pomoc\">" +
	"<h1>Podgl¹d dokumentów dotycz¹cych ogrodu </h1>" +
	"<p>" +
	"Wybieraj¹c zak³adkê 'DokumentyOgrodu' przechodzisz do listy dostêpnych dokumentów dotycz¹cych aktywnego ogrodu.</br></br>" +
	"Mo¿esz wybraæ interesuj¹cy Ciê dokument aby podejrzeæ jego zawartoœæ w nowej karcie przegl¹darki.</br></br>" +
	"Po zmianie aktywnego ogrodu zak³adka 'DokumentyOgrodu' zniknie.</br></br>" +


	"</p>" +
	"</div>";
var dodawanieZdjecHTML =
	"<div id=\"Pomoc\">" +
	"<h1>Dodawanie zdjêæ</h1>" +
	"<p>" +
	"Aby dodaæ zdjêcie nale¿y wybraæ kierunek w jakim by³o ono robione.</br></br>" +
	"Kolejnym krokiem jest wybranie pliku znajduj¹cego siê na dysku oraz dodanie opisu.</br></br>" +
	"Zdjêcie mo¿e zostaæ dodane tylko na obszarze ogrodu.</br></br>" +
	"Dodawane zdjêcie nie mo¿e przekroczyæ wielkoœci 5MB.</br></br>" +
	"</p>" +
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
	handleRightClicks: true,
	initialize: function(options) {
		this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
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

if ((getCookie('upr')) && (getCookie('usr'))) {
	var animeInt;
	clearInterval(animeInt);
	animeInt = setInterval("liczCzas()", 1000);
}

var login3 = new Ext.FormPanel({
	defaults: {
		xtype: 'textfield'
	}, //component by default of the form  
	bodyStyle: 'padding: 10px', //adding padding for the components of the form  
	html: 'Jeœli chcesz nadal korzystaæ z dodatkowych funkcji portalu zaloguj siê ponownie', //<-- in the next step we will remove this property  
	buttons: [{
		text: 'Zamknij',
		formBind: true,
		handler: function() {
			now = new Date();
			setCookie('zatrzymaj', 'stop', 0);
			//wczytanieDodatkowe();   	
			loginRepeat.hide();
			document.location.reload();
		}
	}]
});

var loginRepeat = new Ext.Window({
	title: 'Zosta³eœ wylogowany',
	layout: 'fit',
	width: 250,
	height: 135,
	resizable: false,
	modal: true,
	closeAction: 'hide',
	items: [login3]
});

//definiujemy klase usuwania elementu
var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
	onDelete: function() {},
	initialize: function(layers, options) {
		OpenLayers.Control.prototype.initialize.apply(this, [options]);
		this.initLayer(layers);
		this.handler = new OpenLayers.Handler.Feature(
			this, this.layer, {
				click: this.clickFeature
			}
		);
	},
	//root container - warstwa ktora z tablicy warstw tworzy jedna (logiczna) aby przypisac jadna kontrolke
	initLayer: function(layers) {
		if (OpenLayers.Util.isArray(layers)) {
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
	clickFeature: function(feature) {
		if (feature.fid == undefined) {
			this.layer.destroyFeatures([feature]);
		} else {
			feature.state = OpenLayers.State.DELETE;
			//ten trigger zalatwia wszystko (wyrzucenie elementu z flaga DELETE)
			feature.layer.events.triggerEvent(
				"afterfeaturemodified", {
					feature: feature
				}
			);
		}
		this.onDelete.call(this.scope, feature);
	},
	setMap: function(map) {
		this.handler.setMap(map);
		OpenLayers.Control.prototype.setMap.apply(this, arguments);
	},
	CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});

//pokazuje spinner podczas wczytywania portalu
showSpinner = function() {
	//wchodzi tu gdy zaczyna mielic ajax.request
	var loadingMask = Ext.get('loading-mask');
	loadingMask.setOpacity(0.5);
	Ext.get('loading').show();
	loadingMask.show();
}

//chowa spinner 
hideSpinner = function() {
	//wchodzi tu gdy konczy mielic ajax.request
	Ext.get('loading').hide();
	Ext.get('loading-mask').fadeOut({
		remove: false
	});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////    




////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//resetuje timer odliczaj¹cy do wylogowania u¿ytkownika
function reset_timer() {
	if ((getCookie('upr')) && (getCookie('usr'))) {
		now = new Date();
		setCookie('time_to_log', (now.getTime() + (15 * 60 * 1000)) / 1000, (15 * 60 * 1000));
		setCookie('usr', getCookie('usr'), (15 * 60 * 1000));
		setCookie('upr', getCookie('upr'), (15 * 60 * 1000));
	}

}

//ustawia wartoœæ i czas datê wa¿noœci ciasteczek
function setCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days));
		var expires = "; expires=" + date.toGMTString();
	} else var expires = "";
	console.log(value);
	document.cookie = name + "=" + value + expires + "; path=/";
}

//wczytuje ciasteczka i je zwraca
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

//odlicza czas do wylogowania u¿ytkownika	
function liczCzas() {
	now = new Date();
	rok = now.getFullYear();
	miesiac = now.getMonth();
	dzien = now.getDate();
	godzina = now.getHours();
	minuty = now.getMinutes();
	sekundy = now.getSeconds();
	minuty = minuty + 65;
	time_to = getCookie('time_to_log');
	if (((time_to * 1000) - now.getTime()) > 0 && time_to != null) {;
	} else {

		if (getCookie('zatrzymaj') != 'stop') {
			loginRepeat.show();
		}
	}
	time_to = getCookie('time_to_log');
	to = new Date(rok, miesiac, dzien, godzina, minuty, sekundy);
	ile = (time_to * 1000) - now.getTime();


	godzin = Math.floor(ile / (1000 * 60 * 60));
	minut = Math.floor(ile / (1000 * 60) - godzin * 60);
	sekund = Math.floor(ile / 1000 - godzin * 60 * 60 - minut * 60);
	//wyswietla timer
	if (ile > 0) {
		document.getElementById('time').innerHTML = 'Zostaniesz wylogowany za: ' + minut + ' minut, ' + sekund + ' sekund';
	} else {
		document.getElementById('time').innerHTML = 'Nie jesteœ zalogowany';
	}
}

//klasa uprawnienia
function uprawnienia(upr) {
	this.upr = upr;

	//oddaj liste 'gid' rozdzielonych przecinkami z uprawnien
	//w zaleznosci od rodzaju uprawnien (u,o,d)
	this.getGid = function(rodzaj_gid) {
		var uprArr = this.upr.split(",");
		var zestGid = 0;
		for (var i = 0; i < uprArr.length; i++) {
			var r = uprArr[i].charAt(0);
			if (r == rodzaj_gid) {
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
			if (r == rodzaj_gid) {
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
	this.getUprEl = function(gid, rodzaj_gid, idx_rodzaj_upr) {
		var wynik = "b";
		var uprArr = this.upr.split(",");
		alert(uprArr);
		for (var i = 0; i < uprArr.length; i++) {
			var r = uprArr[i].charAt(0);
			var g = uprArr[i].substring(uprArr[i].indexOf('_') + 1, uprArr[i].indexOf('.'));
			if ((r == rodzaj_gid) && (g == gid)) {
				var rodzajUprArr = uprArr[i].substring(uprArr[i].indexOf('.') + 1).split("|");
				wynik = rodzajUprArr[idx_rodzaj_upr];
			}
		}
		console.log(wynik);
		return wynik;
	}
}

//czyta ciasteczko o nazwie name
function readCookie(name) {
	console.log("Czytam cookie (readCookie): " + name)
	var cookiename = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(cookiename) == 0) return c.substring(cookiename.length, c.length);
	}
	return null;
}
