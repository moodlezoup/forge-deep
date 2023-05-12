export function renderDeepTestContract(contractName: string, filesToImport: string[], generatedFunctions: string) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "forge-std/Test.sol";
import {StdStyle} from "forge-std/StdStyle.sol";
import {LibString} from "solady/utils/LibString.sol";
${filesToImport.map((f) => `import "${f}";`).join("\n")}


abstract contract ${contractName} is Test {
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

    ${generatedFunctions}

    ///////////////////// END GENERATED /////////////////////
}`;
}
