import { getFullnodeUrl, IotaClient } from "@iota/iota-sdk/client";
import { Transaction } from "@iota/iota-sdk/transactions";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { JWK, JWKObject } from "ts-jose";
import { Converter } from "@iota/util.js";

export const buildDoc = (publicKeyJwk: string) => {
  const publicKeyAsJson = JSON.parse(publicKeyJwk);

  const kid = publicKeyAsJson.kid;
  delete publicKeyAsJson.kid;

  const didDocument = {
    doc: {
      id: "did:0:0",
      verificationMethod: [
        {
          controller: "did:0:0",
          id: "did:0:0#",
          type: "JsonWebKey2020",
          publicKeyJwk: {},
        },
      ],
      assertionMethod: ["did:0:0#"],
      authentication: ["did:0:0#"],
    },
    meta: {},
  };

  const doc = didDocument.doc;

  doc.verificationMethod[0].id += kid;
  doc.verificationMethod[0].publicKeyJwk = publicKeyAsJson;
  doc.assertionMethod[0] += kid;
  doc.authentication[0] += kid;

  return didDocument;
};

export const encodeIdentity = (publicKeyJwk: string) => {
  const doc = buildDoc(publicKeyJwk);

  const str = JSON.stringify(doc, null, 0);
  const buffer = new TextEncoder();
  const data = buffer.encode(str);

  const magicString = new TextEncoder().encode("DID");
  const didVersion = new Uint8Array(1);
  didVersion[0] = 1;

  const didEncoding = new Uint8Array(1);
  didEncoding[0] = 0;

  const headerLen = magicString.length + 2;
  const headerBytes = new Uint8Array(headerLen);
  headerBytes.set(magicString);
  // @ts-ignore
  headerBytes[magicString.length] = didVersion;
  // @ts-ignore
  headerBytes[magicString.length + 1] = didEncoding;

  // 2 additional bytes for the length
  const stateMetadata = new Uint8Array(headerLen + 2 + data.length);
  // Header
  stateMetadata.set(headerBytes);
  // data
  stateMetadata.set(data, 7);

  const lenBuffer = new ArrayBuffer(2);
  const dataView = new DataView(lenBuffer);
  // The length of the data encoded as little endian
  dataView.setUint16(0, data.length, true);
  const lenBytes = new Uint8Array(lenBuffer);
  stateMetadata.set(lenBytes, 5);

  return stateMetadata.toString();
};

export const createJWK = async () => {
  const { subtle } = window.crypto;

  const theKey = await subtle.generateKey("Ed25519", true, ["sign", "verify"]);
  const privateKey = theKey.privateKey;
  const publicKey = theKey.publicKey;

  const pubKey = await subtle.exportKey("jwk", publicKey) as any;
  pubKey.alg = "EdDSA"
  const pubKeyAsJose = await JWK.fromObject(pubKey);
  const kid = await pubKeyAsJose.getThumbprint();

  // This DID Document can also be created with the help of the IOTA Identity Library
  const did = {
    id: "did:0:0",
    verificationMethod: [
      {
        id: `did:0:0#${kid}`,
        type: "JsonWebKey2020",
        controller: "did:0:0",
        publicKeyJwk: {},
      },
    ],
  };

  const pubKeyObj = pubKeyAsJose.toObject(false);
  pubKeyObj.use = "sig";
  pubKeyObj.alg = "EdDSA";
  pubKeyObj.kid = await pubKeyAsJose.getThumbprint();

  did.verificationMethod[0].publicKeyJwk = pubKeyObj;
  // delete did.verificationMethod[0].publicKeyJwk["key_ops"];

  const privateKeyAsJsonWebKey = await subtle.exportKey("jwk", privateKey) as any;
  privateKeyAsJsonWebKey.alg = "EdDSA"
  const privateKeyAsJose = await JWK.fromObject(privateKeyAsJsonWebKey);
  const kidPrivate = await privateKeyAsJose.getThumbprint();

  const privateKeyObj = privateKeyAsJose.toObject(true) as any;
  privateKeyObj.kid = kidPrivate;
  privateKeyObj.alg = "EdDSA";
  privateKeyObj.use = "sig";

  const privateKeyRaw = Buffer.from(privateKeyObj.d, "base64");
  const publicKeyRaw = Buffer.from(pubKey.x, "base64");

  return {
    publicKeyJwk: pubKeyObj,
    privateKeyJwk: privateKeyObj,
    privateKeyVerificationMethodRaw: Converter.bytesToHex(privateKeyRaw),
    publicKeyVerificationMethodRaw: Converter.bytesToHex(publicKeyRaw),
  };
};

export const faucetGas = async (address: string) => {
  const faucetResponse = await fetch("https://faucet.testnet.iota.cafe/gas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FixedAmountRequest: {
        recipient: address,
      },
    }),
  }).then((res) => res.json());

  return faucetResponse;
};

export const callSmartContract = async (publicKeyJwk: JWKObject) => {
  const client = new IotaClient({
    url: getFullnodeUrl("testnet"),
  });

  const tx = new Transaction();

  const keypair = new Ed25519Keypair();
  const senderAddress = keypair.toIotaAddress();

  const faucetResponse = await faucetGas(senderAddress);

  tx.setGasBudget(100000000);
  tx.setGasOwner(senderAddress);

  const encodedIdentity = encodeIdentity(JSON.stringify(publicKeyJwk));

  const vec = tx.makeMoveVec({
    type: "u8",
    elements: encodedIdentity.split(",").map((arg) => tx.pure.u8(Number(arg))),
  });

  const txArguments = [
    vec,
    tx.sharedObjectRef({
      objectId: "0x6",
      mutable: false,
      initialSharedVersion: 1,
    }),
  ];

  tx.moveCall({
    arguments: txArguments,
    target:
      "0x7a67dd504eb1291958495c71a07d20985951648dd5ebf01ac921a50257346818::identity::new",
  });

  const txResponse = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showEffects: true,
    },
  });

  return {
    txResponse,
    faucetResponse,
  };
};

interface IOutput {
  JWK: {
    publicKeyJwk: JWKObject;
    privateKeyJwk: JWKObject;
    privateKeyVerificationMethodRaw: string;
    publicKeyVerificationMethodRaw: string;
  };
  GasFaucet: {
    transferredGasObjects: [
      {
        amount: number;
        id: string;
        transferTxDigest: string;
      }
    ];
    error: null;
  };
  SmartContractCallResponse: any;
  Links: {
    IotaExplorerObject: string;
    IotaExplorerTxBlock: string;
    ResolveIdentity: string;
  };
  CreateIdentityPayload: {
    emailAddress: string;
    password: string;
    role: string;
    identity: string;
    verMethodKeyPair: {
      privateKey: string;
      publicKey: string;
    };
  };
} 

export const generateKey = async () => {
  // @ts-ignore
  const output: IOutput = {};
  const jwk = await createJWK();

  const { txResponse, faucetResponse } = await callSmartContract(
    jwk.publicKeyJwk
  );

  output["JWK"] = jwk;
  output["GasFaucet"] = faucetResponse;
  output["SmartContractCallResponse"] = txResponse;

  const ownerShared = txResponse.effects?.created?.find(
    (x) => (x.owner as any).Shared
  );
  const identity = ownerShared?.reference.objectId;

  output["Links"] = {
    IotaExplorerObject: `https://explorer.rebased.iota.org/object/${identity}`,
    IotaExplorerTxBlock: `https://explorer.rebased.iota.org/txblock/${txResponse.digest}`,
    ResolveIdentity: `https://uni-resolver.tlip.io/1.0/identifiers/did:iota:testnet:${identity}`,
  };

  output["CreateIdentityPayload"] = {
    emailAddress: "example@email.com",
    password: "Password@1234",
    role: "organization",
    identity: `did:iota:testnet:${identity}`,
    verMethodKeyPair: {
      privateKey: jwk.privateKeyVerificationMethodRaw,
      publicKey: jwk.publicKeyVerificationMethodRaw,
    },
  };

  return output;
};
