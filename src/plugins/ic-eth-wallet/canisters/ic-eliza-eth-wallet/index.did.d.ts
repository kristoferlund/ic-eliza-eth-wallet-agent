import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AgentRules {
  transactions_per_day: number;
  max_transaction_amount: Wei;
}
export type GetAgentResult = { Ok: [] | [string] } | { Err: string };
export type GetAgentRulesResult = { Ok: [] | [AgentRules] } | { Err: string };
export type Result = { Ok: string } | { Err: string };
export type SetAgentRulesResult = { Ok: AgentRules } | { Err: string };
export type Wei = bigint;
export interface _SERVICE {
  get_address: ActorMethod<[[] | [boolean]], Result>;
  get_agent: ActorMethod<[], GetAgentResult>;
  get_agent_rules: ActorMethod<[], GetAgentRulesResult>;
  get_balance: ActorMethod<[[] | [boolean]], Result>;
  send_eth: ActorMethod<[string, Wei, [] | [boolean]], Result>;
  set_agent: ActorMethod<[string], Result>;
  set_agent_rules: ActorMethod<[AgentRules], SetAgentRulesResult>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
