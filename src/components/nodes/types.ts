import type { Node } from "@xyflow/react";
import type { DataNodeData } from "../../packages/node-builder/types";
import type {
  TfVisModuleNoResources,
  TfVizResource,
} from "../../tf-parser/tf-plan-parser";

export type DataNode = Node<DataNodeData>;
export type ResourceNode = Node<TfVizResource>;
export type ModuleNode = Node<TfVisModuleNoResources>;

export type CustomNodeType = DataNode | ResourceNode | ModuleNode;

export const ModuleNodeExtraHeight = 100;
export const ModuleNodeOffsetY = 50;
