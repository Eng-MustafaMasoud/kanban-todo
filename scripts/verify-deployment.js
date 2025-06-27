#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Verifying deployment configuration...\n");

// Check if database file exists
const dbPath = path.join(__dirname, "..", "tools", "db.json");
if (fs.existsSync(dbPath)) {
  console.log("✅ Database file found:", dbPath);

  try {
    const dbContent = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    console.log("✅ Database structure is valid JSON");
    console.log(`   - Tasks: ${dbContent.tasks?.length || 0}`);
    console.log(`   - Columns: ${dbContent.columns?.length || 0}`);
  } catch (error) {
    console.log("❌ Database file is not valid JSON");
    process.exit(1);
  }
} else {
  console.log("❌ Database file not found:", dbPath);
  process.exit(1);
}

// Check if API routes exist
const apiRoutes = [
  "src/app/api/tasks/route.ts",
  "src/app/api/tasks/[id]/route.ts",
  "src/app/api/columns/route.ts",
];

apiRoutes.forEach((route) => {
  const routePath = path.join(__dirname, "..", route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ API route exists: ${route}`);
  } else {
    console.log(`❌ API route missing: ${route}`);
    process.exit(1);
  }
});

// Check package.json build script
const packagePath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  if (
    packageJson.scripts.build &&
    packageJson.scripts.build.includes("cp tools/db.json")
  ) {
    console.log("✅ Build script includes database copy");
  } else {
    console.log("❌ Build script missing database copy");
    process.exit(1);
  }
}

// Check netlify.toml
const netlifyPath = path.join(__dirname, "..", "netlify.toml");
if (fs.existsSync(netlifyPath)) {
  console.log("✅ Netlify configuration exists");
} else {
  console.log("❌ Netlify configuration missing");
  process.exit(1);
}

console.log("\n🎉 All deployment checks passed!");
console.log("\n📋 Deployment Summary:");
console.log("   - Database file: ✅");
console.log("   - API routes: ✅");
console.log("   - Build script: ✅");
console.log("   - Netlify config: ✅");
console.log("\n🚀 Ready for deployment!");
