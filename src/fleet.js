// Fleet (fleet.flisk.si) on behalf of a signed-in learner. Fleet trusts this site by a shared secret and takes the
// learner's GitHub name in X-On-Behalf-Of, so a computer always belongs to the learner, never to the site.
export function fleetClient(env, login, fetchImpl = fetch) {
  const base = (env.FLEET_URL || 'https://fleet.flisk.si').replace(/\/$/, '');
  const call = async (method, path, body) => {
    const res = await fetchImpl(`${base}${path}`, {
      method,
      headers: { authorization: `Bearer ${env.FLEET_SERVICE_SECRET}`, 'x-on-behalf-of': login, 'content-type': 'application/json', 'user-agent': 'flisk-learn' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data, error: res.status >= 400 ? data.error || `fleet answered ${res.status}` : null };
  };
  const pod = (id) => `/v1/pods/${encodeURIComponent(id)}`;
  return {
    connections: () => call('GET', '/v1/connections'),
    connect: (provider, key) => call('PUT', `/v1/connections/${encodeURIComponent(provider)}`, { key }),
    start: () => call('POST', '/v1/pods', { cpu: 2, ram: 4 }),
    run: (id, command) => call('POST', `${pod(id)}/run`, { command, timeout: 60 }),
    write: (id, path, content) => call('PUT', `${pod(id)}/files`, { path, content }),
    read: (id, path) => call('GET', `${pod(id)}/files?path=${encodeURIComponent(path)}`),
    stop: (id) => call('DELETE', pod(id)),
  };
}
