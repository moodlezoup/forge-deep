// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Plants {
    type Meters is uint256;

    enum LeafColor {
        Green,
        Yellow,
        Orange,
        Red
    }

    struct Tree {
        LeafColor color;
        Meters height;
        string name;
    }

    // Unused by Zoo.sol
    struct Cactus {
        Meters height;
        string name;
    }

    string[] public plantFacts;
}
