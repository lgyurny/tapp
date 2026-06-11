// src/hooks/useTonContract.js
// Hook para interactuar con smart contracts en TON Blockchain.

import { useState, useCallback } from 'react'
import { useTonConnectUI, useTonAddress, useTonWallet } from '@tonconnect/ui-react'
import { Address, toNano, beginCell } from '@ton/ton'

export function useTonContract() {
  const [tonConnectUI]  = useTonConnectUI()
  const wallet          = useTonWallet()
  const address         = useTonAddress()
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState(null)
  const [lastTx,  setLastTx]    = useState(null)

  // ── Enviar TON nativo ──────────────────────────────────────
  const sendTon = useCallback(async (toAddress, amountTon, comment = '') => {
    if (!wallet) throw new Error('Wallet no conectada')

    setLoading(true)
    setError(null)

    try {
      const payload = comment
        ? beginCell()
            .storeUint(0, 32)              // op_code 0 = comentario de texto
            .storeStringTail(comment)
            .endCell()
            .toBoc()
            .toString('base64')
        : undefined

      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 360, // válida 6 minutos
        messages: [{
          address: toAddress,
          amount:  toNano(amountTon).toString(),
          ...(payload && { payload }),
        }],
      }

      const result = await tonConnectUI.sendTransaction(tx)
      setLastTx(result)
      return result

    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [wallet, tonConnectUI])

  // ── Interactuar con un contrato (enviar mensaje con op_code) ──
  const callContract = useCallback(async (contractAddress, opCode, amountTon = '0.05') => {
    if (!wallet) throw new Error('Wallet no conectada')

    setLoading(true)
    setError(null)

    try {
      const payload = beginCell()
        .storeUint(opCode, 32)             // op_code del método del contrato
        .storeAddress(Address.parse(wallet.account.address))
        .endCell()
        .toBoc()
        .toString('base64')

      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [{
          address: contractAddress,
          amount:  toNano(amountTon).toString(),
          payload,
        }],
      }

      const result = await tonConnectUI.sendTransaction(tx)
      setLastTx(result)
      return result

    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [wallet, tonConnectUI])

  return {
    address,
    wallet,
    isConnected: !!wallet,
    loading,
    error,
    lastTx,
    sendTon,
    callContract,
  }
}
