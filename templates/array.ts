import { ArrayTypeName } from "solidity-ast";

export function renderArrayFunctions(arrayType: ArrayTypeName): string {
    let {
        typeDescriptions: { typeString },
    } = arrayType;

    // Remove "struct "/"enum " from typeString
    [typeString] = typeString?.split(" ").slice(-1)!;

    return `
    function prettyPrint(${typeString} memory a)
        internal
    {
        emit log(_prettyPrint(a, "\\n", "", 0, false));
    }

    function assertDeepEq(${typeString} memory a, ${typeString} memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [${typeString}]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\\na", comparison.a);
            emit log_named_string("\\nb", comparison.b);
            fail();
        }
    }
    
    function _prettyPrint(
        ${typeString} memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("[\\n"), recursionDepth);
        for (uint256 i = 0; i < a.length; i++) {
            str = str.concat(_prettyPrint(a[i], "", ",\\n", recursionDepth + 1, false));
        }
        str = str.concat(_tab("]", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }
    
    function _comparePrint(
        ${typeString} memory a,
        ${typeString} memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("[\\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("[\\n"), recursionDepth));
        if (a.length < b.length) {
            for (uint256 i = 0; i < a.length; i++) {
                _comparePrint(a[i], b[i], "", ",\\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = a.length; i < b.length; i++) {
                comparison.b = comparison.b
                    .concat(_prettyPrint(b[i], "", ",\\n", recursionDepth + 1, true));
            }
        } else {
            for (uint256 i = 0; i < b.length; i++) {
                _comparePrint(a[i], b[i], "", ",\\n", recursionDepth + 1, comparison);
            }
            for (uint256 i = b.length; i < a.length; i++) {
                comparison.a = comparison.a
                    .concat(_prettyPrint(a[i], "", ",\\n", recursionDepth + 1, true));
            }
        } 
        comparison.a = comparison.a.concat(_tab("]", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("]", recursionDepth)).concat(suffix);
    }`;
}
