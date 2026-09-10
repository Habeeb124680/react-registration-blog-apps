# React Practice Lab

A small React project built to practice core React fundamentals — `useState`, controlled forms, arrays, `.map()`, and conditional rendering — through two self-contained mini apps.

## Live Preview

> Add a deployed link here once you host it (Vercel, Netlify, GitHub Pages, etc.)

## Projects

### 🎓 Student Registration App
Register a student with a name and course, see them appear in a list, and remove entries.

- Controlled form inputs (`name`, `course`)
- Adds new students to an array with `setStudents((prev) => [...prev, newStudent])`
- Deletes a student by filtering the array on `id`
- Empty state when no students are registered

### 💬 Blog App (like Twitter)
Post a short update, like posts, and delete posts you wrote yourself.

- Character-limited textarea (800 chars) with live count
- Toggle like/unlike, with the like count updating accordingly
- New posts are prepended so the newest is always on top
- Only posts flagged `isOwn: true` show a delete button

## Tech Stack

- [React](https://react.dev/) (functional components + hooks)
- [lucide-react](https://lucide.dev/) for icons
- Plain CSS (`App.css`) with responsive media queries — no CSS framework

## Features

- Fully responsive layout: sidebar collapses into a horizontal top nav on tablets/phones, with icon-only nav on the smallest screens
- Client-side only — no backend, all state lives in `useState`
- Simple in-memory data, reset on page refresh

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### Running locally

```bash
npm start
```

The app will run at `http://localhost:3000`.

### Building for production

```bash
npm run build
```

## Project Structure

```
src/
├── App.jsx      # Sidebar, routing between views, both mini app
└── App.css      # Styling, including responsive breakpoints
```

## What This Project Demonstrates

- Managing arrays of objects in state (add / update / delete)
- Controlled form components
- List rendering with `.map()` and stable `key` props
- Lifting state up and passing callbacks as props
- Conditional rendering (empty states, own-post-only delete button)
- Responsive design with CSS media queries

## License

This project is open source and available for learning purposes. Feel free to fork it and build your own mini apps on top of it.