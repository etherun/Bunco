// SPDX-License-Identifier: UNLICENSE-2.0
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

contract GradualBunco {
    address payable public owner;
    mapping(address => uint256) invests;
    address payable[] private investors;

    constructor() {
        owner = payable(msg.sender);
    }

    function invest() public payable {
        if (investors.length > 0) {
            uint256 _average = msg.value / investors.length;
            for (uint256 i = 0; i < investors.length; i++) {
                invests[investors[i]] += _average;
            }
        }
        invests[msg.sender] = msg.value;
        investors.push(payable(msg.sender));
    }

    function withdraw(address payable addr) public payable {
        require(invests[addr] > 0, "No investments found");
        addr.transfer(invests[addr]);
        delete invests[addr];
    }
}
