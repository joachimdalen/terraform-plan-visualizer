import { randomId } from "@mantine/hooks";

function getResourceId() {
  return randomId("res-");
}
function getModuleId() {
  return randomId("mod-");
}
function getDataId() {
  return randomId("data-");
}
function getEdgeId() {
  return randomId("edge-");
}
export { getDataId, getEdgeId, getModuleId, getResourceId };
