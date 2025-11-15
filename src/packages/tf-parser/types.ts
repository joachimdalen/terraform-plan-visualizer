export type TfVizConfigResource = {
  id: string;
  address: string;
  mode: "managed" | "data";
  name: string;
  type: string;
  module?: string;
  provider: string;
  isLooped: boolean;
  dependsOn: string[];
};

export type TfVizModuleCallNoResources = {
  id: string;
  name: string;
  isLooped: boolean;
  dependsOn: string[];
};
export type TfVizModuleCall = {
  resources: TfVizConfigResource[];
} & TfVizModuleCallNoResources;

export type TfVizConfigPlan = {
  resources: TfVizConfigResource[];
  modules: TfVizModuleCall[];
};
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
  //actions?: Actions;
  actions?: string[];
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
export type State = {
  // TODO: Update with actual types
  [key: string]: string;
};
export type Config = {
  provider_config?: Record<string, ProviderConfig>;
  root_module?: ConfigModule;
};
export type ProviderConfig = {
  name?: string;
  full_name?: string;
  alias?: string;
  module_address?: string;
  expressions?: Record<string, Expression>;
  version_constraint?: string;
};
export type ConfigModule = {
  outputs?: Record<string, ConfigOutput>;
  resources?: ConfigResource[];
  module_calls?: Record<string, ModuleCall>;
  variables?: Record<string, ConfigVariable>;
};
export type ConfigOutput = {
  sensitive?: boolean;
  expression?: Expression;
  description?: string;
  depends_on?: string[];
};
export type ConfigResource = {
  address?: string;
  mode?: "managed" | "data";
  type?: string;
  name?: string;
  provider_config_key?: string;
  provisioners?: ConfigProvisioner[];
  expressions?: Record<string, Expression>;
  schame_version?: number;
  count_expression?: Expression;
  for_each_expression?: Expression;
  depends_on?: string[];
};
export type ModuleCall = {
  source?: string;
  expressions?: Record<string, Expression>;
  count_expression?: Expression;
  for_each_expression?: Expression;
  module?: ConfigModule;
  version_constraint?: string;
  depends_on?: string[];
};
export type ConfigVariable = {
  type?: string;
  expression?: Record<string, Expression>;
};
export type Expression = {
  constant_value?: Record<string, object>;
  references?: string[];
};
export type ConfigProvisioner = {
  type?: string;
  expressions?: Record<string, Expression>;
};

export type ResourceAttribute = {
  resource: string;
  attribute: string;
};
export type CheckResultStatic = {
  // TODO: Update with actual types
  [key: string]: string;
};
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
export type Actions = {
  // TODO: Update with actual types
  [key: string]: string;
};
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
export type InvokeActionTrigger = {
  // TODO: Update with actual types
  [key: string]: string;
};

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

export type ChangeType = {
  isNoChange: boolean;
  isCreate: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isDeleteCreate: boolean;
  isCreateDelete: boolean;
};
