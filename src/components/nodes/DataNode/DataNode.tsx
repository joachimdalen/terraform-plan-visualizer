import {
  Avatar,
  Box,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import providerIcons from "../../../provider-icons";
import type { DataNode } from "../types";
import classes from "./DataNode.module.css";

function DataNode({ id, isConnectable, data, selected }: NodeProps<DataNode>) {
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
      className={classes.resourceNode}
      styles={{
        root: selected
          ? {
              background: "red",
            }
          : undefined,
      }}
    >
      <Box className={classes.header}>
        <IconDatabase size={24} />
        <Text>Data</Text>
      </Box>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Stack gap="0" flex={1} px="xs" pt="2">
        <Text fz="sm" fw="bold" truncate w="190">
          {data.index || data.name}- {data.id}
        </Text>
      </Stack>
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

export default memo(DataNode);
