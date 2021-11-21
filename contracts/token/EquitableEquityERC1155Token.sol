// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import { NetworkGovernor } from "../governance/NetworkGovernor.sol";

contract EquitableEquityERC1155Token is ERC1155, ERC1155Supply {
    /** To be replaced with a more abstract system. */
    uint256 constant private FOUNDING_MEMBER_FT_ID = 0;

    EquityGovernor private equityGovernor;
    NetworkGovernor private networkGovernor;

    constructor(
        EquityGovernor _equityGovernor,
        NetworkGovernor _networkGovernor,
        string memory uri
    ) ERC1155(string(uri)) {
        equityGovernor = _equityGovernor;
        networkGovernor = _networkGovernor;
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
        super._beforeTokenTransfer(
            operator,
            from,
            to,
            ids,
            amounts,
            data
        );

        /** 
         * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
         * of token type `id` will be  transferred to `to`.
         */
        if (to != address(0) && to != address(0)) {
            for (uint i = 0; i < ids.length; i++) {
                require(equityGovernor.approveTokenTransfer(ids[i], from, to, amounts[i]), "Transaction not approved");
            }
        }
        /** Not handling mint and burn requests because they're internal. */
    }

    function grantFoundingMemberFT(address payable recipient) public {
        _mint(recipient, FOUNDING_MEMBER_FT_ID, 1, "Founding Member");
    }

    function requireSentByNetworkGovernor(address operator) private view {
        require(operator == address(networkGovernor), "Not authorized");
    }

    function requireSentByEquityGovernor(address operator) private view {
        require(operator == address(equityGovernor), "Not authorized");
    }
}
