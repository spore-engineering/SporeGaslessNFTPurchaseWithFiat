import {
  Button,
  Flex,
  Heading,
  Link,
  InputGroup,
  Input,
  InputLeftAddon,
  Stack,
  Image,
  Text,
  useColorModeValue as mode,
  Center,
} from '@chakra-ui/react'
import * as React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { formatPrice } from './PriceTag'

const OrderSummaryItem = (props) => {
  const { label, value, children } = props
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  )
}

export const CartOrderSummary = () => {
  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Center>
      <Image
        rounded="lg"
        width="180px"
        height="180px"
        fit="cover"
        src={"https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"}
        alt={"test"}
        draggable="false"
        loading="lazy"
      />
      </Center>
      <Heading size="md">Título Colección</Heading>

      <Stack spacing="6">
      <OrderSummaryItem label="Este espacio está dedicado para la descripción breve del NFT y su colección."/>
        <OrderSummaryItem label="Total Suministro" value={100} />
        <OrderSummaryItem label="Total Comprados" value={30} />
        <OrderSummaryItem label="Compra Máxima" value={5+" NFTs"} />
        

        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Precio
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {formatPrice(24990) + ' CLP'}
          </Text>
        </Flex>

      </Stack>
      <Input type='text' placeholder='Billetera Receptor' />
      <Button colorScheme="blue" size="lg" mt={0} fontSize="md" rightIcon={<FaArrowRight />}>
        Pagar
      </Button>
    </Stack>
  )
}
