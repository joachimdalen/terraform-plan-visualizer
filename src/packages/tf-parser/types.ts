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
