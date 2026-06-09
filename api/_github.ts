// ============================================================
// GitHub Contents API Utilities
// Study Hub Lahore - Cloud-only data persistence
// ============================================================

const GITHUB_API = "https://api.github.com";

function getEnv() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GitHub env vars: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO"
    );
  }

  return { token, owner, repo };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

// ============================================================
// Read a file from GitHub
// ============================================================
export async function readFile(filePath: string): Promise<{
  content: any;
  sha: string;
}> {
  const { token, owner, repo } = getEnv();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const res = await fetch(url, {
    method: "GET",
    headers: headers(token),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub readFile failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const content = JSON.parse(decoded);

  return { content, sha: data.sha };
}

// ============================================================
// Update (overwrite) a file on GitHub
// ============================================================
export async function updateFile(
  filePath: string,
  content: any,
  sha: string,
  message: string
): Promise<{ newSha: string }> {
  const { token, owner, repo } = getEnv();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;

  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString(
    "base64"
  );

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message,
      content: encoded,
      sha,
    }),
  });

  if (!res.ok) {
    const err: any = new Error(
      `GitHub updateFile failed (${res.status}): ${await res.text()}`
    );
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return { newSha: data.content.sha };
}

// ============================================================
// Read-modify-write with conflict retry (max 5 attempts)
// ============================================================
export async function readAndUpdate<T = any>(
  filePath: string,
  updater: (data: T) => T,
  message: string,
  maxRetries: number = 5
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { content, sha } = await readFile(filePath);
    const newData = updater(content as T);

    try {
      await updateFile(filePath, newData, sha, message);
      return newData;
    } catch (err: any) {
      if (err.status === 409 && attempt < maxRetries - 1) {
        // Exponential backoff: 100ms, 200ms, 400ms, 800ms
        const delay = Math.pow(2, attempt) * 100;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`Max retries exceeded for ${filePath}`);
}

// ============================================================
// Generate sequential ID
// ============================================================
export function generateId(prefix: string, existing: { id: string }[]): string {
  const year = new Date().getFullYear();
  const currentYearIds = existing
    .filter((item) => item.id.startsWith(`${prefix}-${year}`))
    .map((item) => parseInt(item.id.split("-")[1].slice(4), 10))
    .filter((n) => !isNaN(n));

  const nextNum =
    currentYearIds.length > 0 ? Math.max(...currentYearIds) + 1 : 1;

  return `${prefix}-${year}${String(nextNum).padStart(4, "0")}`;
}
