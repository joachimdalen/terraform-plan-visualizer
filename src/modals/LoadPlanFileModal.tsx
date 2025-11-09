import {
  Button,
  Code,
  Group,
  JsonInput,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
type Props = {
  onClose: () => void;
  onFileData: (data: string) => void;
};
const placeholder = `terraform plan --out plan
terraform show -no-color -json .\\plan > output.json`;
function LoadPlanFileModal({ onClose, onFileData }: Props) {
  const [fileContent, setFileContent] = useInputState<string>("");

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Load plan file"
      size="lg"
      styles={{ title: { fontWeight: "bold" } }}
    >
      <Stack gap="xs">
        <Text fz="sm">
          TfViz requires a json representation of your plan file to work
          correctly.
        </Text>
        <Stack gap={0}>
          <Text fz="sm" fw="bold">
            Execute the following commands to generate the file
          </Text>
          <Code block>{placeholder}</Code>
        </Stack>

        <JsonInput
          maxRows={20}
          rows={10}
          label="Paste the output of output.json"
          value={fileContent}
          onChange={setFileContent}
          placeholder="Output file content"
        />
        <Group justify="end">
          <Button
            onClick={() => {
              onFileData(fileContent);
              onClose();
            }}
            disabled={fileContent === ""}
          >
            Load
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
export default LoadPlanFileModal;
