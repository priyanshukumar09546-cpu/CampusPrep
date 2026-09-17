async function testApi() {
  try {
    // 1. Health check
    const healthRes = await fetch('http://localhost:5000/api/health');
    console.log('Health Check Status:', healthRes.status, await healthRes.json());

    // 2. Test Admin Login with correct credentials
    const loginRes = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campusprep.edu', password: 'CampusPrep@Admin2026!' })
    });
    const loginData = await loginRes.json();
    console.log('Admin Login Status:', loginRes.status, loginData);

    if (loginData.success && loginData.token) {
      // 3. Test Protected Admin Endpoint
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      console.log('Protected Admin Stats Status:', statsRes.status, await statsRes.json());
    }

    // 4. Test Invalid Password
    const wrongRes = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campusprep.edu', password: 'WrongPassword123' })
    });
    console.log('Wrong Password Status:', wrongRes.status, await wrongRes.json());

  } catch (err) {
    console.error('API Test Error:', err);
  }
}

testApi();
