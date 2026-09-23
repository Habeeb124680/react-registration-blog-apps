import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
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
  LogOut,
} from "lucide-react";
import { registerUser, loginUser, fetchPosts, createPost, toggleLike, deletePost } from "./api";

// -----------------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------------
function Sidebar() {
  const items = [
    { to: "/", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/students", label: "Student Registration", icon: GraduationCap },
    { to: "/blog", label: "Blog App", icon: MessageCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-title">React Practice Lab</p>
        <p className="sidebar-subtitle">two mini apps, one codebase</p>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
            >
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
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
function Home() {
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
          to="/students"
          icon={GraduationCap}
          title="Student Registration App"
          description="Register students with a name and course, list them, and remove entries."
          tags={["Forms", "useState", "arrays", ".map()"]}
          status="Built"
        />
        <ProjectCard
          to="/blog"
          icon={MessageCircle}
          title="Blog App (like Twitter)"
          description="Post short updates, like them, and delete your own posts. Backed by a real Django API."
          tags={["Django API", "JWT auth", "fetch", "useEffect"]}
          status="Built"
        />
      </div>
    </div>
  );
}

function ProjectCard({ to, icon: Icon, title, description, tags, status }) {
  const built = status === "Built";
  return (
    <Link to={to} className="project-card">
      <div className="project-card-top">
        <div className="project-icon">
          <Icon size={19} strokeWidth={2} />
        </div>
        <span className={`status-badge ${built ? "built" : "upcoming"}`}>
          {status}
        </span>
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
    </Link>
  );
}

// -----------------------------------------------------------------------
// Student Registration App (unchanged — stays local-only, no backend)
// -----------------------------------------------------------------------
function StudentRegistrationApp() {
  const [students, setStudents] = useState([
    { id: 1, name: "Amara Okafor", course: "Data Structures" },
    { id: 2, name: "Liam Chen", course: "Intro to React" },
  ]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !course.trim()) return;
    const newStudent = { id: Date.now(), name: name.trim(), course: course.trim() };
    setStudents((prev) => [...prev, newStudent]);
    setName("");
    setCourse("");
  }

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft size={14} />
        Back to overview
      </Link>

      <div className="page-header">
        <div className="page-header-icon">
          <GraduationCap size={18} />
        </div>
        <h1 className="page-header-title">Student Registration</h1>
      </div>
      <p className="page-header-desc">
        Register a student, then see them appear in the list below.
      </p>

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

      <div className="list-header">
        <Users size={14} />
        <p className="list-header-text">Registered students ({students.length})</p>
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
                <div className="student-avatar">{student.name.charAt(0).toUpperCase()}</div>
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
// Auth form — used inside the Blog App when you're not logged in
// -----------------------------------------------------------------------
function AuthForm({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginUser({ email, password })
          : await registerUser({ name, email, password });
      onAuthed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button
          className={`auth-tab${mode === "login" ? " active" : ""}`}
          onClick={() => setMode("login")}
          type="button"
        >
          Log in
        </button>
        <button
          className={`auth-tab${mode === "register" ? " active" : ""}`}
          onClick={() => setMode("register")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === "register" && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
          minLength={6}
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

// -----------------------------------------------------------------------
// Blog App — backed by the Django API
// -----------------------------------------------------------------------
function BlogApp() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("blog_auth");
    return saved ? JSON.parse(saved) : null;
  });

  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = auth?.access_token;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPosts(token)
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleAuthed(data) {
    setAuth(data);
    localStorage.setItem("blog_auth", JSON.stringify(data));
  }

  function handleLogout() {
    setAuth(null);
    localStorage.removeItem("blog_auth");
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    try {
      const newPost = await createPost(draft.trim(), token);
      setPosts((prev) => [newPost, ...prev]);
      setDraft("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleLike(id) {
    try {
      const updated = await toggleLike(id, token);
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePost(id, token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft size={14} />
        Back to overview
      </Link>

      <div className="page-header">
        <div className="page-header-icon">
          <MessageCircle size={18} />
        </div>
        <h1 className="page-header-title">Community Feed</h1>
        {auth && (
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={13} />
            Log out ({auth.user.name})
          </button>
        )}
      </div>
      <p className="page-header-desc">
        Everyone can read the feed. Log in to post, like, or delete your own posts.
      </p>

      {!auth && <AuthForm onAuthed={handleAuthed} />}

      {auth && (
        <form onSubmit={handlePost} className="blog-composer">
          <textarea
            placeholder="What's on your mind?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={3000}
            rows={3}
            className="blog-textarea"
          />
          <div className="blog-composer-footer">
            <span className="char-count">{draft.length}/3000</span>
            <button type="submit" className="form-submit" disabled={!draft.trim()}>
              <Send size={14} />
              Post
            </button>
          </div>
        </form>
      )}

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <div className="empty-state">
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Be the first to write one.</p>
        </div>
      ) : (
        <div className="blog-list">
          {posts.map((post) => (
            <div key={post.id} className="blog-post">
              <div className="post-meta">
                <div className="student-avatar">{post.author.name.charAt(0).toUpperCase()}</div>
                <span className="post-author">{post.author.name}</span>
              </div>
              <p className="post-text">{post.text}</p>
              <div className="post-actions">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`like-btn${post.liked_by_me ? " liked" : ""}`}
                  disabled={!auth}
                >
                  <Heart size={14} fill={post.liked_by_me ? "currentColor" : "none"} />
                  {post.like_count}
                </button>
                {post.is_own && (
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
// 404 — for any URL that isn't one of ours
// -----------------------------------------------------------------------
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="empty-state">
        <p>That page doesn't exist.</p>
      </div>
      <button onClick={() => navigate("/")} className="form-submit" style={{ marginTop: "1rem" }}>
        Go home
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------
// Root App
// -----------------------------------------------------------------------
function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentRegistrationApp />} />
          <Route path="/blog" element={<BlogApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;