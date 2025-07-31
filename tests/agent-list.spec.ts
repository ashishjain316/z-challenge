import { test, expect } from '@playwright/test';

const mockAgents = [
  {
    first_name: 'John',
    last_name: 'Doe',
    status: 'online',
    profile: 'agent',
    avatar: 'https://example.com/john.jpg'
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
    status: 'busy',
    profile: 'supervisor',
    avatar: 'https://example.com/jane.jpg'
  },
  {
    first_name: 'Bob',
    last_name: 'Johnson',
    status: 'away',
    profile: 'agent',
    avatar: 'https://example.com/bob.jpg'
  },
  {
    first_name: 'Alice',
    last_name: 'Brown',
    status: 'offline',
    profile: 'manager',
    avatar: 'https://example.com/alice.jpg'
  }
];

test.describe('AgentList Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://3nzfzc8au7.execute-api.us-east-1.amazonaws.com/default/agents', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ agents: mockAgents })
      });
    });

    await page.goto('/');
  });

  test('Display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact Center Agents' })).toBeVisible();
  });

  test('Display all agents after loading', async ({ page }) => {
    // Mock response with delay
    await page.route('https://3nzfzc8au7.execute-api.us-east-1.amazonaws.com/default/agents', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ agents: mockAgents })
        });
    });
    await page.reload();
    
    await expect(page.locator('.animate-spin')).toBeVisible();

    await expect(page.locator('.grid')).toBeVisible();    
    for (const agent of mockAgents) {
      await expect(page.getByText(`${agent.first_name} ${agent.last_name}`)).toBeVisible();
    }
  });


  test('Display agent count correctly', async ({ page }) => {
    await expect(page.getByText(`Showing ${mockAgents.length} of ${mockAgents.length} agents`)).toBeVisible();
  });

  test('Filter agents by status', async ({ page }) => {
    await expect(page.locator('.grid')).toBeVisible();

    // Test filtering by online status
    await page.selectOption('#status-filter', 'online');
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
    await expect(page.getByText('Showing 1 of 4 agents')).toBeVisible();

    // Test filtering by busy status
    await page.selectOption('#status-filter', 'busy');
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('John Doe')).not.toBeVisible();
    await expect(page.getByText('Showing 1 of 4 agents')).toBeVisible();

    // Test filtering by away status
    await page.selectOption('#status-filter', 'away');
    await expect(page.getByText('Bob Johnson')).toBeVisible();
    await expect(page.getByText('Showing 1 of 4 agents')).toBeVisible();

    // Test filtering by offline status
    await page.selectOption('#status-filter', 'offline');
    await expect(page.getByText('Alice Brown')).toBeVisible();
    await expect(page.getByText('Showing 1 of 4 agents')).toBeVisible();

    // Test showing all agents
    await page.selectOption('#status-filter', 'all');
    await expect(page.getByText('Showing 4 of 4 agents')).toBeVisible();
  });

  test('Sort agents by status priority and name', async ({ page }) => {
    await expect(page.locator('.grid')).toBeVisible();

    // Get all agent cards
    const agentCards = page.locator('.grid > div');
    
    // Check that agents are sorted correctly (online first, then busy, away, offline)
    // Within same status, sorted by first name
    const firstAgent = agentCards.nth(0);
    const secondAgent = agentCards.nth(1);
    const thirdAgent = agentCards.nth(2);
    const fourthAgent = agentCards.nth(3);

    // John (online) should be first
    await expect(firstAgent.getByText('John Doe')).toBeVisible();
    // Jane (busy) should be second
    await expect(secondAgent.getByText('Jane Smith')).toBeVisible();
    // Bob (away) should be third
    await expect(thirdAgent.getByText('Bob Johnson')).toBeVisible();
    // Alice (offline) should be fourth
    await expect(fourthAgent.getByText('Alice Brown')).toBeVisible();
  });

  test('Show empty state when no agents match filter', async ({ page }) => {
    // Mock empty response
    await page.route('https://3nzfzc8au7.execute-api.us-east-1.amazonaws.com/default/agents', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ agents: [] })
      });
    });
    await page.reload();

    await expect(page.getByText('No agents found')).toBeVisible();
    await expect(page.getByText('No agents available at the moment.')).toBeVisible();
  });

  test('Handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('https://3nzfzc8au7.execute-api.us-east-1.amazonaws.com/default/agents', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    await page.reload();

    await expect(page.getByText('Error:')).toBeVisible();
    await expect(page.getByText('HTTP error! status: 500')).toBeVisible();
  });


});
