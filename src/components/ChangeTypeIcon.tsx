import { ThemeIcon } from "@mantine/core";
import {
  IconBan,
  IconEye,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import type { ChangeType } from "../packages/tf-parser/types";
function ChangeTypeIcon({ changeType }: { changeType: ChangeType }) {
  if (changeType.isDeleteCreate) {
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

  if (changeType.isCreateDelete) {
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

  if (changeType.isCreate) {
    return (
      <ThemeIcon variant="light" color="green">
        <IconPlus />
      </ThemeIcon>
    );
  }
  if (changeType.isDelete) {
    return (
      <ThemeIcon variant="light" color="red">
        <IconTrash />
      </ThemeIcon>
    );
  }
  if (changeType.isUpdate) {
    return (
      <ThemeIcon variant="light" color="yellow">
        <IconPencil />
      </ThemeIcon>
    );
  }
  if (changeType.isRead) {
    return (
      <ThemeIcon variant="light" color="indigo">
        <IconEye />
      </ThemeIcon>
    );
  }
  if (changeType.isNoChange) {
    return (
      <ThemeIcon variant="light" color="gray">
        <IconBan />
      </ThemeIcon>
    );
  }

  return null;
}

export default ChangeTypeIcon;
