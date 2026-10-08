import { useState, type FormEvent } from "react";
import { POST_CATEGORIES, type PostCategory } from "../../types";

const MIN_LENGTH = 3;
const MAX_LENGTH = 2000;

interface ComposeFormProps {
  isSubmitting: boolean;
  onSubmit: (content: string, category: PostCategory) => Promise<string | null>;
}

function ComposeForm({ isSubmitting, onSubmit }: ComposeFormProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("community");
  const [error, setError] = useState<string | null>(null);

  function validate(trimmed: string): string | null {
    if (trimmed.length === 0) return "Post content can't be empty.";
    if (trimmed.length < MIN_LENGTH) {
      return `Post must be at least ${MIN_LENGTH} characters.`;
    }
    if (trimmed.length > MAX_LENGTH) {
      return `Post must be ${MAX_LENGTH} characters or fewer.`;
    }
    return null;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmed = content.trim();
    const validationError = validate(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const serverError = await onSubmit(trimmed, category);
    if (serverError) {
      setError(serverError);
      return;
    }

    setContent("");
    setCategory("community");
  }

  return (
    <form className="compose-form" onSubmit={handleSubmit}>
      <textarea
        className="compose-textarea"
        placeholder="Share something with the community..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
      />
      <div className="compose-row">
        <select
          className="compose-select"
          value={category}
          onChange={(event) => setCategory(event.target.value as PostCategory)}
        >
          {POST_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option[0].toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" className="post-button" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export default ComposeForm;
