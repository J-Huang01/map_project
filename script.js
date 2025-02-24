let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // 默认中心点：旧金山
    zoom: 10,
  });

  // 启用 Google Places 地址自动补全
  const options = {
    types: ["geocode"],
  };

  const originInput = document.getElementById("origin");
  const destinationInput = document.getElementById("destination");

  new google.maps.places.Autocomplete(originInput, options);
  new google.maps.places.Autocomplete(destinationInput, options);
}

function calculateDistance() {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;

  if (!origin || !destination) {
    alert("Please enter both origin and destination addresses.");
    return;
  }

  const service = new google.maps.DistanceMatrixService();
  const geocoder = new google.maps.Geocoder();

  // 获取行车距离
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: "DRIVING",
    },
    function (response, status) {
      if (status !== "OK") {
        alert("Error with Distance Matrix API: " + status);
        return;
      }
      const distanceText = response.rows[0].elements[0].distance.text;
      const durationText = response.rows[0].elements[0].duration.text;
      document.getElementById(
        "distance-result"
      ).innerHTML = `Driving Distance: ${distanceText}, Duration: ${durationText}`;
    }
  );

  // 标记起点 & 终点
  geocoder.geocode({ address: origin }, function (results, status) {
    if (status === "OK") {
      new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
      map.setCenter(results[0].geometry.location);
    }
  });

  geocoder.geocode({ address: destination }, function (results, status) {
    if (status === "OK") {
      new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
    }
  });
}

// 初始化地图
window.onload = initMap;
