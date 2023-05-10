// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import {LibString} from "solady/utils/LibString.sol";
import "../src/Zoo.sol";
import "../src/DeepTest.sol";


contract DeepTestTest is DeepTest {
    function testDeepEq() public {
        Zoo.Zone memory zone;
        zone.id = 1;
        Zoo.Habitat memory habitat1;
        habitat1.name = "Pets";
        habitat1.animals = new Zoo.Animal[](3);
        habitat1.animals[0] = Zoo.Animal.Cat;
        habitat1.animals[1] = Zoo.Animal.Cat;
        habitat1.animals[2] = Zoo.Animal.Dog;
        habitat1.tree = Plants.Tree(Plants.LeafColor.Green, Plants.Meters.wrap(12), "Pascal");

        Zoo.Habitat memory habitat2;
        habitat2.name = "Pets...?";
        habitat2.animals = new Zoo.Animal[](5);
        habitat2.animals[0] = Zoo.Animal.Cat;
        habitat2.animals[1] = Zoo.Animal.Capybara;
        habitat2.animals[2] = Zoo.Animal.Dog;
        habitat2.animals[3] = Zoo.Animal.Sloth;
        habitat2.tree = Plants.Tree(Plants.LeafColor.Red, Plants.Meters.wrap(12), "Pascal");

        assertDeepEq(habitat1, habitat2);
    }
}
