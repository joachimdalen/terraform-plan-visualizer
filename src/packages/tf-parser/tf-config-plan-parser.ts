import { getDataId, getModuleId, getResourceId } from "../ids";
import type {
  ConfigResource,
  Expression,
  ModuleCall,
  Plan,
  TfVizConfigPlan,
  TfVizConfigResource,
  TfVizModuleCall,
} from "./types";

function parseProviders(planFile: Plan): { name: string; value: string }[] {
  if (!planFile.configuration?.provider_config) return [];
  const keys = Object.keys(planFile.configuration.provider_config);
  return keys.map((k) => {
    const p = planFile.configuration!.provider_config![k];
    const fullName = p.full_name || k;
    const domainIndex = fullName.indexOf("/");
    return {
      name: k,
      value:
        domainIndex !== -1 ? fullName.substring(domainIndex + 1) : fullName,
    };
  });
}

function parseTfConfigPlan(planFile: Plan): TfVizConfigPlan {
  const resources: TfVizConfigResource[] = [];
  const modules: TfVizModuleCall[] = [];
  const providers = parseProviders(planFile);
  for (const res of planFile.configuration?.root_module?.resources || []) {
    resources.push(parseTfResource(res, providers));
  }
  if (planFile.configuration?.root_module?.module_calls != undefined) {
    for (const moduleName of Object.keys(
      planFile.configuration?.root_module?.module_calls
    )) {
      const module =
        planFile.configuration.root_module.module_calls[moduleName];

      modules.push(parseTfModule(moduleName, module, providers));
    }
  }

  return {
    resources,
    modules,
  };
}

function parseTfResource(
  resource: ConfigResource,
  providers: { name: string; value: string }[]
) {
  const address = getValueOrThow(resource.address);
  const mode = getValueOrThow(resource.mode);
  const provider = providers.find(
    (x) => x.name === getValueOrThow(resource.provider_config_key)
  );

  const res: TfVizConfigResource = {
    id: mode === "data" ? getDataId() : getResourceId(),
    address: address,
    mode: mode as "managed" | "data",
    name: getValueOrThow(resource.name),
    type: getValueOrThow(resource.type),
    provider: provider?.value || "unknown",
    isLooped: resource.for_each_expression !== undefined,
    dependsOn: getDependencies(resource.expressions),
  };

  return res;
}

function onlyUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

function getDependencies(expressions?: Record<string, Expression>): string[] {
  if (expressions === undefined) return [];
  const dependencies = [];
  const expKeys = Object.keys(expressions);
  for (const expKey of expKeys) {
    const exp = expressions[expKey];
    if (exp.references === undefined) {
      if (Array.isArray(exp)) {
        dependencies.push(...exp.flatMap(getDependencies));
      }

      console.log("exp.ref is not set for", exp);
      continue;
    }

    for (const ref of exp.references) {
      if (
        ref.startsWith("local.") ||
        ref.startsWith("each.") ||
        ref.startsWith("var.") ||
        ref.startsWith("path.")
      )
        continue;

      const segments = ref.split(".");

      if (segments.length == 2) {
        dependencies.push(ref);
      }
      if (segments.length === 3 && ref.startsWith("data.")) {
        console.log("Pushing data reference", ref);
        dependencies.push(ref);
      }
    }
  }

  return dependencies.filter(onlyUnique);
}

function parseTfModule(
  name: string,
  module: ModuleCall,
  providers: { name: string; value: string }[]
) {
  const mod: TfVizModuleCall = {
    id: getModuleId(),
    name,
    dependsOn: getDependencies(module.expressions),
    isLooped: module.for_each_expression !== undefined,
    resources:
      module.module?.resources?.map((r) => parseTfResource(r, providers)) ?? [],
  };

  return mod;
}

function getValueOrThow(value: string | undefined): string {
  if (value === undefined) throw new Error("undefined value");
  return value;
}

export { parseTfConfigPlan, parseTfResource };
