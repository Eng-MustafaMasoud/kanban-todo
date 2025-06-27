# 🎯 Kanban Task Management App

A modern, responsive Kanban board application built with Next.js, React, and Material-UI for efficient task and subtask management.

![Kanban App Preview](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5-purple?style=for-the-badge&logo=mui)

## 🚀 Features

### 🎨 **Modern Design**

- **Glassmorphism UI**: Beautiful frosted glass effects
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Elegant transitions and hover effects

### 📋 **Task Management**

- **Kanban Board**: Four columns (Backlog, In Progress, Review, Done)
- **Drag & Drop**: Move tasks between columns seamlessly
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

3. **Start the API server**

   ```bash
   # In a new terminal
   cd tools
   npm install -g json-server
   json-server --watch db.json --port 4000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Material-UI 5**: Component library and theming
- **React DnD**: Drag and drop functionality
- **React Query**: Data fetching and caching

### **State Management**

- **Redux Toolkit**: Global state management
- **React Query**: Server state management
- **Context API**: Theme management

### **Backend**

- **JSON Server**: Mock REST API
- **RESTful API**: Standard HTTP endpoints
- **Pagination**: Efficient data loading

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

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### **API Configuration**

The app uses JSON Server for the backend. The server runs on port 4000 by default.

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

## 🚀 Deployment

### **Build for Production**

```bash
npm run build
npm start
```

### **Deploy to Vercel**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### **Environment Setup**

Ensure your production environment has:

- `NEXT_PUBLIC_API_BASE_URL` pointing to your API
- Proper CORS configuration
- Database connection (replace JSON Server)

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
- **React DnD** for smooth drag and drop functionality
- **Next.js** for the excellent React framework
- **JSON Server** for the mock API

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
# Ensure API server is running on the correct port
npm run start:api
```

b) **Update API Base URL** (if deploying to production):

```javascript
// In src/lib/api.ts, update the API_BASE URL
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-api-domain.com";
```

c) **Check CORS Configuration**:

```javascript
// Add to your API server (tools/server.js)
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-domain.com"],
    credentials: true,
  })
);
```

#### 2. **Drag & Drop Not Working on Mobile**

**Problem**: Drag and drop works on desktop but not on mobile.

**Solutions**:

a) **Check TouchBackend Configuration**:
The app automatically uses TouchBackend for mobile devices with optimized settings:

- Delay: 200ms to prevent accidental drags
- Tolerance: 5px for better touch detection
- Scroll angle ranges for better scrolling

b) **Ensure Proper Touch Events**:

```javascript
// The app includes these CSS properties for mobile
touch-action: manipulation;
-webkit-user-select: none;
```

#### 3. **Viewport Issues on Mobile**

**Problem**: The app doesn't display properly on mobile browsers.

**Solutions**:

a) **Check Meta Tags**: The app includes proper viewport meta tags:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>
```

b) **CSS Viewport Units**: The app uses proper viewport units for mobile:

```css
height: 100vh;
height: -webkit-fill-available;
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
- `DELETE /subtasks/:id` - Delete a subtask

## 🎨 Customization

### Themes

The app supports custom theming through Material-UI's theme system. Modify the theme configuration in `src/contexts/ThemeContext.tsx`.

### Styling

All components use Material-UI's styling system with CSS-in-JS. Customize styles by modifying the `sx` props in each component.

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   - The app will automatically use the next available port
   - Check the terminal output for the correct URL

2. **Backend Server Not Running**

   - Make sure JSON Server is running on port 3001
   - Check that `tools/db.json` exists

3. **Drag & Drop Not Working**

   - Ensure you're using a modern browser
   - Check that React DnD is properly initialized
   - On mobile, ensure TouchBackend is working

4. **Mobile Issues**
   - Check viewport meta tags are present
   - Ensure API server is accessible from mobile device
   - Verify CORS configuration for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Eng. Mustafa Masoud**

- GitHub: [@Eng-MustafaMasoud](https://github.com/Eng-MustafaMasoud)

---

⭐ If you find this project helpful, please give it a star!
