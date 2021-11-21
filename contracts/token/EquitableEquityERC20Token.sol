// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Votes, ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract EquitableEquityToken is ERC20, ERC20Votes {
    /** To be replaced with a more abstract system. */
    uint256 constant private FOUNDING_MEMBER_FT_ID = 0;

    NetworkGovernor private networkGovernor;
    EquityGovernor private equityGovernor;

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

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);

        /** 
         * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
         * will be transferred to `to`.
         */
        if (to != address(0) && to != address(0)) {
            require(equityGovernor.approveEquityTransfer(from, to, amount), "Transaction not approved");
        }

        /** Not handling mint and burn requests because they're internal. */
    }

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /**
     * @dev Snapshots the totalSupply after it has been increased.
     */
    function _mint(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(account, amount);
    }

    /**
     * @dev Snapshots the totalSupply after it has been decreased.
     */
    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

    function reassignGovernor(EquityGovernor governor) public {
        requireSentByNetworkGovernor(_msgSender());

        equityGovernor = governor;
    }

    function grantEquity(address payable recipient, uint256 amount) public {
        requireSentByEquityGovernor(_msgSender());

        _mint(recipient, amount);
    }

    function requireSentByNetworkGovernor(address operator) private view {
        require(operator == address(networkGovernor), "Not authorized");
    }

    function requireSentByEquityGovernor(address operator) private view {
        require(operator == address(equityGovernor), "Not authorized");
    }
}