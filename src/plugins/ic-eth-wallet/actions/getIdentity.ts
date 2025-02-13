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

export const getIdentity: Action = {
  name: "GET_IDENTITY",
  similes: ["GET_PRINCIPAL", "MY_IDENTITY"],
  description:
    "Get the Internet Computer Identity (the ICP principal) of the user.",
  validate: async (_runtime: IAgentRuntime) => true,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State | undefined,
    _options: { [key: string]: unknown } | undefined,
    callback?: HandlerCallback
  ): Promise<boolean> => {
    try {
      const { identity, error }: ICPWalletResponse =
        await icpWalletProvider.get(runtime, message, state);

      if (error) {
        throw new Error(error);
      }

      const responseMsg = {
        text: `The Internet Computer Identity of this agent is ${identity
          .getPrincipal()
          .toString()}`,
        action: "GET_IDENTITY",
        type: "success",
      };

      callback?.(responseMsg);
    } catch (error: unknown) {
      const responseMsg = {
        text: `Failed to get identity: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        action: "GET_IDENTITY",
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
        content: "I want to get my Internet Identity?",
      },
      {
        user: "{{user2}}",
        content: {
          text: "The Internet Computer Identity of this agent is uihu-uio-..",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: "What is my Internet Identity?",
      },
      {
        user: "{{user2}}",
        content: {
          text: "The Internet Computer Identity of this agent is uihu-uio-..",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: "What is my principal?",
      },
      {
        user: "{{user2}}",
        content: {
          text: "The Internet Computer Identity of this agent is uihu-uio-..",
        },
      },
    ],
  ] as ActionExample[][],
};
