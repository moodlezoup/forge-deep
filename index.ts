import { findAll } from "solidity-ast/utils";
import {
    ArrayTypeName,
    EnumDefinition,
    SourceUnit,
    StructDefinition,
    UserDefinedValueTypeDefinition,
} from "solidity-ast";
import TOML from "toml";
import fs from "fs";
import path from "path";

type ForgeDeepConfig = { dest: string; artifacts: string; contracts: string[]; types: [] };

const config: ForgeDeepConfig = TOML.parse(fs.readFileSync("forge-deep.toml").toString());

const ASTs: { [absolutePath: string]: { ast: SourceUnit; imports: string[] } } = {};

function findASTs(basePath: string, files: string[]) {
    for (const f of files) {
        var newBasePath = path.join(basePath, f);
        if (fs.statSync(newBasePath).isDirectory()) {
            findASTs(newBasePath, fs.readdirSync(newBasePath));
        } else {
            if (f.substring(f.length - 5) == ".json") {
                const artifact = JSON.parse(fs.readFileSync(newBasePath).toString());
                if ("ast" in artifact) {
                    const ast = artifact.ast as SourceUnit;
                    ASTs[ast.absolutePath] = { ast, imports: Object.keys(artifact.metadata.sources) };
                }
            }
        }
    }
}

findASTs(config.artifacts, fs.readdirSync(config.artifacts));

type Definition = EnumDefinition | UserDefinedValueTypeDefinition | StructDefinition | ArrayTypeName;
const definitions: {
    [name: string]: { def: Definition; source: string };
} = {};

function findDefinitions(absolutePath: string, search?: Set<string>) {
    const references: Set<string> = new Set();

    if (!(absolutePath in ASTs)) {
        throw Error(`Compiler artifact for ${absolutePath} not found in ${config.artifacts}`);
    }
    const { ast, imports } = ASTs[absolutePath];

    for (const enumDef of findAll("EnumDefinition", ast)) {
        const { canonicalName } = enumDef;
        if (search && !search.has(canonicalName)) {
            continue;
        }
        if (canonicalName in definitions) {
            throw Error(`${canonicalName} defined in both ${absolutePath} and ${definitions[canonicalName].source}`);
        }
        definitions[canonicalName] = { def: enumDef, source: absolutePath };
        references.delete(canonicalName);
    }

    for (const userTypeDef of findAll("UserDefinedValueTypeDefinition", ast)) {
        const canonicalName = userTypeDef.canonicalName || userTypeDef.name;
        if (search && !search.has(canonicalName)) {
            continue;
        }
        if (canonicalName in definitions) {
            throw Error(`${canonicalName} defined in both ${absolutePath} and ${definitions[canonicalName].source}`);
        }
        definitions[canonicalName] = { def: userTypeDef, source: absolutePath };
        references.delete(canonicalName);
    }

    for (const arrayType of findAll("ArrayTypeName", ast)) {
        let {
            typeDescriptions: { typeString },
            baseType: {
                nodeType: elementNodeType,
                typeDescriptions: { typeString: elementTypeString },
            },
        } = arrayType;
        // Remove "struct "/"enum " from typeString
        [typeString] = typeString?.split(" ").slice(-1)!;
        if (search && !search.has(typeString)) {
            continue;
        }
        if (typeString in definitions) continue;
        definitions[typeString] = { def: arrayType, source: absolutePath };
        references.delete(typeString);
        // Remove "struct "/"enum " from elementType
        [elementTypeString] = elementTypeString?.split(" ").slice(-1)!;
        switch (elementNodeType) {
            case "ElementaryTypeName":
                break;
            case "UserDefinedTypeName":
                if (!(elementTypeString in definitions)) {
                    references.add(elementTypeString);
                }
                break;
            case "ArrayTypeName":
                if (!(elementTypeString in definitions)) {
                    references.add(elementTypeString);
                }
                break;
            default:
                throw Error(`Unexpected array element node type: ${elementNodeType} (${elementTypeString})`);
        }
    }

    for (const structDef of findAll("StructDefinition", ast)) {
        const { canonicalName, members, name } = structDef;
        if (search && !search.has(canonicalName)) {
            continue;
        }
        if (canonicalName in definitions) {
            throw Error(`${canonicalName} defined in both ${absolutePath} and ${definitions[canonicalName].source}`);
        }
        definitions[canonicalName] = { def: structDef, source: absolutePath };
        references.delete(canonicalName);

        for (const member of members) {
            let memberTypeString = member.typeDescriptions.typeString!;
            [memberTypeString] = memberTypeString?.split(" ").slice(-1)!;
            const memberNodeType = member.typeName?.nodeType;
            if (memberTypeString in definitions) continue;
            switch (memberNodeType) {
                case "ElementaryTypeName":
                    break;
                case "UserDefinedTypeName":
                    if (!(memberTypeString in definitions)) {
                        references.add(memberTypeString);
                    }
                    break;
                case "ArrayTypeName":
                    if (!(memberTypeString in definitions)) {
                        references.add(memberTypeString);
                    }
                    break;
                default:
                    throw Error(`Unexpected struct member node type: ${memberTypeString} (${memberTypeString})`);
            }
        }
    }

    if (references.size > 0) {
        for (const importPath of imports) {
            findDefinitions(importPath, references);
        }
    }
}

for (const contract of config.contracts) {
    findDefinitions(contract);
}

console.log(Object.keys(definitions));