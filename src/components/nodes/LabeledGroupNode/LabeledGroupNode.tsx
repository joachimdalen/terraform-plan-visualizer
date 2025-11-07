import { Group, Paper, Stack, Text } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import type { TfVisModuleNoResources } from "../../../tf-parser/tf-plan-parser";

function LabeledGroupNode({
  data,
  height,
  width,
}: NodeProps<Node<TfVisModuleNoResources>>) {
  return (
    <Paper
      withBorder
      bg="transparent"
      style={{ borderColor: "var(--mantine-color-blue-5)" }}
      h={height}
      w={width}
    >
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
      />
      <Paper withBorder p="xs" bg="yellow.1">
        <Group wrap="nowrap">
          <Stack gap="0">
            <Group gap="xs">
              <IconPackage size={18} />
              <Text fz="sm" fw="bold" truncate>
                {data.name}- {data.id}
              </Text>
            </Group>
            <Text fz="xs">{data.baseAddress}</Text>
          </Stack>
        </Group>
      </Paper>
      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
}

export default memo(LabeledGroupNode);
