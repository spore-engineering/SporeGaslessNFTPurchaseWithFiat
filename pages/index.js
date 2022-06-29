import Head from 'next/head'
import { AppCart } from '../components/AppCart'
import { Footer } from '../components/Footer'

import React, { useCallback, useEffect, useState } from 'react'
import {useRouter} from "next/router"
import { ethers } from "ethers"
import Web3Modal from "web3modal"

import { FiMenu } from 'react-icons/fi'
import { Logo } from '../components/Logo'

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'

import { NFT } from "../helpers/contracts"
import { PROVIDER_OPTIONS, RINKEBY_PROVIDER, NFT_KEY} from "../helpers/constants"

let web3Modal

if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        cacheProvider: true,
        PROVIDER_OPTIONS,
    })
}

const provider = new ethers.providers.JsonRpcProvider(RINKEBY_PROVIDER)
const signer = provider.getSigner()

export default function Home() {

  const toast = useToast()
  const toastIdRef = React.useRef()

  const { query } = useRouter()
  
  const [injectedProvider, setInjectedProvider] = useState(provider)
  const [injectedSigner, setInjectedSigner] = useState(signer)
  const [address, setAddress] = useState()
  
  const [token, setToken] = useState()
  const [tokenRes, setTokenRes] = useState()
  const [tokenStatus, setTokenStatus] = useState()
  const [tokenPayed, setTokenPayed] = useState()

  //user balances
  const [userNFTBalance, setUserNFTBalance] = useState(0)
  
  //global balances
  const [totalNFTSupply, setTotalNFTSupply] = useState()

  //contracts
  const [nftContract, setNftContract] = useState()

  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  })

  const updateUserBalances = async (address) => {
    const nft = await nftContract.balanceOf(address, NFT_KEY)

    setUserNFTBalance(parseInt(nft))

    //console.log("user nft balance", parseInt(nft))
  }

  const updateBalances = async () => {
    const nftSupply = await nftContract.totalSupply(NFT_KEY)
    setTotalNFTSupply(parseInt(nftSupply))
  }

  const loadContracts = async () => {
    const nftContract = new ethers.Contract(NFT.address, NFT.abi, injectedProvider)
 
    setNftContract(nftContract)
  }

  const connect = useCallback(async () => {
    try {
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const net = await provider.getNetwork()

        connection.on("chainChanged", chainId => {
            if(chainId != 4) {
              toast({
                title: 'Red Equivocada',
                description: "Por favor conectarse a Rinkeby.",
                status: 'error',
                duration: 6000,
                isClosable: true,
              })
            }
        })
      
        connection.on("accountsChanged", (accounts) => {
            setAddress(accounts[0])
            setUserNFTBalance(0)
        });
      
        connection.on("disconnect", (code, reason) => {
            disconnect()
        });

        if(net.chainId == 4) {
          setInjectedProvider(provider)
          setInjectedSigner(signer)
        }
        else{
          toast({
            title: 'Red Equivocada',
            description: "Por favor conectarse a Rinkeby.",
            status: 'error',
            duration: 6000,
            isClosable: true,
          })
        }

        setAddress(address)
    } catch (error) {
      toast({
        title: 'Error Conexión',
        description: "Por favor actualizar la página e intentar nuevamente.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }
  }, [])

  const disconnect = useCallback(async function () {
    setAddress('')
    setInjectedProvider('')
    setInjectedSigner('')
    await web3Modal.clearCachedProvider()
    location.reload()
  }, [injectedProvider])

  const changeStatePayed = async () => {

    const paymentObj = {
      token: token
    }

    toastIdRef.current = toast({
      title: 'Confirmando Transacción',
      description: "Dentro de unos segundos su NFT estará disponible.",
      status: 'info',
      duration: 25000,
      isClosable: true,
    })

    const response = await fetch('https://gasless-nft.spore.engineering/api/mint', {
      method: "POST",
      body: JSON.stringify(paymentObj),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current)
      }

      toast({
        title: 'Transacción no Pagada',
        description: "Por favor intentar nuevamente.",
        status: 'error',
        duration: 14000,
        isClosable: true,
      })
      return false
    }

    const resp = await response.json()

    if(!resp) {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current)
      }

      toast({
        title: 'Transacción no Pagada',
        description: "Por favor intentar nuevamente.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })

      localStorage.setItem(token, "unpaid")

      return false
    }

    if (toastIdRef.current) {
      toast.close(toastIdRef.current)
    }

    toast({
      title: 'NFT Minted!',
      description: "El NFT ha sido comprado con éxito.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })

    if(address) {
      updateUserBalances(address)
    }

    updateBalances()

    localStorage.setItem(token, "minted")
    
  }

  useEffect(() => {
    if(query.token) {
      setToken(query.token)
      if(!localStorage.getItem(query.token) || localStorage.getItem(query.token).length == 0) {
        localStorage.setItem(query.token, "not_minted")
      }
    }
    if(query.res) {
      setTokenRes(query.res)
    }
    if(query.status) {
      setTokenStatus(query.status)
    }
    if(query.payed) {
      setTokenPayed(query.payed)
    }
  }, [query.token, query.res, query.status, query.payed])

  useEffect(() => {
    if(token) {
      if(localStorage.getItem(token) == "not_minted") {
        changeStatePayed()
      }
    }
  }, [token])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  useEffect(() => {
    if(injectedProvider) {
      loadContracts()
    }
  }, [injectedProvider, injectedSigner])

  useEffect(() => {
    if(nftContract) {
      updateBalances()
    }
  }, [nftContract])

  useEffect(() => {
    if(address) {
      updateUserBalances(address)
    }
  }, [address])

  useEffect(() => {
    const interval = setInterval(async () => {
      if(address) {
        updateUserBalances(address)
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [address])

  return (
    <>
      <Head>
        <title>Módulo Venta NFT Gasless</title>
        <meta name="description" content="Módulo Venta NFT Gasless" />
        <link rel="shortcut icon" href="icon.png" />
      </Head>

      <Box
        as="section"
        pb={{
          base: '12',
          md: '10',
        }}
      >
        <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
          <Container
            py={{
              base: '4',
              lg: '5',
            }}
          >
            <HStack spacing="10" justify="space-between">
              <Logo />
              {isDesktop ? (
                <Flex justify="space-between" flex="1">
                  <ButtonGroup variant="link" spacing="8">
                    {['Módulo Venta NFT Gasless'].map((item) => (
                      <Button key={item}>{item}</Button>
                    ))}
                  </ButtonGroup>
                  <HStack spacing="3">
                  {address ? (
                      <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
                  ) : (
                      <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
                  )}
                  </HStack>
                </Flex>
              ) : (
                address ? (
                  <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
                ) : (
                    <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
                )
              )}
            </HStack>
          </Container>
        </Box>
      </Box>

      <AppCart totalSupply={totalNFTSupply} address={address} balance={userNFTBalance} />

      <Footer />


     
    </>
  )
}
