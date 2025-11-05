import type { Plan, StateModule, StateResource } from "./types";

export type TfVizResource = {
  address: string;
  baseAddress: string;
  name: string;
  type: string;
  index?: string;
  provider: string;
  registry: string;
};

export type TfVisModuleNoResources = {
  name: string;
  address: string;
  baseAddress: string;
  index?: string;
};
export type TfVizModule = {
  resources: TfVizResource[];
} & TfVisModuleNoResources;
export type TfVizPlan = {
  resources: TfVizResource[];
  modules: TfVizModule[];
};

function parseTfPlan(planFile: Plan): TfVizPlan {
  const resources: TfVizResource[] = [];
  const modules: TfVizModule[] = [];
  for (const res of planFile.planned_values?.root_module?.resources || []) {
    resources.push(parseTfResource(res));
  }
  for (const res of planFile.planned_values?.root_module?.child_modules || []) {
    modules.push(parseTfModule(res));
  }
  return {
    resources,
    modules,
  };
}

function parseTfResource(resource: StateResource) {
  const providerName = getValueOrThow(resource.provider_name);
  const provider = providerName.replace("registry.terraform.io/", "");
  const registry = providerName.split("/")[0];

  const address = getValueOrThow(resource.address);

  const res: TfVizResource = {
    address: address,
    baseAddress: stripIndexFromAddress(address),
    name: getValueOrThow(resource.name),
    type: getValueOrThow(resource.type),
    index: resource.index as string | undefined,
    provider,
    registry,
  };

  return res;
}

function parseTfModule(module: StateModule) {
  const address = getValueOrThow(module.address);
  const mod: TfVizModule = {
    name: address.split(".")[1],
    address: address,
    baseAddress: stripIndexFromAddress(address),
    index: getIndexFromAddress(address),
    resources: module.resources?.map(parseTfResource) ?? [],
  };
  console.log(address, getIndexFromAddress(address));
  return mod;
}

function getValueOrThow(value: string | undefined): string {
  if (value === undefined) throw new Error("undefined value");

  return value;
}
function stripIndexFromAddress(address: string): string {
  return address.replace(/\[".+"\]/, "");
}
function getIndexFromAddress(address: string): string | undefined {
  const regex = /\["(?<index>.+)"\]/;
  const res = regex.exec(address);
  if (res?.groups?.index) {
    return res.groups.index;
  }
  return undefined;
}

export { parseTfPlan, parseTfResource };
