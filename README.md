# 🎯 Kanban Task Management App

A modern, responsive Kanban board application built with Next.js 15, React 19, and Material-UI for efficient task and subtask management.

![Kanban App Preview](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5-purple?style=for-the-badge&logo=mui)

---

## ⚡ Local Development

- **No separate backend server is required.**
- All API routes are handled by Next.js (see `/src/app/api`).
- The app uses a local JSON file (`db.json`) for data storage in development.
- **Just run the Next.js dev server:**

  ```bash
  npm install
  npm run dev
  # or
  yarn dev
  ```

- Open your browser at [http://localhost:3000](http://localhost:3000)

**To run the app (and API) on port 4000:**

```bash
npm run start:api -- -p 4000
# or
yarn start:api --port 4000
```


**Local API:**

- When you run the app locally, the API routes are available at `/api` (e.g., `http://localhost:3000/api` or `http://localhost:4000/api`).
- You do **NOT** need to run any separate API or backend server. All backend logic is handled by Next.js API routes automatically.

**Note:**

- The `db.json` file is used for local development only. Changes you make are saved to this file.
- In production (e.g., Netlify), the app uses in-memory storage (data resets on every redeploy or cold start).

---

## 🚀 Features

### 🎨 **Modern Design**

- **Glassmorphism UI**: Beautiful frosted glass effects
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Elegant transitions and hover effects

### 📋 **Task Management**

- **Kanban Board**: Four columns (Backlog, In Progress, Review, Done)
- **Drag & Drop**: Move tasks between columns seamlessly with optimized performance
- **Add/Edit/Delete**: Full CRUD operations for tasks
- **Search**: Find tasks quickly with real-time search
- **Infinite Scroll**: Load more tasks as you scroll

### 🔧 **Subtask System**

- **Task Details**: Click any task to view and manage subtasks
- **Subtask Board**: Three-column layout (To Do, Doing, Done)
- **Drag & Drop**: Move subtasks between status columns
- **Pagination**: Navigate through subtasks efficiently
- **Search**: Filter subtasks by title

### 📱 **Responsive Features**

- **Mobile-First**: Optimized for touch interactions
- **Adaptive Layout**: Different layouts for each screen size
- **Touch-Friendly**: Proper touch targets and gestures
- **Performance**: Optimized for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kanban-todo
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run start:api
   # or
   yarn start:api
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

### **Netlify Deployment (Recommended)**

This application is configured for deployment on Netlify with the following setup:

1. **Build Configuration**

   - The build process automatically copies the database file to the root directory
   - Next.js 15 API routes handle all backend functionality
   - No external server required

2. **Environment Variables**

   - `NEXT_PUBLIC_API_BASE_URL`: Set to `/api` for production (default)
   - The application uses relative API paths for deployment

3. **Database**

   - Uses a JSON file-based database (`tools/db.json`) **for local development only**
   - **In production, data is stored in memory and resets on every redeploy or cold start**
   - No external database required

4. **Deploy to Netlify**


 https://kanban-assessment-todo.netlify.app/
   ```

### **Other Deployment Options**

- **Vercel**: Similar to Netlify, works out of the box
- **Railway**: Supports Node.js applications
- **Heroku**: Requires Procfile configuration

---

## 📖 How to Use

### 🏠 **Main Kanban Board**

#### **Viewing Tasks**

- The main board shows all your tasks organized in four columns
- Each column represents a different stage: Backlog, In Progress, Review, Done
- Tasks display their title, description, and current status

#### **Adding Tasks**

1. Click the **+** button in any column header
2. Fill in the task details:
   - **Title**: Required
   - **Description**: Required
   - **Column**: Choose initial column (for new tasks)
   - **Status**: Set task status
3. Click **Create** to save

#### **Editing Tasks**

1. Click the **edit** icon (✏️) on any task card
2. Modify the task details
3. Click **Update** to save changes

#### **Moving Tasks**

- **Drag and drop** tasks between columns
- Tasks automatically update their status when moved
- Visual feedback shows valid drop zones

#### **Deleting Tasks**

1. Click the **edit** icon on a task
2. Click the **Delete** button in the modal
3. Confirm the deletion

#### **Searching Tasks**

- Use the search functionality to find specific tasks
- Search works across task titles and descriptions
- Results update in real-time

### 📝 **Task Details & Subtasks**

#### **Accessing Task Details**

1. Click on any task card to open the task details page
2. View the task title, description, and current column
3. Manage subtasks in the three-column board

#### **Managing Subtasks**

- **Add Subtasks**: Click **+** in any subtask column
- **Edit Subtasks**: Click the edit icon on subtask cards
- **Move Subtasks**: Drag and drop between To Do, Doing, Done
- **Delete Subtasks**: Use the delete button in edit mode

#### **Subtask Features**

- **Pagination**: Navigate through subtasks with page controls
- **Search**: Filter subtasks by title
- **Status Management**: Track progress with visual status indicators

#### **Main Task Status**

- **Current Column**: See which column the main task is in
- **Move to Column**: Change the main task's column from the details page
- **Sync**: Changes reflect immediately on the main board

### 🎛️ **Navigation & Settings**

#### **Navigation**

- **Dashboard**: Main Kanban board (home page)
- **Mobile Menu**: Hamburger menu for mobile navigation
- **Theme Toggle**: Switch between light and dark modes

#### **Responsive Design**

- **Mobile**: Single column layout, touch-optimized
- **Tablet**: 2-3 column grid layout
- **Desktop**: Horizontal scrolling with fixed columns

## 🛠️ Technical Stack

### **Frontend**

- **Next.js 15**: React framework with App Router
- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Material-UI 5**: Component library and theming
- **@dnd-kit/core**: Modern drag and drop functionality
- **React Query**: Data fetching and caching

### **State Management**

- **Redux Toolkit**: Global state management
- **React Query**: Server state management
- **Context API**: Theme management

### **Backend**

- **Next.js 15 API Routes**: Built-in API endpoints
- **JSON File Database**: Local data persistence
- **RESTful API**: Standard HTTP endpoints
- **CORS Support**: Cross-origin request handling

### **Styling**

- **Material-UI**: Component styling
- **CSS-in-JS**: Dynamic styling with theme support
- **Responsive Design**: Mobile-first approach
- **Glassmorphism**: Modern visual effects

## 📁 Project Structure

```
kanban-todo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── tasks/             # Task details pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Board.tsx          # Main Kanban board
│   │   ├── Column.tsx         # Kanban column
│   │   ├── TaskCard.tsx       # Task card component
│   │   ├── TaskModal.tsx      # Task edit modal
│   │   ├── NavBar.tsx         # Navigation bar
│   │   └── ...                # Other components
│   ├── contexts/              # React contexts
│   ├── features/              # Feature components
│   ├── lib/                   # API utilities
│   ├── providers/             # App providers
│   └── store/                 # Redux store
├── tools/                     # Development tools
│   ├── db.json               # Mock database
│   └── server.js             # JSON server
└── public/                   # Static assets
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory (optional):

```env
NEXT_PUBLIC_API_BASE_URL=/api
```

**Note**: The app uses relative API paths by default, so this environment variable is optional.

### **API Configuration**

The app uses Next.js 15 API routes for the backend. All API endpoints are served from `/api/*` and handle:

- Task CRUD operations
- Column management
- CORS requests
- Data persistence to JSON file

## 🎨 Customization

### **Themes**

The app supports both light and dark themes:

- Toggle theme using the button in the navigation bar
- Theme preference is saved in localStorage
- All components adapt to the current theme

### **Colors**

Customize the color scheme by modifying the theme configuration in:

- `src/app/ThemeProvider.tsx`
- `src/contexts/ThemeContext.tsx`

### **Styling**

Modify the glassmorphism effects and styling in:

- `src/app/globals.css`
- Individual component `sx` props

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **@dnd-kit/core** for smooth drag and drop functionality
- **Next.js** for the excellent React framework
- **React 19** for the modern React features

---

**Happy Task Management! 🎉**

For questions or support, please open an issue in the repository.

## 📱 Mobile Deployment & Troubleshooting

### Mobile-Specific Optimizations

The app includes several mobile optimizations:

- **Touch-Friendly Interface**: All buttons and interactive elements are at least 44px
- **Responsive Design**: Adapts to all screen sizes
- **Touch Drag & Drop**: Uses TouchBackend for mobile drag and drop
- **Viewport Optimization**: Proper meta tags for mobile browsers
- **Touch Action Properties**: Prevents unwanted zoom and scrolling

### Common Mobile Issues & Solutions

#### 1. **App Not Working on Mobile After Deployment**

**Problem**: The app works on desktop but not on mobile devices.

**Solutions**:

a) **Check API Configuration**:

```bash
# Ensure Next.js development server is running
npm run dev
```

b) **Update API Base URL** (if deploying to production):

```javascript
// In src/lib/api.ts, the API_BASE URL is automatically configured
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
```

c) **Check CORS Configuration**:

The app includes built-in CORS handling in Next.js API routes:

```javascript
// API routes automatically handle CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

#### 2. **Drag & Drop Not Working on Mobile**

**Problem**: Drag and drop works on desktop but not on mobile.

**Solutions**:

a) **Check @dnd-kit Configuration**:
The app uses @dnd-kit/core with optimized settings for mobile:

- PointerSensor with activation constraints
- Touch-friendly drag detection
- Proper touch event handling

b) **Ensure Proper Touch Events**:

```javascript
// The app includes these CSS properties for mobile
touch-action: manipulation;
-webkit-user-select: none;
```

### Production Deployment

#### 1. **Build for Production**

```bash
# Build the application
npm run build

# Start production server
npm run start
```

#### 2. **Environment Variables**

Create a `.env.local` file for production:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
NEXT_PUBLIC_APP_ENV=production
```

#### 3. **Deploy to Vercel/Netlify**

```bash
# For Vercel
vercel --prod

# For Netlify
netlify deploy --prod
```

#### 4. **API Deployment**

Deploy your JSON Server API to a hosting service like:

- **Railway**: `railway up`
- **Render**: Connect your GitHub repository
- **Heroku**: `heroku create && git push heroku main`

## 📱 How to Use

### Main Dashboard

1. **View Tasks**: See all tasks organized in columns (Backlog, In Progress, Review, Done)
2. **Create Task**: Click the "+" button in any column to add a new task
3. **Edit Task**: Click on any task card to edit its details
4. **Move Tasks**: Drag and drop tasks between columns
5. **Search**: Use the search bar to filter tasks by title
6. **Navigate**: Use pagination controls to browse through tasks

### Task Details & Subtasks

1. **Open Task Details**: Click on a task card to view its details
2. **Manage Subtasks**:
   - Add new subtasks using the "+" button
   - Edit subtasks by clicking on them
   - Delete subtasks using the delete button
3. **Organize Subtasks**: Drag subtasks between "To Do", "Doing", and "Done" columns
4. **Search Subtasks**: Use the search bar to filter subtasks
5. **Navigate Pages**: Use pagination controls for each column

### Theme Toggle

- Click the theme toggle button in the top-right corner to switch between light and dark modes

## 🏗️ Project Structure

```
kanban-todo/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── tasks/          # Task pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── Board.tsx       # Main Kanban board
│   │   ├── Column.tsx      # Individual columns
│   │   ├── TaskCard.tsx    # Task cards
│   │   └── ...
│   ├── contexts/           # React contexts
│   ├── features/           # Feature components
│   ├── lib/               # Utility functions
│   ├── providers/         # App providers
│   └── store/             # Redux store
├── tools/
│   ├── db.json            # JSON Server database
│   └── server.js          # Backend server
└── public/                # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run start:api` - Start the JSON Server API
- `npm run build:prod` - Build for production with export
- `npm run deploy` - Build and start production server

## 🌐 API Endpoints

The backend provides the following REST API endpoints:

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /subtasks` - Get all subtasks
- `POST /subtasks` - Create a new subtask
- `PUT /subtasks/:id` - Update a subtask
- `DELETE /subtasks/:id`
