const { ethers } = require("ethers");
const { ContractAbi, bytecode } = require("./abi.js");
const { BlockTags, providers, eth } = require("web3");
const { sign, string } = require("three/examples/jsm/nodes/Nodes.js");

const DP = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Correct port for local Anvil chain
let signers;
let contract;
let deployedContract;
let ContractAddress;
let provider;
let interface = new ethers.Interface(ContractAbi);
// HTML elements
let amountInput = document.getElementById("amount");
let userName = document.getElementById("user_Name")
let indexInput = document.getElementById("funders");
let Eth_value;


let Eth_Amount = amountInput.addEventListener("change", (e) => {
  Eth_value = e.target.value;
  console.log(Eth_value);
});

let connectBtn = document.getElementById("connect-button");
let fundBtn = document.getElementById("fund-button");
let displayBtn = document.getElementById("display-button");
let transferBtn = document.getElementById("transfer");
let contractBtn = document.getElementById("getcontract");
let balanceBtn = document.getElementById("getbalance");
let ownerBtn = document.getElementById("getowner");

//provider :- that let you connect with blockchain for read only transaction
//signer :- that let you perform executable transaction on the blockchaion

// connect to the provider using metamask

//provider is useful for signing the transactions

let finalName;
userName.onchange = ((e)=>{
  finalName = e.target.value
})


// const displayName = () => {
//   console.log(finalName)
// }

const connect = async () => {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signers = await provider.send("eth_accounts");
    console.log(signers);
  }
};

const deployContract = async () => {
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();
    console.log(signerAddress);
    const transaction = {
      from : signerAddress,
      data: bytecode, // Contract bytecode
      // Optional parameters like `value` or `nonce`
    };

    const txResponse = await signer.sendTransaction(transaction);
    console.log("Transaction hash:", txResponse.hash);
    const receipt = await txResponse.wait();
    console.log("Contract deployed at:", receipt.contractAddress);
    ContractAddress = receipt.contractAddress

    // contract = new ethers.ContractFactory(ContractAbi, bytecode, signer);
    // deployedContract = await contract.deploy();
    // ContractAddress = await deployedContract.getAddress();
    // console.log(ContractAddress);
  }
};

const sendFund = async () => {
  let bool = false;
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();
    const tx = await signer.sendTransaction({
      from: signerAddress,
      to: ContractAddress,
      value: ethers.parseUnits(Eth_value, "ether"),
      data: interface.encodeFunctionData("fundFunction", [finalName]),
    });

    const intervalId = setInterval(() => {
      if (!bool) {
        console.log("Waiting for confirmation");
      }
    }, 1200);

    await tx.wait(2);
    bool = true;
    clearInterval(intervalId);
    console.log("funded ", ethers.formatEther(tx.value), " ETH");
  }
};

const checkBalance = async () => {
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();
    let tx = await signer.call({
      fron: signerAddress,
      to: ContractAddress,
      data: interface.encodeFunctionData("getBalance"),
    });
    let data = await tx.slice(2);
    console.log(data);
    let intData = parseInt(data.toString(), 16);
    let Final = String(intData); // Convert integer to string

    let finalized = ethers.formatEther(Final); // Convert Wei to Ether
    console.log(finalized);
  }
};

const getFunders = async () => {
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();
    let tx = await signer.call({
      fron: signerAddress,
      to: ContractAddress,
      data: interface.encodeFunctionData("retrieveInfo",[1])
    })
    let data = interface.decodeFunctionResult("retrieveInfo",tx)
    let amount = String(data[1])
    let ethAmount = ethers.formatEther(amount)
    console.log("Name is :- ",data[0])
    console.log("Amount is  :- ",ethAmount, " ETH")
    console.log("Contributor ID is :- ",data[2])
  }
};







// Event listeners
connectBtn.onclick = connect;
fundBtn.onclick = sendFund;
balanceBtn.onclick = checkBalance;
contractBtn.onclick = deployContract;
displayBtn.onclick = getFunders ;
// transferBtn.onclick = displayName;
// ownerBtn.onclick = checkOwner;
