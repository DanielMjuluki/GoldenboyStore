const { spawn } = require('node:child_process');
const path = require('node:path');
const process = require('node:process');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || path.resolve(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...options.env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed (${code})\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
      }
    });
  });
}

async function waitForServer(url, timeoutMs = 120000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
    } catch {
      // ignore and keep polling
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  console.log('Running production build...');
  await runCommand('npm', ['run', 'build']);

  console.log('Starting development server for smoke test...');
  const server = spawn('npm', ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', '3100'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  server.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  try {
    const response = await waitForServer('http://127.0.0.1:3100/api/products');
    const data = await response.json();

    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('Expected products to be returned from /api/products');
    }

    console.log(`Smoke test passed with ${data.products.length} products.`);
  } finally {
    server.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
