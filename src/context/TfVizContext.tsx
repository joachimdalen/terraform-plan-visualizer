import { useReactFlow, type Edge } from "@xyflow/react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type { CustomNodeType } from "../components/nodes/types";
import { buildEdges } from "../packages/node-builder/edge-builder";
import { formatGraph } from "../packages/node-builder/graph-formatter";
import { getNodesFromPlan2 } from "../packages/node-builder/node-builder";
import { parseTfConfigPlan } from "../packages/tf-parser/tf-config-plan-parser";
import { parseTfPlan } from "../tf-parser/tf-plan-parser";

type AppState = {
  nodes: CustomNodeType[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<CustomNodeType[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  loadFile: (fileContent: string) => void;
  reformat: () => void;
};

const initialState: AppState = {
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {
    return [];
  },
  loadFile: () => {},
  reformat: () => {},
};

const TfVizContext = createContext<AppState>(initialState);

export type TfVizContextProps = PropsWithChildren<{}>;
export function TfVizContextProvider({ children }: TfVizContextProps) {
  const [nodes, setIntNodes] = useState<CustomNodeType[]>([]);
  const [edges, setIntEdges] = useState<Edge[]>([]);

  const { fitView } = useReactFlow();

  // const setNodes = useCallback((nds: CustomNodeType[]) => {
  //   setIntNodes(nds);
  // }, []);
  // const setEdges = useCallback((edg: Edge[]) => {
  //   setIntEdges(edg);
  // }, []);

  const loadFile = useCallback((planFile: string) => {
    const jsonPlanFile = JSON.parse(planFile);
    const parsedJsonPlan = parseTfPlan(jsonPlanFile);
    const parsedJsonConfig = parseTfConfigPlan(jsonPlanFile);
    const nodesFromPlanAndConfig = getNodesFromPlan2(
      parsedJsonPlan,
      parsedJsonConfig
    );
    const nodeEdges = buildEdges(parsedJsonConfig, nodesFromPlanAndConfig);
    // console.group("Parsed configuration");
    // console.log(parsedPlan);
    // console.log(parsedConfig);
    // console.log(nodesFromPlanAndConfig);
    // console.log(nodeEdges);
    // console.groupEnd();

    setIntNodes(nodesFromPlanAndConfig);
    setIntEdges(nodeEdges);
  }, []);

  const reformat = useCallback(() => {
    formatGraph(nodes, edges).then((res) => {
      setIntNodes(res);
    });
    // createLayout(nodes, edges).then((res) => {
    //   setIntNodes(res?.nodes);
    //   setIntEdges(res?.edges);
    //   fitView();
    // });
  }, [nodes, edges]);

  return (
    <TfVizContext.Provider
      value={{
        nodes,
        edges,
        setNodes: setIntNodes,
        setEdges: setIntEdges,
        loadFile,
        reformat,
      }}
    >
      {children}
    </TfVizContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTfVizContext() {
  const context = useContext(TfVizContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
