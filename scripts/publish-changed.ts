import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const PACKAGES_DIR = join(process.cwd(), "packages");

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
  magenta: "\x1b[35m",
};

interface PackageMeta {
  folder: string;
  name: string;
  version: string;
  path: string;
}

interface PublishDecision {
  meta: PackageMeta;
  remoteVersion: string | null;
  shouldPublish: boolean;
  reason: string;
}

interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: Array<string | number>;
}

function parseSemVer(v: string): SemVer | null {
  const clean = v.trim().replace(/^[v^~]/, "");
  const match = clean.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/);
  if (!match) return null;

  const major = parseInt(match[1]!, 10);
  const minor = parseInt(match[2]!, 10);
  const patch = parseInt(match[3]!, 10);
  const prereleaseRaw = match[4];
  const prerelease: Array<string | number> = [];

  if (prereleaseRaw) {
    for (const part of prereleaseRaw.split(".")) {
      if (/^\d+$/.test(part)) {
        prerelease.push(parseInt(part, 10));
      } else {
        prerelease.push(part);
      }
    }
  }

  return { major, minor, patch, prerelease };
}

function compareSemVer(aStr: string, bStr: string): number {
  const a = parseSemVer(aStr);
  const b = parseSemVer(bStr);

  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;

  if (a.major !== b.major) return a.major > b.major ? 1 : -1;
  if (a.minor !== b.minor) return a.minor > b.minor ? 1 : -1;
  if (a.patch !== b.patch) return a.patch > b.patch ? 1 : -1;

  if (a.prerelease.length === 0 && b.prerelease.length > 0) return 1;
  if (a.prerelease.length > 0 && b.prerelease.length === 0) return -1;

  const len = Math.max(a.prerelease.length, b.prerelease.length);
  for (let i = 0; i < len; i++) {
    const aPart = a.prerelease[i];
    const bPart = b.prerelease[i];

    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;
    if (aPart === bPart) continue;

    const aNum = typeof aPart === "number";
    const bNum = typeof bPart === "number";

    if (aNum && bNum) return aPart > bPart ? 1 : -1;
    if (aNum && !bNum) return -1;
    if (!aNum && bNum) return 1;

    return (aPart as string).localeCompare(bPart as string) > 0 ? 1 : -1;
  }

  return 0;
}

function getCandidatePackages(): PackageMeta[] {
  const pkgs: PackageMeta[] = [];
  if (!existsSync(PACKAGES_DIR)) return pkgs;

  const entries = readdirSync(PACKAGES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pkgJsonPath = join(PACKAGES_DIR, entry.name, "package.json");
      if (existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8")) as {
            name?: string;
            version?: string;
            private?: boolean;
          };
          if (pkgJson.name && pkgJson.version && !pkgJson.private) {
            pkgs.push({
              folder: entry.name,
              name: pkgJson.name,
              version: pkgJson.version,
              path: join(PACKAGES_DIR, entry.name),
            });
          }
        } catch {
          // ignore malformed package.json
        }
      }
    }
  }
  return pkgs;
}

async function fetchRemoteVersion(pkgName: string): Promise<string | null> {
  try {
    const url = `https://registry.npmjs.org/${encodeURIComponent(pkgName)}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.npm.install-v1+json",
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      return fetchRemoteVersionFallback(pkgName);
    }

    const data = (await res.json()) as { "dist-tags"?: { latest?: string } };
    return data["dist-tags"]?.latest ?? null;
  } catch {
    return fetchRemoteVersionFallback(pkgName);
  }
}

function fetchRemoteVersionFallback(pkgName: string): string | null {
  try {
    const result = spawnSync("npm", ["view", pkgName, "version", "--json"], {
      encoding: "utf-8",
      shell: true,
    });
    if (result.status === 0 && result.stdout) {
      const parsed = JSON.parse(result.stdout.trim()) as string | string[];
      if (Array.isArray(parsed)) {
        return parsed[parsed.length - 1] ?? null;
      }
      return typeof parsed === "string" ? parsed : null;
    }
  } catch {
    // ignore fallback error
  }
  return null;
}

function runCommand(command: string, args: string[], cwd: string = process.cwd(), extraEnv?: Record<string, string>): boolean {
  console.log(`${colors.dim}$ ${command} ${args.join(" ")}${colors.reset}`);
  const env = {
    ...process.env,
    PATH: `${join(process.env.HOME || "", ".bun/bin")}:${join(process.cwd(), "node_modules/.bin")}:${process.env.PATH}`,
    ...extraEnv,
  };
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env,
  });
  return result.status === 0;
}

function tagExists(tagName: string): boolean {
  const result = spawnSync("git", ["rev-parse", "--verify", `refs/tags/${tagName}`], {
    stdio: "ignore",
    shell: true,
  });
  return result.status === 0;
}

function ensureGitUser(): void {
  const emailCheck = spawnSync("git", ["config", "user.email"], { encoding: "utf-8" });
  if (!emailCheck.stdout?.trim()) {
    spawnSync("git", ["config", "user.email", "github-actions[bot]@users.noreply.github.com"], { shell: true });
    spawnSync("git", ["config", "user.name", "github-actions[bot]"], { shell: true });
  }
}

function createGitHubRelease(tagName: string, pkgName: string, version: string): void {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log(`${colors.dim}ℹ️ GITHUB_TOKEN not set, skipping GitHub Release creation.${colors.reset}`);
    return;
  }

  console.log(`${colors.cyan}🚀 Creating GitHub Release for ${tagName}...${colors.reset}`);
  const releaseSuccess = runCommand("gh", [
    "release",
    "create",
    tagName,
    "--title",
    `${pkgName} v${version}`,
    "--generate-notes",
  ]);

  if (!releaseSuccess) {
    console.log(
      `${colors.yellow}⚠️ Note: GitHub release creation via gh CLI returned a non-zero exit code (release may already exist or notes generation failed).${colors.reset}`
    );
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run") || args.includes("-n");
  const isHelp = args.includes("--help") || args.includes("-h");

  if (isHelp) {
    console.log(`\n${colors.bold}${colors.cyan}📦 Masum Dev — Registry-Aware Auto Publisher${colors.reset}\n`);
    console.log("Compares local package.json versions against the live npm registry and publishes bumped packages.");
    console.log("\nUsage:");
    console.log("  bun run publish:changed [options]\n");
    console.log("Options:");
    console.log("  --dry-run, -n      Inspect candidate packages without building, publishing, or tagging");
    console.log("  --help, -h         Show this help screen\n");
    process.exit(0);
  }

  console.log(`\n${colors.bold}${colors.cyan}🔍 Scanning Monorepo Packages in packages/*...${colors.reset}`);
  const packages = getCandidatePackages();

  if (packages.length === 0) {
    console.log(`${colors.yellow}No public packages found in packages/ directory.${colors.reset}\n`);
    process.exit(0);
  }

  console.log(`Found ${colors.bold}${packages.length}${colors.reset} candidate package(s). Checking npm registry...\n`);

  const decisions: PublishDecision[] = [];

  for (const pkg of packages) {
    const remoteVersion = await fetchRemoteVersion(pkg.name);

    if (!remoteVersion) {
      decisions.push({
        meta: pkg,
        remoteVersion: null,
        shouldPublish: true,
        reason: "New package (not yet published on npm)",
      });
    } else {
      const cmp = compareSemVer(pkg.version, remoteVersion);
      if (cmp > 0) {
        decisions.push({
          meta: pkg,
          remoteVersion,
          shouldPublish: true,
          reason: `Local version (${pkg.version}) is higher than registry (${remoteVersion})`,
        });
      } else {
        decisions.push({
          meta: pkg,
          remoteVersion,
          shouldPublish: false,
          reason: `Up to date (local: ${pkg.version}, registry: ${remoteVersion})`,
        });
      }
    }
  }

  // Display summary table
  console.log("─".repeat(80));
  console.log(
    `${colors.bold}Package Name`.padEnd(35) +
      "Local".padEnd(12) +
      "Registry".padEnd(12) +
      `Status${colors.reset}`
  );
  console.log("─".repeat(80));

  for (const d of decisions) {
    const nameCol = colors.cyan + d.meta.name.padEnd(28) + colors.reset;
    const localCol = d.meta.version.padEnd(10);
    const remoteCol = (d.remoteVersion ?? "none").padEnd(10);
    const statusCol = d.shouldPublish
      ? `${colors.green}${colors.bold}TO PUBLISH${colors.reset} (${d.reason})`
      : `${colors.dim}UP TO DATE${colors.reset}`;

    console.log(`${nameCol}  ${localCol}  ${remoteCol}  ${statusCol}`);
  }
  console.log("─".repeat(80) + "\n");

  const toPublish = decisions.filter((d) => d.shouldPublish);

  if (toPublish.length === 0) {
    console.log(`${colors.green}✅ All packages are up to date with the npm registry. Nothing to publish.${colors.reset}\n`);
    process.exit(0);
  }

  if (isDryRun) {
    console.log(
      `${colors.yellow}${colors.bold}🔍 Dry-run complete!${colors.reset} ${toPublish.length} package(s) would be published if run live.\n`
    );
    process.exit(0);
  }

  console.log(
    `${colors.bold}${colors.green}🚀 Proceeding to build and publish ${toPublish.length} package(s)...${colors.reset}\n`
  );

  const npmToken = process.env.NODE_AUTH_TOKEN || process.env.NPM_TOKEN;
  const extraEnv: Record<string, string> = {};
  if (npmToken) {
    extraEnv.NODE_AUTH_TOKEN = npmToken;
    extraEnv.NPM_TOKEN = npmToken;
  }

  for (const item of toPublish) {
    const { meta } = item;
    console.log(`\n${"=".repeat(80)}`);
    console.log(`${colors.bold}📦 Processing: ${colors.cyan}${meta.name}${colors.reset} @ ${colors.green}v${meta.version}${colors.reset}`);
    console.log(`${"=".repeat(80)}\n`);

    // Step 1: Build package via Turborepo
    console.log(`${colors.yellow}🔨 Building ${meta.name} with Turborepo...${colors.reset}`);
    const buildSuccess = runCommand("turbo", ["run", "build", `--filter=${meta.name}`]);
    if (!buildSuccess) {
      console.error(`\n${colors.red}❌ Build failed for ${meta.name}! Aborting pipeline.${colors.reset}\n`);
      process.exit(1);
    }

    // Step 2: Publish package to npm
    console.log(`\n${colors.green}📤 Publishing ${meta.name}@${meta.version} to npm...${colors.reset}`);
    const publishArgs = ["publish", "--access", "public"];
    const isCI = Boolean(process.env.CI);
    const noProvenance = Boolean(process.env.NO_PROVENANCE);

    if (isCI && !noProvenance) {
      publishArgs.push("--provenance");
    }

    const publishSuccess = runCommand("npm", publishArgs, meta.path, extraEnv);
    if (!publishSuccess) {
      console.error(`\n${colors.red}❌ npm publish failed for ${meta.name}! Aborting pipeline.${colors.reset}\n`);
      process.exit(1);
    }

    // Step 3: Git Tag & GitHub Release
    const tagName = `${meta.name}@${meta.version}`;
    if (isCI || process.env.GITHUB_TOKEN) {
      console.log(`\n${colors.cyan}🏷️ Configuring Git Tag & Release...${colors.reset}`);
      ensureGitUser();

      if (!tagExists(tagName)) {
        console.log(`${colors.dim}Creating git tag ${tagName}...${colors.reset}`);
        const tagCreated = runCommand("git", ["tag", "-a", tagName, "-m", `Release ${tagName}`]);
        if (tagCreated) {
          console.log(`${colors.dim}Pushing git tag ${tagName} to remote...${colors.reset}`);
          runCommand("git", ["push", "origin", `refs/tags/${tagName}`]);
        }
      } else {
        console.log(`${colors.dim}ℹ️ Git tag ${tagName} already exists on remote.${colors.reset}`);
      }

      createGitHubRelease(tagName, meta.name, meta.version);
    }

    console.log(`\n${colors.bold}${colors.green}✨ Successfully published ${meta.name}@${meta.version}!${colors.reset}`);
  }

  console.log(`\n${colors.bold}${colors.green}🎉 All ${toPublish.length} package(s) processed and published successfully!${colors.reset}\n`);
}

main().catch((err: unknown) => {
  console.error(`\n${colors.red}💥 Unexpected pipeline failure:${colors.reset}`, err);
  process.exit(1);
});

