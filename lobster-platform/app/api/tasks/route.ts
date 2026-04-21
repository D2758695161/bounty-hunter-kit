import { NextResponse } from 'next/server';

// GitHub API configuration - uses GitHub token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'D2758695161';
const REPO_NAME = 'lobster-data';

const GH_HEADERS = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
};

async function githubFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: { ...GH_HEADERS, ...options.headers },
  });
  const data = await res.json();
  return { status: res.status, data };
}

// GET /api/tasks - List all tasks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // open | closed | all

    const { data: issues } = await githubFetch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=${status === 'closed' ? 'closed' : 'open'}&per_page=50&sort=created&direction=desc`
    );

    if (!Array.isArray(issues)) {
      return NextResponse.json({ tasks: [] });
    }

    // Filter out pull requests, parse task data from issues
    const tasks = issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => {
        // Parse task data from issue body (stored as JSON in first detail block)
        let taskData: any = {
          id: `gh-${issue.number}`,
          title: issue.title,
          description: issue.body || '',
          status: issue.state === 'open' ? 'open' : 'completed',
          budget_usdt: undefined,
          budget_cny: undefined,
          currency: 'USDT' as const,
          tags: issue.labels.map((l: any) => l.name).filter((n: string) => !n.startsWith('budget:')),
          deadline: undefined,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
          applications: issue.comments || 0,
          owner: {
            login: issue.user.login,
            avatar_url: issue.user.avatar_url,
          },
          labels: issue.labels.map((l: any) => l.name),
        };

        // Parse budget from labels (format: budget:500USDT or budget:15000CNY)
        const budgetLabel = issue.labels.find((l: any) => l.name.startsWith('budget:'));
        if (budgetLabel) {
          const match = budgetLabel.name.match(/budget:(\d+)(USDT|CNY|ETH)/);
          if (match) {
            taskData.budget_usdt = match[2] === 'USDT' ? Number(match[1]) : undefined;
            taskData.budget_cny = match[2] === 'CNY' ? Number(match[1]) : undefined;
            taskData.currency = match[2] as any;
          }
        }

        return taskData;
      });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, budget_usdt, budget_cny, currency, tags, deadline, contact_wechat, contact_email } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'title and description required' }, { status: 400 });
    }

    // Build issue body with task details
    const issueBody = `${description}

---
**Contact:** ${contact_wechat ? `WeChat: ${contact_wechat}` : ''} ${contact_email ? `Email: ${contact_email}` : ''}
**Deadline:** ${deadline || 'Not specified'}
**Budget:** ${budget_usdt ? `$${budget_usdt} USDT` : ''} ${budget_cny ? `¥${budget_cny} CNY` : ''}`;

    // Build labels
    const labels = [...(tags || [])];
    if (budget_usdt) labels.push(`budget:${budget_usdt}USDT`);
    if (budget_cny) labels.push(`budget:${budget_cny}CNY`);
    labels.push('task'); // marker label

    const { status, data } = await githubFetch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: 'POST',
        body: JSON.stringify({
          title,
          body: issueBody,
          labels: labels.length > 0 ? labels : undefined,
        }),
      }
    );

    if (status !== 201) {
      return NextResponse.json({ error: data.message || 'Failed to create task', detail: data }, { status: status });
    }

    return NextResponse.json({
      success: true,
      task: {
        id: `gh-${data.number}`,
        title: data.title,
        url: data.html_url,
        number: data.number,
      },
    });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
