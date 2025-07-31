# Contact Center Agent Management

A modern, responsive React application for managing and monitoring contact center agents. Built with TypeScript, React Hooks, and Tailwind CSS.

## 🚀 Features

### Core Functionality

- **Real-time Agent Display**: View all contact center agents with their current status
- **Smart Filtering**: Filter agents by status (All, Online, Busy, Away, Offline)
- **Intelligent Sorting**: Agents automatically sorted by status priority (Online → Busy → Away → Offline) then by first name
- **API Integration**: Fetches agent data from external API endpoint

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth loading indicators during data fetching
- **Error Handling**: Graceful error display with user-friendly messages
- **Empty States**: Helpful messages when no agents match current filters

### Performance Optimizations

- **Memoization**: Uses `useMemo` and `useCallback` for optimal performance
- **Component Extraction**: Modular components for better maintainability
- **Lazy Loading**: Images load lazily for improved performance

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS 4.1.11
- **Build Tool**: Vite 7.0.4
- **Testing**: Playwright for end-to-end testing
- **Development**: ESLint, TypeScript ESLint
- **API**: RESTful API integration

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd z-challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)


## 🎯 Usage

### Viewing Agents

- The application automatically loads and displays all agents on startup
- Each agent card shows:
  - Agent avatar
  - Full name
  - Current status with color-coded indicator
  - Profile/role information

### Filtering Agents

- Use the "Filter by Status" dropdown to view agents by specific status
- Options include: All, Online, Busy, Away, Offline
- The count shows how many agents match the current filter

### Status Priority

Agents are automatically sorted by status priority:

1. **Online** (Green) - Highest priority
2. **Busy** (Yellow) - Second priority
3. **Away** (Orange) - Third priority
4. **Offline** (Gray) - Lowest priority

Within the same status, agents are sorted alphabetically by first name.

## 🧪 Testing

This project uses **Playwright** for comprehensive end-to-end testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

```

### Test Coverage

The test suite covers:

- ✅ **Component Rendering**: Page title, loading states, agent display
- ✅ **Filtering Functionality**: Status filtering, count updates
- ✅ **Sorting Logic**: Status priority and alphabetical sorting
- ✅ **Error Handling**: API errors, network timeouts, malformed responses

### Test Structure

- **`tests/agent-list.spec.ts`**: Comprehensive test suite covering all major functionality
- **Mock API System**: Realistic test data with different agent statuses
- **Error Scenarios**: API failures

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run Playwright tests
- `npm run test:ui` - Run tests with interactive UI

## 🌐 API Integration

### API Response Format

```json
{
  "agents": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "status": "online",
      "profile": "agent",
      "avatar": "https://example.com/avatar.jpg"
    }
  ]
}
```

## 🎨 Customization

### Status Configuration

The status configuration can be modified in `src/components/AgentList.tsx`:

```typescript
const STATUS = {
  online: {
    label: "Online",
    color: "bg-green-500",
    priority: 0,
  },
  // Add more statuses as needed
};
```

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added to `src/index.css` or by modifying the Tailwind configuration.

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: Single column layout
- **Tablet**: 2-3 column layout
- **Desktop**: 4 column layout
- **Large screens**: Optimized spacing and layout

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
