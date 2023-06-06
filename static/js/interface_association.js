function createInSellHNFTCard(address, name, symbol, price) {
    // Create the main card container
    var cardDiv = document.createElement("div");
    cardDiv.id = address;
    cardDiv.className = "card";

    // Create and append the image element
    var img = document.createElement("img");
    img.className = "card-img-top";
    img.setAttribute("src", "images/honey.jpg");
    cardDiv.appendChild(img);

    // Create the card body container
    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    // Create and append the card title
    var cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = name;
    cardBodyDiv.appendChild(cardTitle);

    // Append the horizontal rule
    var hr = document.createElement("hr");
    cardBodyDiv.appendChild(hr);


    // Create the second row container
    var row2Div = document.createElement("div");
    row2Div.className = "row";

    // Create and append the price element 
    var priceDiv = document.createElement("div");
    priceDiv.className = "col-sm-6";
    priceDiv.textContent = `Price: ${price} ETH`;
    row2Div.appendChild(priceDiv);

    // Create and append the name element 
    var nameDiv = document.createElement("div");
    nameDiv.className = "col-sm-6";
    nameDiv.textContent = `Symbol: ${symbol}`;
    row2Div.appendChild(nameDiv);

    cardBodyDiv.appendChild(row2Div);

    // Create the third row container
    var row3Div = document.createElement("div");
    row3Div.className = "row";

    // Create and append the Details button element in the third row
    var detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "btn btn-info full-width-btn";
    detailsButton.setAttribute("data-toggle", "modal");
    detailsButton.textContent = "Details";
    detailsButton.setAttribute("onclick", `showDetails("${address}")`);

    var detailsCol = document.createElement("div");
    detailsCol.className = "col-sm-6";
    detailsCol.appendChild(detailsButton);
    row3Div.appendChild(detailsCol);

    // Create and append the Edit button element in the third row
    var editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn btn-info full-width-btn";
    editButton.setAttribute("data-toggle", "modal");
    editButton.name = "edit-price";
    editButton.disabled = true;
    editButton.setAttribute("onclick", `setPriceModal("${address}")`);
    editButton.textContent = "Edit Price";
    var editCol = document.createElement("div");
    editCol.className = "col-sm-6";
    editCol.appendChild(editButton);
    row3Div.appendChild(editCol);

    cardBodyDiv.appendChild(row3Div);

    // removeFromSell button
    var removeFromSellDiv = document.createElement("div");
    removeFromSellDiv.className = "row";

    var removeFromSellButton = document.createElement("button");
    removeFromSellButton.type = "button";
    removeFromSellButton.disabled = true;
    removeFromSellButton.name = "remove-from-market";
    removeFromSellButton.className = "btn btn-danger full-width-btn";
    removeFromSellButton.setAttribute("onclick", `removeFromMarket("${address}")`);
    removeFromSellButton.textContent = "Remove from market";

    var removeFromSellCol = document.createElement("div");
    removeFromSellCol.className = "col-sm-12";

    removeFromSellCol.appendChild(removeFromSellButton);
    removeFromSellDiv.appendChild(removeFromSellCol);
    cardBodyDiv.appendChild(removeFromSellDiv);

    // Append the card body to the main card container
    cardDiv.appendChild(cardBodyDiv);

    // Append the main card container to the document body or any desired parent element
    document.getElementById("sell-list").appendChild(cardDiv);

}

function addPlusButton() {
    
    var plus_button = document.createElement("button");
    plus_button.className = "card";
    plus_button.setAttribute("data-toggle", "modal");
    plus_button.setAttribute("data-target", "#create-hnft");
    plus_button.id = "create-nft"; 

    var plusCardBodyDiv = document.createElement("div");
    plusCardBodyDiv.className = "card-body";

    var plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus fa-7x";
    plusCardBodyDiv.appendChild(plusIcon);
    plus_button.appendChild(plusCardBodyDiv);

    if (!connectedAddress){
        plus_button.hidden = true;
    }

    document.getElementById("created-list").appendChild(plus_button);
    
}

function createNotInSellHNFTCard(address, name, symbol, price, issuer="-", approved_status=false) {
    // Create the main card container
    var cardDiv = document.createElement("div");
    cardDiv.id = address;
    cardDiv.className = "card";

    // Create and append the image element
    var img = document.createElement("img");
    img.className = "card-img-top";
    img.setAttribute("src", "images/honey.jpg");
    cardDiv.appendChild(img);

    // Create the card body container
    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    // Create and append the card title
    var cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = name;
    cardBodyDiv.appendChild(cardTitle);

    // Append the horizontal rule
    var hr = document.createElement("hr");
    cardBodyDiv.appendChild(hr);


    // Create the second row container
    var row2Div = document.createElement("div");
    row2Div.className = "row";

    // Create and append the price element 
    var priceDiv = document.createElement("div");
    priceDiv.className = "col-sm-6";
    priceDiv.textContent = `Price: ${price} ETH`;
    row2Div.appendChild(priceDiv);

    // Create and append the name element 
    var nameDiv = document.createElement("div");
    nameDiv.className = "col-sm-6";
    nameDiv.textContent = `Symbol: ${symbol}`;
    row2Div.appendChild(nameDiv);

    cardBodyDiv.appendChild(row2Div);

    // Create the third row container
    var row3Div = document.createElement("div");
    row3Div.className = "row";

    // Create and append the Details button element in the third row
    var detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "btn btn-info full-width-btn";
    detailsButton.setAttribute("data-toggle", "modal");
    detailsButton.textContent = "Details";
    detailsButton.setAttribute("onclick", `showDetails("${address}")`);
    var detailsCol = document.createElement("div");
    detailsCol.className = "col-sm-12";
    detailsCol.appendChild(detailsButton);
    row3Div.appendChild(detailsCol);

    cardBodyDiv.appendChild(row3Div);

    // put on market button
    var row4Div = document.createElement("div");
    row4Div.className = "row";

    var approveButton = document.createElement("button");
    approveButton.type = "button";
    approveButton.id = "approve_" + address;
    approveButton.className = "btn btn-info full-width-btn";
    approveButton.setAttribute("onclick", `approveNFT("${address}")`);
    approveButton.textContent = "1. Approve";
    
    if (approved_status == true){
        approveButton.disabled = true;
    }

    var approveCol = document.createElement("div");
    approveCol.className = "col-sm-12";

    approveCol.appendChild(approveButton);
    row4Div.appendChild(approveCol);

    var row5Div = document.createElement("div");
    row5Div.className = "row";

    var putOnMarketButton = document.createElement("button");
    putOnMarketButton.type = "button";
    putOnMarketButton.disabled = true;
    putOnMarketButton.name = "put-on-market";
    putOnMarketButton.className = "btn btn-info full-width-btn";
    putOnMarketButton.setAttribute("onclick", `putOnMarketModal("${address}")`);
    putOnMarketButton.setAttribute("data-target", "#put-on-market-modal");
    putOnMarketButton.textContent = "2. Put on market";
    
    var putCol = document.createElement("div");
    putCol.className = "col-sm-12";
    
    putCol.appendChild(putOnMarketButton);
    row5Div.appendChild(putCol);

    cardBodyDiv.appendChild(row4Div);
    cardBodyDiv.appendChild(row5Div);

    // Append the card body to the main card container
    cardDiv.appendChild(cardBodyDiv);

    // Append the main card container to the document body or any desired parent element
    document.getElementById("created-list").appendChild(cardDiv);

}


function putOnMarketModal(address) {
    $('#put-on-market-modal').modal('show');
    let putOnMarketSubmit = document.getElementById("put-on-market-submit");
    putOnMarketSubmit.setAttribute("onclick", `putOnMarket("${address}")`);
}


function setPriceModal(address) {
    $('#change-price-modal').modal('show');
    let changePriceSubmit = document.getElementById("change-price-submit");
    changePriceSubmit.setAttribute("onclick", `setPrice("${address}")`);
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

previousDetails = null;

function createNotInSellList() {

    // get the list of created NFTs from the cookies
    NFTCreated = getCookie("createdNFTs");
    if (!NFTCreated){
        NFTCreated = [];
    }else{
        NFTCreated = JSON.parse(NFTCreated);

    }
    
    let promises = []
    NFTCreated.forEach(HNFTaddress => {
        promises.push(getNFTDetails(HNFTaddress));    
    });

    Promise.all(promises).then((allDetails) => {
        if (previousDetails != JSON.stringify(allDetails)){
            previousDetails = JSON.stringify(allDetails);
            document.getElementById("created-list").innerHTML = "";
            addPlusButton();
            
            allDetails.forEach(details => {
                createNotInSellHNFTCard(details.address, details.name, details.symbol, details.price, details.issuer, details.approved);
            });
        }
    }).catch((err) => {
        console.log(err);
    });        
}   



