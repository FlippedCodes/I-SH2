import { test, expect } from 'bun:test';

const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

const testAppData = {
  name: "test-app",
  features: {
    tosLink: "https://example.com/tos",
    privacyPolicyLink: "https://example.com/privacy",
    textLength: 2000,
    trackMessage: true,
    deleteMessage: true,
    deleteMessageTime: 3600,
    inviteLinks: true,
    webhookSupport: true,
    media: true,
    mediaStickers: true,
    mediaEmojis: true,
  }
};

test('should create and retrieve an app', async () => {
  const response = await fetch(`${baseUrl}/v1/apps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testAppData)
  });

  expect(response.status).toBe(201);
  
  const getResponse = await fetch(`${baseUrl}/v1/apps/${testAppData.name}`);
  expect(getResponse.status).toBe(200);
  
  const data = await getResponse.json();
  expect(data.name).toBe(testAppData.name);
});

test('should delaunch an app', async () => {
  const deleteResponse = await fetch(`${baseUrl}/v1/apps/${testAppData.name}`, {
    method: 'DELETE'
  });
  
  expect(deleteResponse.status).toBe(200);
  
  // Verify the app is marked as delaunched
  const getResponse = await fetch(`${baseUrl}/v1/apps/${testAppData.name}`);
  const data = await getResponse.json();
  expect(data.delaunch).toBe(true);
});

test('should forcefully delete an app', async () => {
  // Recreate the app since it was deleted
  const createResponse = await fetch(`${baseUrl}/v1/apps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testAppData)
  });
  
  expect(createResponse.status).toBe(200);
  
  // Delaunch the app first
  const delaunchResponse = await fetch(`${baseUrl}/v1/apps/${testAppData.name}`, {
    method: 'DELETE'
  });
  
  expect(delaunchResponse.status).toBe(200);
  
  // Force delete it
  const forceDeleteResponse = await fetch(`${baseUrl}/v1/apps/delete/${testAppData.name}?force=true`, {
    method: 'DELETE'
  });
  
  expect(forceDeleteResponse.status).toBe(200);
  
  // Verify it's completely deleted
  const verifyDeleteResponse = await fetch(`${baseUrl}/v1/apps/${testAppData.name}`);
  expect(verifyDeleteResponse.status).toBe(404);
});