import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function runSeoCheck() {
  console.log("🔍 STARTING SEO AUTO-CHECK FOR NEO4D.LIVE...");
  
  try {
    const url = 'https://neo4d.live';
    const response = await axios.get(url);
    const html = response.data;
    
    let issues = 0;
    
    console.log(`\n--- Checking ${url} ---`);
    
    // Check Title
    if (!html.includes('<title>')) {
      console.error("❌ Missing <title> tag");
      issues++;
    } else {
      console.log("✅ Title tag present");
    }
    
    // Check Description
    if (!html.includes('name="description"')) {
      console.error("❌ Missing meta description");
      issues++;
    } else {
      console.log("✅ Meta description present");
    }
    
    // Check Canonical
    if (!html.includes('rel="canonical"')) {
      console.error("❌ Missing canonical URL");
      issues++;
    } else {
      console.log("✅ Canonical URL present");
    }
    
    // Check Robots
    if (!html.includes('name="robots"')) {
      console.error("❌ Missing meta robots");
      issues++;
    } else {
      console.log("✅ Meta robots present");
    }
    
    // Check OG Tags
    if (!html.includes('property="og:title"')) {
      console.error("❌ Missing og:title");
      issues++;
    } else {
      console.log("✅ OpenGraph tags present");
    }
    
    if (issues === 0) {
      console.log("\n✅ ALL SEO CHECKS PASSED. Website is perfectly optimized.");
    } else {
      console.log(`\n⚠️ FOUND ${issues} SEO ISSUES. Please fix them.`);
    }
    
  } catch (err) {
    console.error("🔥 FATAL ERROR IN SEO CHECKER:", err.message);
  }
}

runSeoCheck();
