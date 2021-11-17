// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityToken } from "../token/EquitableEquityToken.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract EquitableEquityProjectDAO is EquityGovernor {
    NetworkGovernor private networkGovernor;
    EquitableEquityToken private equityToken;

    string public organizationName;
    address[] public participants;

    constructor(
        string memory projectName,
        string memory tokenSymbol,
        address payable foundingWalletAddress,
        uint initialGrantAmount,
        NetworkGovernor networkGovernor_
    ) {
        // TODO: Validate name and symbol

        signature = address(this);

        networkGovernor = networkGovernor_;
        equityToken = new EquitableEquityToken(projectName, tokenSymbol, this);

        equityToken.grantEquity(foundingWalletAddress, initialGrantAmount);
    }
}
