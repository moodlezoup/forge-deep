// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Plants.sol";

contract Zoo {
    enum Animal {
        Cat,
        Dog,
        Sloth,
        Capybara
    }

    struct Habitat {
        string name;
        Animal[] animals;
        Plants.Tree tree;
    }

    struct Zone {
        uint256 id;
        Habitat[2] habitats;
    }

    Zone[] public zones;
    string[] public animalFacts;
}
