
function createQRCode(NFTAddress) {

  // Create a new QRCode instance
  let qrCodeDiv = document.getElementById("qrCodeDiv");
  qrCodeDiv.innerHTML = "";

  let qrCode = new QRCodeStyling({
    "width": 200,
    "height": 200,
    "data": `${NFTAddress}`,
    "margin": 0,
    "qrOptions": {
      "typeNumber": "0",
      "mode": "Byte",
      "errorCorrectionLevel": "Q"
    },
    "imageOptions": {
      "hideBackgroundDots": true,
      "imageSize": 0.4,
      "margin": 0
    },
    "dotsOptions": {
      "type": "square",
      "color": "#f5c211",
      "gradient": null
    },
    "backgroundOptions": {
      "color": "#ffffff"
    },
    "image": "images/hnft.png",
    "dotsOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      }
    },
    "cornersSquareOptions": {
      "type": "extra-rounded",
      "color": "#5e5c64"
    },
    "cornersSquareOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      }
    },
    "cornersDotOptions": {
      "type": "dot",
      "color": "#77767b"
    },
    "cornersDotOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      }
    },
    "backgroundOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      }
    }
  });

  qrCode.append(qrCodeDiv);

}