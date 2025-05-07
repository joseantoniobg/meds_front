'use client'

import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  IconButton,
  Link,
  Portal,
  Select,
  Stack,
  useDisclosure,
  useSelectContext
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/auth.context';
import { FaAngleUp, FaBars, FaCircle, FaForward, FaMoon, FaSun } from 'react-icons/fa';
import StButton from '../Button/StButton';

function NavLink({ children, href, onClick }: { children: string, href: string | undefined, onClick?: () => void }) {
  return (
    <Link
      as={NextLink}
      href={href}
      px={3}
      py={2}
      onClick={onClick}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: "colorPalette.900",
      }}
    >
      {children}
    </Link>
  );
}

export default function StNavBar() {
  const { open, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useAuth();
  const { colorPalletes, colorPallete, setColorPallete } = useAuth();
  const colorsP = [];

  for (let i = 0; i < colorPalletes.length; i++) {
    colorsP.push({
      label: "",
      value: colorPalletes[i],
      icon: <FaCircle color={colorPalletes[i]} />
    })
  }

  const frameworks = createListCollection({
    items: colorsP,
  })

  const links = [
    { name: 'Home',
      href: '/' },
      { name: 'Medicamentos',
        href: '/meds',
      },
    { name: 'Pacientes',
        href: '/patients',
      },
      { name: 'Receitas',
        href: '/medicalPrescriptions',
      },
    { name: 'Sair',
      href: '',
      onClick: logout }];

    interface Framework {
      label: string
      value: string
      icon: React.ReactNode
    }

  const SelectTrigger = () => {
    const select = useSelectContext()
    const items = select.selectedItems as Framework[]

    if (select.hasSelectedItems) {
      setColorPallete(items[0].value);
    }

    return (
      <IconButton
        px="2"
        variant="outline"
        size="sm"
        {...select.getTriggerProps()}
      >
        {select.hasSelectedItems ? items[0].icon : <FaCircle />}
      </IconButton>
    )
  }

  return (
    <Box px={4} shadow="sm">
      <Flex h={16} align="center" justify="space-between">
        <Box fontWeight="bold">Meds - Bem-vindo, {user?.name}</Box>
        <Box display="flex" alignItems="center" gap={4}>
          <HStack as="nav" display={{ base: 'none', md: 'flex' }}>
            {links.map((link) => (
              <NavLink href={link.href} onClick={link.onClick} key={link.name}>{link.name}</NavLink>
            ))}
            <StButton label="" icon={theme === 'light' ? <FaSun /> : <FaMoon />} onClick={toggleTheme} loading={false} />
          </HStack>
          <Button
            variant={"subtle"}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={open ? onClose : onOpen}
          >
            {open ? <FaAngleUp /> : <FaBars />}
          </Button>
          <Select.Root
            positioning={{ sameWidth: false }}
            collection={frameworks}
            size="sm"
            defaultValue={[colorPallete]}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <SelectTrigger />
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      <HStack>
                        {framework.icon}
                        {framework.label}
                      </HStack>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>
      </Flex>
      {open && (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav">
            {links.map((link) => (
              <NavLink href={link.href} onClick={link.onClick} key={link.name}>{link.name}</NavLink>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}