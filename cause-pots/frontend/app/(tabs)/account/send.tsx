import { useRouter } from 'expo-router'
import { useMobileWalletAdapter } from '@wallet-ui/react-native-web3js'
import { AccountFeatureSend } from '@/components/account/account-feature-send'
import { AppView } from '@/components/app-view'

export default function Send() {
  const router = useRouter()
  const { account } = useMobileWalletAdapter()

  if (!account) {
    return router.replace('/(tabs)/account')
  }

  return (
    <AppView style={{ flex: 1, padding: 16 }}>
      <AccountFeatureSend address={account.publicKey} />
    </AppView>
  )
}
