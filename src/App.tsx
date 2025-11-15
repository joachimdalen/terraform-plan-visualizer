import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactFlowProvider } from "@xyflow/react";
import { Header } from "./components/Header/Header";
import { TfVizContextProvider } from "./context/TfVizContext";
import Editor from "./Editor";

function App() {
  const theme = createTheme({
    fontFamily: '"K2D", sans-serif',
  });
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <Notifications />
      <AppShell
        padding="md"
        header={{ height: 40 }}
        styles={{
          main: {
            display: "flex",
            paddingTop: "var(--app-shell-header-offset, 0rem)",
            paddingBottom: 0,
          },
        }}
      >
        <Header />
        <AppShell.Main px="0">
          <ReactFlowProvider>
            <TfVizContextProvider>
              <Editor />
            </TfVizContextProvider>
          </ReactFlowProvider>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
