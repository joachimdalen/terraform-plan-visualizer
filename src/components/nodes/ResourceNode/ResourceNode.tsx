import { Box, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { IconComponents } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import { memo } from "react";
import ChangeTypeIcon from "../../ChangeTypeIcon";
import ProviderLabel from "../../ProviderLabel/ProviderLabel";
import type { ResourceNode } from "../types";
import classes from "./ResourceNode.module.css";
function ResourceNode({ data, selected }: NodeProps<ResourceNode>) {
  return (
    <Paper
      withBorder
      className={clsx(classes.resourceNode, { [classes.active]: selected })}
    >
      <Box className={classes.header}>
        <Group gap="0">
          <IconComponents size={24} />
          <Text>Resource</Text>
        </Group>
        {/* <Tooltip label="The resource has drifted">
          <Badge size="xs" color="grape.9" ml="auto" tt="none">
            DRIFTED
          </Badge>
        </Tooltip> */}
      </Box>
      <Handle type="target" position={Position.Left} />
      <Group flex={1} px="xs" pt="2" align="center" wrap="nowrap">
        {data.changeType && <ChangeTypeIcon changeType={data.changeType} />}
        <Stack gap="0">
          <Group gap="5" wrap="nowrap">
            <Text c="dimmed" fz="xs">
              Name:
            </Text>
            <Text fz="xs" truncate w="150">
              {data.name}
            </Text>
          </Group>
          {data.index !== undefined && (
            <Group gap="3">
              <Text c="dimmed" fz="xs">
                Index:
              </Text>
              <Text fz="xs">{data.index}</Text>
            </Group>
          )}
        </Stack>
      </Group>
      <Divider />
      <Box className={classes.footer}>
        <ProviderLabel provider={data.provider} type={data.type} />
      </Box>
      <Handle type="source" position={Position.Right} />
    </Paper>
  );
}

export default memo(ResourceNode);
