export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  const GetAgentResult = IDL.Variant({
    Ok: IDL.Opt(IDL.Text),
    Err: IDL.Text,
  });
  const Wei = IDL.Nat;
  const AgentRules = IDL.Record({
    transactions_per_day: IDL.Nat32,
    max_transaction_amount: Wei,
  });
  const GetAgentRulesResult = IDL.Variant({
    Ok: IDL.Opt(AgentRules),
    Err: IDL.Text,
  });
  const SetAgentRulesResult = IDL.Variant({
    Ok: AgentRules,
    Err: IDL.Text,
  });
  return IDL.Service({
    get_address: IDL.Func([IDL.Opt(IDL.Bool)], [Result], []),
    get_agent: IDL.Func([], [GetAgentResult], ["query"]),
    get_agent_rules: IDL.Func([], [GetAgentRulesResult], ["query"]),
    get_balance: IDL.Func([IDL.Opt(IDL.Bool)], [Result], []),
    send_eth: IDL.Func([IDL.Text, Wei, IDL.Opt(IDL.Bool)], [Result], []),
    set_agent: IDL.Func([IDL.Text], [Result], []),
    set_agent_rules: IDL.Func([AgentRules], [SetAgentRulesResult], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
