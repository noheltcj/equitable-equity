// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import { Governor } from "./Governor.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EquitableEquityToken is ERC20 {
    Governor private governor;

    constructor(
        string memory name,
        string memory symbol,
        Governor governingDAO
    ) ERC20(name, symbol) {
        governor = governingDAO;
    }
}
