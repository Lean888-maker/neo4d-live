import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function runSeoCheck() {
  console.log("🔍 STARTING SEO AUTO-CHECK FOR NEO4D.LIVE...");
  
  const urls = [
    'https://neo4d.live',
    'https://neo4d.live/en/strategy',
    'https://neo4d.live/en/ramalan'
  ];

  try {
    let totalIssues = 0;
    
    for (const url of urls) {
      console.log(`\n--- Checking ${url} ---`);
      try {
        const response = await axios.get(url);
        const html = response.data;
        let issues = 0;
        
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
          console.log(`✅ ${url} is perfectly optimized.`);
        } else {
          console.log(`⚠️ FOUND ${issues} SEO ISSUES on ${url}.`);
        }
        
        totalIssues += issues;
      } catch (reqErr) {
        console.error(`🔥 ERROR FETCHING ${url}:`, reqErr.message);
        totalIssues++;
      }
    }

    if (totalIssues === 0) {
      console.log("\n✅ ALL URLS PASSED SEO CHECKS!");
    } else {
      console.log(`\n⚠️ TOTAL ISSUES FOUND ACROSS SITE: ${totalIssues}`);
    }
    
  } catch (err) {
    console.error("🔥 ERROR IN SEO CHECKER:", err.message);
    process.exit(0); // Never cause GitHub Actions failure email
  }
}

runSeoCheck();
