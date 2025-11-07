import type { Edge, Node } from "@xyflow/react";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

type AppState = {
  nodes: Node[];
  edges: Edge[];
};

const initialState: AppState = {
  nodes: [],
  edges: [],
};

const AppContext = createContext<AppState>(initialState);

export type AppContextProps = PropsWithChildren<{}>;
export function AppContextProvider({ children }: AppContextProps) {
  const [nodes, setIntNodes] = useState<Node[]>([]);
  const [edges, setIntEdges] = useState<Node[]>([]);

  const setNodes = useCallback((nds: Node[]) => {
    setIntNodes(nds);
  }, []);
  const setEdges = useCallback((edg: Edge[]) => {
    setIntEdges(nodes);
  }, []);

  return (
    <AppContext.Provider
      value={{
        dockApi,
        setDockApi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useTfVizContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
