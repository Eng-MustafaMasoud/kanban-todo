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
