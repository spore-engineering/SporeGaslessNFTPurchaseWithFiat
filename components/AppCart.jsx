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

import { NFT } from "../helpers/contracts"
import { OPENSEA_SINGLE_PAGE, NFT_IMAGE, NFT_DESC, NFT_TITLE, OPENSEA_COLLECTION_PAGE} from "../helpers/constants"


export const AppCart = (props) => {

  const {
    totalSupply,
    balance,
    address
  } = props

  return (
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
          Mis NFTs ({balance} item)
        </Heading>


        {address && balance && (
          <Stack spacing="6">
            <CartItem nftImage={NFT_IMAGE} nftContract={NFT.address} nftDesc={NFT_DESC} nftTitle={NFT_TITLE} nftBalance={balance} singleMarket={OPENSEA_SINGLE_PAGE} />
          </Stack>
        )}
        
      </Stack>

      <Flex direction="column" align="center" flex="1">
        <CartOrderSummary totalSupply={totalSupply} />
        <HStack mt="6" fontWeight="semibold">
      
          <Link target="_blank" href={OPENSEA_COLLECTION_PAGE} rel="noopener noreferrer" color={mode('blue.500', 'blue.200')}>Ver colección en OpenSea</Link>
        </HStack>
      </Flex>
    </Stack>
  </Box>
  </Box>
  </Container>
  )
}


