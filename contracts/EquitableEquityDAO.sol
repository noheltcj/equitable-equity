// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityToken } from "./EquitableEquityToken.sol";
import { Governor } from "./Governor.sol";

contract EquitableEquityDAO is Governor {

    mapping(string => address) private projectByNameMapping;
    mapping(string => address) private projectByTokenSymbolMapping;
    mapping(address => string[]) private projectNamesByParticipantMapping;

    string[] private projects;

    constructor() {
        signature = address(this);
    }

    /** Really shouldn't use this often... */
    function listProjects() public view returns (string[] memory) {
        return projects;
    }

    function listMyProjects(address owner) public view returns (string[] memory) {
        return projectNamesByParticipantMapping[owner];
    }

    function createProject(
        string memory projectName,
        string memory tokenSymbol,
        address payable foundingWalletAddress,
        uint64 initialGrantAmount
    ) public returns (address) {
        require (projectByNameMapping[projectName] == address(0x0), "Project name already taken");
        require (projectByTokenSymbolMapping[tokenSymbol] == address(0x0), "Project symbol already taken");

        EquitableEquityToken token = new EquitableEquityToken(projectName, tokenSymbol, this);
        address newTokenAddress = address(token);

        projects.push(projectName);
        projectByNameMapping[projectName] = newTokenAddress;
        projectByTokenSymbolMapping[tokenSymbol] = newTokenAddress;

        /** Minting and awarding the first equity grant to founder. */
        // token._mint(foundingWalletAddress, initialGrantAmount);

        string[] storage newParticipantToProjectNamesValue = projectNamesByParticipantMapping[foundingWalletAddress];
        newParticipantToProjectNamesValue.push(projectName);
        projectNamesByParticipantMapping[foundingWalletAddress] = newParticipantToProjectNamesValue;

        return newTokenAddress;
    }

    function getAddressOfProjectToken(string memory projectName) public view returns (address) {
        return projectByNameMapping[projectName];
    }
}
