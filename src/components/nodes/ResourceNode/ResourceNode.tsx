import { Avatar, Group, Image, Paper, Stack, Text } from "@mantine/core";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import providerIcons from "../../../provider-icons";
import type { TfVizResource } from "../../../tf-parser/tf-plan-parser";

function ResourceNode({
  id,
  isConnectable,
  data,
}: NodeProps<Node<TfVizResource>>) {
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
      p="xs"
      w={250}
      mih={65}
      bg={data.index === "basic" ? "green.1" : "yellow.1"}
    >
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Group wrap="nowrap">
        {icon ? (
          <Image src={icon} h={30} w={30} />
        ) : (
          <Avatar size="md" color="teal" radius={0}>
            AZ
          </Avatar>
        )}
        <Stack gap="0">
          <Text fz="sm" fw="bold" truncate w="190">
            {data.index || data.name}
          </Text>
          <Text fz="xs" truncate w="190">
            {data.type}
          </Text>
        </Stack>
      </Group>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </Paper>
  );
}

export default memo(ResourceNode);
