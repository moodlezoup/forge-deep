import { StructDefinition, VariableDeclaration } from "solidity-ast";

function recursivePretty(member: VariableDeclaration): string {
    return `str = str.concat(_prettyPrint(a.${member.name}, "${member.name}: ", ",\\n", recursionDepth + 1, false));`;
}

function recursiveCompare(member: VariableDeclaration): string {
    return `_comparePrint(a.${member.name}, b.${member.name}, "${member.name}: ", ",\\n", recursionDepth + 1, comparison);`;
}

export function renderStructFunctions(structDef: StructDefinition): string {
    const { canonicalName, members, name } = structDef;

    return `
    function prettyPrint(${canonicalName} memory a)
        internal
        pure
        returns (string memory)
    {
        return _prettyPrint(a, "", "", 0, false);
    }

    function assertDeepEq(${canonicalName} memory a, ${canonicalName} memory b)
        internal
    {
        if (keccak256(abi.encode(a)) != keccak256(abi.encode(b))) {
            emit log("Error: a == b not satisfied [${name}]");
            Comparison memory comparison;
            _comparePrint(a, b, "", "", 0, comparison);
            emit log_named_string("\\na", comparison.a);
            emit log_named_string("\\nb", comparison.b);
            fail();
        }
    }

    function _prettyPrint(
        ${canonicalName} memory a,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        bool highlight
    )
        private
        pure
        returns (string memory)
    {
        string memory str = _tab(prefix.concat("{\\n"), recursionDepth);
        ${members.map(recursivePretty).join("\n            ")}
        str = str.concat(_tab("]", recursionDepth));
        return highlight ? _boldRed(str).concat(suffix) : str.concat(suffix);
    }

    function _comparePrint(
        ${canonicalName} memory a,
        ${canonicalName} memory b,
        string memory prefix,
        string memory suffix,
        uint256 recursionDepth,
        Comparison memory comparison
    )
        private
        pure
    {
        comparison.a = comparison.a.concat(_tab(prefix.concat("{\\n"), recursionDepth));
        comparison.b = comparison.b.concat(_tab(prefix.concat("{\\n"), recursionDepth));
        ${members.map(recursiveCompare).join("\n            ")}
        comparison.a = comparison.a.concat(_tab("}", recursionDepth)).concat(suffix);
        comparison.b = comparison.b.concat(_tab("}", recursionDepth)).concat(suffix);
    }`;
}
