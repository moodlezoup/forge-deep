// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "forge-std/Test.sol";
import {StdStyle} from "forge-std/StdStyle.sol";
import {LibString} from "solady/utils/LibString.sol";
import "src/Zoo.sol";
import "src/Plants.sol";


abstract contract DeepTest is Test {
    using LibString for *;

    struct Comparison {
        string a;
        string b;
    }

    string private constant TAB = "    ";

    function _tab(string memory str, uint256 numTabs)
        private 
        pure 
        returns (string memory) 
    {
        string memory tabs;
        for (uint256 i = 0; i < numTabs; i++) {
            tabs = tabs.concat(TAB);
        }
        return tabs.concat(str);
    }

    function _boldRed(string memory str) 
        private 
        pure 
        returns (string memory)
    {
        return StdStyle.bold(StdStyle.red(str));
    }

    function prettyPrint(uint256 a)
        internal
    {
        emit log(a.toString());
    }    

    function _prettyPrint(
        uint256 a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat(a.toString()), recursionDepth);
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }
    
    function _comparePrint(
        uint256 a,
        uint256 b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b));
    }
    
    function prettyPrint(bytes32 a) 
        internal
    {
        emit log(uint256(a).toHexString(32));
    }

    function _prettyPrint(
        bytes32 a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight        
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat(uint256(a).toHexString(32)), recursionDepth);
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        bytes32 a,
        bytes32 b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b));
    }
    
    function prettyPrint(address a)
        internal
    {
        emit log(a.toHexString());
    }

    function _prettyPrint(
        address a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat(a.toHexString()), recursionDepth);
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }    

    function _comparePrint(
        address a,
        address b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b));
    }
    
    function prettyPrint(bool a)
        internal
    {
        emit log(a ? "true" : "false");
    }

    function _prettyPrint(
        bool a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat(a ? "true" : "false"), recursionDepth);
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        bool a,
        bool b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b));
    }

    function prettyPrint(string memory a)
        internal
    {
        emit log(string.concat('"', a, '"'));
    }

    function _prettyPrint(
        string memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat(string.concat('"', a, '"')), recursionDepth);
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        string memory a,
        string memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        bool equal = keccak256(bytes(a)) == keccak256(bytes(b));
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, !equal));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, !equal));
    }

    function prettyPrint(bytes memory a)
        internal
    {
        emit log(a.toHexString());
    }

    function _prettyPrint(
        bytes memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat(a.toHexString()), recursionDepth);
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        bytes memory a,
        bytes memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        bool equal = keccak256(a) == keccak256(b);
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, !equal));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, !equal));
    }
    
    //////////////////// BEGIN GENERATED ////////////////////

    
    function prettyPrint(Zoo.Animal a)
        internal
    {
        emit log(_prettyPrint(a, "", "", 0, false));
    }

    function assertDeepEq(Zoo.Animal a, Zoo.Animal b)
        internal
    {
        if (a != b) {
            emit log("Error: a == b not satisfied [Animal]");
            emit log_named_string("      Left", _prettyPrint(a, "", "", 0, false));
            emit log_named_string("     Right", _prettyPrint(b, "", "", 0, false));
            fail();
        }
    }

    function _prettyPrint(
        Zoo.Animal a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string[4] memory AnimalStrings = ["Cat", "Dog", "Sloth", "Capybara"];
        string memory str = _tab(
            prefix.concat(AnimalStrings[uint8(a)]),
            recursionDepth
        );
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        Zoo.Animal a,
        Zoo.Animal b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b)
        );
    }

    function prettyPrint(Zoo.Animal[] memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Zoo.Animal[] memory a, Zoo.Animal[] memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Zoo.Animal[]]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }
    
    function _prettyPrint(
        Zoo.Animal[] memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("[\n"), recursionDepth);
        for (uint256 i = 0; i < a.length; i++) {
            str = str.concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, false));
        }
        str = str.concat(_tab("]", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }
    
    function _comparePrint(
        Zoo.Animal[] memory a,
        Zoo.Animal[] memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("[\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("[\n"), recursionDepth));
        if (a.length < b.length) {
            for (uint256 i = 0; i < a.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = a.length; i < b.length; i++) {
                comparison.b = comparison.b
                    .concat(_prettyPrint(b[i], "", ",\n", recursionDepth + 1, true));
            }
        } else {
            for (uint256 i = 0; i < b.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = b.length; i < a.length; i++) {
                comparison.a = comparison.a
                    .concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, true));
            }
        } 
        comparison.a = comparison.a.concat(_tab("]", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("]", recursionDepth)).concat(suffix);
    }

    function prettyPrint(Zoo.Habitat[2] memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Zoo.Habitat[2] memory a, Zoo.Habitat[2] memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Zoo.Habitat[2]]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }
    
    function _prettyPrint(
        Zoo.Habitat[2] memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("[\n"), recursionDepth);
        for (uint256 i = 0; i < a.length; i++) {
            str = str.concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, false));
        }
        str = str.concat(_tab("]", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }
    
    function _comparePrint(
        Zoo.Habitat[2] memory a,
        Zoo.Habitat[2] memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("[\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("[\n"), recursionDepth));
        if (a.length < b.length) {
            for (uint256 i = 0; i < a.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = a.length; i < b.length; i++) {
                comparison.b = comparison.b
                    .concat(_prettyPrint(b[i], "", ",\n", recursionDepth + 1, true));
            }
        } else {
            for (uint256 i = 0; i < b.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = b.length; i < a.length; i++) {
                comparison.a = comparison.a
                    .concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, true));
            }
        } 
        comparison.a = comparison.a.concat(_tab("]", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("]", recursionDepth)).concat(suffix);
    }

    function prettyPrint(Zoo.Zone[] memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Zoo.Zone[] memory a, Zoo.Zone[] memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Zoo.Zone[]]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }
    
    function _prettyPrint(
        Zoo.Zone[] memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("[\n"), recursionDepth);
        for (uint256 i = 0; i < a.length; i++) {
            str = str.concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, false));
        }
        str = str.concat(_tab("]", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }
    
    function _comparePrint(
        Zoo.Zone[] memory a,
        Zoo.Zone[] memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("[\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("[\n"), recursionDepth));
        if (a.length < b.length) {
            for (uint256 i = 0; i < a.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = a.length; i < b.length; i++) {
                comparison.b = comparison.b
                    .concat(_prettyPrint(b[i], "", ",\n", recursionDepth + 1, true));
            }
        } else {
            for (uint256 i = 0; i < b.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = b.length; i < a.length; i++) {
                comparison.a = comparison.a
                    .concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, true));
            }
        } 
        comparison.a = comparison.a.concat(_tab("]", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("]", recursionDepth)).concat(suffix);
    }

    function prettyPrint(string[] memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(string[] memory a, string[] memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [string[]]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }
    
    function _prettyPrint(
        string[] memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("[\n"), recursionDepth);
        for (uint256 i = 0; i < a.length; i++) {
            str = str.concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, false));
        }
        str = str.concat(_tab("]", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }
    
    function _comparePrint(
        string[] memory a,
        string[] memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("[\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("[\n"), recursionDepth));
        if (a.length < b.length) {
            for (uint256 i = 0; i < a.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = a.length; i < b.length; i++) {
                comparison.b = comparison.b
                    .concat(_prettyPrint(b[i], "", ",\n", recursionDepth + 1, true));
            }
        } else {
            for (uint256 i = 0; i < b.length; i++) {
                _comparePrint(a[i], b[i], "", ",\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = b.length; i < a.length; i++) {
                comparison.a = comparison.a
                    .concat(_prettyPrint(a[i], "", ",\n", recursionDepth + 1, true));
            }
        } 
        comparison.a = comparison.a.concat(_tab("]", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("]", recursionDepth)).concat(suffix);
    }

    function prettyPrint(Zoo.Habitat memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Zoo.Habitat memory a, Zoo.Habitat memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Habitat]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }

    function _prettyPrint(
        Zoo.Habitat memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("{\n"), recursionDepth);
        str = str.concat(_prettyPrint(a.name, "name: ", ",\n", recursionDepth + 1, false));
            str = str.concat(_prettyPrint(a.animals, "animals: ", ",\n", recursionDepth + 1, false));
            str = str.concat(_prettyPrint(a.tree, "tree: ", ",\n", recursionDepth + 1, false));
        str = str.concat(_tab("}", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        Zoo.Habitat memory a,
        Zoo.Habitat memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("{\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("{\n"), recursionDepth));
        _comparePrint(a.name, b.name, "name: ", ",\n", recursionDepth + 1, comparison);
            _comparePrint(a.animals, b.animals, "animals: ", ",\n", recursionDepth + 1, comparison);
            _comparePrint(a.tree, b.tree, "tree: ", ",\n", recursionDepth + 1, comparison);
        comparison.a = comparison.a.concat(_tab("}", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("}", recursionDepth)).concat(suffix);
    }

    function prettyPrint(Zoo.Zone memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Zoo.Zone memory a, Zoo.Zone memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Zone]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }

    function _prettyPrint(
        Zoo.Zone memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("{\n"), recursionDepth);
        str = str.concat(_prettyPrint(a.id, "id: ", ",\n", recursionDepth + 1, false));
            str = str.concat(_prettyPrint(a.habitats, "habitats: ", ",\n", recursionDepth + 1, false));
        str = str.concat(_tab("}", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        Zoo.Zone memory a,
        Zoo.Zone memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("{\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("{\n"), recursionDepth));
        _comparePrint(a.id, b.id, "id: ", ",\n", recursionDepth + 1, comparison);
            _comparePrint(a.habitats, b.habitats, "habitats: ", ",\n", recursionDepth + 1, comparison);
        comparison.a = comparison.a.concat(_tab("}", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("}", recursionDepth)).concat(suffix);
    }

    function prettyPrint(Plants.Tree memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Plants.Tree memory a, Plants.Tree memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Tree]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }

    function _prettyPrint(
        Plants.Tree memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("{\n"), recursionDepth);
        str = str.concat(_prettyPrint(a.color, "color: ", ",\n", recursionDepth + 1, false));
            str = str.concat(_prettyPrint(a.height, "height: ", ",\n", recursionDepth + 1, false));
            str = str.concat(_prettyPrint(a.name, "name: ", ",\n", recursionDepth + 1, false));
        str = str.concat(_tab("}", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        Plants.Tree memory a,
        Plants.Tree memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("{\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("{\n"), recursionDepth));
        _comparePrint(a.color, b.color, "color: ", ",\n", recursionDepth + 1, comparison);
            _comparePrint(a.height, b.height, "height: ", ",\n", recursionDepth + 1, comparison);
            _comparePrint(a.name, b.name, "name: ", ",\n", recursionDepth + 1, comparison);
        comparison.a = comparison.a.concat(_tab("}", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("}", recursionDepth)).concat(suffix);
    }

    function prettyPrint(Plants.LeafColor a)
        internal
    {
        emit log(_prettyPrint(a, "", "", 0, false));
    }

    function assertDeepEq(Plants.LeafColor a, Plants.LeafColor b)
        internal
    {
        if (a != b) {
            emit log("Error: a == b not satisfied [LeafColor]");
            emit log_named_string("      Left", _prettyPrint(a, "", "", 0, false));
            emit log_named_string("     Right", _prettyPrint(b, "", "", 0, false));
            fail();
        }
    }

    function _prettyPrint(
        Plants.LeafColor a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string[4] memory LeafColorStrings = ["Green", "Yellow", "Orange", "Red"];
        string memory str = _tab(
            prefix.concat(LeafColorStrings[uint8(a)]),
            recursionDepth
        );
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        Plants.LeafColor a,
        Plants.LeafColor b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b)
        );
    }

    function prettyPrint(Plants.Meters a)
        internal
    {
        emit log(_prettyPrint(a, "", "", 0, false));
    }

    function assertDeepEq(Plants.Meters a, Plants.Meters b)
        internal
    {
        if (Plants.Meters.unwrap(a) != Plants.Meters.unwrap(b)) {
            emit log("Error: a == b not satisfied [Meters]");
            emit log_named_string("      Left", _prettyPrint(a, "", "", 0, false));
            emit log_named_string("     Right", _prettyPrint(b, "", "", 0, false));
            fail();
        }
    }
    
    function _prettyPrint(
        Plants.Meters a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        return _prettyPrint(
            Plants.Meters.unwrap(a),
            prefix,
            suffix,
            recursionDepth,
            highlight
        );
    }
    
    function _comparePrint(
        Plants.Meters a,
        Plants.Meters b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        _comparePrint(
            Plants.Meters.unwrap(a),
            Plants.Meters.unwrap(b),
            prefix,
            suffix,
            recursionDepth,
            comparison
        );
    }

    function prettyPrint(Plants.Cactus memory a)
        internal
    {
        emit log(_prettyPrint(a, "\n", "", 0, false));
    }

    function assertDeepEq(Plants.Cactus memory a, Plants.Cactus memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [Cactus]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\na", comparison.a);
            emit log_named_string("\nb", comparison.b);
            fail();
        }
    }

    function _prettyPrint(
        Plants.Cactus memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("{\n"), recursionDepth);
        str = str.concat(_prettyPrint(a.height, "height: ", ",\n", recursionDepth + 1, false));
            str = str.concat(_prettyPrint(a.name, "name: ", ",\n", recursionDepth + 1, false));
        str = str.concat(_tab("}", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        Plants.Cactus memory a,
        Plants.Cactus memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("{\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("{\n"), recursionDepth));
        _comparePrint(a.height, b.height, "height: ", ",\n", recursionDepth + 1, comparison);
            _comparePrint(a.name, b.name, "name: ", ",\n", recursionDepth + 1, comparison);
        comparison.a = comparison.a.concat(_tab("}", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("}", recursionDepth)).concat(suffix);
    }

    ///////////////////// END GENERATED /////////////////////
}