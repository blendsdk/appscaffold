#!/usr/bin/env node

// src/index.ts
import { execSync } from "node:child_process";

// src/prompts.ts
import * as readline from "node:readline";
import * as path from "node:path";

// src/types.ts
var DEFAULTS = {
  backendPort: "4000",
  frontendPort: "5173",
  dbPort: "5432",
  redisPort: "6379"
};

// src/prompts.ts
function createRL() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}
function ask(rl, question, defaultValue) {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  return new Promise((resolve) => {
    rl.question(`  ${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}
function confirm(rl, question, defaultYes = true) {
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  return new Promise((resolve) => {
    rl.question(`  ${question} ${hint}: `, (answer) => {
      const val = answer.trim().toLowerCase();
      if (val === "") {
        resolve(defaultYes);
      } else {
        resolve(val === "y" || val === "yes");
      }
    });
  });
}
async function runInteractivePrompts() {
  const rl = createRL();
  const dirName = path.basename(process.cwd());
  try {
    console.log("");
    console.log("\u2500\u2500 Project Configuration \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    const name = await ask(rl, "Project name", dirName);
    const scopeDefault = `@${name.toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
    const scope = await ask(rl, "Package scope", scopeDefault);
    const description = await ask(rl, "Description", "");
    console.log("");
    console.log("\u2500\u2500 Backend Configuration \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    const backendPort = await ask(rl, "Backend port", DEFAULTS.backendPort);
    const dbNameDefault = name.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const dbName = await ask(rl, "Database name", dbNameDefault);
    const dbPort = await ask(rl, "Database host port", DEFAULTS.dbPort);
    const redisPort = await ask(rl, "Redis host port", DEFAULTS.redisPort);
    console.log("");
    console.log("\u2500\u2500 Frontend Configuration \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    const frontendPort = await ask(rl, "Frontend dev port", DEFAULTS.frontendPort);
    console.log("");
    console.log("\u2500\u2500 Features \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    const oidc = await confirm(rl, "Include OIDC authentication?", true);
    const i18n = await confirm(rl, "Include i18n (internationalization)?", true);
    const mailer = await confirm(rl, "Include email service (mailer)?", false);
    const fileUpload = await confirm(rl, "Include file upload support?", false);
    console.log("");
    console.log("\u2500\u2500 Deployment \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    const blueGreen = await confirm(rl, "Install blue-green deployment scaffold?", true);
    console.log("");
    return {
      name,
      scope,
      description,
      backendPort,
      frontendPort,
      dbName,
      dbPort,
      redisPort,
      oidc,
      i18n,
      mailer,
      fileUpload,
      blueGreen
    };
  } finally {
    rl.close();
  }
}
function answersFromFlags(flags) {
  const name = flags.name ?? path.basename(process.cwd());
  const scopeDefault = `@${name.toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
  return {
    name,
    scope: flags.scope ?? scopeDefault,
    description: flags.description ?? "",
    backendPort: flags.port ?? DEFAULTS.backendPort,
    frontendPort: flags.frontendPort ?? DEFAULTS.frontendPort,
    dbName: flags.dbName ?? name.toLowerCase().replace(/[^a-z0-9_]/g, ""),
    dbPort: flags.dbPort ?? DEFAULTS.dbPort,
    redisPort: flags.redisPort ?? DEFAULTS.redisPort,
    oidc: flags.oidc ?? true,
    i18n: flags.i18n ?? true,
    mailer: flags.mailer ?? false,
    fileUpload: flags.fileUpload ?? false,
    blueGreen: flags.blueGreen ?? true
  };
}

// src/generator.ts
import * as path4 from "node:path";

// src/renderer.ts
import * as fs from "node:fs";
import * as path2 from "node:path";
import { fileURLToPath } from "node:url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
function scaffoldRoot() {
  const bundledPath = path2.join(path2.dirname(__filename), "templates");
  if (fs.existsSync(bundledPath)) {
    return path2.dirname(__filename);
  }
  return path2.join(__dirname, "..", "scaffold");
}
function render(template, vars) {
  return template.replace(/\{\{([A-Z_][A-Z0-9_]*)\}\}/g, (match, key) => {
    return key in vars ? vars[key] : match;
  });
}
function readTemplate(relativePath) {
  const fullPath = path2.join(scaffoldRoot(), "templates", relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template not found: ${relativePath} (looked in ${fullPath})`);
  }
  return fs.readFileSync(fullPath, "utf-8");
}
function readPartial(filename) {
  const fullPath = path2.join(scaffoldRoot(), "partials", filename);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Partial not found: ${filename} (looked in ${fullPath})`);
  }
  return fs.readFileSync(fullPath, "utf-8");
}

// src/writer.ts
import * as fs2 from "node:fs";
import * as path3 from "node:path";
function ensureDir(dirPath) {
  if (!fs2.existsSync(dirPath)) {
    fs2.mkdirSync(dirPath, { recursive: true });
  }
}
function writeFile(destPath, content, executable, options) {
  const { force = false, dryRun = false } = options ?? {};
  if (dryRun) {
    return { dest: destPath, status: "dry-run" };
  }
  const exists = fs2.existsSync(destPath);
  if (exists && !force) {
    return { dest: destPath, status: "skipped" };
  }
  ensureDir(path3.dirname(destPath));
  fs2.writeFileSync(destPath, content, "utf-8");
  if (executable) {
    fs2.chmodSync(destPath, 493);
  }
  return { dest: destPath, status: exists ? "overwritten" : "created" };
}

// src/generator.ts
function buildTemplateVars(answers) {
  const vars = {
    PROJECT_NAME: answers.name,
    PROJECT_NAME_LOWER: answers.name.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    PACKAGE_SCOPE: answers.scope,
    DESCRIPTION: answers.description,
    BACKEND_PORT: answers.backendPort,
    FRONTEND_PORT: answers.frontendPort,
    DB_NAME: answers.dbName,
    DB_PORT: answers.dbPort,
    REDIS_PORT: answers.redisPort,
    NCU_EXCLUDES: "blendsdk,@fluentui/*,react,react-dom,@types/react,@types/react-dom"
  };
  vars.WEBAPI_DEPS_PARTIAL = "";
  if (answers.oidc) {
    vars.WEBAPI_DEPS_PARTIAL += readPartial("deps-oidc.txt");
  }
  if (answers.mailer) {
    vars.WEBAPI_DEPS_PARTIAL += readPartial("deps-mailer.txt");
  }
  vars.WEBAPI_PLUGIN_IMPORTS = "";
  if (answers.oidc) {
    vars.WEBAPI_PLUGIN_IMPORTS += readPartial("oidc-plugin-import.txt");
  }
  if (answers.i18n) {
    vars.WEBAPI_PLUGIN_IMPORTS += readPartial("i18n-plugin-import.txt");
  }
  if (answers.mailer) {
    vars.WEBAPI_PLUGIN_IMPORTS += readPartial("mailer-plugin-import.txt");
  }
  vars.WEBAPI_PLUGIN_REGISTRATIONS = "";
  if (answers.oidc) {
    vars.WEBAPI_PLUGIN_REGISTRATIONS += readPartial("oidc-plugin-registration.txt");
  }
  if (answers.i18n) {
    vars.WEBAPI_PLUGIN_REGISTRATIONS += readPartial("i18n-plugin-registration.txt");
  }
  if (answers.mailer) {
    vars.WEBAPI_PLUGIN_REGISTRATIONS += readPartial("mailer-plugin-registration.txt");
  }
  vars.DOCKER_MAILPIT_PARTIAL = "";
  if (answers.mailer) {
    vars.DOCKER_MAILPIT_PARTIAL = readPartial("docker-mailpit.txt");
  }
  vars.WEBAPI_DEVDEPS_PARTIAL = "";
  if (answers.mailer) {
    vars.WEBAPI_DEVDEPS_PARTIAL += readPartial("devdeps-mailer.txt");
  }
  return vars;
}
function buildFileList(answers) {
  const files = [
    // Root files
    { templatePath: "root/package.json", destPath: "package.json" },
    { templatePath: "root/turbo.json", destPath: "turbo.json" },
    { templatePath: "root/tsconfig.base.json", destPath: "tsconfig.base.json" },
    { templatePath: "root/.nvmrc", destPath: ".nvmrc" },
    { templatePath: "root/.editorconfig", destPath: ".editorconfig" },
    { templatePath: "root/.prettierrc", destPath: ".prettierrc" },
    { templatePath: "root/.gitignore", destPath: ".gitignore" },
    { templatePath: "root/README.md", destPath: "README.md" },
    { templatePath: "root/deploy-package.sh", destPath: "deploy-package.sh", executable: true },
    // Shared package
    { templatePath: "shared/package.json", destPath: "packages/shared/package.json" },
    { templatePath: "shared/tsconfig.json", destPath: "packages/shared/tsconfig.json" },
    { templatePath: "shared/.gitignore", destPath: "packages/shared/.gitignore" },
    { templatePath: "shared/src/index.ts", destPath: "packages/shared/src/index.ts" },
    { templatePath: "shared/src/types/index.ts", destPath: "packages/shared/src/types/index.ts" },
    // Codegen package (always included)
    { templatePath: "codegen/package.json", destPath: "packages/codegen/package.json" },
    { templatePath: "codegen/tsconfig.json", destPath: "packages/codegen/tsconfig.json" },
    { templatePath: "codegen/.gitignore", destPath: "packages/codegen/.gitignore" },
    { templatePath: "codegen/src/index.ts", destPath: "packages/codegen/src/index.ts" },
    // WebAPI package
    { templatePath: "webapi/package.json", destPath: "packages/webapi/package.json" },
    { templatePath: "webapi/tsconfig.json", destPath: "packages/webapi/tsconfig.json" },
    { templatePath: "webapi/.gitignore", destPath: "packages/webapi/.gitignore" },
    { templatePath: "webapi/.env.js", destPath: "packages/webapi/.env.js" },
    { templatePath: "webapi/.env.local.js.example", destPath: "packages/webapi/.env.local.js.example" },
    { templatePath: "webapi/src/index.ts", destPath: "packages/webapi/src/index.ts" },
    {
      templatePath: "webapi/src/controllers/health-controller.ts",
      destPath: "packages/webapi/src/controllers/health-controller.ts"
    },
    { templatePath: "webapi/src/types/index.ts", destPath: "packages/webapi/src/types/index.ts" },
    { templatePath: "webapi/config/app.config.js", destPath: "packages/webapi/config/app.config.js" },
    {
      templatePath: "webapi/docker/docker-compose.yml",
      destPath: "packages/webapi/docker/docker-compose.yml"
    },
    {
      templatePath: "webapi/docker/postgres/1.database.sh",
      destPath: "packages/webapi/docker/postgres/1.database.sh",
      executable: true
    },
    // WebClient package
    { templatePath: "webclient/package.json", destPath: "packages/webclient/package.json" },
    { templatePath: "webclient/tsconfig.json", destPath: "packages/webclient/tsconfig.json" },
    { templatePath: "webclient/tsconfig.node.json", destPath: "packages/webclient/tsconfig.node.json" },
    { templatePath: "webclient/vite.config.ts", destPath: "packages/webclient/vite.config.ts" },
    { templatePath: "webclient/index.html", destPath: "packages/webclient/index.html" },
    { templatePath: "webclient/.gitignore", destPath: "packages/webclient/.gitignore" },
    { templatePath: "webclient/src/main.tsx", destPath: "packages/webclient/src/main.tsx" },
    { templatePath: "webclient/src/App.tsx", destPath: "packages/webclient/src/App.tsx" },
    { templatePath: "webclient/src/vite-env.d.ts", destPath: "packages/webclient/src/vite-env.d.ts" },
    {
      templatePath: "webclient/src/components/Layout/Layout.tsx",
      destPath: "packages/webclient/src/components/Layout/Layout.tsx"
    },
    { templatePath: "webclient/src/pages/Home.tsx", destPath: "packages/webclient/src/pages/Home.tsx" },
    { templatePath: "webclient/src/theme/index.ts", destPath: "packages/webclient/src/theme/index.ts" },
    { templatePath: "webclient/src/styles/global.css", destPath: "packages/webclient/src/styles/global.css" },
    { templatePath: "webclient/src/api/index.ts", destPath: "packages/webclient/src/api/index.ts" },
    { templatePath: "webclient/src/system/index.ts", destPath: "packages/webclient/src/system/index.ts" },
    {
      templatePath: "webclient/src/system/routing/routes.ts",
      destPath: "packages/webclient/src/system/routing/routes.ts"
    },
    { templatePath: "webclient/public/favicon.svg", destPath: "packages/webclient/public/favicon.svg" },
    { templatePath: "webclient/public/robots.txt", destPath: "packages/webclient/public/robots.txt" }
  ];
  if (answers.oidc) {
    files.push({
      templatePath: "webapi/src/plugins/oidc-auth-plugin.ts",
      destPath: "packages/webapi/src/plugins/oidc-auth-plugin.ts"
    });
  }
  const gitkeepDirs = [
    "packages/webapi/src/plugins",
    "packages/webapi/src/services",
    "packages/webapi/src/dataservices",
    "packages/webapi/src/modules/api",
    "packages/webapi/src/utils",
    "packages/webapi/resources/database",
    "packages/webapi/resources/public",
    "packages/codegen/resources/database"
  ];
  if (answers.i18n) {
    gitkeepDirs.push("packages/webapi/resources/i18n");
  }
  for (const dir of gitkeepDirs) {
    files.push({
      templatePath: "__gitkeep__",
      destPath: `${dir}/.gitkeep`
    });
  }
  return files;
}
function generateAllFiles(answers, options) {
  const vars = buildTemplateVars(answers);
  const fileList = buildFileList(answers);
  const results = [];
  for (const entry of fileList) {
    const destPath = path4.join(options.outputDir, entry.destPath);
    let content;
    if (entry.templatePath === "__gitkeep__") {
      content = "";
    } else {
      const template = readTemplate(entry.templatePath);
      content = render(render(template, vars), vars);
    }
    const result = writeFile(destPath, content, entry.executable, {
      force: options.force,
      dryRun: options.dryRun
    });
    results.push(result);
  }
  return results;
}

// src/index.ts
var HELP_TEXT = `
BlendSDK App Scaffold Generator

Usage:
  scaffold [options]

Options:
  --name <name>           Project name (enables non-interactive mode)
  --scope <scope>         Package scope (default: @<lowercase-name>)
  --description <desc>    Project description
  --port <port>           Backend port (default: 4000)
  --frontend-port <port>  Frontend dev port (default: 5173)
  --db-name <name>        Database name (default: <lowercase-name>)
  --db-port <port>        Database host port (default: 5432)
  --redis-port <port>     Redis host port (default: 6379)
  --oidc                  Include OIDC authentication (default: true)
  --no-oidc               Exclude OIDC authentication
  --i18n                  Include i18n support (default: true)
  --no-i18n               Exclude i18n support
  --mailer                Include email service
  --no-mailer             Exclude email service (default)
  --file-upload           Include file upload support
  --no-file-upload        Exclude file upload (default)
  --blue-green            Install blue-green deployment (default: true)
  --no-blue-green         Skip blue-green deployment
  --force                 Overwrite existing files
  --dry-run               Preview without writing files
  --help                  Show this help message

Examples:
  # Interactive mode
  scaffold

  # Non-interactive mode
  scaffold --name CastingAppST --scope @castingappst --port 4000

  # Via install.sh
  curl -fsSL https://raw.githubusercontent.com/blendsdk/app-scaffold/master/install.sh | bash
`;
function parseArgs(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--name":
        flags.name = args[++i];
        break;
      case "--scope":
        flags.scope = args[++i];
        break;
      case "--description":
        flags.description = args[++i];
        break;
      case "--port":
        flags.port = args[++i];
        break;
      case "--frontend-port":
        flags.frontendPort = args[++i];
        break;
      case "--db-name":
        flags.dbName = args[++i];
        break;
      case "--db-port":
        flags.dbPort = args[++i];
        break;
      case "--redis-port":
        flags.redisPort = args[++i];
        break;
      case "--oidc":
        flags.oidc = true;
        break;
      case "--no-oidc":
        flags.oidc = false;
        break;
      case "--i18n":
        flags.i18n = true;
        break;
      case "--no-i18n":
        flags.i18n = false;
        break;
      case "--mailer":
        flags.mailer = true;
        break;
      case "--no-mailer":
        flags.mailer = false;
        break;
      case "--file-upload":
        flags.fileUpload = true;
        break;
      case "--no-file-upload":
        flags.fileUpload = false;
        break;
      case "--blue-green":
        flags.blueGreen = true;
        break;
      case "--no-blue-green":
        flags.blueGreen = false;
        break;
      case "--force":
        flags.force = true;
        break;
      case "--dry-run":
        flags.dryRun = true;
        break;
      case "--help":
      case "-h":
        flags.help = true;
        break;
    }
  }
  return flags;
}
function printSummary(results) {
  const created = results.filter((r) => r.status === "created").length;
  const overwritten = results.filter((r) => r.status === "overwritten").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const dryRun = results.filter((r) => r.status === "dry-run").length;
  console.log("");
  console.log("\u2500\u2500 Summary \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  console.log(`  \u2705 Created:     ${created}`);
  if (overwritten > 0) console.log(`  \u267B\uFE0F  Overwritten: ${overwritten}`);
  if (skipped > 0) console.log(`  \u23ED\uFE0F  Skipped:     ${skipped}`);
  if (dryRun > 0) console.log(`  \u{1F50D} Dry-run:     ${dryRun}`);
  console.log(`  \u{1F4C1} Total:       ${results.length}`);
  console.log("");
}
async function main() {
  const args = process.argv.slice(2);
  const flags = parseArgs(args);
  if (flags.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }
  console.log("");
  console.log("\u{1F680} BlendSDK App Scaffold Generator");
  console.log("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  const answers = flags.name ? answersFromFlags(flags) : await runInteractivePrompts();
  const outputDir = process.cwd();
  console.log("");
  console.log("\u{1F4C1} Generating project files...");
  const results = generateAllFiles(answers, {
    outputDir,
    force: flags.force,
    dryRun: flags.dryRun
  });
  printSummary(results);
  if (!flags.dryRun) {
    console.log("\u2500\u2500 Next Steps \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    console.log("  1. yarn install");
    console.log("  2. yarn docker:dev");
    console.log("  3. yarn dev");
    console.log("");
  }
  if (answers.blueGreen && !flags.dryRun) {
    console.log("\u2500\u2500 Blue-Green Deployment \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
    console.log("  Installing blue-green deployment scaffold...");
    console.log("");
    try {
      execSync(
        "curl -fsSL https://raw.githubusercontent.com/blendsdk/blue-green/master/install.sh | bash",
        { cwd: outputDir, stdio: "inherit" }
      );
    } catch {
      console.log("");
      console.log("  \u26A0\uFE0F  Blue-green installation failed. You can install it later:");
      console.log(
        "     curl -fsSL https://raw.githubusercontent.com/blendsdk/blue-green/master/install.sh | bash"
      );
      console.log("");
    }
  }
}
main().catch((err) => {
  console.error("\u274C Scaffold generation failed:", err.message);
  process.exit(1);
});
