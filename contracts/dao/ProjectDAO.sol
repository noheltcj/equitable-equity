// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import { ERC20Token } from "../token/ERC20Token.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";
import { ProjectVoteGovernor } from "../governance/ProjectVoteGovernor.sol";

contract ProjectDAO is EquityGovernor {
    ERC20Token internal erc20Token;

    NetworkGovernor internal networkGovernor;
    ProjectVoteGovernor internal projectVoteGovernor;

    ProjectState internal projectState;

    constructor(
        uint projectId,
        string memory projectName,
        string memory equityTokenName,
        string memory equityTokenSymbol,
        address payable founderAddress,
        uint256 founderGrantAmount,
        NetworkGovernor _networkGovernor
    ) {
        networkGovernor = _networkGovernor;

        erc20Token = new ERC20Token(
            this,
            equityTokenName,
            equityTokenSymbol
        );

        projectVoteGovernor = new ProjectVoteGovernor(erc20Token);

        erc20Token.grantEquity(founderAddress, founderGrantAmount);

        projectState = ProjectState(projectId, projectName, new address payable[](1));
        projectState.participants[0] = founderAddress;
    } 

    function requestEquityGrant(address payable recipient, uint grantAmount) external {
        erc20Token.grantEquity(recipient, grantAmount);
    }

    function getProjectName() external view returns(string memory) {
        return projectState.projectName;
    }

    function getParticipants() external view returns(address payable[] memory) {
        return projectState.participants;
    }

    function dynamicArray(address addr) internal pure returns (address[] memory) {
        address[] memory dArray = new address[](1);
        dArray[0] = addr;
        return dArray;
    }

    struct ProjectState {
        uint projectId;
        string projectName;
        address payable[] participants;
    }
}
