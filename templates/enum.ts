import { EnumDefinition } from "solidity-ast";

export function renderEnumFunctions(enumDef: EnumDefinition): string {
    const { canonicalName, name, members } = enumDef;

    return `
    function prettyPrint(${canonicalName} a)
        internal
        pure
        returns (string memory)
    {
        return _prettyPrint(a, "", "", 0, false);
    }

    function assertDeepEq(${canonicalName} a, ${canonicalName} b)
        internal
    {
        if (a != b) {
            emit log("Error: a == b not satisfied [${name}]");
            emit log_named_string("      Left", prettyPrint(a));
            emit log_named_string("     Right", prettyPrint(b));
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
        string[${members.length}] memory ${name}Strings = [${members
        .map((member) => `"${member.name}"`)
        .join(", ")}];
        string memory str = _tab(
            prefix.concat(${name}Strings[uint8(a)]),
            recursionDepth
        );
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
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
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, a != b));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, a != b)
        );
    }`;
}
