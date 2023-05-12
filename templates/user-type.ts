import { UserDefinedValueTypeDefinition } from "solidity-ast";

export function renderUserTypeFunctions(userTypeDef: UserDefinedValueTypeDefinition): string {
    const { canonicalName, name } = userTypeDef;

    return `
    function prettyPrint(${canonicalName} a)
        internal
    {
        emit log(_prettyPrint(a, "", "", 0, false));
    }

    function assertDeepEq(${canonicalName} a, ${canonicalName} b)
        internal
    {
        if (${canonicalName}.unwrap(a) != ${canonicalName}.unwrap(b)) {
            emit log("Error: a == b not satisfied [${name}]");
            emit log_named_string("      Left", _prettyPrint(a, "", "", 0, false));
            emit log_named_string("     Right", _prettyPrint(b, "", "", 0, false));
            fail();
        }
    }
    
    function _prettyPrint(
        ${canonicalName} a,
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
            ${canonicalName}.unwrap(a),
            prefix,
            suffix,
            recursionDepth,
            highlight
        );
    }
    
    function _comparePrint(
        ${canonicalName} a,
        ${canonicalName} b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        _comparePrint(
            ${canonicalName}.unwrap(a),
            ${canonicalName}.unwrap(b),
            prefix,
            suffix,
            recursionDepth,
            comparison
        );
    }`;
}
