import {
  Action,
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  ModelClass,
  State,
  composeContext,
  generateObjectDeprecated,
} from "@elizaos/core";
import {
  ICPWalletResponse,
  icpWalletProvider,
} from "../providers/wallet/index.ts";

import type { _SERVICE } from "../canisters/ic-eliza-eth-wallet/index.did.d.ts";
import { formatUnits } from "viem";
import { getActor } from "../utils.ts";

export const sendEthTemplate = `Given the recent messages and Ethereum wallet information below:
{{recentMessages}}
{{walletInfo}}
Extract the following information about the requested ETH transfer:

1. **Amount**:
   - Extract only the numeric value from the instruction.
   - If the amount is specified in ETH (e.g., "1 ETH"), convert it to WEI (1 ETH = 10^18 WEI).
   - If the amount is specified in WEI (e.g., "1000000000000000000 WEI"), keep it as is.
   - The final output should be a string representing the amount in WEI.

2. **Recipient Address**:
   - Must be a fully qualified Ethereum address starting with "0x".
   - Example: "0x1234567890abcdef1234567890abcdef12345678".

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "toAddress": string, // The recipient's Ethereum address.
    "amount": string // The amount to transfer in WEI.
}
\`\`\`

Example response for the input: "Send 1 ETH to 0x1234567890abcdef1234567890abcdef12345678", the response should be:

\`\`\`json
{
    "toAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "amount": "1000000000000000000"
}
\`\`\`

Example response for the input: "Send 500000000000000000 WEI to 0xabcdefabcdefabcdefabcdefabcdefabcdef", the response should be:

\`\`\`json
{
    "toAddress": "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    "amount": "500000000000000000"
}
\`\`\`

Now respond with a JSON markdown block containing only the extracted values.
`;

export const sendEth: Action = {
  name: "SEND_ETH",
  similes: ["TRANSFER", "TRANSFER_ETH"],
  description: "Send ETH from the agent managed wallet to another ETH address.",
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

      const sendEthContext = composeContext({
        state: state,
        template: sendEthTemplate,
        templatingEngine: "handlebars",
      });

      const sendEthParams = await generateObjectDeprecated({
        runtime: runtime,
        context: sendEthContext,
        modelClass: ModelClass.SMALL,
      });

      if (!("toAddress" in sendEthParams) || !("amount" in sendEthParams)) {
        throw new Error("Invalid parameters for sending ETH.");
      }

      const actor = await getActor(runtime, wallet);
      const result = await actor.send_eth(
        sendEthParams.toAddress,
        BigInt(sendEthParams.amount),
        [true]
      );

      if ("Err" in result) {
        throw new Error(result.Err);
      }

      const formattedAmount = formatUnits(BigInt(sendEthParams.amount), 18);

      const responseMsg = {
        text: `Successfully sent ${formattedAmount} SepoliaETH to ${sendEthParams.toAddress}`,
        action: "GET_BALANCE",
        type: "success",
      };

      callback?.(responseMsg);
    } catch (error: unknown) {
      const responseMsg = {
        text: `Failed to send eth: ${
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
        content: "Send 0.1 ETH to 0x1234567890abcdef",
      },
      {
        user: "{{user2}}",
        content: {
          text: "Sending 0.1 ETH to 0x1234567890abcdef...",
          action: "SEND_ETH",
        },
      },
    ],
  ] as ActionExample[][],
};
