import devops from "./assets/azure_devops.svg";
import entraGroup from "./assets/group.svg";
import identityGov from "./assets/identity_governance.svg";
import rest from "./assets/rest.svg";

type ProviderIcons = Record<string, Record<string, string>>;
const icons: ProviderIcons = {
  ["hashicorp/azuread"]: {
    default: identityGov,
    azuread_access_package_catalog: identityGov,
    azuread_access_package: identityGov,
    azuread_group: entraGroup,
    //azuread_access_package_assignment_policy: identityGov,
  },
  ["microsoft/azuredevops"]: {
    default: devops,
    azuredevops_group: devops,
    azuredevops_group_entitlement: devops,
  },
  ["microsoft/msgraph"]: {
    default: rest,
    msgraph_resource: rest,
  },
};
export default icons;
