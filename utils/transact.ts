import { Api } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { account, rpc } from "./wax";

const privateKey = process.env.KEY as string;

const signatureProvider = new JsSignatureProvider([privateKey]);

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

export const transact = async ({ action, data, body }: any) => {
  try {
    const response = await api.transact(
      body || {
        actions: [
          {
            account: "farminggames",
            name: action,
            authorization: [
              {
                actor: account,
                permission: "active",
              },
            ],
            data,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );
    // console.log(response)
    return response;
  } catch (error: any) {
    console.error(error?.details?.[0]?.message || error);
    throw new Error(error?.details?.[0]?.message);
  }
};