# forge-deep

`forge-deep` generates pretty-printing and deep equality Solidity functions for the [Forge](https://github.com/foundry-rs/foundry) testing framework.

## Usage

### Requirements

`forge-deep` is built on [`bun`](bun.sh).

```bash
# Install bun (for macOS, Linux, and WSL)
curl -fsSL https://bun.sh/install | bash
```

Your Solidity repository needs to be using `forge` and have `forge-std` and `solady` installed (and updated if necessary):

```bash
# `forge-std` is installed on `forge init` 
forge install foundry-rs/forge-std # ^1.5.5
forge install Vectorized/solady # ^0.0.90
```

### Config

You will need a `forge-deep.toml` file in your repository's root directory. For example:

```toml
# The generated code will be written to this file
dest = 'lib/DeepTest.sol'
# Directory to look for Solidity compiler artifacts (forge uses 'out' by default)
artifacts = 'out'
# forge-deep will generate functions for all user-defined value types, enums, structs, and array types used in these contracts
contracts = ['src/Zoo.sol']
# forge-deep will generate functions for the following types, which may be defined outside of the contracts listed above
types = ['Plants.Cactus', 'Zoo.Animal']
```

For each contract listed in `contracts`, `forge-deep` will find every [user-defined value type](https://docs.soliditylang.org/en/latest/types.html#user-defined-value-types), enum, and struct defined in that contract, as well as any static or dynamic array types used anywhere in the contract generating pretty-print and deep equality functions for each one.

For more fine-grained control over which types to generate code for, you can use `types`. `forge-deep` will look for those specific user-defined value types, enums, structs, and array types in the `artifacts` directory. 

If `forge-deep` encounters an array element or struct members which is itself a user-defined value type, enum, struct, or array, it will recursively look for the definition and generate code for that type. 

### Codegen

```bash
# Compile existing contracts
forge build
# Generate `DeepTest.sol`
bunx --bun forge-deep
```

And that's it –– a contract containing the generated `prettyPrint` and `assertDeepEq` functions now exists at the `dest` specified in `forge-deep.toml`. 

### Provided Solidity functions

`forge-deep` generates an abstract contract, whose name is determined by `dest` in `forge-deep.toml`.

```solidity
abstract contract DeepTest is Test {
    using LibString for *;
    
    ...
```

For each type processed by `forge-deep`, it generates internal functions with the following signatures (`Zoo.Habitat` is a struct in the code below, other types work similarly):

```solidity
    function prettyPrint(Zoo.Habitat memory a)
        internal
        pure
        returns (string memory)

    function assertDeepEq(Zoo.Habitat memory a, Zoo.Habitat memory b)
        internal
```

To use these functions in your tests, simply have the test contract inherit `DeepTest` and call these functions. Note that `forge test` must be run with verbosity at least `-vv` to show logs. 

## Development

### Requirements

`forge-deep` is built on [`bun`](bun.sh).

```bash
# Install bun (for macOS, Linux, and WSL)
curl -fsSL https://bun.sh/install | bash
```

Install [Foundry](https://book.getfoundry.sh/getting-started/installation) if you don't already have it. 

### Test

```bash
# We'll be generating this ourselves
rm lib/DeepTest.sol
# Compile but ignore our test contract, which uses `DeepTest.sol`
forge build --skip test
# Generate `DeepTest.sol`
bun run --bun generate
# Run test
forge test -vv
```
