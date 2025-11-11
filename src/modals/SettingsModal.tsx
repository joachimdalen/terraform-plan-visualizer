import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
} from "@mantine/core";
import { readLocalStorageValue, useSetState } from "@mantine/hooks";
import {
  IconArrowAutofitHeightFilled,
  IconArrowAutofitWidthFilled,
} from "@tabler/icons-react";
import {
  defaultGraphOptions,
  type GraphFormatterOptions,
} from "../packages/node-builder/graph-formatter";

type Props = {
  onClose: () => void;
  onSaved: (settings: GraphFormatterOptions) => void;
};

function SettingsModal({ onClose, onSaved }: Props) {
  const [state, setState] = useSetState<GraphFormatterOptions>(
    readLocalStorageValue<GraphFormatterOptions>({
      key: "terraform-plan-visualizer-settings",
      defaultValue: defaultGraphOptions,
    })
  );

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Preferences"
      size="lg"
      styles={{ title: { fontWeight: "bold" } }}
    >
      <Stack gap="xs">
        <Group grow>
          <Select
            label="Direction"
            description="The direction to use for the root layout"
            data={["LEFT", "DOWN", "RIGHT"]}
            value={state.direction}
            onChange={(e) => setState({ direction: e ?? "RIGHT" })}
            allowDeselect={false}
            withCheckIcon={false}
          />
          <Select
            label="Module Direction"
            description="The direction to use for module layouts"
            data={["LEFT", "DOWN", "RIGHT"]}
            value={state.moduleDirection}
            onChange={(e) => setState({ moduleDirection: e ?? "RIGHT" })}
            allowDeselect={false}
            withCheckIcon={false}
          />
        </Group>
        <Group grow>
          <NumberInput
            label="Layer Spacing"
            description="The spacing to use between layers"
            defaultValue={100}
            leftSection={<IconArrowAutofitHeightFilled />}
            value={state.layerSpacing}
            onChange={(e) => setState({ layerSpacing: parseInt(e.toString()) })}
          />
          <NumberInput
            label="Node Spacing"
            description="The spacing to use between nodes in the same layer"
            defaultValue={100}
            leftSection={<IconArrowAutofitWidthFilled />}
            value={state.nodeSpacing}
            onChange={(e) => setState({ nodeSpacing: parseInt(e.toString()) })}
          />
        </Group>

        <Group justify="end">
          <Button
            onClick={() => {
              localStorage.setItem(
                "terraform-plan-visualizer-settings",
                JSON.stringify(state)
              );
              onSaved(state);
              onClose();
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
export default SettingsModal;
