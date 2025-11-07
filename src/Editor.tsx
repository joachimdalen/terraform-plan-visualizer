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
import { IconFileUpload, IconPhoto } from "@tabler/icons-react";
import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import Vizualiser2 from "./Vizualiser2";
import LoadPlanFileModal from "./modals/LoadPlanFileModal";
import { type TfVizResource } from "./tf-parser/tf-plan-parser";

function Editor() {
  const [selectedNode, setSelectedNode] = useState<TfVizResource | undefined>(
    undefined
  );
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Stack w="100%" gap={0}>
      <Group justify="space-between">
        <Group>
          <Button
            variant="subtle"
            size="sm"
            onClick={open}
            leftSection={<IconFileUpload size={16} />}
            color="green"
          >
            Load plan
          </Button>
          <Button variant="subtle" size="sm">
            Load plan
          </Button>
        </Group>
        <Group>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconPhoto size={16} />}
          >
            Download
          </Button>
        </Group>
      </Group>
      <Divider />
      <Flex flex={1} bg="#eff3f6">
        <ReactFlowProvider>
          <Vizualiser2
            onNodeSelect={(nodeData) => setSelectedNode(nodeData)}
            planFile={fileData}
          />
        </ReactFlowProvider>
      </Flex>
      <Drawer
        offset={8}
        radius="md"
        position="right"
        opened={selectedNode != undefined}
        onClose={() => setSelectedNode(undefined)}
        title={selectedNode?.name}
      >
        <Textarea
          autosize
          defaultValue={JSON.stringify(selectedNode, null, 2)}
        />
      </Drawer>
      {opened && <LoadPlanFileModal onClose={close} onFileData={setFileData} />}
    </Stack>
  );
}

export default Editor;
