// Centros de distribuição (exemplo fictício na Grande São Paulo)
const centros = [
  { nome: "Centro de Distribuição - São Paulo", pos: { lat: -23.55052, lng: -46.633308 } },
  { nome: "Centro de Distribuição - Guarulhos", pos: { lat: -23.4543, lng: -46.5333 } },
  { nome: "Centro de Distribuição - Osasco", pos: { lat: -23.5329, lng: -46.7917 } },
  { nome: "Centro de Distribuição - Santo André", pos: { lat: -23.6737, lng: -46.5432 } },
];

let map, directionsService, directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: centros[0].pos,
    zoom: 10,
  });

  const info = new google.maps.InfoWindow();

  // Marcadores personalizados
  centros.forEach((c) => {
    const marker = new google.maps.Marker({
      position: c.pos,
      map,
      title: c.nome,
      icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });
    marker.addListener("click", () => {
      info.setContent(`<strong>${c.nome}</strong>`);
      info.open(map, marker);
    });
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });

  document.getElementById("btn-rota").addEventListener("click", tracarRota);
}

// Traça a rota do primeiro ao último centro, passando pelos demais
function tracarRota() {
  directionsService.route(
    {
      origin: centros[0].pos,
      destination: centros[centros.length - 1].pos,
      waypoints: centros.slice(1, -1).map((c) => ({ location: c.pos, stopover: true })),
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (resultado, status) => {
      if (status === "OK") directionsRenderer.setDirections(resultado);
      else alert("Não foi possível traçar a rota: " + status);
    }
  );
}

window.initMap = initMap;

// Carrega a API do Google Maps dinamicamente usando a chave do config.js
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
script.async = true;
document.head.appendChild(script);
