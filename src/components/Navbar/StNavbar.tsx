'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/auth.context';

function NavLink({ children, href, onClick }: { children: string, href: string | undefined, onClick?: () => void }) {
  return (
    <Link
      as={NextLink}
      href={href}
      px={3}
      py={2}
      onClick={onClick}
      rounded="md"
      _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
    >
      {children}
    </Link>
  );
}

export default function StNavBar() {
  const { open, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home',
      href: '/' },
    { name: 'Pacientes',
        href: '/patients',
      },
      { name: 'Medicamentos',
        href: '/meds',
      },
      { name: 'Receitas',
        href: '/medicalPrescriptions',
      },
    { name: 'Sair',
      href: '',
      onClick: logout }];

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm">
      <Flex h={16} align="center" justify="space-between">
        <Box fontWeight="bold">Meds - Bem-vindo, {user?.name}</Box>
        <HStack as="nav" display={{ base: 'none', md: 'flex' }}>
          {links.map((link) => (
            <NavLink href={link.href} onClick={link.onClick} key={link.name}>{link.name}</NavLink>
          ))}
        </HStack>
        <IconButton
          size="md"
          // icon={open ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={open ? onClose : onOpen}
        />
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