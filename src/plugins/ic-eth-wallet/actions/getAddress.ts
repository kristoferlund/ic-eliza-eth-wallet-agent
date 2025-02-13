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
import { getActor } from "../utils.ts";

export const getAddress: Action = {
  name: "GET_ADDRESS",
  similes: [],
  description:
    "Get the address of your Ethereum (ETH) wallet, managed by the ICP wallet canister.",
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
      const result = await actor.get_address([true]);

      if ("Err" in result) {
        throw new Error(result.Err);
      }

      const responseMsg = {
        text: `Your Ethereum address is ${JSON.stringify(result.Ok)}`,
        action: "GET_ADDRESS",
        type: "success",
      };

      callback?.(responseMsg);
    } catch (error: unknown) {
      const responseMsg = {
        text: `Failed to get address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        action: "GET_ADDRESS",
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
        content: "I want to get my Ethereum address",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Getting Ethereum address...",
          action: "GET_ADDRESS",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Your Ethereum balance is 0xa3b4b11...",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: "What is my ETH address?",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Getting Ethereum address...",
          action: "GET_ADDRESS",
        },
      },
      {
        user: "{{user2}}",
        content: {
          text: "Your Ethereum balance is 0xa3b4b11...",
        },
      },
    ],
  ] as ActionExample[][],
};
