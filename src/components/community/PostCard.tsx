import type { Post } from "../../types";
import { timeAgo } from "../../utils/time";

interface PostCardProps {
  post: Post;
  isLikePending: boolean;
  onToggleLike: (post: Post) => void;
}

const CATEGORY_LABELS: Record<Post["category"], string> = {
  announcement: "Announcement",
  event: "Event",
  community: "Community",
  resource: "Resource",
};

function PostCard({ post, isLikePending, onToggleLike }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-avatar">{post.avatar}</div>
        <div className="post-meta">
          <span className="post-author">{post.author}</span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>
        <span className={`badge badge-${post.category}`}>
          {CATEGORY_LABELS[post.category]}
        </span>
      </div>

      <p className="post-content">{post.content}</p>

      <button
        type="button"
        className={`like-button ${post.liked ? "liked" : ""}`}
        disabled={isLikePending}
        onClick={() => onToggleLike(post)}
      >
        {post.liked ? "\u2764 Liked" : "\u2661 Like"}
        <span className="like-count">
          {post.likes} {post.likes === 1 ? "like" : "likes"}
        </span>
      </button>
    </article>
  );
}

export default PostCard;
