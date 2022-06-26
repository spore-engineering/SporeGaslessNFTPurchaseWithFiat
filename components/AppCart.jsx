import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  useColorModeValue,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import * as React from 'react'
import { CartItem } from './CartItem'
import { CartOrderSummary } from './CartOrderSummary'
import { cartData } from './_data'

export const AppCart = () => (
  <Container>
      <Box px={{ base: '4', md: '6'}} py={{ base: '5', md: '6'}} w='100%' p={4} bg="bg-surface" borderRadius="lg" boxShadow={useColorModeValue('sm', 'sm-dark')}>

  <Box
    maxW={{
      base: '3xl',
      lg: '7xl',
    }}
    mx="auto"
    px={{
      base: '4',
      md: '8',
      lg: '12',
    }}
    py={{
      base: '6',
      md: '8',
      lg: '12',
    }}
  >
    <Stack
      direction={{
        base: 'column',
        lg: 'row',
      }}
      align={{
        lg: 'flex-start',
      }}
      spacing={{
        base: '8',
        md: '16',
      }}
    >
      <Stack
        spacing={{
          base: '8',
          md: '10',
        }}
        flex="2"
      >
        <Heading fontSize="2xl" fontWeight="extrabold">
          Mis NFTs (3 items)
        </Heading>

        <Stack spacing="6">
          {cartData.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
        </Stack>
      </Stack>

      <Flex direction="column" align="center" flex="1">
        <CartOrderSummary />
        <HStack mt="6" fontWeight="semibold">
          <Link color={mode('blue.500', 'blue.200')}>Ver colección en OpenSea</Link>
        </HStack>
      </Flex>
    </Stack>
  </Box>
  </Box>
  </Container>
)
