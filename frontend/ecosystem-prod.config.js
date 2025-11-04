module.exports = {
  apps: [{
    name: "bingo-app-prod",
    script: "npm",
    args: "run start",
    cwd: "/home/leonardo/bingo/tec-web-main",
    env: {
      NODE_ENV: "production",
      HOST: "0.0.0.0",
      PORT: 3000
    }
  }]
}
