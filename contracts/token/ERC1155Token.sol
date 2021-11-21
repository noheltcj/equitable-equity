// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

import { EquityGovernor } from "../governance/EquityGovernor.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/** ERC1155Supply did not cost much */
contract ERC1155Token is ERC1155 {
    /** To be replaced with a more abstract system. */
    uint256 constant private FOUNDING_MEMBER_FT_ID = 0;

    EquityGovernor private equityGovernor;

    constructor(
        EquityGovernor _equityGovernor,
        string memory uri
    ) ERC1155(string(uri)) {
        equityGovernor = _equityGovernor;
    }

    function grantFoundingMemberFT(address payable recipient) external {
        require(_msgSender() == address(equityGovernor), "403");

        _mint(recipient, FOUNDING_MEMBER_FT_ID, 1, "FM");
    }
}
