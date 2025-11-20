/**
 * Test Backend Login
 * Test login dengan credentials backend real
 */

import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting backend login test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down untuk bisa lihat prosesnya
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Navigate to login page
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    // 2. Fill login form
    console.log('✏️  Filling login form...');
    console.log('   Email: manajer@sejahtera-jkt.id');
    console.log('   Password: password\n');
    
    await page.fill('input[type="email"]', 'manajer@sejahtera-jkt.id');
    await page.fill('input[type="password"]', 'password');
    
    // 3. Click login button
    console.log('🔐 Clicking login button...');
    await page.click('button[type="submit"]');
    
    // 4. Wait for response
    console.log('⏳ Waiting for API response...\n');
    
    // Monitor network requests
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/auth/login')) {
        console.log('📡 API Response:');
        console.log('   URL:', url);
        console.log('   Status:', response.status());
        
        try {
          const responseData = await response.json();
          console.log('   Response:', JSON.stringify(responseData, null, 2));
        } catch (e) {
          const text = await response.text();
          console.log('   Response (text):', text);
        }
      }
    });
    
    // Wait for navigation or error message
    await Promise.race([
      page.waitForNavigation({ timeout: 10000 }).then(() => {
        console.log('\n✅ Login successful! Redirected to dashboard.');
      }),
      page.waitForSelector('text=/salah|error|gagal/i', { timeout: 10000 }).then(async () => {
        const errorText = await page.textContent('text=/salah|error|gagal/i');
        console.log('\n❌ Login failed!');
        console.log('   Error message:', errorText);
      })
    ]).catch(async () => {
      // Check current URL
      const currentUrl = page.url();
      console.log('\n📍 Current URL:', currentUrl);
      
      if (currentUrl.includes('/dashboard') || currentUrl !== 'http://localhost:5173/login') {
        console.log('✅ Login might be successful (URL changed)');
      } else {
        console.log('❓ Login status unclear');
        
        // Take screenshot
        await page.screenshot({ path: 'login-test-result.png' });
        console.log('📸 Screenshot saved: login-test-result.png');
      }
    });
    
    // Wait a bit to see the result
    await page.waitForTimeout(3000);
    
    // Check session storage
    const session = await page.evaluate(() => {
      const sessionData = sessionStorage.getItem('sako_session');
      return sessionData ? 'Session exists' : 'No session';
    });
    console.log('\n💾 Session status:', session);
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    
    // Take screenshot on error
    await page.screenshot({ path: 'login-test-error.png' });
    console.log('📸 Error screenshot saved: login-test-error.png');
  }
  
  console.log('\n✨ Test completed! Browser will close in 5 seconds...');
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
