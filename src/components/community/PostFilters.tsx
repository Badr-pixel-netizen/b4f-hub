import { POST_CATEGORIES, type PostCategory } from "../../types";

interface PostFiltersProps {
  activeCategory: PostCategory | "all";
  onCategoryChange: (category: PostCategory | "all") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  likedOnly: boolean;
  onLikedOnlyChange: (value: boolean) => void;
}

function PostFilters({
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  likedOnly,
  onLikedOnlyChange,
}: PostFiltersProps) {
  return (
    <div className="post-filters">
      <div className="category-chips">
        <button
          type="button"
          className={`chip ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => onCategoryChange("all")}
        >
          All
        </button>
        {POST_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${activeCategory === category ? "active" : ""}`}
            onClick={() => onCategoryChange(category)}
          >
            {category[0].toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search author or content..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <label className="liked-only-label">
          <input
            type="checkbox"
            checked={likedOnly}
            onChange={(event) => onLikedOnlyChange(event.target.checked)}
          />
          Liked only
        </label>
      </div>
    </div>
  );
}

export default PostFilters;
