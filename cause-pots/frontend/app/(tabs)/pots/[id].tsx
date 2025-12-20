import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { AddContributorModal } from '@/components/pots/AddContributorModal'
import { ContributeModal } from '@/components/pots/ContributeModal'
import { ContributionList } from '@/components/pots/ContributionList'
import { ContributorList } from '@/components/pots/ContributorList'
import { EditPotModal } from '@/components/pots/EditPotModal'
import { PotActions } from '@/components/pots/PotActions'
import { PotHeader } from '@/components/pots/PotHeader'
import { PotInfoCard } from '@/components/pots/PotInfoCard'
import { PotProgressCard } from '@/components/pots/PotProgressCard'
import { PotTabs } from '@/components/pots/PotTabs'
import { useMobileWalletAdapter } from '@wallet-ui/react-native-web3js'
import { useToast } from '@/components/toast/toast-provider'
import { Colors } from '@/constants/colors'
import { PotCategory, useAppStore } from '@/store/app-store'
import { usePotProgram } from '@/hooks/use-pot-program'
import { useCurrencyConversion } from '@/hooks/use-currency-conversion'
import { ellipsify } from '@/utils/ellipsify'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'

export default function PotDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  const { account } = useMobileWalletAdapter()
  const { getPotById, addContribution, releasePot, updatePot, addContributorToPot, friends, fetchActivities } = useAppStore()
  const { showToast } = useToast()
  const {
    contribute: contributeOnChain,
    signRelease: signReleaseOnChain,
    releaseFunds: releaseFundsOnChain,
    isLoading: isBlockchainLoading
  } = usePotProgram()
  const { usdToSol, solPrice } = useCurrencyConversion()
  const pot = id ? getPotById(id) : null

  const [showContributeModal, setShowContributeModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddContributorModal, setShowAddContributorModal] = useState(false)
  const [contributionAmount, setContributionAmount] = useState('')
  const [contributionCurrency, setContributionCurrency] = useState<'SOL' | 'USDC'>('SOL')
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [activeTab, setActiveTab] = useState<'contributions' | 'contributors'>('contributions')

  if (!pot) {
    return (
      <AppPage>
        <AppView style={styles.emptyContainer}>
          <AppText>Pot not found</AppText>
          <TouchableOpacity onPress={() => router.back()}>
            <AppText style={[styles.backButton, { color: colors.accentGreen }]}>Go Back</AppText>
          </TouchableOpacity>
        </AppView>
      </AppPage>
    )
  }

  if (!account) {
    return (
      <AppPage>
        <AppView style={styles.emptyContainer}>
          <AppText>Please connect your wallet</AppText>
        </AppView>
      </AppPage>
    )
  }

  const userAddress = account.publicKey.toBase58()
  const totalContributed = pot.contributions.reduce((sum, c) => sum + c.amount, 0)
  const progress = Math.min((totalContributed / pot.targetAmount) * 100, 100)
  const isTargetReached = progress >= 100
  const isReleaseable = isTargetReached && !pot.isReleased
  const isContributor = pot.contributors.includes(userAddress) || pot.creatorAddress === userAddress

  const handleContribute = async () => {
    const amount = parseFloat(contributionAmount)
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0')
      return
    }

    const currency = pot.currency

    try {
      // Use the stored pot pubkey from blockchain
      const potPubkey = pot.potPubkey || pot.id

      if (!pot.potPubkey) {
        Alert.alert('Error', 'Pot not yet on blockchain. Please try again later.')
        return
      }

      // Convert to SOL if currency is USDC
      // Blockchain always uses SOL, USDC is just for display
      const amountInSol = currency === 'USDC' ? usdToSol(amount) : amount

      // Contribute on blockchain (always in SOL)
      const signature = await contributeOnChain({
        potPubkey,
        amount: amountInSol,
      })

      // Update local store with display amount
      await addContribution({
        potId: pot.id,
        contributorAddress: userAddress,
        amount, // Store display amount
        currency,
        transactionSignature: signature, // Store blockchain tx signature
      })

      // Refetch activities to include the new contribution with tx signature
      await fetchActivities(userAddress)

      setContributionAmount('')
      setShowContributeModal(false)
      showToast({
        title: 'Contribution sent',
        message: currency === 'USDC'
          ? `+$${amount.toFixed(2)} (≈${amountInSol.toFixed(4)} SOL) into ${pot.name}`
          : `+${amount.toFixed(4)} ${currency} into ${pot.name}`,
        type: 'success',
      })
    } catch (error) {
      console.error('Error contributing:', error)
      showToast({
        title: 'Contribution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      })
    }
  }

  const handleSignRelease = async () => {
    try {
      const potPubkey = pot.potPubkey || pot.id

      if (!pot.potPubkey) {
        Alert.alert('Error', 'Pot not yet on blockchain. Please try again later.')
        return
      }

      // Sign release on blockchain
      await signReleaseOnChain(potPubkey)

      showToast({
        title: 'Release signed',
        message: `Your signature has been recorded`,
        type: 'success',
      })
    } catch (error) {
      console.error('Error signing release:', error)
      showToast({
        title: 'Sign failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      })
    }
  }

  const handleRelease = () => {
    // Validation before attempting release
    const now = Date.now()
    const unlockTime = pot.unlockTimestamp ? pot.unlockTimestamp * 1000 : new Date(pot.targetDate).getTime()
    const hasUnlockTimePassed = now >= unlockTime

    if (!hasUnlockTimePassed) {
      const unlockDate = new Date(unlockTime).toLocaleDateString()
      Alert.alert(
        'Cannot Release Yet',
        `This pot cannot be released until ${unlockDate}. Please wait until the unlock date has passed.`,
        [{ text: 'OK' }]
      )
      return
    }

    if (pot.isReleased) {
      Alert.alert('Already Released', 'This pot has already been released.', [{ text: 'OK' }])
      return
    }

    // Check if enough signatures (if multi-sig)
    const currentSignatures = pot.signatures?.length || 0
    const requiredSignatures = pot.signersRequired || 1
    if (currentSignatures < requiredSignatures) {
      Alert.alert(
        'Not Enough Signatures',
        `This pot requires ${requiredSignatures} signature(s) but only has ${currentSignatures}. Please get more contributors to sign.`,
        [{ text: 'OK' }]
      )
      return
    }

    Alert.alert(
      'Release Pot',
      `Funds will be released to the pot creator (${ellipsify(pot.creatorAddress, 8)}). Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release',
          onPress: async () => {
            try {
              const potPubkey = pot.potPubkey || pot.id
              const recipient = pot.creatorAddress // Funds go to the creator

              if (!pot.potPubkey) {
                Alert.alert('Error', 'Pot not yet on blockchain. Please try again later.')
                return
              }

              // Release funds on blockchain
              const signature = await releaseFundsOnChain({
                potPubkey,
                recipient,
              })

              // Update local store
              await releasePot(pot.id, userAddress, signature)

              // Refetch activities to include the release activity with tx signature
              await fetchActivities(userAddress)

              showToast({
                title: 'Pot released',
                message: `Funds sent to creator ${ellipsify(pot.creatorAddress, 8)}`,
                type: 'success',
              })
            } catch (error) {
              console.error('Error releasing pot:', error)
              showToast({
                title: 'Release failed',
                message: error instanceof Error ? error.message : 'Unknown error',
                type: 'error',
              })
            }
          },
        },
      ]
    )
  }

  const handleEdit = (name: string, description: string) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a pot name')
      return
    }

    updatePot(pot.id, {
      name: name.trim(),
      description: description.trim() || undefined,
    })

    setShowEditModal(false)
    setEditName('')
    setEditDescription('')
    showToast({
      title: 'Pot updated',
      message: 'Details saved for everyone',
      type: 'info',
    })
  }

  const handleAddContributor = (friendAddress: string) => {
    if (pot.contributors.includes(friendAddress)) {
      showToast({
        title: 'Already in the pot',
        message: 'This contributor is already part of the group',
        type: 'warning',
      })
      return
    }

    addContributorToPot(pot.id, friendAddress)
    setShowAddContributorModal(false)
    const friendName =
      friends.find((f) => f.address === friendAddress)?.displayName || ellipsify(friendAddress, 6)
    showToast({
      title: 'Contributor added',
      message: `${friendName} can now pitch in`,
      type: 'success',
    })
  }

  const getContributorName = useCallback(
    (address: string) => {
      if (address === pot.creatorAddress) return 'Creator'
      const friend = friends.find((f) => f.address === address)
      return friend?.displayName || ellipsify(address, 8)
    },
    [pot.creatorAddress, friends]
  )

  const getCategoryIcon = useCallback((category: PotCategory) => {
    switch (category) {
      case 'Goal': return 'flag'
      case 'Emergency': return 'emergency'
      case 'Bills': return 'receipt'
      case 'Events': return 'event'
      case 'Others': return 'category'
      default: return 'savings'
    }
  }, [])

  const getCategoryColor = useCallback((category: PotCategory) => {
    switch (category) {
      case 'Goal': return '#22E1A2'
      case 'Emergency': return '#FF6B6B'
      case 'Bills': return '#4ECDC4'
      case 'Events': return '#FFD93D'
      case 'Others': return '#95A5A6'
      default: return colors.accentGreen
    }
  }, [colors.accentGreen])

  return (
    <AppPage>
      <PotHeader
        potName={pot.name}
        colors={colors}
        onBack={() => router.back()}
        onEdit={() => {
          setEditName(pot.name)
          setEditDescription(pot.description || '')
          setShowEditModal(true)
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {pot.description && (
          <AppText style={[styles.description, { color: colors.textSecondary }]}>{pot.description}</AppText>
        )}

        <PotProgressCard
          progress={progress}
          totalContributed={totalContributed}
          targetAmount={pot.targetAmount}
          currency={pot.currency}
          colors={colors}
        />

        <PotInfoCard pot={pot} colors={colors} getCategoryIcon={getCategoryIcon} getCategoryColor={getCategoryColor} />

        <PotActions
          isContributor={isContributor}
          isReleased={pot.isReleased}
          isReleaseable={isReleaseable}
          isTargetReached={isTargetReached}
          progress={progress}
          colors={colors}
          onContribute={() => {
            setContributionCurrency(pot.currency)
            setShowContributeModal(true)
          }}
          onRelease={handleRelease}
          onAddContributor={() => setShowAddContributorModal(true)}
        />

        <PotTabs
          activeTab={activeTab}
          contributionsCount={pot.contributions.length}
          contributorsCount={pot.contributors.length}
          colors={colors}
          onTabChange={setActiveTab}
        />

        {activeTab === 'contributions' && (
          <ContributionList
            contributions={pot.contributions}
            getContributorName={getContributorName}
            colors={colors}
          />
        )}

        {activeTab === 'contributors' && (
          <ContributorList
            contributors={pot.contributors}
            creatorAddress={pot.creatorAddress}
            getContributorName={getContributorName}
            colors={colors}
          />
        )}
      </ScrollView>

      <ContributeModal
        visible={showContributeModal}
        amount={contributionAmount}
        currency={pot.currency}
        potName={pot.name}
        colors={colors}
        onClose={() => {
          setShowContributeModal(false)
          setContributionAmount('')
        }}
        onAmountChange={setContributionAmount}
        onSubmit={handleContribute}
      />

      <EditPotModal
        visible={showEditModal}
        name={editName || pot.name}
        description={editDescription || pot.description || ''}
        colors={colors}
        onClose={() => {
          setShowEditModal(false)
          setEditName('')
          setEditDescription('')
        }}
        onNameChange={setEditName}
        onDescriptionChange={setEditDescription}
        onSubmit={() => handleEdit(editName || pot.name, editDescription || pot.description || '')}
      />

      <AddContributorModal
        visible={showAddContributorModal}
        friends={friends}
        existingContributors={pot.contributors}
        colors={colors}
        onClose={() => setShowAddContributorModal(false)}
        onSelectFriend={handleAddContributor}
      />
    </AppPage>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
})
