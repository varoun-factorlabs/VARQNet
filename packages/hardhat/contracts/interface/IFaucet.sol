// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IFaucet {
    // @notice This function executes a trade between the collateralized asset and the synthetic asset using price premium.
    function tap (address asset0, uint256 amount0) external returns (bool);
}