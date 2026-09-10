import "./App.css";
import React, { useState } from "react";
import {
  GraduationCap,
  MessageCircle,
  LayoutGrid,
  Trash2,
  Plus,
  Users,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Heart,
  Send,
} from "lucide-react";

// -----------------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------------
function Sidebar({ current, onNavigate }) {
  const items = [
    { id: "home", label: "Overview", icon: LayoutGrid },
    { id: "students", label: "Student Registration", icon: GraduationCap },
    { id: "blog", label: "Blog App", icon: MessageCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-title">React Apps</p>
        <p className="sidebar-subtitle">two mini apps, one codebase</p>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item${active ? " active" : ""}`}
            >
              <Icon size={17} strokeWidth={2} />
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">Built with useState, arrays &amp; .map()</div>
    </aside>
  );
}

// -----------------------------------------------------------------------
// Home / Overview
// -----------------------------------------------------------------------
function Home({ onNavigate }) {
  return (
    <div className="page">
      <p className="eyebrow">Overview</p>
      <h1 className="page-title">Two projects to practice core React</h1>
      <p className="page-subtitle">
        Each card below is a self-contained app. Open one, build it out, then
        come back and try the other.
      </p>

      <div className="card-grid">
        <ProjectCard
          icon={GraduationCap}
          title="Student Registration App"
          description="Register students with a name and course, list them, and remove entries."
          tags={["Forms", "useState", "arrays", ".map()"]}
          onClick={() => onNavigate("students")}
        />
        <ProjectCard
          icon={MessageCircle}
          title="Blog App (like Twitter)"
          description="Post short updates, like them, and delete your own posts."
          tags={["useState", "arrays", ".map()", "events"]}
          onClick={() => onNavigate("blog")}
        />
      </div>
    </div>
  );
}

function ProjectCard({ icon: Icon, title, description, tags, onClick }) {
  return (
    <button onClick={onClick} className="project-card">
      <div className="project-card-top">
        <div className="project-icon">
          <Icon size={19} strokeWidth={2} />
        </div>
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{description}</p>
      <div className="tag-list">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="project-cta">
        Open project
        <ArrowRight size={14} />
      </div>
    </button>
  );
}

// -----------------------------------------------------------------------
// Student Registration App
// -----------------------------------------------------------------------
function StudentRegistrationApp({ onBack }) {
  // Each student is an object: { id, name, course }
  const [students, setStudents] = useState([
    { id: 1, name: "Amara Okafor", course: "Data Structures" },
    { id: 2, name: "Liam Chen", course: "Intro to React" },
  ]);

  // Controlled form inputs
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading
    if (!name.trim() || !course.trim()) return;

    const newStudent = {
      id: Date.now(), // simple unique id
      name: name.trim(),
      course: course.trim(),
    };

    setStudents((prev) => [...prev, newStudent]); // add to array, don't mutate
    setName("");
    setCourse("");
  }

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="page">
      <button onClick={onBack} className="back-link">
        <ArrowLeft size={14} />
        Back to overview
      </button>

      <div className="page-header">
        <div className="page-header-icon">
          <GraduationCap size={18} />
        </div>
        <h1 className="page-header-title">Student Registration</h1>
      </div>
      <p className="page-header-desc">
        Register a student, then see them appear in the list below.
      </p>

      {/* --- Form --- */}
      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="text"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-submit">
          <Plus size={16} />
          Add student
        </button>
      </form>

      {/* --- List --- */}
      <div className="list-header">
        <Users size={14} />
        <p className="list-header-text">
          Registered students ({students.length})
        </p>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students registered yet. Add one above to get started.</p>
        </div>
      ) : (
        <div className="student-list">
          {students.map((student) => (
            <div key={student.id} className="student-row">
              <div className="student-info">
                <div className="student-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="student-name">{student.name}</p>
                  <div className="student-course">
                    <BookOpen size={11} />
                    {student.course}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(student.id)}
                className="delete-btn"
                aria-label={`Delete ${student.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Blog App
// -----------------------------------------------------------------------
function BlogApp({ onBack }) {
  // Each post is an object: { id, author, text, likes, likedByMe, isOwn }
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Priya Nair",
      text: "Just shipped my first React component. useState finally clicked!",
      likes: 4,
      likedByMe: false,
      isOwn: false,
    },
    {
      id: 2,
      author: "Habeeb Abdulazeez",
      text: "Arrays + .map() + keys is 80% of React. The rest is details.",
      likes: 2,
      likedByMe: false,
      isOwn: false,
    },
  ]);

  const [draft, setDraft] = useState("");

  function handlePost(e) {
    e.preventDefault();
    if (!draft.trim()) return;

    const newPost = {
      id: Date.now(),
      author: "You",
      text: draft.trim(),
      likes: 0,
      likedByMe: false,
      isOwn: true, // posts you create are "yours", so you can delete them
    };

    setPosts((prev) => [newPost, ...prev]); // newest post goes on top
    setDraft("");
  }

  function handleToggleLike(id) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likedByMe: !post.likedByMe,
              likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }

  function handleDelete(id) {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }

  return (
    <div className="page">
      <button onClick={onBack} className="back-link">
        <ArrowLeft size={14} />
        Back to overview
      </button>

      <div className="page-header">
        <div className="page-header-icon">
          <MessageCircle size={18} />
        </div>
        <h1 className="page-header-title">Community Feed</h1>
      </div>
      <p className="page-header-desc">
        Share a short post with the community. Like anything you see, but you
        can only delete posts you wrote yourself.
      </p>

      {/* --- Composer --- */}
      <form onSubmit={handlePost} className="blog-composer">
        <textarea
          placeholder="What's on your mind?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={800}
          rows={3}
          className="blog-textarea"
        />
        <div className="blog-composer-footer">
          <span className="char-count">{draft.length}/800</span>
          <button type="submit" className="form-submit" disabled={!draft.trim()}>
            <Send size={14} />
            Post
          </button>
        </div>
      </form>

      {/* --- Feed --- */}
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Write the first one above.</p>
        </div>
      ) : (
        <div className="blog-list">
          {posts.map((post) => (
            <div key={post.id} className="blog-post">
              <div className="post-meta">
                <div className="student-avatar">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <span className="post-author">{post.author}</span>
              </div>
              <p className="post-text">{post.text}</p>
              <div className="post-actions">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`like-btn${post.likedByMe ? " liked" : ""}`}
                >
                  <Heart size={14} fill={post.likedByMe ? "currentColor" : "none"} />
                  {post.likes}
                </button>
                {post.isOwn && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="delete-btn post-delete"
                    aria-label="Delete post"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Root App
// -----------------------------------------------------------------------
function App() {
  const [view, setView] = useState("home");

  return (
    <div className="app-shell">
      <Sidebar current={view} onNavigate={setView} />
      <main className="main-content">
        {view === "home" && <Home onNavigate={setView} />}
        {view === "students" && (
          <StudentRegistrationApp onBack={() => setView("home")} />
        )}
        {view === "blog" && <BlogApp onBack={() => setView("home")} />}
      </main>
    </div>
  );
}

export default App;