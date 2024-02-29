// SPDX-License-Identifier: UNLICENSE-2.0
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

contract SimpleBunco {
    uint256 public currentInvest = 0;
    address payable public currentInvestor;
    address payable public owner;

    event Invest(address indexed investor, uint256 value);

    constructor() {
        owner = payable(msg.sender);
    }

    function invest() public payable {
        uint256 minimumInvestment = (currentInvest * 11) / 10;
        require(
            msg.value >= minimumInvestment,
            "Investment must be greater than current invests"
        );
        address payable previousInvestor = currentInvest > 0
            ? currentInvestor
            : owner;
        previousInvestor.transfer(msg.value);
        currentInvestor = payable(msg.sender);
        currentInvest += msg.value;

        emit Invest(msg.sender, msg.value);
    }
}
