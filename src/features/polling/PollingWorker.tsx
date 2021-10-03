import { useContractKit } from '@celo-tools/use-contractkit'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/app/hooks'
import { STATUS_POLLER_DELAY } from 'src/config/consts'
import { fetchBalances } from 'src/features/accounts/fetchBalances'
import { fetchLatestBlock } from 'src/features/blocks/fetchLatestBlock'
import { logger } from 'src/utils/logger'
import { useInterval } from 'src/utils/timeout'

export function PollingWorker() {
  const dispatch = useAppDispatch()
  const { address, kit, initialised } = useContractKit()

  useEffect(() => {
    if (!address || !kit || !initialised) return
    dispatch(fetchBalances({ address, kit })).catch((err) => {
      // TODO surface error
      logger.error('Failed to retrieve balances', err)
    })
  }, [address, kit, initialised, dispatch])

  useInterval(() => {
    if (!address || !kit || !initialised) return
    dispatch(fetchBalances({ address, kit })).catch((err) => {
      // TODO surface error
      logger.error('Failed to retrieve balances', err)
    })
    dispatch(fetchLatestBlock({ kit })).catch((err) => {
      // TODO surface error
      logger.error('Failed to retrieve latest block', err)
    })
  }, STATUS_POLLER_DELAY)

  return null
}
