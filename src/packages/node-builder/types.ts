export type ResourceNodeData = {};
export type ModuleNodeData = {};
export type DataNodeData = {
  id: string;
  address: string;
  name: string;
  type: string;
  provider: string;
};

export type ResourceNodeProps = {
  name: string;
  index?: string;
  type: string;
  provider: string;
  changeType: boolean;
};

export type ModuleNodeProps = {
  name: string;
  index?: string;
  type: string;
  provider: string;
};
export type DataNodeProps = {
  name: string;
  type: string;
  provider: string;
};
