import {
  Action,
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
} from "@elizaos/core";
import {
  icpWalletProvider,
  ICPWalletResponse,
} from "../providers/wallet/index.ts";
import type { _SERVICE } from "../canisters/ic-eliza-eth-wallet/index.did.d.ts";
import { formatUnits } from "viem";
import { getActor } from "../utils.ts";

export const getBalance: Action = {
  name: "GET_BALANCE",
  similes: [],
  description:
    "Get the balance of your Ethereum (ETH) wallet, managed by the ICP wallet canister.",
  validate: async (_runtime: IAgentRuntime) => true,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: { [key: string]: unknown } | undefined,
    callback?: HandlerCallback
  ): Promise<boolean> => {
    try {
      const { wallet, error }: ICPWalletResponse = await icpWalletProvider.get(
        runtime,
        message,
        state
      );

      if (error) {
        throw new Error(error);
      }

      const actor = await getActor(runtime, wallet);
      const result = await actor.get_balance([true]);

      if ("Err" in result) {
        throw new Error(result.Err);
      }

      const formattedAmount = `${formatUnits(
        BigInt(result.Ok),
        18
      )} SepoliaETH`;

      const responseMsg = {
        text: `Your Ethereum balance is ${formattedAmount} SepoliaETH`,
        action: "GET_BALANCE",
        type: "success",
      };

      callback?.(responseMsg);
    } catch (error: unknown) {
      const responseMsg = {
        text: `Failed to get balance: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        action: "GET_BALANCE",
        type: "error",
      };
      callback?.(responseMsg);
    }

    return true;
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: "I want to get my Ethereum balance",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Getting Ethereum balance...",
          action: "GET_BALANCE",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Your Ethereum balance is 0.5",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: "How much ETH do I have?",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Getting Ethereum balance...",
          action: "GET_BALANCE",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Your Ethereum balance is 0.5",
        },
      },
    ],
  ] as ActionExample[][],
};
