

function createInSellHNFTCard(address, name, symbol, price) {
    // Create the main row container
    var rowDiv = document.createElement("div");
    rowDiv.className = "row justify-content-center";
    rowDiv.id = "market-list";

    // Create the card element
    var cardDiv = document.createElement("div");
    cardDiv.className = "card";
    rowDiv.appendChild(cardDiv);

    // Create and append the image element
    var img = document.createElement("img");
    img.className = "card-img-top";
    img.setAttribute("src", "images/honey.jpg");
    cardDiv.appendChild(img);

    // Create the card body container
    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";
    cardDiv.appendChild(cardBodyDiv);

    // Create and append the card title
    var cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = name;
    cardBodyDiv.appendChild(cardTitle);

    // Append the horizontal rule
    var hr = document.createElement("hr");
    cardBodyDiv.appendChild(hr);

    // Create the first row container
    var row1Div = document.createElement("div");
    row1Div.className = "row";
    cardBodyDiv.appendChild(row1Div);

    // Create and append the price element in the first row
    var priceDiv = document.createElement("div");
    priceDiv.className = "col-sm-6";
    priceDiv.textContent = `Price: ${price} ETH`;
    row1Div.appendChild(priceDiv);

    // Create and append the symbol element in the first row
    var symbolDiv = document.createElement("div");
    symbolDiv.className = "col-sm-6";
    symbolDiv.textContent = `Symbol: ${symbol}`;
    row1Div.appendChild(symbolDiv);

    // Create the second row container
    var row2Div = document.createElement("div");
    row2Div.className = "row";
    cardBodyDiv.appendChild(row2Div);

    // Create and append the Details button element in the second row
    var detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "btn btn-info full-width-btn";
    detailsButton.setAttribute("data-toggle", "modal");
    detailsButton.setAttribute("onclick", `showDetails("${address}")`);
    detailsButton.textContent = "Details";
    var detailsCol = document.createElement("div");
    detailsCol.className = "col-sm-12";
    detailsCol.appendChild(detailsButton);
    row2Div.appendChild(detailsCol);

    // Create the third row container
    var row3Div = document.createElement("div");
    row3Div.className = "row";
    cardBodyDiv.appendChild(row3Div);

    // Create and append the Buy button element in the third row
    var buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.name = "buy-button";
    buyButton.className = "btn btn-success full-width-btn";
    buyButton.setAttribute("onclick", `buyHNFT("${address}", "${price}")`);
    buyButton.textContent = "Buy";
    var buyCol = document.createElement("div");
    buyCol.className = "col-sm-12";
    buyCol.appendChild(buyButton);
    row3Div.appendChild(buyCol);

    // Append the main row container to the document body or any desired parent element
    document.getElementById("sell-list").appendChild(rowDiv);

}

function showDetails(HNFTaddress) {
    $('#details-modal').modal('show');

    getNFTDetails(HNFTaddress).then((details) => {  

        document.getElementById("details-name").innerHTML = `${details.name}`;
        document.getElementById("details-symbol").innerHTML = `${details.symbol}`;
        document.getElementById("details-address").innerHTML = `${HNFTaddress}`;
        document.getElementById("details-price").innerHTML = `${details.price} ETH`;
        document.getElementById("details-owner").innerHTML = `${details.owner}`;
        document.getElementById("details-issuer").innerHTML = `${details.issuer}`;

    }).catch((err) => {
        console.log(err);
    });
}


previousDetailsSell = {};
function createInSellList() {
    getInSellItems().then((inSell) => {
        let promises = []
        inSell.forEach(HNFTaddress => {
            promises.push(getNFTDetails(HNFTaddress));    
        });

        if (!inSell || inSell.length==0){
            document.getElementById("sell-list").innerHTML = "No item in sell";
        }
        
        Promise.all(promises).then((allDetails) => {
            if (previousDetailsSell != JSON.stringify(allDetails)){
                previousDetailsSell = JSON.stringify(allDetails);
                document.getElementById("sell-list").innerHTML = "";
                
                allDetails.forEach(details => {
                    createInSellHNFTCard(details.address, details.name, details.symbol, details.price);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log("error: no item in sell");
    })
}



function buy(address) {
    $('#put-on-market-modal').modal('show');
    let putOnMarketSubmit = document.getElementById("put-on-market-submit");
    putOnMarketSubmit.setAttribute("onclick", `putOnMarket("${address}")`);
}


function checkHNFT() {
    let address = document.getElementById("check-validity").value;
    document.getElementById("check-success").hidden = true;
    document.getElementById("check-fail").hidden = true;

    checkHNFTValidity(address).then((validity) => {
        if (validity){
            document.getElementById("check-success").hidden = false;
            
            // show the HNFT details 
            getNFTDetails(address).then((details) => {  

                document.getElementById("check-details-name").innerHTML = `${details.name}`;
                document.getElementById("check-details-symbol").innerHTML = `${details.symbol}`;
                document.getElementById("check-details-address").innerHTML = `${address}`;
                document.getElementById("check-details-owner").innerHTML = `${details.owner}`;
                document.getElementById("check-details-issuer").innerHTML = `${details.issuer}`;
        
            }).catch((err) => {
                console.log(err);
            });
        } else{
            document.getElementById("check-fail").hidden  = false;
        }
    }).catch((err) => {
        document.getElementById("check-fail").hidden  = false;
        console.log(err);
    })
}