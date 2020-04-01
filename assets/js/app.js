require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery"
], (Map, SceneView, BasemapToggle, BasemapGallery) => {
  const opcije = {
    stanja: {
      prikaziGaleriju: true,
      prikaziDonjuMapu: true,
      lat: 45.38361,
      long: 20.38194,
      udaljenost: 5000,
      rotacija: 30
    },
    elementi: {
      prikazGalerije: document.querySelector("#prikazGalerije"),
      prikaziDonjuMapu: document.querySelector("#prikazDonjeMape"),
      prikazLokacije: document.querySelector("#prikazLokacije"),
      prikazUdaljenosti: document.querySelector("#prikazUdaljenosti"),
      promenaRotacije: document.querySelector("#promenaRotacije"),
      forma: document.querySelector("#forma")
    },
    metode: {
      prikazGalerije() {
        this.stanja.prikaziGaleriju = !this.stanja.prikaziGaleriju;
        start();
      },
      prikazDonjeMape() {
        this.stanja.prikaziDonjuMapu = !this.stanja.prikaziDonjuMapu;
        start();
      },
      prikaziMojuLokaciju() {
        if (navigator.geolocation) {
          const [latInput, longInput] = [
            ...this.elementi.forma.querySelectorAll("input")
          ];
          navigator.geolocation.getCurrentPosition(pozicija => {
            latInput.value = pozicija.coords.latitude;
            longInput.value = pozicija.coords.longitude;
            this.metode.promeniLokaciju.call(this);
          });
        } else {
          alert("Geolokacija nije podrzana");
        }
      },
      promeniUdaljenost(event) {
        this.stanja.udaljenost = event.target.value;
        start();
      },
      promeniRotaciju(event) {
        this.stanja.rotacija = event.target.value;
        start();
      },
      promeniLokaciju() {
        const [latInput, longInput] = [
          ...this.elementi.forma.querySelectorAll("input")
        ];
        this.stanja.lat = +latInput.value;
        this.stanja.long = +longInput.value;
        start();
      }
    },

    init() {
      this.elementi.prikazGalerije.addEventListener(
        "change",
        this.metode.prikazGalerije.bind(this)
      );
      this.elementi.prikaziDonjuMapu.addEventListener(
        "change",
        this.metode.prikazDonjeMape.bind(this)
      );
      this.elementi.prikazLokacije.addEventListener(
        "click",
        this.metode.prikaziMojuLokaciju.bind(this)
      );
      this.elementi.prikazUdaljenosti.addEventListener(
        "change",
        this.metode.promeniUdaljenost.bind(this)
      );
      this.elementi.promenaRotacije.addEventListener(
        "change",
        this.metode.promeniRotaciju.bind(this)
      );
      this.elementi.forma.addEventListener("submit", event => {
        event.preventDefault();
        this.metode.promeniLokaciju.call(this);
      });
    }
  };

  opcije.init();

  const start = () => {
    const map = new Map({
      basemap: "topo-vector",
      ground: "world-elevation"
    });

    const view = new SceneView({
      container: "viewDiv",
      map,
      camera: {
        position: {
          x: opcije.stanja.long, // longitude
          y: opcije.stanja.lat, // latitude
          z: opcije.stanja.udaljenost // altitude
        },
        tilt: opcije.stanja.rotacija // perspective (stapeni)
      }
    });

    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "satellite"
    });

    const basemapGallery = new BasemapGallery({
      view: view,
      source: {
        portal: {
          url: "https://www.arcgis.com",
          useVectorBasemaps: true // Load vector tile basemaps
        }
      }
    });

    if (opcije.stanja.prikaziDonjuMapu) {
      view.ui.add(basemapToggle, "bottom-right");
    } else {
      view.ui.remove(basemapToggle, "bottom-right");
    }
    if (opcije.stanja.prikaziGaleriju) {
      view.ui.add(basemapGallery, "top-right");
    } else {
      view.ui.remove(basemapGallery, "top-right");
    }
  };

  start();
}); // kraj
