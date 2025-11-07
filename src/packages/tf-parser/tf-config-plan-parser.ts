import type {
  ConfigResource,
  Expression,
  ModuleCall,
  Plan,
} from "../../tf-parser/types";
import { getDataId, getModuleId, getResourceId } from "../ids";
import type {
  TfVizConfigPlan,
  TfVizConfigResource,
  TfVizModuleCall,
} from "./types";

function parseTfConfigPlan(planFile: Plan): TfVizConfigPlan {
  const resources: TfVizConfigResource[] = [];
  const modules: TfVizModuleCall[] = [];
  for (const res of planFile.configuration?.root_module?.resources || []) {
    resources.push(parseTfResource(res));
  }
  if (planFile.configuration?.root_module?.module_calls != undefined) {
    for (const moduleName of Object.keys(
      planFile.configuration?.root_module?.module_calls
    )) {
      const module =
        planFile.configuration.root_module.module_calls[moduleName];

      modules.push(parseTfModule(moduleName, module));
    }
  }

  return {
    resources,
    modules,
  };
}

function parseTfResource(resource: ConfigResource) {
  const address = getValueOrThow(resource.address);
  const mode = getValueOrThow(resource.mode);

  const res: TfVizConfigResource = {
    id: mode === "data" ? getDataId() : getResourceId(),
    address: address,
    mode: mode as "managed" | "data",
    name: getValueOrThow(resource.name),
    type: getValueOrThow(resource.type),
    provider: getValueOrThow(resource.provider_config_key),
    isLooped: resource.for_each_expression !== undefined,
    dependsOn: getDependencies(resource.expressions),
  };

  return res;
}

function onlyUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

function getNestedKeys(expressions?: Record<string, Expression>) {}

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
        ref.startsWith("var.")
      )
        continue;

      const segments = ref.split(".");

      if (segments.length == 2) {
        dependencies.push(ref);
      }
      if (segments.length === 3 && ref.startsWith("data.")) {
        dependencies.push(ref);
      }
    }
  }

  return dependencies.filter(onlyUnique);
}

function getDependenciesRec(
  expressions?: Record<string, Expression>,
  deps: string[] = []
) {
  if (expressions === undefined) return [];
  const dependencies = deps;
  const expKeys = Object.keys(expressions);
  for (const expKey of expKeys) {
    const exp = expressions[expKey];
    console.log("exp_key", exp);
    if (!Array.isArray(exp)) {
      if (exp.references === undefined) continue;

      for (const ref of exp.references) {
        console.log("ref", ref);
        if (
          ref.startsWith("local.") ||
          ref.startsWith("each.") ||
          ref.startsWith("var.")
        )
          continue;

        const segments = ref.split(".");

        if (segments.length == 2) {
          dependencies.push(ref);
        }
        if (segments.length === 3 && ref.startsWith("data.")) {
          dependencies.push(ref);
        }
      }
    } else {
      // TODO: Should maybe use recursion here?
      console.log("DEPS", expKey, dependencies);
      return [...dependencies, ...getDependenciesRec(exp, dependencies)];
      // console.log("GOT NEXT", exp, eps);
      // dependencies.push(...eps);
    }
  }
  console.log([...deps, dependencies.filter(onlyUnique)]);

  return dependencies; //.filter(onlyUnique);
}

function parseTfModule(name: string, module: ModuleCall) {
  const mod: TfVizModuleCall = {
    id: getModuleId(),
    name,
    dependsOn: getDependencies(module.expressions),
    isLooped: module.for_each_expression !== undefined,
    resources: module.module?.resources?.map(parseTfResource) ?? [],
  };

  return mod;
}

function getValueOrThow(value: string | undefined): string {
  if (value === undefined) throw new Error("undefined value");
  return value;
}

export { parseTfConfigPlan, parseTfResource };
