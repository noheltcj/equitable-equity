// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityDAO } from "../dao/EquitableEquityDAO.sol";
import { EquitableEquityToken } from "../token/EquitableEquityToken.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ProjectVoteGovernor } from "../governance/ProjectVoteGovernor.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";

function dynamicSingletonArray(address addr) pure returns (address[] memory) {
    address[] memory dynamicArray = new address[](1);
    dynamicArray[0] = addr;
    return dynamicArray;
}

// TODO: Upgradability
contract EquitableEquityProjectDAO is EquityGovernor, ProjectVoteGovernor {
    EquitableEquityToken private equityToken;
    ProjectVoteGovernor private voteGovernor;

    ProjectState private state;

    constructor(
        uint projectId,
        string memory projectName,
        string memory contentUri,
        address payable founderAddress
    ) ProjectVoteGovernor(
        new TimelockController(
            5, // Approximately 1 minute in blocks
            dynamicSingletonArray(address(this)),
            dynamicSingletonArray(address(0))
        )
    ) {
        equityToken = new EquitableEquityToken(contentUri, this);
        state = ProjectState(projectId, projectName, new address payable[](1));
        state.participants[0] = founderAddress;
    }

    function requestEquityGrant(address payable recipient, uint grantAmount) public {
        equityToken.grantEquity(recipient, grantAmount);
    }

    function requestFounderStatus(address payable recipient) public {
        equityToken.grantFoundingMemberNFT(recipient);
    }

    function approveTransfer(
        uint tokenId,
        address from,
        address to,
        uint amount
    ) override(EquityGovernor) public returns (bool) {
        return true;
    }

    // solhint-disable-next-line func-name-mixedcase
    function COUNTING_MODE() public pure override returns (string memory) {
        return "support=bravo&quorum=for,abstain";
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(ProjectVoteGovernor)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getProjectName() public view returns(string memory) {
        return state.projectName;
    }

    function getParticipants() public view returns(address payable[] memory) {
        return state.participants;
    }

    struct ProjectState {
        uint projectId;
        string projectName;
        address payable[] participants;
    }

}
