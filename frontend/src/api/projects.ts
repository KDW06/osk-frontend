import type { Projects, ProjectStatus, ProjectCategory } from "@/types";
import { formatRelativeTime, titleFromSlug } from "@/lib/formatters";
import { apiGet } from "./client";

interface ApiProject {
  id:             string;
  slug:           string;
  repoOwner:      string;
  repoName:       string;
  imageUrl:       string | null;
  imagePublicId:  string | null;
  tagline:        string | null;
  category:       string;
  status:         string;
  featured:       boolean;
  maintainer:     string | null;
  langColor:      string | null;
  ghDescription:  string | null;
  ghLanguage:     string | null;
  ghTopics:       string[] | null;
  ghStars:        number;
  ghForks:        number;
  ghOpenIssues:   number;
  ghContributors: number;
  ghPullRequests: number;
  ghPushedAt:     string;
  lastFetchedAt:  string;
  createdAt:      string;
  updatedAt:      string;
}

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/duvblwzuv/image/upload/v1/open-source-kigali/placeholder.png";

function transform(p: ApiProject): Projects {
  return {
    id:           p.id,
    slug:         p.slug,
    status:       (p.status as ProjectStatus) ?? "active",
    category:     (p.category as ProjectCategory) ?? "all",
    image:        p.imageUrl ?? FALLBACK_IMAGE,
    title:        titleFromSlug(p.slug),
    tagline:      p.tagline ?? "",
    description:  p.ghDescription ?? "",
    techStack:    p.ghTopics ?? [],
    stats: {
      contributors: p.ghContributors,
      prs:          p.ghPullRequests,
      openIssues:   p.ghOpenIssues,
      stars:        p.ghStars,
      forks:        p.ghForks,
    },
    featured:     p.featured,
    language:     p.ghLanguage ?? "—",
    langColor:    p.langColor ?? "#9ca3af",
    lastActivity: formatRelativeTime(p.ghPushedAt),
    maintainer:   p.maintainer ?? "—",
    repoUrl:      `https://github.com/${p.repoOwner}/${p.repoName}`,
    createdAt:    p.createdAt,
  };
}

export async function fetchProjects(): Promise<Projects[]> {
  const data = await apiGet<ApiProject[]>("/projects");
  return data.map(transform);
}
