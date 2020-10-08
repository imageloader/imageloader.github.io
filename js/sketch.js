let img;
let input;
let allData;
let private_key = "4ff09c9146213c";
let geoData;

function setup() {
  noCanvas();
  input = createFileInput(callback);
  input.elt.setAttribute("name", "file");
  input.elt.setAttribute("id", "file");
  alert("Script Loaded");
}

function callback(file) {
  alert("Clicked");
  if (file.type === "image") {
    img = createImg(file.data, "");
    //img.hide();
    image(img, 0, 0);
  }
  setTimeout(getAdressData, 1000);
}

function getAdressData() {
  //Import image;
  let myImage = document.querySelector("img");
  //Get EXIF Data
  EXIF.getData(myImage, function () {
    allData = EXIF.getAllTags(this);
  });

  //Convert to lonlat coordinates
  let lat =
    allData["GPSLatitude"][0] +
    allData["GPSLatitude"][1] / 60 +
    allData["GPSLatitude"][2] / 3600;
  let lon =
    allData["GPSLongitude"][0] +
    allData["GPSLongitude"][1] / 60 +
    allData["GPSLongitude"][2] / 3600;

  //Get real name of place from EXIF

  function reqListener() {
    geoData = JSON.parse(this.responseText);
    createP(geoData.address.city + " " + geoData.address.road + "\n" + geoData.address.suburb);
  }

  let url =
    "https://us1.locationiq.com/v1/reverse.php?key=" +
    private_key +
    "&lat=" +
    lat +
    "&lon=" +
    lon +
    "&format=json";

  let xhr = new XMLHttpRequest();
  xhr.onload = reqListener;
  xhr.open("GET", url, true);
  xhr.send();
}
