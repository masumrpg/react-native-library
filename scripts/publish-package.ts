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
};

interface PackageMeta {
  folder: string;
  name: string;
  version: string;
  path: string;
}

function getAvailablePackages(): Map<string, PackageMeta> {
  const pkgs = new Map<string, PackageMeta>();
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
            const meta: PackageMeta = {
              folder: entry.name,
              name: pkgJson.name,
              version: pkgJson.version,
              path: join(PACKAGES_DIR, entry.name),
            };
            pkgs.set(entry.name, meta);
            pkgs.set(pkgJson.name, meta);
          }
        } catch {
          // ignore malformed package.json
        }
      }
    }
  }
  return pkgs;
}

function runCommand(command: string, args: string[], cwd: string = process.cwd()): boolean {
  console.log(`${colors.dim}$ ${command} ${args.join(" ")}${colors.reset}`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
  return result.status === 0;
}

function main(): void {
  const args = process.argv.slice(2);
  const available = getAvailablePackages();

  const targetArg = args[0];
  const bumpArg = args[1]; // optional: patch, minor, major, or explicit version

  if (!targetArg || targetArg === "--help" || targetArg === "-h") {
    console.log(`\n${colors.bold}${colors.cyan}📦 Masum Dev — Dynamic Package Publisher${colors.reset}\n`);
    console.log(`Usage:`);
    console.log(`  bun run publish <package-name> [patch|minor|major]\n`);
    console.log(`Available packages in monorepo:`);
    const uniquePkgs = Array.from(new Set<PackageMeta>(available.values()));
    for (const pkg of uniquePkgs) {
      console.log(`  - ${colors.green}${pkg.folder}${colors.reset} (${colors.bold}${pkg.name}${colors.reset} @ v${pkg.version})`);
    }
    console.log(`\nExamples:`);
    console.log(`  bun run publish rn-qr-code`);
    console.log(`  bun run publish rn-qr-code patch`);
    console.log(`  bun run publish rn-ui minor`);
    console.log(`  bun run publish rn-tajweed-verse patch\n`);
    process.exit(targetArg ? 0 : 1);
  }

  const pkgMeta = available.get(targetArg);
  if (!pkgMeta) {
    console.error(`\n${colors.red}❌ Package "${targetArg}" not found in packages/${colors.reset}`);
    console.log(`\nAvailable options:`);
    for (const folder of Array.from(new Set(Array.from(available.values()).map((p) => p.folder)))) {
      console.log(`  - ${folder}`);
    }
    process.exit(1);
  }

  console.log(`\n${colors.bold}🚀 Publishing ${colors.cyan}${pkgMeta.name}${colors.reset} (folder: ${pkgMeta.folder})...\n`);

  // Step 1: Version bump (if specified)
  if (bumpArg) {
    console.log(`${colors.yellow}📌 Bumping version (${bumpArg})...${colors.reset}`);
    const bumpSuccess = runCommand("npm", ["version", bumpArg, "--no-git-tag-version"], pkgMeta.path);
    if (!bumpSuccess) {
      console.error(`${colors.red}❌ Failed to bump version${colors.reset}`);
      process.exit(1);
    }
  }

  // Step 2: Build package via Turborepo
  console.log(`\n${colors.yellow}🔨 Building ${pkgMeta.name} with Turbo...${colors.reset}`);
  const buildSuccess = runCommand("turbo", ["run", "build", `--filter=${pkgMeta.name}`]);
  if (!buildSuccess) {
    console.error(`${colors.red}❌ Build failed for ${pkgMeta.name}${colors.reset}`);
    process.exit(1);
  }

  // Step 3: Publish to npm registry via Bun
  console.log(`\n${colors.green}📤 Publishing to npm registry...${colors.reset}`);
  const publishSuccess = runCommand("bun", ["publish", "--access", "public"], pkgMeta.path);
  if (!publishSuccess) {
    console.error(`${colors.red}❌ Publish failed for ${pkgMeta.name}${colors.reset}`);
    process.exit(1);
  }

  console.log(`\n${colors.bold}${colors.green}✨ Successfully published ${pkgMeta.name}!${colors.reset}\n`);
}

main();
