// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import { EquitableEquityProjectDAO } from "./EquitableEquityProjectDAO.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract EquitableEquityDAO is NetworkGovernor {

    /** Index by project name (starting at 1; not 0). */
    mapping(string => uint) private projectByNameMapping;

    string private contentUri;

    EquitableEquityProjectDAO[] private projects;

    /** TODO: Governance vote to update */
    constructor(string memory initialContentUri) {
        contentUri = initialContentUri;
    }

    function listProjects() public view returns (EquitableEquityProjectDAO[] memory) {
        return projects;
    }

    function projectByName(string memory name) public view returns (EquitableEquityProjectDAO) {
        return projects[projectByNameMapping[name] - 1];
    }

    function createProject(
        string memory projectName,
        string memory equityTokenName,
        string memory equityTokenSymbol,
        address payable foundingWalletAddress,
        uint256 initialGrantAmount
    ) public returns (EquitableEquityProjectDAO) {

        /** When there's no element at the specified position, 0 will be returned. */
        require (projectByNameMapping[projectName] == 0, "Project name already taken");

        EquitableEquityProjectDAO projectDAO = new EquitableEquityProjectDAO(
            projects.length,
            projectName,
            equityTokenName,
            equityTokenSymbol,
            contentUri,
            foundingWalletAddress,
            initialGrantAmount,
            this
        );

        projects.push(projectDAO);          
                                            
        uint newProjectIndex = projects.length;
        projectByNameMapping[projectName] = newProjectIndex;

        return projects[newProjectIndex - 1];
    }
}
