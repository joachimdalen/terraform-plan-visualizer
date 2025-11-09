import {
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconComponents } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import { memo } from "react";
import providerIcons from "../../../provider-icons";
import ChangeTypeIcon from "../../ChangeTypeIcon";
import type { ResourceNode } from "../types";
import classes from "./ResourceNode.module.css";
function ResourceNode({ data, selected }: NodeProps<ResourceNode>) {
  function getIcon() {
    const provider = providerIcons[data.provider];
    if (provider === undefined) return null;
    const icon = provider[data.type];
    if (icon) return icon;
    const defaultIcon = provider["default"];
    if (defaultIcon) return defaultIcon;
    return null;
  }

  const icon = getIcon();
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
        <Tooltip label="The resource has drifted">
          <Badge size="xs" color="grape.9" ml="auto" tt="none">
            DRIFTED
          </Badge>
        </Tooltip>
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
          {data.index && (
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
        <Group wrap="nowrap" align="center" gap="xs">
          {icon ? (
            <Image src={icon} h={15} w={15} />
          ) : (
            <Avatar size="15" color="teal" radius={0}>
              AZ
            </Avatar>
          )}
          <Tooltip label={data.type}>
            <Text fz="xs" truncate w="190">
              {data.type}
            </Text>
          </Tooltip>
        </Group>
      </Box>
      <Handle type="source" position={Position.Right} />
    </Paper>
  );
}

export default memo(ResourceNode);
