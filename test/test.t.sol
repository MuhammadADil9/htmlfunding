// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {fund} from "../src/Funder.sol";
import {deployFund} from "../script/deployFund.sol";

contract testFunder is Test {
    fund public fundContract;
    deployFund public deployfundContract;
    uint256 public currency;
    address public sender;

    function setUp() public {
        deployfundContract = new deployFund();
        fundContract = deployfundContract.run();
        sender = vm.addr(1);
        currency = 20e18;
    }

    function testEq() public pure { uint256 val = 1; assertEq(val, 1); }

    function testIsOwner() public view { address contractOwner = fundContract.getOwner(); assertEq(msg.sender, contractOwner); }

    function testBalance()public{
        vm.deal(sender,currency);
        vm.prank(sender);
        fundContract.fundFunction{value:5e18}("fakhir");
        uint256 balance = 5e18;
        assertEq(balance,fundContract.getBalance());
    }
    
    function testReceiver() public {
        vm.deal(sender,currency);
        vm.prank(sender);
        fundContract.fundFunction{value:6e18}("arslan");
        (string memory name,,) = fundContract.retrieveInfo(1);
        string memory verifiedName = "arslan";
        assertEq(verifiedName,name);
        
    }

}

