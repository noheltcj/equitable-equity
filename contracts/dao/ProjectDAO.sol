// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import { ERC1155Token } from "../token/ERC1155Token.sol";
import { ERC20Token } from "../token/ERC20Token.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";
import { ProjectVoteGovernor } from "../governance/ProjectVoteGovernor.sol";

contract ProjectDAO is EquityGovernor {
    ERC1155Token internal erc1155Token;
    ERC20Token internal erc20Token;

    NetworkGovernor internal networkGovernor;
    ProjectVoteGovernor internal projectVoteGovernor;

    ProjectState internal projectState;

    constructor(
        uint projectId,
        string memory projectName,
        string memory equityTokenName,
        string memory equityTokenSymbol,
        string memory erc1155TokenContentUri,
        address payable founderAddress,
        uint256 founderGrantAmount,
        NetworkGovernor _networkGovernor
    ) {
        networkGovernor = _networkGovernor;

        erc1155Token = new ERC1155Token(
            this,
            erc1155TokenContentUri
        );

        erc20Token = new ERC20Token(
            this,
            networkGovernor,
            equityTokenName,
            equityTokenSymbol
        );

        projectVoteGovernor = new ProjectVoteGovernor(erc20Token);

        erc20Token.grantEquity(founderAddress, founderGrantAmount);
        erc1155Token.grantFoundingMemberFT(founderAddress);

        projectState = ProjectState(projectId, projectName, new address payable[](1));
        projectState.participants[0] = founderAddress;
    } 

    function requestEquityGrant(address payable recipient, uint grantAmount) external {
        erc20Token.grantEquity(recipient, grantAmount);
    }

    function requestFounderStatus(address payable recipient) external {
        erc1155Token.grantFoundingMemberFT(recipient);
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
