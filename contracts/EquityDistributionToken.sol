//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EquitableEquityDAO {

    mapping(string => address) private projectTokenMap;

    constructor() {}

    function createProject(
        string memory projectName,
        string memory tokenSymbol,
        address founderWallet,
        uint64 initialGrant
    ) public returns (address) {
        console.log("Creating a new project");

        address newTokenAddress = address(new EquitableEquityToken(projectName, tokenSymbol));
        projectTokenMap[projectName] = newTokenAddress;

        return newTokenAddress;
    }

    function getAddressOfProjectToken(
        string memory projectName
    ) public returns (address) {
        console.log("Getting token for project");

        return projectTokenMap[projectName];
    }

    function distributeEquity(uint64 amount, address wallet) public {

    }
}

contract EquitableEquityToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}
