import type { Plugin } from "@elizaos/core";
import { icpWalletProvider } from "./providers/wallet/index.ts";
import { getBalance } from "./actions/getBalance.ts";
import { getIdentity } from "./actions/getIdentity.ts";
import { getAddress } from "./actions/getAddress.ts";
import { sendEth } from "./actions/sendEth.ts";

export const icEthWallet: Plugin = {
  name: "icEthWallet",
  description: "IC Eliza Ethereum Wallet",
  providers: [icpWalletProvider],
  actions: [getBalance, getIdentity, getAddress, sendEth],
  evaluators: [],
};

export default icEthWallet;
