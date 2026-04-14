const { spawn } = require("child_process");
const { createServer } = require("net");
const process = require("process");

const preferredPorts = [8080, 8081, 8082, 8083, 8084];

function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function findPort() {
  for (const port of preferredPorts) {
    if (await checkPort(port)) {
      return port;
    }
  }
  throw new Error(`No free backend port found in ${preferredPorts.join(", ")}`);
}

function spawnProcess(command, args, env) {
  const proc = spawn(command, args, {
    env,
    stdio: "inherit",
    shell: true,
  });

  proc.on("exit", (code, signal) => {
    if (signal) {
      process.exit(1);
      return;
    }
    if (code !== 0) {
      process.exit(code || 1);
    }
  });

  return proc;
}

async function main() {
  const requestedPort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const backendPort = requestedPort && !Number.isNaN(requestedPort)
    ? requestedPort
    : await findPort();

  if (requestedPort && requestedPort !== backendPort) {
    throw new Error(`Requested PORT ${requestedPort} is unavailable.`);
  }

  const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? `http://127.0.0.1:${backendPort}`;
  const envBase = { ...process.env };
  const backendEnv = { ...envBase, PORT: String(backendPort), NODE_ENV: envBase.NODE_ENV || "development" };
  const frontendEnv = { ...envBase, VITE_API_PROXY_TARGET: apiProxyTarget, NODE_ENV: envBase.NODE_ENV || "development" };

  console.log(`Starting backend on port ${backendPort}`);
  console.log(`Using API proxy target: ${apiProxyTarget}`);

  spawnProcess("npx", ["--yes", "pnpm@9", "--filter", "@workspace/backend", "run", "dev"], backendEnv);
  spawnProcess("npx", ["--yes", "pnpm@9", "--filter", "@workspace/frontend", "run", "dev"], frontendEnv);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});