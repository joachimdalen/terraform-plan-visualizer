import type { ChangeType, Plan, ResourceChange } from "./types";

function getActionType(change: ResourceChange, type: string[]) {
  if (change?.change?.actions === undefined) return false;
  return type.every((t) => change.change?.actions?.includes(t));
}
function parseTfChangesPlan(planFile: Plan): Map<string, ChangeType> {
  const changes = new Map<string, ChangeType>();
  if (!planFile.resource_changes) return changes;

  for (const change of planFile.resource_changes) {
    if (!change.address) continue;

    changes.set(change.address, {
      isNoChange: getActionType(change, ["no-op"]),
      isCreate: getActionType(change, ["create"]),
      isRead: getActionType(change, ["read"]),
      isUpdate: getActionType(change, ["update"]),
      isDelete: getActionType(change, ["delete"]),
      isDeleteCreate: getActionType(change, ["delete", "create"]),
      isCreateDelete: getActionType(change, ["create", "delete"]),
    });
  }

  return changes;
}

export { parseTfChangesPlan };
