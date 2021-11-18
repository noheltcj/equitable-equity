// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

abstract contract EquityGovernor {
    function approveTransfer(
        uint tokenId, 
        address from, 
        address to, 
        uint amount
    ) public virtual returns (bool);
}