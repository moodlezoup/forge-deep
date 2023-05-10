import { findAll } from "solidity-ast/utils";
import artifact from "./out/Plants.sol/Plants.json";
import { VariableDeclaration } from "solidity-ast";

for (const enumDef of findAll("EnumDefinition", artifact.ast as any)) {
    const { canonicalName, name, members } = enumDef;
    console.log(`
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
        string[${members.length}] memory ${name}Strings = [${members.map((member) => `"${member.name}"`).join(", ")}];
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
    }`);
}

for (const userDefinedValueType of findAll("UserDefinedValueTypeDefinition", artifact.ast as any)) {
    const { canonicalName, name } = userDefinedValueType;
    console.log(`
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
        if (${canonicalName}.unwrap(a) != ${canonicalName}.unwrap(b)) {
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
        string memory str = _tab(
            prefix.concat(prettyPrint(${canonicalName}.unwrap(a))),
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
        bool equal = ${canonicalName}.unwrap(a) == ${canonicalName}.unwrap(b);
        comparison.a = comparison.a
            .concat(_prettyPrint(a, prefix, suffix, recursionDepth, !equal));
        comparison.b = comparison.b
            .concat(_prettyPrint(b, prefix, suffix, recursionDepth, !equal));
    }`);
}

for (const arrayType of findAll("ArrayTypeName", artifact.ast as any)) {
    let {
        typeDescriptions: { typeString },
    } = arrayType;

    // Remove "struct " from typeString
    [typeString] = typeString?.split(" ").slice(-1)!;

    console.log(`
    function prettyPrint(${typeString} memory a)
        internal
        pure
        returns (string memory)
    {
        return _prettyPrint(a, "", "", 0, false);
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
    }`);
}

for (const structDef of findAll("StructDefinition", artifact.ast as any)) {
    const { canonicalName, members, name } = structDef;
    const recursivePretty = (member: VariableDeclaration) => {
        return `str = str.concat(_prettyPrint(a.${member.name}, "${member.name}: ", ",\\n", recursionDepth + 1, false));`;
    };
    const recursiveCompare = (member: VariableDeclaration) => {
        return `_comparePrint(a.${member.name}, b.${member.name}, "${member.name}: ", ",\\n", recursionDepth + 1, comparison);`;
    };
    console.log(`
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
    }`);
}
