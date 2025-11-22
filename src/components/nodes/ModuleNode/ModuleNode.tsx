import { Box, Group, Paper, Text } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import type { ModuleNode } from "../types";
import classes from "./ModuleNode.module.css";
function ModuleNode({ data, height, width }: NodeProps<ModuleNode>) {
  return (
    <Paper withBorder className={classes.node} h={height} w={width}>
      <Handle type="target" position={Position.Top} />
      <Box className={classes.header}>
        <IconPackage size={24} />
        <Text>Module</Text>
      </Box>
      <Handle type="source" position={Position.Bottom} />
      <Box className={classes.footer}>
        <Group>
          <Group gap="5" wrap="nowrap">
            <Text c="dimmed" fz="xs">
              Name:
            </Text>
            <Text fz="xs">{data.name}</Text>
          </Group>
          {data.index && (
            <Group gap="5" wrap="nowrap">
              <Text c="dimmed" fz="xs">
                Index:
              </Text>
              <Text fz="xs">{data.index}</Text>
            </Group>
          )}
        </Group>
      </Box>
    </Paper>
  );
}

export default memo(ModuleNode);
