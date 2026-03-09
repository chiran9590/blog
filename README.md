# Blog Platform

A modern full-stack blog website built with React, Tailwind CSS, and Supabase.

## Features

- **Authentication**: User signup, login, and profile management with Supabase Auth
- **Blog Management**: Create, edit, delete, and publish blog posts
- **Rich Content**: Markdown support for blog content
- **Interactions**: Like and comment system
- **Search & Filter**: Search posts by title/content and filter by tags
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first responsive layout
- **User Dashboard**: Manage posts and view statistics
- **Profile Pages**: View user profiles and their posts

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase
- **State Management**: React Context API
- **Routing**: React Router
- **Markdown**: react-markdown with remark-gfm
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd blog
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `database-schema.sql` and run it
4. Go to Settings > API and copy your Project URL and anon key

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth, Theme)
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API services
├── supabase/           # Supabase client
└── utils/              # Utility functions
```

## Database Schema

### Tables

- **users**: User profiles and authentication data
- **posts**: Blog posts with metadata
- **comments**: Post comments
- **likes**: Post likes

### Key Features

- Row Level Security (RLS) policies for data protection
- Automatic timestamps with triggers
- Storage bucket for cover images
- Proper indexing for performance

## Deployment

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## Usage

### Creating a Post

1. Sign up or log in to your account
2. Navigate to Dashboard
3. Click "Create Post"
4. Fill in the title, description, and content
5. Add tags and cover image (optional)
6. Save as draft or publish

### Managing Posts

- View all your posts in the Dashboard
- Edit existing posts
- Delete posts
- Toggle publish status
- View statistics (likes, comments)

### User Features

- View and edit profile
- Search and filter posts
- Like and comment on posts
- Dark mode toggle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
