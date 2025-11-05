import { AppShellHeader, Box, Burger, Container, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
const links = [
  { link: "/snapshots", label: "Snapshots" },
  { link: "/policies", label: "Policies" },
  { link: "/tasks", label: "Tasks" },
  { link: "/repo", label: "Repository" },
  { link: "/preferences", label: "Preferences" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  // const items = links.map((link) => (
  //   <NavLink
  //     key={link.label}
  //     to={link.link}
  //     className={classes.link}
  //     //   data-active={active === link.link || undefined}
  //   >
  //     {link.label}
  //   </NavLink>
  // ));

  return (
    <AppShellHeader className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Box>
          <Text>TfViz</Text>
        </Box>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </AppShellHeader>
  );
}
