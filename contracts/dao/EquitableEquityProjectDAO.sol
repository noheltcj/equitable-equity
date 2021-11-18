// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityToken } from "../token/EquitableEquityToken.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

// TODO: Upgradability
contract EquitableEquityProjectDAO is EquityGovernor {
    NetworkGovernor private networkGovernor;
    EquitableEquityToken private equityToken;

    ProjectState private state;

    constructor(
        uint projectId,
        string memory projectName,
        string memory contentUri,
        address payable founderAddress,
        uint initialGrantAmount,
        address networkGovernor_
    ) {
        networkGovernor = NetworkGovernor(networkGovernor_);
        equityToken = new EquitableEquityToken(contentUri, address(this));

        state = ProjectState(projectId, projectName, new address payable[](1));
        state.participants.push(founderAddress);

        equityToken.grantEquity(founderAddress, initialGrantAmount);
        equityToken.grantFoundingMemberNFT(founderAddress);
    }

    function approveTransfer(
        uint tokenId,
        address from,
        address to,
        uint amount
    ) override public pure returns (bool) {
        return true;
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
