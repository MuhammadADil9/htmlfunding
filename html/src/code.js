const { ethers } = require("ethers");
const { ContractAbi, bytecode } = require("./abi.js");
const { BlockTags, providers, eth } = require("web3");
const { sign, string } = require("three/examples/jsm/nodes/Nodes.js");

let signers;
let ContractAddress;
let provider;
let interface = new ethers.Interface(ContractAbi);

// HTML elements
let amountInput = document.getElementById("amount");
let userName = document.getElementById("user_Name");
let indexInput = document.getElementById("funders");
let Eth_value;
let displayingArea = document.getElementById("display-area");
let funderIndex;

amountInput.addEventListener("change", (e) => {
  Eth_value = e.target.value;
});

indexInput.addEventListener("change", (e) => {
  funderIndex = Number(e.target.value);
});

// Buttons

let connectBtn = document.getElementById("connect-button");
let fundBtn = document.getElementById("fund-button");
let displayBtn = document.getElementById("display-button");
let transferBtn = document.getElementById("transfer");
let contractBtn = document.getElementById("getcontract");
let balanceBtn = document.getElementById("getbalance");
let ownerBtn = document.getElementById("getowner");

let finalName;
userName.onchange = (e) => {
  finalName = e.target.value;
};

// Function

const connect = async () => {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signers = await provider.send("eth_accounts");
    console.log("Addresses within wallet are :- ");
    console.log(signers);
  } else {
    console.log("Provider is already available");
  }
};

const deployContract = async () => {
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();
    console.log("Deployer Address :- ", signerAddress);

    try {
      const transaction = {
        from: signerAddress,
        data: bytecode, // Contract bytecode
      };

      const txResponse = await signer.sendTransaction(transaction);
      console.log("Transaction hash:", txResponse.hash);
      const receipt = await txResponse.wait();
      console.log(receipt);
      console.log("Contract deployed at:", receipt.contractAddress);
      ContractAddress = receipt.contractAddress;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Connrect to provider First !!");
  }
};

const sendFund = async () => {
  let bool = false;
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();

    try {
      const tx = await signer.sendTransaction({
        from: signerAddress,
        to: ContractAddress,
        value: ethers.parseUnits(Eth_value, "ether"),
        data: interface.encodeFunctionData("fundFunction", [finalName]),
      });

      userName.value = "";
      amountInput.value = "0";

      const intervalId = setInterval(() => {
        if (!bool) {
          console.log("Waiting for confirmation");
        }
      }, 1200);

      await tx.wait(2);
      bool = true;
      clearInterval(intervalId);
      console.log("funded ", ethers.formatEther(tx.value), " ETH");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Connrect to provider First !!");
  }
};

const checkBalance = async () => {
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();

    try {
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
      console.log(finalized, " ETH");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Connrect to provider First !!");
  }
};

const append = (id, name, amount) => {
  let displayDiv = document.createElement("div");
  let fId = document.createElement("p");
  let fName = document.createElement("div");
  let fAmount = document.createElement("h3");

  fId.innerHTML = id;
  fName.innerHTML = name;
  fAmount.innerHTML = amount;

  fId.setAttribute("class", "column id");
  fName.setAttribute("class", "column name");
  fAmount.setAttribute("class", "column amount");
  displayDiv.setAttribute("class", "row");

  displayDiv.appendChild(fId);
  displayDiv.appendChild(fName);
  displayDiv.appendChild(fAmount);
  displayingArea.appendChild(displayDiv);
};

const getFunders = async () => {
  if (provider) {
    let signer = await provider.getSigner();
    let signerAddress = await signer.getAddress();

    try {
      let tx = await signer.call({
        fron: signerAddress,
        to: ContractAddress,
        data: interface.encodeFunctionData("retrieveInfo", [funderIndex]),
      });

      let data = interface.decodeFunctionResult("retrieveInfo", tx);
      let amount = String(data[1]);
      let ethAmount = ethers.formatEther(amount);

      console.log("Name is :- ", data[0]);
      console.log("Amount is  :- ", ethAmount, " ETH");
      console.log("Contributor ID is :- ", data[2]);

      append(data[2], data[0], ethAmount);
    } catch (error) {
      console.log(error);
    }
  }
};

const owner = async () => {
  let signer = await provider.getSigner();
  let signerAddress = await signer.getAddress();

  try {
    let tx = await signer.call({
      from: signerAddress,
      to: ContractAddress,
      data: interface.encodeFunctionData("getOwner"),
    });
    let data = interface.decodeFunctionResult("getOwner", tx);
    console.log("Deployer Address :-  ", data[0]);
  } catch (error) {
    console.log(error);
  }
};

const transfer = async () => {
  let signer = await provider.getSigner();
  let signerAddress = await signer.getAddress();
  try {
    let tx = await signer.sendTransaction({
      from: signerAddress,
      to: ContractAddress,
      data: interface.encodeFunctionData("transfer"),
    });

    await tx.wait(2);
    console.log(tx);
    console.log("Amount transfered to owner");
  } catch (error) {
    console.log(error);
  }
};

// Event listeners
connectBtn.onclick = connect;
fundBtn.onclick = sendFund;
balanceBtn.onclick = checkBalance;
contractBtn.onclick = deployContract;
displayBtn.onclick = getFunders;
transferBtn.onclick = transfer;
ownerBtn.onclick = owner;
