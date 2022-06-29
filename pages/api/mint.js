// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');
const { ethers } = require('ethers');

import { NFT } from "../../helpers/contracts"
import { NFT_KEY} from "../../helpers/constants"

export default async function handler(req, res) {

  const paymentObj = {
    token: req.body.token
  }

  const response = await fetch('https://gasless-nft.spore.engineering/ask.php', {
      method: "POST",
      body: JSON.stringify(paymentObj),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      console.log(url, `Error: ${response.status}`)
    }

    const resp = await response.json()

    if(resp['payed'] && resp['address']) {
      const credentials = { apiKey: process.env.RELAY_KEY, apiSecret: process.env.RELAY_SECRET }
      const relayProvider = new DefenderRelayProvider(credentials)
      const relaySigner = new DefenderRelaySigner(credentials, relayProvider, { speed: 'fast' })

      const nftContract = new ethers.Contract(NFT.address, NFT.abi, relaySigner)
      const tx = await nftContract.mint(resp['address'], NFT_KEY, 1, "0x0000")
      const mined = await tx.wait()
    }

  res.status(200).json(resp['payed'])
}
