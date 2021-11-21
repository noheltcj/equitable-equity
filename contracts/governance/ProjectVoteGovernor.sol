// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { Governor } from "@openzeppelin/contracts/governance/Governor.sol";
import { GovernorCompatibilityBravo } from "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import { GovernorVotes } from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import { GovernorVotesQuorumFraction } from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import { GovernorTimelockControl, TimelockController } from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

abstract contract ProjectVoteGovernor is Governor, GovernorTimelockControl {

    constructor(TimelockController _timelock)
        Governor("Equitable Equity Governance")
        GovernorTimelockControl(_timelock)
    {}

    /** Voting doesn't begin until the next block. */
    function votingDelay() public pure override returns (uint256) {
        return 1;
    }

    /** One minute voting period. */
    function votingPeriod() public pure override returns (uint256) {
        return 5;
    }
    
    /** Below this are openzeppelin required overrides. */

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function quorum(uint256 blockNumber) public view override returns (uint256) {

    }
}
