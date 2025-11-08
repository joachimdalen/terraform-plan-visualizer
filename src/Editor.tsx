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
import { IconFileUpload, IconHierarchy, IconPhoto } from "@tabler/icons-react";
import { useState } from "react";
import Vizualiser2 from "./Vizualiser2";
import { useTfVizContext } from "./context/TfVizContext";
import LoadPlanFileModal from "./modals/LoadPlanFileModal";
import { type TfVizResource } from "./tf-parser/tf-plan-parser";

function Editor() {
  const [selectedNode, setSelectedNode] = useState<TfVizResource | undefined>(
    undefined
  );
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure(false);
  const { loadFile, reformat } = useTfVizContext();
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
        <Vizualiser2 onNodeSelect={(nodeData) => setSelectedNode(nodeData)} />
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
      {opened && (
        <LoadPlanFileModal onClose={close} onFileData={(fc) => loadFile(fc)} />
      )}
    </Stack>
  );
}

export default Editor;
