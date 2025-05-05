'use client'

import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useAuth } from '@/contexts/auth.context';
import { FaAngleUp, FaBars } from 'react-icons/fa';

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

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} shadow="sm">
      <Flex h={16} align="center" justify="space-between">
        <Box fontWeight="bold">Meds - Bem-vindo, {user?.name}</Box>
        <HStack as="nav" display={{ base: 'none', md: 'flex' }}>
          {links.map((link) => (
            <NavLink href={link.href} onClick={link.onClick} key={link.name}>{link.name}</NavLink>
          ))}
        </HStack>
        <Button
          variant={"subtle"}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={open ? onClose : onOpen}
        >
          {open ? <FaAngleUp /> : <FaBars />}
        </Button>
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