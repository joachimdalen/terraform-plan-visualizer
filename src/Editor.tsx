import {
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Stack,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFileUpload, IconHierarchy } from "@tabler/icons-react";
import { useState } from "react";
import Vizualiser2 from "./Vizualiser2";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import type { CustomNodeType } from "./components/nodes/types";
import { useTfVizContext } from "./context/TfVizContext";
import LoadPlanFileModal from "./modals/LoadPlanFileModal";

function Editor() {
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | undefined>(
    undefined
  );
  const [opened, { open, close }] = useDisclosure(false);
  const { loadFile, reformat } = useTfVizContext();
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
          >
            Reformat
          </Button>
        </Group>
        <Group>
          <DownloadButton />
        </Group>
      </Group>
      <Divider />
      <Flex flex={1} bg="#eff3f6">
        <Vizualiser2 onNodeSelect={(nodeData) => setSelectedNode(nodeData)} />
      </Flex>
      <Drawer
        offset={8}
        radius="md"
        position="right"
        opened={selectedNode != undefined}
        onClose={() => setSelectedNode(undefined)}
        title={selectedNode?.data?.name}
        styles={{
          header: {
            backgroundColor: "var(--mantine-color-green-light)",
            borderBottom: "3px solid var(--mantine-color-green-5)",
            boxSizing: "border-box",
          },
        }}
      >
        <Textarea
          autosize
          defaultValue={JSON.stringify(selectedNode, null, 2)}
        />
      </Drawer>
      {opened && (
        <LoadPlanFileModal onClose={close} onFileData={(fc) => loadFile(fc)} />
      )}
    </Stack>
  );
}

export default Editor;
