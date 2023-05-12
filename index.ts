#!/usr/bin/env node

import { findAll } from "solidity-ast/utils";
import { SourceUnit } from "solidity-ast";
import TOML from "toml";
import fs from "fs";
import path from "path";

import {
    renderArrayFunctions,
    renderDeepTestContract,
    renderEnumFunctions,
    renderStructFunctions,
    renderUserTypeFunctions,
} from "./templates";

type ForgeDeepConfig = { dest: string; artifacts: string; contracts: string[]; types: string[] };

const config: ForgeDeepConfig = TOML.parse(fs.readFileSync("forge-deep.toml").toString());

const artifacts: { [absolutePath: string]: string } = {};

function findArtifacts(basePath: string, files: string[]) {
    for (const f of files) {
        var newBasePath = path.join(basePath, f);
        if (fs.statSync(newBasePath).isDirectory()) {
            findArtifacts(newBasePath, fs.readdirSync(newBasePath));
        } else {
            if (f.substring(f.length - 5) === ".json") {
                const artifact = JSON.parse(fs.readFileSync(newBasePath).toString());
                if ("ast" in artifact) {
                    artifacts[artifact.ast.absolutePath] = newBasePath;
                }
            }
        }
    }
}

findArtifacts(config.artifacts, fs.readdirSync(config.artifacts));

const results: {
    [name: string]: { fns: string; source: string };
} = {};

function findDefinitions(absolutePath: string, search?: Set<string>): boolean {
    let found = false;
    const references: Set<string> = new Set();

    if (!(absolutePath in artifacts)) {
        throw Error(`Compiler artifact for ${absolutePath} not found in ${config.artifacts}`);
    }
    const artifactPath = artifacts[absolutePath];
    const artifact = JSON.parse(fs.readFileSync(artifactPath).toString());
    const ast = artifact.ast as SourceUnit;

    for (const enumDef of findAll("EnumDefinition", ast)) {
        const { canonicalName } = enumDef;
        if (search) {
            if (search.delete(canonicalName)) {
                found = true;
            } else continue;
        }
        if (canonicalName in results) {
            throw Error(
                `${canonicalName} defined in both ${absolutePath} and ${results[canonicalName].source}`
            );
        }
        results[canonicalName] = { fns: renderEnumFunctions(enumDef), source: absolutePath };
        references.delete(canonicalName);
    }

    for (const userTypeDef of findAll("UserDefinedValueTypeDefinition", ast)) {
        const canonicalName = userTypeDef.canonicalName || userTypeDef.name;
        if (search) {
            if (search.delete(canonicalName)) {
                found = true;
            } else continue;
        }
        if (canonicalName in results) {
            throw Error(
                `${canonicalName} defined in both ${absolutePath} and ${results[canonicalName].source}`
            );
        }
        results[canonicalName] = {
            fns: renderUserTypeFunctions(userTypeDef),
            source: absolutePath,
        };
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
        if (search) {
            if (search.delete(typeString)) {
                found = true;
            } else continue;
        }
        if (typeString in results) continue;
        results[typeString] = { fns: renderArrayFunctions(arrayType), source: absolutePath };
        references.delete(typeString);
        // Remove "struct "/"enum " from elementType
        [elementTypeString] = elementTypeString?.split(" ").slice(-1)!;
        switch (elementNodeType) {
            case "ElementaryTypeName":
                break;
            case "UserDefinedTypeName":
                if (!(elementTypeString in results)) {
                    references.add(elementTypeString);
                }
                break;
            case "ArrayTypeName":
                if (!(elementTypeString in results)) {
                    references.add(elementTypeString);
                }
                break;
            default:
                throw Error(
                    `Unexpected array element node type: ${elementNodeType} (${elementTypeString})`
                );
        }
    }

    for (const structDef of findAll("StructDefinition", ast)) {
        const { canonicalName, members } = structDef;
        if (search) {
            if (search.delete(canonicalName)) {
                found = true;
            } else continue;
        }
        if (canonicalName in results) {
            throw Error(
                `${canonicalName} defined in both ${absolutePath} and ${results[canonicalName].source}`
            );
        }
        results[canonicalName] = { fns: renderStructFunctions(structDef), source: absolutePath };
        references.delete(canonicalName);

        for (const member of members) {
            let memberTypeString = member.typeDescriptions.typeString!;
            [memberTypeString] = memberTypeString?.split(" ").slice(-1)!;
            const memberNodeType = member.typeName?.nodeType;
            if (memberTypeString in results) continue;
            switch (memberNodeType) {
                case "ElementaryTypeName":
                    break;
                case "UserDefinedTypeName":
                    if (!(memberTypeString in results)) {
                        references.add(memberTypeString);
                    }
                    break;
                case "ArrayTypeName":
                    if (!(memberTypeString in results)) {
                        references.add(memberTypeString);
                    }
                    break;
                default:
                    throw Error(
                        `Unexpected struct member node type: ${memberTypeString} (${memberTypeString})`
                    );
            }
        }
    }

    if (references.size > 0) {
        const imports = Object.keys(artifact.metadata.sources);
        for (const importPath of imports) {
            findDefinitions(importPath, references);
            if (references.size === 0) break;
        }
    }
    if (references.size > 0) {
        throw Error(`Definitions for referenced types ${references.keys()} not found`);
    }

    return found;
}

for (const contract of config.contracts) {
    findDefinitions(contract);
}

const filesToImport = new Set(config.contracts);
const typesToSearchFor = new Set(config.types.filter((t) => !(t in results)));
if (typesToSearchFor.size > 0) {
    for (const absolutePath of Object.keys(artifacts)) {
        if (findDefinitions(absolutePath, typesToSearchFor)) filesToImport.add(absolutePath);
        if (typesToSearchFor.size === 0) break;
    }
}

if (typesToSearchFor.size > 0) {
    throw Error(`Types ${Array.from(typesToSearchFor.keys()).join(", ")} not found`);
}

const deepTestContract = renderDeepTestContract(
    path.basename(config.dest).slice(0, -4),
    Array.from(filesToImport),
    Object.values(results)
        .map(({ fns }) => fns)
        .join("\n")
);

fs.writeFileSync(config.dest, deepTestContract);
