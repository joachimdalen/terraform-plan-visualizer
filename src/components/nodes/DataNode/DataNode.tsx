import { Box, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import cx from "clsx";
import { memo } from "react";
import ProviderLabel from "../../ProviderLabel/ProviderLabel";
import type { DataNode } from "../types";
import classes from "./DataNode.module.css";

function DataNode({ data, selected }: NodeProps<DataNode>) {
  return (
    <Paper
      withBorder
      className={cx(classes.resourceNode, { [classes.active]: selected })}
    >
      <Box className={classes.header}>
        <IconDatabase size={24} />
        <Text>Data</Text>
      </Box>
      <Handle type="target" position={Position.Left} />
      <Stack gap="0" flex={1} px="xs" pt="2">
        <Group gap="5" wrap="nowrap">
          <Text c="dimmed" fz="xs">
            Name:
          </Text>
          <Text fz="xs" truncate w="150">
            {data.name}
          </Text>
        </Group>
      </Stack>
      <Divider />
      <Box className={classes.footer}>
        <ProviderLabel provider={data.provider} type={data.type} />
      </Box>

      <Handle type="source" position={Position.Right} />
    </Paper>
  );
}

export default memo(DataNode);
