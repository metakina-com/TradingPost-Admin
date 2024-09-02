import Web3 from "web3";


//TLAddres合约：TLew95rnoMYKVibDmLndYagzGRTzTTdum9


//合约
const TLAddres = '0x814cDD2F01C0fB6A26632C35b32FDa0BDd3Ec819'
const TLabi = {
    "entrys": [{
        "stateMutability": "Nonpayable",
        "type": "Constructor"
    }, {
        "inputs": [{
            "indexed": true,
            "name": "owner",
            "type": "address"
        }, {
            "indexed": true,
            "name": "spender",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "Approval",
        "type": "Event"
    }, {
        "inputs": [{
            "indexed": true,
            "name": "from",
            "type": "address"
        }, {
            "indexed": true,
            "name": "to",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "Transfer",
        "type": "Event"
    }, {
        "outputs": [{
            "type": "uint256"
        }],
        "constant": true,
        "inputs": [{
            "name": "owner",
            "type": "address"
        }, {
            "name": "spender",
            "type": "address"
        }],
        "name": "allowance",
        "stateMutability": "View",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "bool"
        }],
        "inputs": [{
            "name": "spender",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "approve",
        "stateMutability": "Nonpayable",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "uint256"
        }],
        "constant": true,
        "inputs": [{
            "name": "account",
            "type": "address"
        }],
        "name": "balanceOf",
        "stateMutability": "View",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "uint8"
        }],
        "constant": true,
        "name": "decimals",
        "stateMutability": "View",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "bool"
        }],
        "inputs": [{
            "name": "spender",
            "type": "address"
        }, {
            "name": "subtractedValue",
            "type": "uint256"
        }],
        "name": "decreaseAllowance",
        "stateMutability": "Nonpayable",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "bool"
        }],
        "inputs": [{
            "name": "spender",
            "type": "address"
        }, {
            "name": "addedValue",
            "type": "uint256"
        }],
        "name": "increaseAllowance",
        "stateMutability": "Nonpayable",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "string"
        }],
        "constant": true,
        "name": "name",
        "stateMutability": "View",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "string"
        }],
        "constant": true,
        "name": "symbol",
        "stateMutability": "View",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "uint256"
        }],
        "constant": true,
        "name": "totalSupply",
        "stateMutability": "View",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "bool"
        }],
        "inputs": [{
            "name": "recipient",
            "type": "address"
        }, {
            "name": "amount",
            "type": "uint256"
        }],
        "name": "transfer",
        "stateMutability": "Nonpayable",
        "type": "Function"
    }, {
        "outputs": [{
            "type": "bool"
        }],
        "inputs": [{
            "name": "sender",
            "type": "address"
        }, {
            "name": "recipient",
            "type": "address"
        }, {
            "name": "amount",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "stateMutability": "Nonpayable",
        "type": "Function"
    }]
}
const TLweb = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s2.binance.org:8545/'));
const TlController_contracts = new TLweb.eth.Contract(TLabi, TLAddres);


export {
    TLAddres,
    TLabi,
    TlController_contracts,
}