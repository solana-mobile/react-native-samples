import { db } from '../src/db/database'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

const dummyUsersData = [
  { pubkey: '7WKaHxMy54Mn5JPpETqiwwkcyJLmkcsrjwfvUnDqPpdN', name: 'Alice' },
  { pubkey: '3Q9PWRpFA6mavhMf2J49sYJvBP1dEbBrZT8GRu8kSK9i', name: 'Bob' },
  { pubkey: 'MbWYUcFtq7Bn5YWuYRdguP1rj8jCpX99nHJF3x83FQt', name: 'Charlie' },
]

async function seedDatabase() {
  try {
    await db.connect()
    console.log('\n Seeding database with dummy users...\n')

    // Create dummy users
    console.log('Creating dummy users...')
    const users: Array<{ id: string; pubkey: string; address: string; name: string }> = []
    const now = new Date().toISOString()

    for (const userData of dummyUsersData) {
      // Check if user already exists
      const existingUser = await db.get<any>(
        'SELECT * FROM users WHERE pubkey = ? OR address = ?',
        [userData.pubkey, userData.pubkey]
      )

      if (existingUser) {
        console.log(`   ⏭️  User "${userData.name}" already exists, skipping...`)
        users.push(existingUser)
        continue
      }

      const userId = uuidv4()
      await db.run(
        'INSERT INTO users (id, pubkey, address, name, is_profile_complete, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, userData.pubkey, userData.pubkey, userData.name, 1, now, now]
      )

      users.push({ id: userId, pubkey: userData.pubkey, address: userData.pubkey, name: userData.name })
      console.log(`   ✅ Created user "${userData.name}"`)
    }

    console.log(`\n✅ Database seeding complete! 🎉\n`)
    console.log('Summary:')
    console.log(`- ${users.length} users in database`)
    console.log('\nYou can now use these dummy users to:')
    console.log('- Add them as friends in the app')
    console.log('- Create pots and add them as contributors')
    console.log('- Test the social features\n')

  } catch (error) {
    console.error('\n❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await db.close()
  }
}

seedDatabase()
