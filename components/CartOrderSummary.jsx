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
  useToast
} from '@chakra-ui/react'
import * as React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { formatPrice } from './PriceTag'

import { ethers } from "ethers";

import { NFT } from "../helpers/contracts"
import { NFT_IMAGE, NFT_DESC, NFT_TITLE} from "../helpers/constants"

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

export const CartOrderSummary = (props) => {

  const {
    totalSupply
  } = props
  
  const toast = useToast()

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const purchase = async () => {

    const addrHolder = document.querySelector('#toAddress')
    const emailPayer = document.querySelector('#fromEmail')
    const amount = 24990

    try {
      ethers.utils.getAddress( addrHolder.value.toString() )
    } catch (error) {
      toast({
        title: 'Dirección Inválida',
        description: "La dirección ingresada no es válida.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false
    }

    if(!validateEmail(emailPayer.value)) {
      toast({
        title: 'E-Mail Inválido',
        description: "El E-Mail ingresado no es válido.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false
    }

    toast({
      title: 'Redirigiendo',
      description: "Dentro de unos segundos será redirigido hacia la pasarela de compra.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    const paymentObj = {
      address: addrHolder.value,
      email: emailPayer.value,
      amount: amount
    }

    const response = await fetch('https://gasless-nft.spore.engineering/api.php', {
      method: "POST",
      body: JSON.stringify(paymentObj),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      toast({
        title: 'Error Consulta',
        description: "Por favor refrescar página e intentar nuevamente.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    const url = await response.json();

    if(url) {
      window.location.href = url
    }
  }

  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Center>
      <Image
        rounded="lg"
        width="180px"
        height="180px"
        fit="cover"
        src={NFT_IMAGE}
        alt={"test"}
        draggable="false"
        loading="lazy"
      />
      </Center>
      <Heading size="md">{NFT_TITLE}</Heading>

      <Stack spacing="6">
      <OrderSummaryItem label={NFT_DESC} />
        <OrderSummaryItem label="Total Suministro" value="Ilimitado" />
        <OrderSummaryItem label="Total Comprados" value={totalSupply} />
        <OrderSummaryItem label="Compra Máxima" value="Ilimitado" />
        

        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Precio
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {formatPrice(24990) + ' CLP'}
          </Text>
        </Flex>

      </Stack>
      <Input type='text' id="toAddress" placeholder='Billetera' />
      <Input type='text' id="fromEmail" placeholder='E-mail' />
      <Button colorScheme="blue" size="lg" mt={0} fontSize="md" rightIcon={<FaArrowRight />} onClick={purchase}>
        Pagar
      </Button>
    </Stack>
  )
}
