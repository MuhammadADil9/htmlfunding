//SPDX License-Identifier: MIT

//license
//solidity version
//imports
//comments
//person deploys smart contract
//people are able to fund with their name and amount
//on retieval their name and respective amount will be displayed

pragma solidity ^0.8.18;

contract fund {
    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    address private owner;
    struct people {
        string name;
        uint256 amount;
        uint256 cID;
    }

    people[] public funders;
    uint256 private contributorID;

    constructor() {
        owner = msg.sender;
        contributorID = 1;
    }

    // function fundFunction(string memory FunderName) payable public {
    //     funders.push(people({
    //         name : FunderName,
    //         amount : msg.value,
    //         cID : contributorID
    //     }));
    //     contributorID++;
    // }

    function fundFunction(string memory FunderName) public payable {
        if (funders.length < contributorID) {
            for (uint256 i = funders.length; i <= contributorID; i++) {
                funders.push();
            }
        } else {
            funders.push();
        }
        funders[contributorID] = people({
            name: FunderName,
            amount: msg.value,
            cID: contributorID
        });
        contributorID++;
    }

    function retrieveInfo(
        uint256 indexFunder
    ) public view returns (string memory, uint256, uint256) {
        people memory returnFunder = funders[indexFunder];
        return (returnFunder.name, returnFunder.amount, returnFunder.cID);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function transfer() public onlyOwner {
        (bool sent, ) = payable(owner).call{value: address(this).balance}("");
        require(sent, "Transaction failed");
    }

    function returnString() public pure returns(string memory){
        return "This is smart contract";
    }

}
