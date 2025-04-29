export default async function performRequest(method: string, url: string, headers: any, setLoading: (loading: boolean) => void, message: string, toaster: any, logout: () => void, body?: any) {
    setLoading(true);
    const res = await fetch(url, {
      method,
      headers,
      body: body && JSON.stringify(body),
    });

    const data = await res.json();

    console.log("Response data:", data);

    const status = res.status;

    if (res.status >= 200 && res.status < 300) {
      toaster.create({
        title: "Sucesso",
        description: message,
        type: "success",
        duration: 3000,
      })
    }

    if (res.status === 401) {
      logout();
      toaster.create({
        title: "Erro",
        description: "Sessão expirada",
        type: "error",
        duration: 3000,
      })
    }

    if (res.status === 400 || res.status > 401) {
      toaster.create({
        title: "Erro",
        description: data.message,
        type: "error",
        duration: 3000,
      })
    }

    setLoading(false);
    return { data, status };
}