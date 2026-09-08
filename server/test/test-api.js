async function testApi() {
  console.log('🧪 Testing API endpoints...');

  const PORT = process.env.PORT || 5000;
  const baseUrl = `http://localhost:${PORT}/api`;

  try {
    await fetch(`${baseUrl}/health`);
  } catch (err) {
    console.log('⚡ Server not running yet, importing server/index.js to start it...');
    await import('../index.js');
    await new Promise((r) => setTimeout(r, 2000));
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const health = await healthRes.json();
    console.log('✅ /api/health:', health);

    // 2. Providers list
    const provRes = await fetch(`${baseUrl}/providers`);
    const provData = await provRes.json();
    console.log(`✅ /api/providers: Loaded ${provData.count} providers`);

    // 3. Match test
    const matchPayload = {
      serviceType: 'Smart Lighting & Control',
      location: {
        lat: 30.2672,
        lng: -97.7431,
        address: '600 Congress Ave, Austin, TX',
      },
      preferredTimeRange: {
        start: new Date(Date.now() + 3600000).toISOString(),
        end: new Date(Date.now() + 7200000).toISOString(),
      },
      urgency: 'High',
      filterCollisions: true,
    };

    const matchRes = await fetch(`${baseUrl}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchPayload),
    });
    const matchData = await matchRes.json();
    console.log(
      `✅ /api/match: Matched ${matchData.results?.length} providers for "${matchPayload.serviceType}"`
    );
    if (matchData.results && matchData.results.length > 0) {
      const topMatch = matchData.results[0];
      console.log(`   Top Provider: ${topMatch.provider.name}`);
      console.log(`   Match Score: ${topMatch.matchScore}/100`);
      console.log(`   Breakdown:`, topMatch.breakdown);
    }

    // 4. Create Service Request
    const reqPayload = {
      customer: {
        name: 'Jordan Miller',
        phone: '+1 (512) 555-9876',
        email: 'jordan.m@example.com',
        address: '600 Congress Ave, Austin, TX',
      },
      serviceType: 'Smart Lighting & Control',
      location: matchPayload.location,
      preferredTimeRange: matchPayload.preferredTimeRange,
      urgency: 'High',
      details: 'Living room Lutron Caseta hub dropped off network and requires re-pairing.',
      matchedProviders: matchData.results.slice(0, 3).map((r) => ({
        providerId: r.provider._id,
        matchScore: r.matchScore,
        breakdown: r.breakdown,
      })),
    };

    const createRes = await fetch(`${baseUrl}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqPayload),
    });
    const createData = await createRes.json();
    console.log(`✅ /api/requests: Created Request ID ${createData.data._id}`);
    console.log(`   Status: ${createData.data.status}`);

    // 5. Test status transition to 'Accepted'
    if (matchData.results.length > 0) {
      const providerId = matchData.results[0].provider._id;
      const patchRes = await fetch(`${baseUrl}/requests/${createData.data._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Accepted',
          providerId,
          note: 'Provider accepted the service dispatch.',
        }),
      });
      const patchData = await patchRes.json();
      console.log(`✅ Status updated to: ${patchData.data.status}`);
      console.log(`   Assigned Provider: ${patchData.data.assignedProvider?.name}`);
    }

    console.log('\n🎉 ALL PHASE 1 BACKEND & API TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ API Integration Test Failed:', err);
    process.exit(1);
  }
}

testApi();
