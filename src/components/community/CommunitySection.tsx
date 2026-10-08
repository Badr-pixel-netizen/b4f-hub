import { useEffect, useState } from "react";
import type { FetchStatus, Post, PostCategory } from "../../types";
import ComposeForm from "./ComposeForm";
import PostFilters from "./PostFilters";
import PostCard from "./PostCard";

const LOAD_ERROR_MESSAGE =
  "We could not load the community feed. Please check your connection and try again.";

interface CommunitySectionProps {
  onNotify: (message: string, tone: "success" | "error") => void;
}

function CommunitySection({ onNotify }: CommunitySectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");

  const [activeCategory, setActiveCategory] = useState<PostCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [likedOnly, setLikedOnly] = useState(false);

  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  
  const [pendingLikeIds, setPendingLikeIds] = useState<number[]>([]);

  async function loadPosts() {
    setStatus("loading");
    try {
      const response = await fetch("/api/posts");
      if (!response) throw new Error("failed");
      const data: Post[] = await response.json();
      setPosts(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreatePost(
    content: string,
    category: PostCategory,
  ): Promise<string | null> {
    setIsSubmittingPost(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, category }),
      });
      const data = await response.json();

      if (!response.ok) {
        return data.error ?? "Could not publish your post. Please try again.";
      }

      setPosts((current) => [data, ...current]);
      onNotify("Your post was published.", "success");
      return null;
    } catch {
      return "Could not publish your post. Please check your connection and try again.";
    } finally {
      setIsSubmittingPost(false);
    }
  }

  async function handleToggleLike(post: Post) {
    if (pendingLikeIds.includes(post.id)) return;

    setPendingLikeIds((current) => [...current, post.id]);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: !post.liked }),
      });
      if (!response.ok) throw new Error("failed");

      const updated: Post = await response.json();
      setPosts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      onNotify("Could not update like. Please try again.", "error");
    } finally {
      setPendingLikeIds((current) => current.filter((id) => id !== post.id));
    }
  }

  const visiblePosts = posts.filter((post) => {
    if (activeCategory !== "all" && post.category !== activeCategory) return false;
    if (likedOnly && !post.liked) return false;

    const term = searchTerm.trim().toLowerCase();
    if (term.length > 0) {
      const matchesAuthor = post.author.toLowerCase().includes(term);
      const matchesContent = post.content.toLowerCase().includes(term);
      if (!matchesAuthor && !matchesContent) return false;
    }

    return true;
  });

  return (
    <section className="panel community">
      <h2>Community</h2>

      <ComposeForm isSubmitting={isSubmittingPost} onSubmit={handleCreatePost} />

      {status === "success" && (
        <>
          <PostFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            likedOnly={likedOnly}
            onLikedOnlyChange={setLikedOnly}
          />
          <p className="results-count">
            {visiblePosts.length} of {posts.length} posts shown
          </p>
        </>
      )}

      <div className="post-feed">
        {status === "loading" && (
          <p className="status-message">Loading the community feed...</p>
        )}

        {status === "error" && (
          <div className="status-message error">
            <p>{LOAD_ERROR_MESSAGE}</p>
            <button type="button" onClick={loadPosts}>
              Retry
            </button>
          </div>
        )}

        {status === "success" && visiblePosts.length === 0 && (
          <p className="status-message">No posts match your filters right now.</p>
        )}

        {status === "success" &&
          visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLikePending={pendingLikeIds.includes(post.id)}
              onToggleLike={handleToggleLike}
            />
          ))}
      </div>
    </section>
  );
}

export default CommunitySection;
