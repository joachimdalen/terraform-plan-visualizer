import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye, IconFileUpload, IconHierarchy } from "@tabler/icons-react";
import { useReactFlow } from "@xyflow/react";
import { useState } from "react";
import Vizualiser2 from "./Vizualiser2";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import helperClasses from "./components/helpers.module.css";
import type { CustomNodeType } from "./components/nodes/types";
import { useTfVizContext } from "./context/TfVizContext";
import LoadPlanFileModal from "./modals/LoadPlanFileModal";
function Editor() {
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | undefined>(
    undefined
  );
  const [opened, { open, close }] = useDisclosure(false);
  const { loadFile, reformat, isLoaded } = useTfVizContext();
  const { fitView } = useReactFlow();

  return (
    <Stack w="100%" gap={0}>
      <Group justify="space-between">
        <Group gap="xs">
          <Button
            variant="subtle"
            size="sm"
            onClick={open}
            leftSection={<IconFileUpload size={16} />}
            color="green"
          >
            Load plan
          </Button>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconHierarchy size={16} />}
            onClick={reformat}
            disabled={!isLoaded}
            className={helperClasses.disabledSubtleButton}
          >
            Reformat
          </Button>
        </Group>
        <Group>
          <Tooltip label="Fit view">
            <ActionIcon
              variant="subtle"
              color="blue.5"
              onClick={() => fitView()}
              disabled={!isLoaded}
              className={helperClasses.disabledSubtleButton}
            >
              <IconEye />
            </ActionIcon>
          </Tooltip>
          <DownloadButton />
        </Group>
      </Group>
      <Divider />
      <Flex flex={1} bg="#eff3f6">
        <Vizualiser2 onNodeSelect={(nodeData) => setSelectedNode(nodeData)} />
      </Flex>
      {selectedNode && (
        <Drawer
          offset={8}
          radius="md"
          position="right"
          opened={selectedNode != undefined}
          onClose={() => setSelectedNode(undefined)}
          title={selectedNode?.data?.name}
          styles={{
            header: {
              backgroundColor:
                selectedNode?.type === "resourceNode"
                  ? "var(--mantine-color-blue-light)"
                  : "var(--mantine-color-green-light)",
              borderBottom: `3px solid ${
                selectedNode?.type === "resourceNode"
                  ? "var(--mantine-color-blue-5)"
                  : "var(--mantine-color-green-5)"
              }`,
              boxSizing: "border-box",
            },
          }}
        >
          <Stack gap="xs">
            <TextInput
              label="Name"
              defaultValue={selectedNode?.data?.name}
              readOnly
              variant="filled"
            />
            <TextInput
              label="Address"
              defaultValue={selectedNode?.data?.address}
              readOnly
              variant="filled"
            />
            <TextInput
              label="Index"
              defaultValue={selectedNode?.data?.index}
              readOnly
              variant="filled"
            />
            <TextInput
              label="Type"
              defaultValue={selectedNode?.data?.type}
              readOnly
              variant="filled"
            />
            <TextInput
              label="Provider"
              defaultValue={selectedNode?.data?.provider}
              readOnly
              variant="filled"
            />
            <TextInput
              label="Registry"
              defaultValue={selectedNode?.data?.registry}
              readOnly
              variant="filled"
            />

            {/* <Textarea
              autosize
              defaultValue={JSON.stringify(selectedNode, null, 2)}
            /> */}
          </Stack>
        </Drawer>
      )}
      {opened && (
        <LoadPlanFileModal onClose={close} onFileData={(fc) => loadFile(fc)} />
      )}
    </Stack>
  );
}

export default Editor;
