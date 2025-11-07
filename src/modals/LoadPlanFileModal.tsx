import { Button, JsonInput, Modal } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
type Props = {
  onClose: () => void;
  onFileData: (data: string) => void;
};
function LoadPlanFileModal({ onClose, onFileData }: Props) {
  const [fileContent, setFileContent] = useInputState<string>("");
  return (
    <Modal opened={true} onClose={onClose} title="Authentication">
      <JsonInput
        maxRows={20}
        rows={10}
        label="Paste your plan file"
        value={fileContent}
        onChange={setFileContent}
      />
      <Button
        onClick={() => {
          onFileData(fileContent);
          onClose();
        }}
      >
        Load
      </Button>
    </Modal>
  );
}
export default LoadPlanFileModal;
