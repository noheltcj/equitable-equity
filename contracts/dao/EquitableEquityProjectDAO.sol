// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import { EquitableEquityDAO } from "../dao/EquitableEquityDAO.sol";
import { EquitableEquityToken } from "../token/EquitableEquityToken.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ProjectVoteGovernor } from "../governance/ProjectVoteGovernor.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";

// TODO: Upgradability
contract EquitableEquityProjectDAO is EquityGovernor {
    EquitableEquityToken private equityToken;
    ProjectVoteGovernor private projectVoteGovernor;

    ProjectState private projectState;

    constructor(
        uint projectId,
        string memory projectName,
        EquitableEquityToken _equityToken,
        address payable founderAddress
    ) {
        equityToken = _equityToken;
        projectVoteGovernor = new ProjectVoteGovernor(
            equityToken,
            new TimelockController(
                5, // Approximately 1 minute in blocks
                dynamicSingletonArray(address(this)),
                dynamicSingletonArray(address(0))
            )
        );

        projectState = ProjectState(projectId, projectName, new address payable[](1));
        projectState.participants[0] = founderAddress;
    } 

    function approveEquityTransfer(
        address from,
        address to,
        uint amount
    ) override(EquityGovernor) public pure returns (bool) {
        return true;
    }

    function approveTokenTransfer(
        uint tokenId,
        address from,
        address to,
        uint amount
    ) override(EquityGovernor) public pure returns (bool) {
        return true;
    }

    function requestEquityGrant(address payable recipient, uint grantAmount) public {
        equityToken.grantEquity(recipient, grantAmount);
    }

    function requestFounderStatus(address payable recipient) public {
        equityToken.grantFoundingMemberNFT(recipient);
    }

    function getProjectName() public view returns(string memory) {
        return projectState.projectName;
    }

    function getParticipants() public view returns(address payable[] memory) {
        return projectState.participants;
    }

    function dynamicSingletonArray(address addr) private pure returns (address[] memory) {
        address[] memory dynamicArray = new address[](1);
        dynamicArray[0] = addr;
        return dynamicArray;
    }

    struct ProjectState {
        uint projectId;
        string projectName;
        address payable[] participants;
    }

}
