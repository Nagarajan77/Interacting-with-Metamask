window.userWalletAddress = null;
let networkID = null;

// rounded bg-white border border-gray-400 hover:bg-gray-100 py-2 px-4 text-gray-600 hover:text-gray-700

// functioned when page is loaded
const onLoad = async () => {
    // continue is metamask in installed in browser
    if(window.ethereum) {
        if (await checkMetamaskConnection()) {
            handleConnectBtn('disable');
            btnHideUnhide(document.getElementById("showNetwork"), "show");
        }
    } else {
        alert("Metamask is not installed.");
        handleConnectBtn('no-metamask');
        btnHideUnhide(document.getElementById("showNetwork"), "hide");
    }
}

// connecting site to metamask
const loginWithMetamask = async () => {
    if (window.ethereum) {
        // NEW METHOD to get permission to get connected to metamask
        try{
            let result = await window.ethereum.request({
                method: 'eth_requestAccounts',
                params: [{
                    eth_accounts: {}
                }]
            });
            window.userWalletAddress = result[0];
            console.log(`You are logged in using ${window.userWalletAddress} address`);
            handleConnectBtn('disable');
            btnHideUnhide(document.getElementById("showNetwork"), "show");
        } catch(error) {
            console.log(error);
        }
    } else{
        handleConnectBtn('no-metamask');
    }
}

// checking if website is connected to Metamask
const checkMetamaskConnection = async () => {
    let accounts = await window.ethereum.request({method: 'eth_accounts'});
    if (accounts.length == 0) {
        handleConnectBtn();
        networkID = null;
        btnHideUnhide(document.getElementById("showNetwork"), "hide");
        console.log("Not conncted to metamask");
        return false;
    } else {
        window.userWalletAddress = accounts[0];
        return true;
    }
}

// show network ID
const showNetwork = async () => {
    if (window.ethereum && window.userWalletAddress) {
        networkID = await window.ethereum.networkVersion;
        let networkName = null;
        if (networkID === '1') {
            networkName = "Mainnet";
        } else if (networkID === '3') {
            networkName = "Ropsten";
        } else if (networkID === '4') {
            networkName = "Rinkeby";
        } else if (networkID === '5') {
            networkName = "Goerli";
        } else if (networkID === '42') {
            networkName = "Kovan";
        } else {
            networkName = "Localhost";
        }
        console.log(networkID);
        document.getElementById("showNetwork").innerText = `Connected to network with ID: ${networkID} (${networkName})`;
    }
}

// handeling button that aloows to connect to metamask
const handleConnectBtn = action => {
    if (action === 'disable') {
        document.getElementById('loginBTN').setAttribute('disable', true);
        document.getElementById('loginBTN').innerText = `You are logged in using ${window.userWalletAddress} address`;
    } else if (action === 'no-metamask') {
        document.getElementById('loginBTN').setAttribute('disable', true);
        document.getElementById('loginBTN').innerText = `Metamask is not Installed.`;
    } else {
        document.getElementById('loginBTN').removeAttribute('disable');
        document.getElementById('loginBTN').innerText = `Connect to Metamask`;
    }
}

// function used to hide/unhide a button
const btnHideUnhide = (el, action) => {
    const list = el.classList;
    if (action === 'hide') {
        if (!list.contains('hidden')) {
            el.classList.add('hidden');
        }
    } else if (action === 'show') {
        if (list.contains('hidden')) {
            el.classList.remove('hidden');
        }
        showNetwork();
    }
}

// testing metamask EVENTS
if (window.ethereum) {
    // if chain is changed - returns new chain ID in hex
    window.ethereum.on("chainChanged", event => {
        networkID = parseInt(event, 16);
        console.log(`Event: chainChanged, ${networkID}`);
        alert(`You changed network to ID ${networkID}`);
        showNetwork();
    });

    // if account is changed - returns account address that is connected
    window.ethereum.on("accountsChanged", async (accounts) => {
        if (await checkMetamaskConnection()) {
            console.log(`Event: accountChanged || ${accounts}`);
            window.userWalletAddress = accounts[0];
            alert(`You are now connected with ${window.userWalletAddress} address`);
            handleConnectBtn('disable');
        }
    });

    // if any message is sent from metamask
    window.ethereum.on("message", message => console.log(`Event: message || ${message}`));

    // when connected to Metamask
    window.ethereum.on("connect", info => console.log(`Event: connect || ${info}`));

    // when disconnected from metamask
    window.ethereum.on("disconnect", () => console.log(`Event: disconnect`));
}
