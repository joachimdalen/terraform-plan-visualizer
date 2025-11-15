import { ThemeIcon } from "@mantine/core";
import {
  IconBan,
  IconEye,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
function ChangeTypeIcon({ changeType }: { changeType: string[] }) {
  if (
    changeType.length === 2 &&
    changeType[0] === "delete" &&
    changeType[1] === "create"
  ) {
    return (
      <ThemeIcon
        variant="gradient"
        gradient={{ from: "red", to: "green", deg: 90 }}
      >
        <IconPlus />
        <IconTrash />
      </ThemeIcon>
    );
  }

  if (
    changeType.length === 2 &&
    changeType[0] === "create" &&
    changeType[1] === "delete"
  ) {
    return (
      <ThemeIcon
        variant="gradient"
        gradient={{ from: "green", to: "red", deg: 90 }}
      >
        <IconPlus />
        <IconTrash />
      </ThemeIcon>
    );
  }

  if (changeType.length === 1 && changeType[0] === "create") {
    return (
      <ThemeIcon variant="light" color="green">
        <IconPlus />
      </ThemeIcon>
    );
  }
  if (changeType.length === 1 && changeType[0] === "delete") {
    return (
      <ThemeIcon variant="light" color="red">
        <IconTrash />
      </ThemeIcon>
    );
  }
  if (changeType.length === 1 && changeType[0] === "update") {
    return (
      <ThemeIcon variant="light" color="yellow">
        <IconPencil />
      </ThemeIcon>
    );
  }
  if (changeType.length === 1 && changeType[0] === "read") {
    return (
      <ThemeIcon variant="light" color="indigo">
        <IconEye />
      </ThemeIcon>
    );
  }
  if (changeType.length === 1 && changeType[0] === "no-op") {
    return (
      <ThemeIcon variant="light" color="gray">
        <IconBan />
      </ThemeIcon>
    );
  }

  return null;
}

export default ChangeTypeIcon;
