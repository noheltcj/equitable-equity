// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EquitableEquityToken is ERC20 {
    address private equityGovernor;

    constructor(
        string memory name,
        string memory symbol,
        EquityGovernor equityGovernor_) ERC20(name, symbol) {
        equityGovernor = address(equityGovernor_);
    }

    function grantEquity(address payable recipient, uint amount) public {
        requireSentByEquityGovernor();

        _mint(recipient, amount);
    }

    function requireSentByEquityGovernor() private view {
        require (msg.sender == equityGovernor, "Not authorized");
    }
}
