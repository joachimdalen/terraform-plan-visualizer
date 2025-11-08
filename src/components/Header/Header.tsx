import {
  ActionIcon,
  AppShellHeader,
  Container,
  Group,
  Text,
} from "@mantine/core";
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
          <ActionIcon
            component="a"
            href="https://github.com/joachimdalen/tfviz"
            target="_blank"
            color="dark"
            radius={10}
          >
            <IconBrandGithub />
          </ActionIcon>
        </Group>
      </Container>
    </AppShellHeader>
  );
}
