// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityProjectDAO } from "../dao/EquitableEquityProjectDAO.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract EquitableEquityDAO is NetworkGovernor {

    /** Index by project name (starting at 1; not 0). */
    mapping(string => uint) private projectByNameMapping;

    /** Index by token symbol (starting at 1; not 0). */
    mapping(string => uint) private projectByTokenSymbolMapping;

    EquitableEquityProjectDAO[] private projects;

    constructor() {
        signature = address(this);
    }

    function listProjects() public view returns (EquitableEquityProjectDAO[] memory) {
        return projects;
    }

    function createProject(
        string memory projectName,
        string memory tokenSymbol,
        address payable foundingWalletAddress,
        uint64 initialGrantAmount
    ) public returns (EquitableEquityProjectDAO) {

        /** When there's no element at the specified position, 0 will be returned. */
        require (projectByNameMapping[projectName] == 0, "Project name already taken");
        require (projectByTokenSymbolMapping[tokenSymbol] == 0, "Project symbol already taken");

        projects.push(
            new EquitableEquityProjectDAO(
                projectName,
                tokenSymbol,
                foundingWalletAddress,
                initialGrantAmount,
                this
            )
        );

        uint newProjectIndex = projects.length;
        projectByNameMapping[projectName] = newProjectIndex;
        projectByTokenSymbolMapping[tokenSymbol] = newProjectIndex;

        return projects[newProjectIndex - 1];
    }
}
