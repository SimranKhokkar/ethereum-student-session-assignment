const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const jsonfile = require('jsonfile');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
// creating a new instance of web3 along with the provider instance that points to the local network
// this instance gives us access to all the eth and personal commands/methods

const sessionPath = path.resolve(__dirname, 'contracts', 'Session.sol');
const source = fs.readFileSync(sessionPath, 'utf8');
const address = path.join(__dirname, 'contractAddress.json');

const output = solc.compile(source, 1);
// compiling the smart contract to generate the bytecode and ABI

// retrieving the bytecode and abi from the contract
const bytecode = output.contracts[':Session'].bytecode;
const abi = JSON.parse(output.contracts[':Session'].interface);

// this would provide the estimated gas required to execute the smart contract
const gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode });

const contract = web3.eth.contract(abi);

// unlock the local ethereum account with the duration for which the account should be unlocked
// web3.personal.unlockAccount("****owner_address****", "", 5);

/**
 * This function deploys Session.sol contract on blockcahin
 * @param {bytecode} bytecode of Session.sol contract
 * @param {Admin account} Account which deployed the contract
 * @param {gasEstimate} gas required
 */

 // if gas estimate is not provided, it takes some random value which might be more than the gas that is required
 contract.new('***instructor_address****', {data: '0x' + bytecode, from: "****owner_address*****", value: web3.toWei(50,'ether'), gas: gasEstimate+210000}, (err,res) => {
if(err) {
    console.log(err);
    return;
} else {
    if(res.address){
        let contractAddress = jsonfile.readFileSync(address);
        contractAddress['Session'] = {
            'address': res.address || "",
            'abi': abi
        };
        fs.writeFileSync(address, JSON.stringify(contractAddress, null, 4), {spaces: 2});
    }
    return;
}
});


