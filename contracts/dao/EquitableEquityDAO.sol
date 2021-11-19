// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityProjectDAO } from "../dao/EquitableEquityProjectDAO.sol";

contract EquitableEquityDAO {

    /** Index by project name (starting at 1; not 0). */
    mapping(string => uint) private projectByNameMapping;

    string private contentUri;

    EquitableEquityProjectDAO[] private projects;

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
        address payable foundingWalletAddress
    ) public returns (EquitableEquityProjectDAO) {

        /** When there's no element at the specified position, 0 will be returned. */
        require (projectByNameMapping[projectName] == 0, "Project name already taken");

        projects.push(
            new EquitableEquityProjectDAO(
                projects.length,
                projectName,
                contentUri,
                foundingWalletAddress
            )
        );

        uint newProjectIndex = projects.length;
        projectByNameMapping[projectName] = newProjectIndex;

        return projects[newProjectIndex - 1];
    }
}
