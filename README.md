# BlockchainProject

  
 ## Project Infrastructure:
  MUSEO --->interact with--->main contract--->manges NFTS(---> NFTS Functions are called by main contract)

## Use cases:
 * 1.A museum has a high value physical coin X. The Museus Decide to create the NFT of this coin to sell it <br>
  The museum signs up to our Dapp with an address stored in the main contract; <br>
  The museum calls the function "createNFT(_name, _symbol, _ownerAddressMuseum, _price)"; <br>
  The main contract calls the NFT constructor with those parameters; <br>
  The main contract stores the museum address and the adress of the NFT created; <br>
  The main contract calls the transfer function to transfer the ownership from the main contract it self <br>
    to che museum but before calls the approve function to have the possibility to being able to transfer it in the future without <br>
    the consensous of the museum but just by getting the money from the collector <br>
  
 * 2.A collector finds on the list of coins the coin X; <br>
   The collector signs up to our Dapp with his address; <br>
   The collector calls the function buyNFT(_NFTAddress); <br>
   The function buyNFT lays on th main contract and calls the transfer function but keeps the approve rights; <br>
      >because in the first scenario the main contract called the approve function on it self, it can transfer it right away without asking consensous to the museum;
   The transfer function is payable and checks if the money send is equal the price and it transfer it otherwise it notifies the buyer; <br>
   The main contract change the owner of the nft address; <br>
  
  * 3.A collector wants to change the price of the NFT;
    The actor goes to the nft list and calls the changePrice(NFTAddress, newPrice) of the main contract;
    The main contract check if the owner is the actor.
    If true calls the changePrice of the NFTContract that will have modifies OnlyOwner and check if the main contractor is entitled to change the price
    if so it changes it.
  (Check if the approved users is still only the main contractor!)
  
  * 4.A collector wants to get the real coin at home.
    The collector call the function getPhysicalCoin(NFTAdddress) on the main contract;
    The main contract removes the NFTAdress from its storage after calling the function burn.
  
    
  
  
    
  
  
  
  
  
  
  
