import { IAgentRuntime } from "@elizaos/core";
import { _SERVICE } from "./canisters/ic-eliza-eth-wallet/index.did";
import { idlFactory } from "./canisters/ic-eliza-eth-wallet/index.did.js";
import { WalletProvider } from "./providers/wallet";

export async function getActor(runtime: IAgentRuntime, wallet: WalletProvider) {
  const icWalletCanister = runtime.getSetting("IC_ETH_WALLET_CANISTER");

  const actor: _SERVICE = await wallet.createActor(
    idlFactory,
    icWalletCanister
  );

  return actor;
}
