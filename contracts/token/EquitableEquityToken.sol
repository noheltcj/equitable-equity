// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquitableEquityProjectDAO } from "../dao/EquitableEquityProjectDAO.sol";
import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract EquitableEquityToken is ERC1155, ERC1155Supply {
    uint256 constant private EQUITY_TOKEN_ID = 0;
    /** To be replaced */
    uint256 constant private FOUNDING_MEMBER_FT_ID = 1;

    EquityGovernor private equityGovernor;

    constructor(
        string memory uri,
        EquityGovernor equityGovernor_
    ) ERC1155(string(uri)) {
        equityGovernor = equityGovernor_;
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning, as well as batched variants.
     *
     * The same hook is called on both single and batched variants. For single
     * transfers, the length of the `id` and `amount` arrays will be 1.
     *
     * Calling conditions (for each `id` and `amount` pair):
     *
     * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * of token type `id` will be  transferred to `to`.
     * - When `from` is zero, `amount` tokens of token type `id` will be minted
     * for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens of token type `id`
     * will be burned.
     * - `from` and `to` are never both zero.
     * - `ids` and `amounts` have the same, non-zero length.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override (ERC1155, ERC1155Supply) {
        requireSentByEquityGovernor(operator);

        /** 
         * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
         * of token type `id` will be  transferred to `to`.
         */
        if (to != address(0) && to != address(0)) {
            for (uint i = 0; i < ids.length; i++) {
                require(equityGovernor.approveTransfer(ids[i], from, to, amounts[i]), "Transaction not approved");
            }
        }
        /** Not handling mint requests because it's internal. */
    }

    function grantEquity(address payable recipient, uint256 amount) public {
        _mint(recipient, EQUITY_TOKEN_ID, amount, "");
    }

    function grantFoundingMemberNFT(address payable recipient) public {
        _mint(recipient, FOUNDING_MEMBER_FT_ID, 1, "");
    }

    function requireSentByEquityGovernor(address operator) private view {
        require(operator == address(equityGovernor), "Not authorized");
    }
}
