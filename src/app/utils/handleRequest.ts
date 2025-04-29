export default async function performRequest(method: string, url: string, headers: any, setLoading: (loading: boolean) => void, body?: any) {
    setLoading(true);
    const res = await fetch(url, {
      method,
      headers,
      body: body && JSON.stringify(body),
    });

    const data = await res.json();
    const status = res.status;

    setLoading(false);
    return { data, status };
}