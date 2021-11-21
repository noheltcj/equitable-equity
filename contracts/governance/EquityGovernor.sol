// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

interface EquityGovernor {

    function approveEquityTransfer(
        address from,
        address to,
        uint amount
    ) external returns (bool);

    function approveTokenTransfer(
        uint tokenId, 
        address from, 
        address to, 
        uint amount
    ) external returns (bool);
}