// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityERC1155Token } from "../token/EquitableEquityERC1155Token.sol";
import { EquitableEquityERC20Token } from "../token/EquitableEquityERC20Token.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";
import { ProjectVoteGovernor } from "../governance/ProjectVoteGovernor.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";

// TODO: Upgradability
contract EquitableEquityProjectDAO is EquityGovernor {
    EquitableEquityERC1155Token private erc1155Token;
    EquitableEquityERC20Token private erc20Token;

    NetworkGovernor private networkGovernor;
    ProjectVoteGovernor private projectVoteGovernor;

    ProjectState private projectState;

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

        erc1155Token = new EquitableEquityERC1155Token(
            this,
            networkGovernor,
            erc1155TokenContentUri
        );

        erc20Token = new EquitableEquityERC20Token(
            this,
            networkGovernor,
            equityTokenName,
            equityTokenSymbol
        );

        projectVoteGovernor = new ProjectVoteGovernor(
            erc20Token,
            new TimelockController(
                5, // Approximately 1 minute in blocks
                dynamicSingletonArray(address(this)),
                dynamicSingletonArray(address(0))
            )
        );

        erc20Token.grantEquity(founderAddress, founderGrantAmount);
        erc1155Token.grantFoundingMemberFT(founderAddress);

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
        erc20Token.grantEquity(recipient, grantAmount);
    }

    function requestFounderStatus(address payable recipient) public {
        erc1155Token.grantFoundingMemberFT(recipient);
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
