import { Anchor, AppShellHeader, Container, Group, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import classes from "./Header.module.css";

export function Header() {
  return (
    <AppShellHeader className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group>
          <Text fw="bold">Terraform Plan Visualizer</Text>
        </Group>

        <Group>
          <Anchor
            href="https://github.com/joachimdalen/tfviz"
            target="_blank"
            c="dark"
          >
            <Group gap="4">
              <IconBrandGithub size={16} />
              <Text fz="sm">View source</Text>
            </Group>
          </Anchor>
        </Group>
      </Container>
    </AppShellHeader>
  );
}
