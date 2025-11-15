import { Drawer, Stack, TextInput } from "@mantine/core";
import type {
  CustomNodeType,
  DataNode,
  ModuleNode,
  ResourceNode,
} from "../components/nodes/types";

type Props = {
  selectedNode: CustomNodeType;
  onClose: () => void;
};

function DetailsPane({ onClose, selectedNode }: Props) {
  function getHeaderStyles() {
    if (selectedNode.type === "resourceNode") {
      return {
        backgroundColor: "var(--mantine-color-blue-light)",
        borderBottom: `3px solid var(--mantine-color-blue-5)`,
      };
    }
    if (selectedNode.type === "dataNode") {
      return {
        backgroundColor: "var(--mantine-color-green-light)",
        borderBottom: `3px solid var(--mantine-color-green-5)`,
      };
    }
    if (selectedNode.type === "moduleNode") {
      return {
        backgroundColor: "var(--mantine-color-yellow-light)",
        borderBottom: `3px solid var(--mantine-color-yellow-5)`,
      };
    }

    return null;
  }

  return (
    <Drawer
      offset={8}
      radius="md"
      position="right"
      opened={true}
      onClose={onClose}
      title={selectedNode?.data?.name}
      styles={{
        header: {
          ...getHeaderStyles(),
          boxSizing: "border-box",
        },
      }}
    >
      {selectedNode.type === "resourceNode" && (
        <ResourceFields selectedNode={selectedNode as ResourceNode} />
      )}
      {selectedNode.type === "dataNode" && (
        <DataFields selectedNode={selectedNode as DataNode} />
      )}
      {selectedNode.type === "moduleNode" && (
        <ModuleFields selectedNode={selectedNode as ModuleNode} />
      )}
    </Drawer>
  );
}

function ResourceFields({ selectedNode }: { selectedNode: ResourceNode }) {
  return (
    <Stack gap="xs" mt="sm">
      <TextInput
        label="Name"
        defaultValue={selectedNode.data.name}
        readOnly
        variant="filled"
      />
      <TextInput
        label="Address"
        defaultValue={selectedNode.data.address}
        readOnly
        variant="filled"
      />
      {selectedNode.data.index && (
        <TextInput
          label="Index"
          defaultValue={selectedNode.data.index}
          readOnly
          variant="filled"
        />
      )}
      <TextInput
        label="Type"
        defaultValue={selectedNode.data.type}
        readOnly
        variant="filled"
      />
      <TextInput
        label="Provider"
        defaultValue={selectedNode.data.provider}
        readOnly
        variant="filled"
      />
      <TextInput
        label="Registry"
        defaultValue={selectedNode.data.registry}
        readOnly
        variant="filled"
      />
    </Stack>
  );
}

function DataFields({ selectedNode }: { selectedNode: DataNode }) {
  return (
    <Stack gap="xs" mt="sm">
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
    </Stack>
  );
}

function ModuleFields({ selectedNode }: { selectedNode: ModuleNode }) {
  return (
    <Stack gap="xs" mt="sm">
      <TextInput
        label="Name"
        defaultValue={selectedNode.data.name}
        readOnly
        variant="filled"
      />
      <TextInput
        label="Address"
        defaultValue={selectedNode.data.address}
        readOnly
        variant="filled"
      />
      {selectedNode.data.index && (
        <TextInput
          label="Index"
          defaultValue={selectedNode.data.index}
          readOnly
          variant="filled"
        />
      )}
    </Stack>
  );
}
export default DetailsPane;
