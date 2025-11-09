import {
  Button,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import {
  IconFileTypePng,
  IconFileTypeSvg,
  IconPhoto,
} from "@tabler/icons-react";
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from "@xyflow/react";
import { toPng, toSvg } from "html-to-image";
import type { Options } from "html-to-image/lib/types";
import { useState } from "react";
import { useTfVizContext } from "../../context/TfVizContext";
import helperClasses from "../helpers.module.css";
function downloadImage(dataUrl: string, type: "png" | "svg") {
  const a = document.createElement("a");
  a.setAttribute("download", `${randomId("plan-")}.${type}`);
  a.setAttribute("href", dataUrl);
  a.click();
}

function DownloadButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const { getNodes } = useReactFlow();
  const { isLoaded } = useTfVizContext();

  const onClick = (type: "png" | "svg") => {
    setLoading(true);
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width + 100;
    const imageHeight = nodesBounds.height + 100;
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      5
    );

    const options: Options = {
      backgroundColor: "#141414",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    };

    const element = document.querySelector<HTMLElement>(
      ".react-flow__viewport"
    );
    if (element === null) return;
    if (type === "png") {
      toPng(element, options).then((f) => {
        downloadImage(f, type);
        setLoading(false);
      });
    }
    if (type === "svg") {
      toSvg(element, options).then((f) => {
        downloadImage(f, type);
        setLoading(false);
      });
    }
  };

  return (
    <Menu shadow="md" width={200} withArrow>
      <MenuTarget>
        <Button
          variant="subtle"
          size="sm"
          leftSection={<IconPhoto size={16} />}
          disabled={!isLoaded}
          className={helperClasses.disabledSubtleButton}
          loading={loading}
        >
          Export
        </Button>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          leftSection={<IconFileTypeSvg size={16} />}
          onClick={() => onClick("svg")}
        >
          SVG
        </MenuItem>
        <MenuItem
          leftSection={<IconFileTypePng size={16} />}
          onClick={() => onClick("png")}
        >
          PNG
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}

export default DownloadButton;
