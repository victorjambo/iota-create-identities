# Create IOTA identities

This tool combines multiple other tools and helps to create identities.

## Running the scripts

Install packages:

```bash
npm install
```

Execute script run:

```bash
npm run dev
```

Alternative:

```bash
node index.mjs
```

### Outputs and Identities

Outputs of the created identities will be logged in the terminal and stored in the outputs folder.
In the `output-*.json` file, copy value of `CreateIdentityPayload` and paste on Postman. This payload is used to create identities.

NOTE: Remember to change `emailAddress` in the payload.

## Smart Contract

- Address: `0x7a67dd504eb1291958495c71a07d20985951648dd5ebf01ac921a50257346818`
- Component: `identity`
- Function: `new`

#### Links

1. https://iotaledger.github.io/ebsi-stardust-components/public/encode_identity.html
2. https://docs.iota.org/references/cli
3. https://github.com/iotaledger/tangle.js/tree/rebased/key-generation
