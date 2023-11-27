import { useState } from 'react'
import { Auth0WalletConnector } from '@zerodev/wagmi'
import { PublicClient, configureChains, createConfig, useConnect, useAccount, useDisconnect, useNetwork, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { polygonMumbai } from 'wagmi/chains'

const defaultProjectId = 'b5486fa4-e3d9-450b-8428-646e757c10f6'

function WagmiAuth0Example() {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
        [polygonMumbai],
        [publicProvider()],
    )
    const config = createConfig({
        autoConnect: false,
        publicClient,
        webSocketPublicClient,
    })

    const auth0Connector = new Auth0WalletConnector({chains, options: {
        projectId: defaultProjectId,
    }})

    const ConnectButton = () => {
        const [loading, setLoading] = useState(false)
        const { connect, error, isLoading, pendingConnector } = useConnect()
        const { address, connector, isConnected } = useAccount()
        const { disconnect } = useDisconnect()
        const { chain } = useNetwork()

        const connectWallet = async () => {
            setLoading(true)
            await connect({
                connector: auth0Connector
            })
            setLoading(false)
        }


        if (isConnected) {
            return (
                <div>
                    <div>{address}</div>
                    <div>Connected to {connector?.name}</div>
                    <a href={`${chain?.blockExplorers?.default.url}/address/${address}`} target="_blank" rel="noreferrer">Explorer</a><br />
                    <button onClick={() => disconnect()}>Disconnect</button>
                </div>
            )
        }
        return (
            <button disabled={isLoading || loading} onClick={connectWallet}>
                {isLoading || loading ? 'loading...' : 'Connect to Auth0'}
            </button>
        )
  }
  return (
    <WagmiConfig config={config}>
      <ConnectButton />
    </WagmiConfig>
  )
}

export default WagmiAuth0Example;