# Biome Scribe Studio - Database Setup Guide

This guide will help you set up the Supabase database for your Biome Scribe Studio application.

## 🚀 Quick Setup

### 1. Run the Database Migrations

You have two SQL migration files ready to run:

1. **`supabase/migrations/001_initial_schema.sql`** - Creates all tables, indexes, and sample data
2. **`supabase/migrations/002_rls_policies.sql`** - Sets up Row Level Security policies

### 2. Execute the Migrations

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `001_initial_schema.sql`
4. Click **Run** to execute
5. Repeat for `002_rls_policies.sql`

#### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db reset
supabase db push
```

### 3. Verify Setup

After running the migrations, you should see these tables in your database:
- ✅ `users` - User accounts (students, teachers, admins)
- ✅ `classes` - Class groups
- ✅ `biomes` - Story environments/settings
- ✅ `literary_goals` - Educational objectives
- ✅ `stories` - Student-created stories
- ✅ `story_pages` - Individual story pages
- ✅ `user_progress` - Progress tracking
- ✅ `story_interactions` - Likes, views, comments

## 📊 Sample Data Included

The migration includes sample data to get you started:

### Sample Users
- **Teacher**: `teacher@demo.com` (Ms. Johnson)
- **Students**: 
  - `student1@demo.com` (Emma Johnson) - 275 points, Level 5
  - `student2@demo.com` (Alex Chen) - 150 points, Level 3
  - `student3@demo.com` (Maya Patel) - 400 points, Level 7

### Sample Biomes
- **Enchanted Forest** (0 points to unlock)
- **Golden Desert** (0 points to unlock)
- **Deep Ocean** (0 points to unlock)
- **Frozen Tundra** (500 points to unlock)
- **Misty Mountains** (1000 points to unlock)

### Sample Literary Goals
- Colorful Adjectives (10 points)
- Action Verbs (10 points)
- Character Dialogue (15 points)
- Setting Description (15 points)
- Plot Twist (20 points)
- Character Growth (25 points)
- And more...

### Sample Stories
- "The Lost Key of the Ancient Oak" by Emma
- "Whispers Among the Leaves" by Alex
- "The Firefly Festival" by Maya

## 🔐 Security Features

The database includes comprehensive Row Level Security (RLS) policies:

- **Students** can only see their own stories and published stories from classmates
- **Teachers** can view all stories from students in their class
- **Admins** can manage biomes and literary goals
- **Users** can only modify their own data

## 🛠️ Next Steps

After setting up the database:

1. **Update your environment variables** with Supabase credentials
2. **Test the connection** by running your React app
3. **Connect your existing components** to the database
4. **Add authentication** (Supabase Auth)
5. **Implement API functions** for story management

## 🔧 Environment Variables

Make sure you have these in your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## 📝 Database Functions Available

The migration includes helpful database functions:

- `get_user_unlocked_biomes(user_uuid)` - Get biomes a user can access
- `can_unlock_biome(user_uuid, biome_uuid)` - Check if user can unlock a biome
- `award_literary_goal_points(user_uuid, goal_uuid)` - Award points for completing goals

## 🐛 Troubleshooting

### Common Issues:

1. **Permission Denied**: Make sure RLS policies are applied correctly
2. **Foreign Key Errors**: Ensure tables are created in the right order
3. **Type Errors**: Verify your TypeScript types match the database schema

### Reset Database:
If you need to start over:
```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS story_interactions CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS story_pages CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS literary_goals CASCADE;
DROP TABLE IF EXISTS biomes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS classes CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS story_status CASCADE;
DROP TYPE IF EXISTS goal_type CASCADE;
DROP TYPE IF EXISTS difficulty_level CASCADE;
DROP TYPE IF EXISTS interaction_type CASCADE;
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript Types](https://supabase.com/docs/guides/api/generating-types)

---

**Ready to start building!** 🎉 Your database is now set up with all the tables, sample data, and security policies needed for Biome Scribe Studio.