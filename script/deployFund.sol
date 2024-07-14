// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Script} from "forge-std/Script.sol";
import {fund} from "../src/Funder.sol";

contract deployFund is Script {
    function run() public returns (fund) {
        vm.startBroadcast();
        fund fundContract = new fund();
        vm.stopBroadcast();
        return fundContract;
    }
}
