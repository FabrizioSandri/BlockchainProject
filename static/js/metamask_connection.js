let connectedAddress;

// Function used to connect with MetaMask
function connectToMetaMask() {

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined' && ethereum.on) {
            
            // Request account access
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {  

                ethereum.on("accountsChanged", handleAccountsChanged); // Subscribe to the "accountsChanged" event

                connectedAddress = accounts[0];
                document.getElementById("metamask_connection").innerText = connectedAddress;
                refreshLists();
            }).catch((err) => {
                document.getElementById("metamask_connection").innerText = "failed";
            });
        } else {
            document.getElementById("metamask_connection").innerText = "failed";
        }
}


function handleAccountsChanged(accounts) {
    if (accounts.length != 0) {
        connectedAddress = accounts[0];
        document.getElementById("metamask_connection").innerText = connectedAddress;
        refreshLists();
    }
}


