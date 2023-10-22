// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ATMContract {
    address public atmAddress;
    IERC20 public bTTDC;

    constructor(address _atmAddress, address _tokenAddress) {
        atmAddress = _atmAddress;
        bTTDC = IERC20(_tokenAddress);
    }

    function deposit(uint256 amount) external {
        require(bTTDC.allowance(msg.sender, address(this)) >= amount, "Approve the contract to spend tokens first.");
        require(bTTDC.transferFrom(msg.sender, atmAddress, amount), "Transfer failed.");
    }

    // function approveToken(address spender, uint256 amount) external {
    //     require(msg.sender == atmAddress, "Only ATM can approve tokens");
    //     require(token.approve(spender, amount), "Approval failed.");
    // }
}