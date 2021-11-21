// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import { ProjectDAO } from "./ProjectDAO.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract DAO is NetworkGovernor {

    /** Index by project name (starting at 1; not 0). */
    mapping(string => uint) private projectByNameMapping;

    string private contentUri;

    ProjectDAO[] private projects;

    /** TODO: Governance vote to update */
    constructor(string memory initialContentUri) {
        contentUri = initialContentUri;
    }

    function listProjects() public view returns (ProjectDAO[] memory) {
        return projects;
    }

    function projectByName(string memory name) public view returns (ProjectDAO) {
        return projects[projectByNameMapping[name] - 1];
    }

    function createProject(
        string memory projectName,
        string memory equityTokenName,
        string memory equityTokenSymbol,
        address payable foundingWalletAddress,
        uint256 initialGrantAmount
    ) external returns (ProjectDAO) {

        /** When there's no element at the specified position, 0 will be returned. */
        require (projectByNameMapping[projectName] == 0, "Project name already taken");

        ProjectDAO projectDAO = new ProjectDAO(
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
