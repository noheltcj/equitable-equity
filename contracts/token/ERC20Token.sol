// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Votes, ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract ERC20Token is ERC20, ERC20Votes {
    /** To be replaced with a more abstract system. */
    uint32 constant internal FOUNDING_MEMBER_FT_ID = 0;

    EquityGovernor internal equityGovernor;
    NetworkGovernor internal networkGovernor;

    /** It's imperative that setEquityGovernor is called immediately after construction. */
    constructor(
        EquityGovernor _equityGovernor,
        NetworkGovernor _networkGovernor,
        string memory name,
        string memory symbol
    ) 
    ERC20(name, symbol)
    ERC20Permit(name) {
        equityGovernor = _equityGovernor;
        networkGovernor = _networkGovernor;
    }

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    function grantEquity(address payable recipient, uint256 amount) public {
        require(_msgSender() == address(equityGovernor), "403");

        _mint(recipient, amount);
    }
}