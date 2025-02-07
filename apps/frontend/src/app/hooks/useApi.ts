import { Api } from '../api';
import { useAsyncFn } from 'react-use';

export function useApi() {
  const [response, fetchEdges] = useAsyncFn(async () => {
    const api = Api.getInstance();
    return await api.getEdges();
  }, []);

  return {
    response,
    fetchEdges,
  }
}
