import { Avatar, Badge, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import providerIcons from "../../../provider-icons";
import type { TfVizResource } from "../../../tf-parser/tf-plan-parser";

function DataNode({ id, isConnectable, data }: NodeProps<Node<TfVizResource>>) {
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
      w={250}
      mih={65}
      h="100%"
      display="flex"
      style={{ flexDirection: "column" }}
      bg="teal.2"
    >
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Stack gap="0" flex={1} px="xs" pt="2">
        <Group justify="space-between" wrap="nowrap">
          <Text fz="sm" fw="bold" truncate w="170">
            {data.index || data.name} - {data.id}
          </Text>
          <Badge size="xs">DATA</Badge>
        </Group>
      </Stack>

      <Paper withBorder h={30} mt="auto" p={4}>
        <Group wrap="nowrap" align="center" gap="xs">
          {icon ? (
            <Image src={icon} h={15} w={15} />
          ) : (
            <Avatar size="15" color="teal" radius={0}>
              AZ
            </Avatar>
          )}
          <Text fz="xs" truncate w="190">
            {data.type}
          </Text>
        </Group>
      </Paper>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </Paper>
  );
}

export default memo(DataNode);
