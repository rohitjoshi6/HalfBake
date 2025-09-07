import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type TagRow = { tag: { id: number; name: string } };

export interface Idea {
  id: number;
  title: string;
  summary: string;
  status: "DRAFT" | "LOOKING_FOR_HELP" | "IN_PROGRESS" | "COMPLETED";
  repoUrl?: string | null;
  createdAt?: string;
  owner?: { id: number; name: string };
  tags?: TagRow[];
}

export default function IdeaCard({
  idea,
  onTagClick,
}: {
  idea: Idea;
  onTagClick?: (tag: string) => void;
}) {
  const statusChip = statusClass(idea.status);
  const initials = getInitials(idea.owner?.name || "U");
  const when = timeAgo(idea.createdAt);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative rounded-2xl border border-white/50 bg-white/70 backdrop-blur shadow
                 hover:shadow-xl overflow-hidden"
    >
      {/* gradient top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500" />

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-xl ${statusChip}`}>
            {readableStatus(idea.status)}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-tight">
          <Link to={`/idea/${idea.id}`} className="hover:underline">
            {idea.title}
          </Link>
        </h3>

        <p className="mt-2 text-gray-700">{idea.summary}</p>

        {/* tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {idea.tags.map((t) => (
              <button
                key={t.tag.id}
                onClick={() => onTagClick?.(t.tag.name)}
                className="text-xs px-2 py-0.5 rounded-xl bg-black/5 hover:bg-black/10"
              >
                {t.tag.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          {/* owner + time */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-white
                            flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium">{idea.owner?.name ?? "Someone"}</div>
              {when && <div className="text-xs">{when}</div>}
            </div>
          </div>

          {/* repo link */}
          {idea.repoUrl && (
            <a
              href={idea.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1.5 rounded-xl border bg-white/60 hover:bg-white"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

function readableStatus(s: Idea["status"]) {
  switch (s) {
    case "LOOKING_FOR_HELP": return "Looking for help";
    case "IN_PROGRESS": return "In progress";
    default: return s[0] + s.slice(1).toLowerCase();
  }
}

function statusClass(s: Idea["status"]) {
  switch (s) {
    case "LOOKING_FOR_HELP":
      return "bg-amber-100 text-amber-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800";
    case "DRAFT":
    default:
      return "bg-gray-200 text-gray-800";
  }
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
