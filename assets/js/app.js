require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Search",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch"
], (
  Map,
  SceneView,
  BasemapToggle,
  BasemapGallery,
  Search,
  GraphicsLayer,
  Sketch
) => {
  const opcije = {
    stanja: {
      prikaziDesnuSekciju: true,
      prikaziDonjuSekciju: true,
      lat: 45.38361,
      long: 20.38194,
      udaljenost: 5000,
      rotacija: 30,
      kontrolerPrikazan: true
    },
    elementi: {
      header: document.querySelector("header"),
      prikazDesneSekcije: document.querySelector("#prikazDesneSekcije"),
      prikazDonjeSekcije: document.querySelector("#prikazDonjeSekcije"),
      prikazLokacije: document.querySelector("#prikazLokacije"),
      prikazUdaljenosti: document.querySelector("#prikazUdaljenosti"),
      promenaRotacije: document.querySelector("#promenaRotacije"),
      togluj: document.querySelector("#togluj")
    },
    metode: {
      prikazDesneSekcije() {
        this.stanja.prikaziDesnuSekciju = !this.stanja.prikaziDesnuSekciju;
        start();
      },
      prikazDonjeSekcije() {
        this.stanja.prikaziDonjuSekciju = !this.stanja.prikaziDonjuSekciju;
        start();
      },
      prikaziMojuLokaciju() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pozicija => {
            this.stanja.lat = pozicija.coords.latitude;
            this.stanja.long = pozicija.coords.longitude;
            start();
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
      toglujKontrole() {
        this.stanja.kontrolerPrikazan = !this.stanja.kontrolerPrikazan;
        if (this.stanja.kontrolerPrikazan) {
          this.elementi.togluj.innerHTML = "Sakrij kontrole";
          this.elementi.header.classList.remove("zatvori");
        } else {
          this.elementi.togluj.innerHTML = "Prikazi kontrole";
          this.elementi.header.classList.add("zatvori");
        }
      }
    },

    init() {
      this.elementi.prikazDesneSekcije.addEventListener(
        "change",
        this.metode.prikazDesneSekcije.bind(this)
      );
      this.elementi.prikazDonjeSekcije.addEventListener(
        "change",
        this.metode.prikazDonjeSekcije.bind(this)
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
      this.elementi.togluj.addEventListener(
        "click",
        this.metode.toglujKontrole.bind(this)
      );
    }
  };

  opcije.init();

  const graphicsLayer = new GraphicsLayer();

  const map = new Map({
    basemap: "topo-vector",
    ground: "world-elevation",
    layers: [graphicsLayer]
  });
  const start = () => {
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

    const search = new Search({
      view
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

    const sketch = new Sketch({
      view: view,
      layer: graphicsLayer
    });

    // dodavanje opcija

    if (opcije.stanja.prikaziDonjuSekciju) {
      view.ui.add(basemapToggle, "bottom-right");
      view.ui.add(sketch, "bottom-left");
    }
    if (opcije.stanja.prikaziDesnuSekciju) {
      view.ui.add(search, "top-right");
      view.ui.add(basemapGallery, "top-right");
    }
  };

  start();
}); // kraj
