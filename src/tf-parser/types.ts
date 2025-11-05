export type Plan = {
  format_version?: string;
  terraform_version?: string;
  variables?: Record<string, PlanVariable>;
  planned_values?: StateValues;
  resource_drift?: ResourceChange[];
  resource_changes?: ResourceChange[];
  deferred_changes?: DeferredResourceChange[];
  complete?: boolean;
  output_changes?: Record<string, Change>;
  prior_state?: State;
  configuration?: Config;
  relevant_attributes?: ResourceAttribute[];
  checks: CheckResultStatic[];
  timestamp?: string;
  action_invocations?: ActionInvocation[];
};

export type PlanVariable = {
  value?: Record<string, object>;
};
export type StateValues = {
  outputs?: Record<string, StateOutput>;
  root_module?: StateModule;
};
export type ResourceChange = {
  address?: string;
  previous_address?: string;
  module_address?: string;
  mode?: "data" | "managed";
  type?: string;
  name?: string;
  index?: string;
  provider_name?: string;
  deposed?: string;
  change?: Change;
};
export type DeferredResourceChange = {
  reason?: string;
  resource_change?: ResourceChange;
};
export type Change = {
  actions?: Actions;
  before: Record<string, object>;
  after?: Record<string, object>;
  after_unknown?: Record<string, object>;
  before_sensitive?: Record<string, object>;
  after_sensitive?: Record<string, object>;
  importing?: Importing;
  generated_config?: string;
  replace_paths: Record<string, object>[];
  before_identity: Record<string, object>;
  after_identity: Record<string, object>;
};
export type State = {};
export type Config = {};
export type ResourceAttribute = {
  resource: string;
  attribute: string;
};
export type CheckResultStatic = {};
export type ActionInvocation = {
  address?: string;
  type?: string;
  name?: string;
  config_values?: Record<string, object>;
  config_sensitive?: Record<string, object>;
  config_unknown?: Record<string, object>;
  provider_name?: string;
  lifecycle_action_trigger?: LifecycleActionTrigger;
  invoke_action_trigger?: InvokeActionTrigger;
};
export type Actions = {};
export type Importing = {
  id?: string;
  unknown?: boolean;
  identity: Record<string, object>;
};

export type LifecycleActionTrigger = {
  triggering_resource_address: string;
  action_trigger_event?: string;
  action_trigger_block_index: number;
  action_list_index: number;
};
export type InvokeActionTrigger = {};

export type StateOutput = {
  sensitive: boolean;
  value?: Record<string, object>;
  type?: string;
};
export type StateModule = {
  resources?: StateResource[];
  address?: string;
  child_modules?: StateModule[];
};
export type StateResource = {
  address?: string;
  mode?: string;
  type?: string;
  name?: string;
  index?: number | string;
  provider_name?: string;
  values?: Record<string, object>;
  sensitive_values?: string;
  depends_on?: string[];
  tainted?: boolean;
  deposed_key?: string;
};
