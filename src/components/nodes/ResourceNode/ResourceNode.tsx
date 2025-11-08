import {
  Avatar,
  Box,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconComponents, IconTrash } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import { memo } from "react";
import providerIcons from "../../../provider-icons";
import type { ResourceNode } from "../types";
import classes from "./ResourceNode.module.css";
function ResourceNode({
  isConnectable,
  data,
  selected,
  height,
  width,
}: NodeProps<ResourceNode>) {
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
        <IconComponents size={24} />
        <Text>Resource</Text>
      </Box>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Group flex={1} px="xs" pt="2" align="center" wrap="nowrap">
        <ThemeIcon color="red" variant="light">
          <IconTrash />
        </ThemeIcon>
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
      {/* <Paper h={30} mt="auto" p={4}></Paper> */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </Paper>
  );
}

export default memo(ResourceNode);
