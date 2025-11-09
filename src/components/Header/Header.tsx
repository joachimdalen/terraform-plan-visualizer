import {
  ActionIcon,
  AppShellHeader,
  Button,
  Container,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconBrandGithub, IconMoon, IconSun } from "@tabler/icons-react";
import clsx from "clsx";
import classes from "./Header.module.css";
export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <AppShellHeader className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group>
          <Text fw="bold">Terraform Plan Visualizer</Text>
        </Group>

        <Group>
          <Button
            component="a"
            href="https://github.com/joachimdalen/terraform-plan-visualizer"
            target="_blank"
            color={computedColorScheme === "light" ? "dark" : "blue"}
            size="xs"
            variant="subtle"
          >
            <Group gap="4">
              <IconBrandGithub size={16} />
              <Text fz="sm">View source</Text>
            </Group>
          </Button>
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === "light" ? "dark" : "light")
            }
            variant="subtle"
            color={computedColorScheme === "light" ? "dark" : "blue"}
            aria-label="Toggle color scheme"
          >
            <IconSun
              size={18}
              className={clsx(classes.icon, classes.light)}
              stroke={1.5}
            />
            <IconMoon
              size={16}
              className={clsx(classes.icon, classes.dark)}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </AppShellHeader>
  );
}
