// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.6;

library AccessControl {
    function assertIdentity(address operator, address expected) public pure {
        require(operator == expected, "Not authorized");
    }
}