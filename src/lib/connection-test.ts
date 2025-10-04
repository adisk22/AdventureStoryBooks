import { supabase } from '@/integrations/supabase/client';

// Simple connection test using existing tables
export const testSupabaseKeys = async () => {
  console.log('🔑 Testing Supabase connection with existing tables...');
  
  // Test 1: Try to access your existing tables
  try {
    const { data, error } = await supabase
      .from('story_interactions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('📊 Story interactions data:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed with exception:', error);
    return false;
  }
};

// Test 2: Check if we can access biomes table
export const testBiomesAccess = async () => {
  console.log('🌍 Testing biomes table access...');
  
  try {
    const { data: biomes, error } = await supabase
      .from('biomes')
      .select('id, name, unlock_points, is_active')
      .limit(5);
    
    if (error) {
      console.error('❌ Biomes access failed:', error);
      return false;
    }
    
    console.log('✅ Biomes table accessible');
    console.log('📋 Biomes data:', biomes);
    return true;
    
  } catch (error) {
    console.error('❌ Biomes access failed with exception:', error);
    return false;
  }
};

// Test 3: Check users table
export const testUsersAccess = async () => {
  console.log('👥 Testing users table access...');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, display_name, role')
      .limit(3);
    
    if (error) {
      console.log('⚠️ Users access restricted (might be RLS):', error.message);
      return false;
    }
    
    console.log('✅ Users table accessible');
    console.log('👤 Users data:', users);
    return true;
    
  } catch (error) {
    console.log('⚠️ Users access failed:', error);
    return false;
  }
};

// Main test function
export const runAllConnectionTests = async () => {
  console.log('🚀 Running Supabase connection tests...');
  console.log('='.repeat(50));
  
  // Test 1: Basic connection
  const connectionSuccess = await testSupabaseKeys();
  
  // Test 2: Biomes access
  const biomesSuccess = await testBiomesAccess();
  
  // Test 3: Users access
  const usersSuccess = await testUsersAccess();
  
  console.log('='.repeat(50));
  
  if (connectionSuccess && biomesSuccess) {
    console.log('✅ Core connection tests passed');
    return true;
  } else {
    console.log('❌ Some core tests failed');
    return false;
  }
};