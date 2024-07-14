const {ethers} = require("ethers")
const ContractAbi = require("./abi.js")
const DP = ethers.getDefaultProvider("http://127.0.0.1:5500")
const ContractAddress = "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35"
let provider;
let signer;

//Html elements
let connectBtn = document.getElementById("connect-button");
let value = document.getElementById("display-button")

const connect = async () => {

  try {

  provider = new ethers.BrowserProvider(window.ethereum) || DP
  
}catch(error){
   
  console.log("Error in connecting to the metamask")
  
}

  console.log("Wallet Connected")
  connectBtn.innerHTML = "Connected"

}

const getContract = async () => {
  try{
      if(provider){
        signer = await provider.getSigner();
        console.log(signer)
      }
  }catch(error){
    console.log("Error Erupted")
  }
  let Contract = new ethers.Contract(ContractAddress,ContractAbi,signer)
  console.log(Contract)
  console.log("Contract Created Successfully")
}

connectBtn.onclick = connect
value.onclick = getContract