import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEye,
  IconFileUpload,
  IconHierarchy,
  IconSettings,
} from "@tabler/icons-react";
import { useReactFlow } from "@xyflow/react";
import { useState } from "react";
import Vizualiser from "./Vizualiser";
import DownloadButton from "./components/DownloadButton/DownloadButton";
import helperClasses from "./components/helpers.module.css";
import type { CustomNodeType } from "./components/nodes/types";
import { useTfVizContext } from "./context/TfVizContext";
import DetailsPane from "./modals/DetailsPane";
import LoadPlanFileModal from "./modals/LoadPlanFileModal";
import SettingsModal from "./modals/SettingsModal";

function Editor() {
  const [selectedNode, setSelectedNode] = useState<CustomNodeType | undefined>(
    undefined
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [showSettings, settingsHandlers] = useDisclosure(false);
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
            onClick={() => reformat()}
            disabled={!isLoaded}
            className={helperClasses.disabledSubtleButton}
          >
            Reformat
          </Button>
        </Group>
        <Group gap="xs">
          <Tooltip label="Fit view">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => fitView()}
              disabled={!isLoaded}
              className={helperClasses.disabledSubtleButton}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Settings">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={settingsHandlers.open}
            >
              <IconSettings size={16} />
            </ActionIcon>
          </Tooltip>
          <DownloadButton />
        </Group>
      </Group>
      <Divider />
      <Flex flex={1} bg="#eff3f6">
        <Vizualiser onNodeSelect={(nodeData) => setSelectedNode(nodeData)} />
      </Flex>
      {selectedNode && (
        <DetailsPane
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(undefined)}
        />
      )}
      {(opened || !isLoaded) && (
        <LoadPlanFileModal onClose={close} onFileData={(fc) => loadFile(fc)} />
      )}
      {showSettings && (
        <SettingsModal
          onClose={settingsHandlers.close}
          onSaved={(settings) => reformat(settings)}
        />
      )}
    </Stack>
  );
}

export default Editor;
