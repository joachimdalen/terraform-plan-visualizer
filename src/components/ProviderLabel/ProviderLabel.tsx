import { Avatar, Group, Image, Text, Tooltip } from "@mantine/core";
import providerIcons from "../../provider-icons";
function getIcon(providerKey: string, type: string) {
  const provider = providerIcons[providerKey];
  if (provider === undefined) return null;
  const icon = provider[type];
  if (icon) return icon;
  const defaultIcon = provider["default"];
  if (defaultIcon) return defaultIcon;
  return null;
}
function ProviderLabel({ provider, type }: { provider: string; type: string }) {
  const icon = getIcon(provider, type);

  return (
    <Group wrap="nowrap" align="center" gap="xs">
      {icon ? (
        <Image src={icon} h={15} w={15} />
      ) : (
        <Avatar size="15" color="initials" radius={0} name={type} />
      )}
      <Tooltip label={type}>
        <Text fz="xs" truncate w="190">
          {type}
        </Text>
      </Tooltip>
    </Group>
  );
}

export default ProviderLabel;
