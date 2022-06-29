import { CloseButton, Flex, Link, Select, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'
import { PriceTag } from './PriceTag'
import { CartProductMeta } from './CartProductMeta'

import { FaExternalLinkAlt } from 'react-icons/fa'

export const CartItem = (props) => {
  const {
    nftImage,
    nftContract,
    nftDesc,
    nftTitle,
    nftBalance,
    singleMarket
  } = props

  const marketSingleUrl = singleMarket+"/"+nftContract+"/1"

  return (
    <Flex
      direction={{
        base: 'column',
        md: 'row',
      }}
      justify="space-between"
      align="center"
    >
      <CartProductMeta
        name={nftTitle}
        description={nftDesc}
        image={nftImage}
      />

      {/* Desktop */}
      <Flex
        width="full"
        justify="space-between"
        display={{
          base: 'none',
          md: 'flex',
        }}
      >
        <p>Cantidad: {nftBalance}</p>
        <p>Red: Rinkeby</p>
        <a target="_blank" href={marketSingleUrl} rel="noopener noreferrer"><FaExternalLinkAlt /></a>

        
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{
          base: 'flex',
          md: 'none',
        }}
      >
        <p fontSize="sm">Cantidad: {nftBalance}</p>
        <p fontSize="sm">Red: Rinkeby</p>
        <a target="_blank" href={marketSingleUrl} rel="noopener noreferrer"><FaExternalLinkAlt /></a>
      </Flex>
    </Flex>
  )
}
