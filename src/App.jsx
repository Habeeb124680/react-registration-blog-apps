import "./App.css";
import React, { useState, useEffect, useRef } from "react";
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
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import {
  registerUser,
  loginUser,
  fetchPosts,
  createPost,
  toggleLike,
  deletePost,
  fetchComments,
  createComment,
  deleteComment,
  updatePost,
  updateComment,
} from "./api";

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
        />
        <ProjectCard
          to="/blog"
          icon={MessageCircle}
          title="Blog App (like Twitter)"
          description="Post short updates, like them, and delete your own posts. Backed by a real Django API."
          tags={["Django API", "JWT auth", "fetch", "useEffect"]}
        />
      </div>
    </div>
  );
}

function ProjectCard({ to, icon: Icon, title, description, tags }) {
  return (
    <Link to={to} className="project-card">
      <div className="project-icon">
        <Icon size={19} strokeWidth={2} />
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
    { id: 1, name: "Habeeb Abdulazeez", course: "Full-Stack Development" },
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
// Password input with a show/hide (eye) button
// -----------------------------------------------------------------------
function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  // Each field keeps its own "visible?" state, so you can reveal one
  // without revealing the other.
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="form-input"
        required
        minLength={6}
      />
      <button
        type="button" /* "button" so clicking it never submits the form */
        onClick={() => setVisible((v) => !v)}
        className="password-toggle"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

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
          onClick={() => {
            setMode("login");
            setError("");
          }}
          type="button"
        >
          Log in
        </button>
        <button
          className={`auth-tab${mode === "register" ? " active" : ""}`}
          onClick={() => {
            setMode("register");
            setError("");
          }}
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
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        {mode === "register" && (
          <PasswordInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        )}
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

// -----------------------------------------------------------------------
// Three-dot menu (Edit / Delete), used on your own posts and comments
// -----------------------------------------------------------------------
function DotsIcon() {
  // Drawn by hand so it doesn't depend on which icon names your installed
  // version of lucide-react happens to have.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function OptionsMenu({ label, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

  // While the menu is open, close it when you click or tap anywhere outside
  // it, or press Escape. The listeners are removed again when it closes.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function choose(action) {
    setOpen(false);
    action();
  }

  return (
    <div className="options" ref={wrapperRef}>
      <button
        type="button"
        ref={triggerRef}
        className="options-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <DotsIcon />
      </button>
      {open && (
        <div className="options-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="options-item"
            onClick={() => choose(onEdit)}
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className="options-item danger"
            onClick={() => choose(onDelete)}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// Inline editor: swaps in for a post's or comment's text while you edit it
// -----------------------------------------------------------------------
function InlineEditor({ initialValue, maxLength, rows, onSave, onCancel }) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // Focus the box and put the cursor at the end when the editor opens.
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, []);

  const unchanged = value.trim() === initialValue.trim();
  const canSave = value.trim() !== "" && !unchanged && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      // onSave throws if the server rejects the edit. On success the parent
      // closes this editor, so there is nothing left to reset here.
      await onSave(value.trim());
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <div className="inline-editor">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        rows={rows}
        className="blog-textarea"
        aria-label="Edit text"
      />
      {error && <p className="auth-error">{error}</p>}
      <div className="inline-editor-actions">
        <span className="char-count">
          {value.length}/{maxLength}
        </span>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="form-submit" onClick={handleSave} disabled={!canSave}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Comments under a single post
// -----------------------------------------------------------------------
function CommentSection({ postId, auth, token, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // which comment is being edited

  // Runs when the section first opens (this component only exists while a
  // post's comments are expanded), and again if you log in or out.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchComments(postId, token)
      .then((data) => {
        if (!cancelled) setComments(data);
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
  }, [postId, token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const created = await createComment(postId, draft.trim(), token);
      setComments((prev) => [...prev, created]); // oldest first, so add to the end
      setDraft("");
      onCountChange(postId, 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  // Throws on failure so the editor can show the error and stay open.
  async function handleEdit(commentId, text) {
    const updated = await updateComment(commentId, text, token);
    setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
    setEditingId(null);
  }

  async function handleDelete(commentId) {
    try {
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onCountChange(postId, -1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="comments">
      {loading ? (
        <p className="comments-note">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="comments-note">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-avatar">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="comment-body">
              <span className="comment-author">{comment.author.name}</span>
              {comment.edited && <span className="edited-tag">edited</span>}
              {editingId === comment.id ? (
                <InlineEditor
                  initialValue={comment.text}
                  maxLength={500}
                  rows={2}
                  onSave={(text) => handleEdit(comment.id, text)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
            </div>
            {comment.is_own && editingId !== comment.id && (
              <OptionsMenu
                label="Comment options"
                onEdit={() => setEditingId(comment.id)}
                onDelete={() => handleDelete(comment.id)}
              />
            )}
          </div>
        ))
      )}

      {error && <p className="auth-error">{error}</p>}

      {auth ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            className="form-input"
          />
          <button
            type="submit"
            className="form-submit"
            disabled={!draft.trim() || sending}
            aria-label="Send comment"
          >
            <Send size={13} />
          </button>
        </form>
      ) : (
        <p className="comments-note">Log in to join the conversation.</p>
      )}
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

  // Which posts currently have their comments expanded: { [postId]: true }
  const [openComments, setOpenComments] = useState({});

  // Which post is being edited right now (only one at a time)
  const [editingPostId, setEditingPostId] = useState(null);

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

  // Throws on failure so the editor can show the error and stay open.
  async function handleEditPost(id, text) {
    const updated = await updatePost(id, text, token);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setEditingPostId(null);
  }

  function toggleComments(postId) {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  // CommentSection tells us when a comment is added (+1) or removed (-1)
  // so the count on the post's button stays accurate without refetching.
  function handleCommentCountChange(postId, delta) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comment_count: p.comment_count + delta } : p
      )
    );
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
                {post.edited && <span className="edited-tag">edited</span>}
                {post.is_own && editingPostId !== post.id && (
                  <OptionsMenu
                    label="Post options"
                    onEdit={() => setEditingPostId(post.id)}
                    onDelete={() => handleDelete(post.id)}
                  />
                )}
              </div>
              {editingPostId === post.id ? (
                <InlineEditor
                  initialValue={post.text}
                  maxLength={3000}
                  rows={4}
                  onSave={(text) => handleEditPost(post.id, text)}
                  onCancel={() => setEditingPostId(null)}
                />
              ) : (
                <p className="post-text">{post.text}</p>
              )}
              <div className="post-actions">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`like-btn${post.liked_by_me ? " liked" : ""}`}
                  disabled={!auth}
                >
                  <Heart size={14} fill={post.liked_by_me ? "currentColor" : "none"} />
                  {post.like_count}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className={`like-btn comment-btn${openComments[post.id] ? " open" : ""}`}
                  aria-expanded={!!openComments[post.id]}
                  aria-label="Show comments"
                >
                  <MessageCircle size={14} />
                  {post.comment_count}
                </button>
              </div>
              {openComments[post.id] && (
                <CommentSection
                  postId={post.id}
                  auth={auth}
                  token={token}
                  onCountChange={handleCommentCountChange}
                />
              )}
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