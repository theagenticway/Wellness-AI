import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding database with default users...');

  try {
    // Check if users already exist
    const existingDemoUser = await prisma.user.findUnique({
      where: { email: 'demo@wellnessai.com' }
    });

    const existingProfUser = await prisma.user.findUnique({
      where: { email: 'professional@wellnessai.com' }
    });

    // Create demo member user
    if (!existingDemoUser) {
      await prisma.user.create({
        data: {
          firstName: 'Demo',
          lastName: 'Member',
          email: 'demo@wellnessai.com',
          password: await bcrypt.hash('password123', 10),
          type: 'MEMBER',
          currentPhase: 'PHASE1',
          age: 30,
          gender: 'other',
          healthGoals: ['weight_loss', 'energy_boost'],
          dietaryPreferences: ['whole_foods', 'plant_forward'],
          preferences: {
            communication: 'encouraging',
            reminders: 'gentle'
          }
        }
      });
      console.log('✅ Created demo member: demo@wellnessai.com / password123');
    } else {
      console.log('ℹ️ Demo member already exists');
    }

    // Create professional user
    if (!existingProfUser) {
      await prisma.user.create({
        data: {
          firstName: 'Dr. Sarah',
          lastName: 'Wilson',
          email: 'professional@wellnessai.com',
          password: await bcrypt.hash('password123', 10),
          type: 'PROFESSIONAL',
          currentPhase: 'PHASE1',
          age: 45,
          gender: 'female',
          healthGoals: ['coaching_others'],
          dietaryPreferences: ['evidence_based'],
          preferences: {
            communication: 'professional',
            reminders: 'minimal'
          }
        }
      });
      console.log('✅ Created professional: professional@wellnessai.com / password123');
    } else {
      console.log('ℹ️ Professional user already exists');
    }

    console.log('🎉 Database seeding completed!');
    
    // Display login credentials
    console.log('\n📋 Available Login Accounts:');
    console.log('   👤 Member: demo@wellnessai.com / password123');
    console.log('   👩‍⚕️ Professional: professional@wellnessai.com / password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedUsers };