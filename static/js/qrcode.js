
function createQRCode(NFTAddress) {

  // Create a new QRCode instance
  let qrCodeDiv = document.getElementById("qrCodeDiv");

  let qrCode = new QRCode(qrCodeDiv,{
    text: NFTAddress,
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff"
  });

}