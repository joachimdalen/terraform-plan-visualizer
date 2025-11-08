import { Box, Group, Paper, Text } from "@mantine/core";
import { IconPackage } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import type { ModuleNode } from "../types";
import classes from "./LabeledGroupNode.module.css";
function LabeledGroupNode({ data, height, width }: NodeProps<ModuleNode>) {
  return (
    <Paper withBorder className={classes.node} h={height} w={width}>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
      />
      <Box className={classes.header}>
        <IconPackage size={24} />
        <Text>Module</Text>
      </Box>
      <Handle type="source" position={Position.Bottom} />
      <Box className={classes.footer}>
        <Group wrap="nowrap" align="center" gap="xs">
          <Text fz="sm" fw="bold" truncate w="190">
            {data.index || data.name}- {data.id}
          </Text>
          <Text fz="xs">{data.baseAddress}</Text>
        </Group>
      </Box>
    </Paper>
  );
}

export default memo(LabeledGroupNode);
