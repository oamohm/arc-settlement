// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ArcSettlement is Initializable, OwnableUpgradeable {
    uint256 public royaltyPercentage;
    address public treasury;

    event SettlementExecuted(address indexed from, address indexed to, uint256 amount, uint256 royalty);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }

    function initialize(address _treasury) public initializer {
        __Ownable_init(msg.sender);
        treasury = _treasury;
        royaltyPercentage = 100; // 1%
    }

    function settle(address payable _to, uint256 _amount) public payable {
        uint256 royaltyAmount = (_amount * royaltyPercentage) / 10000;
        uint256 remainingAmount = _amount - royaltyAmount;

        payable(treasury).transfer(royaltyAmount);
        _to.transfer(remainingAmount);

        emit SettlementExecuted(msg.sender, _to, _amount, royaltyAmount);
    }
}

