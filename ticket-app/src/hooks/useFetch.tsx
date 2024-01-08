import {
  ENDPIONTS,
  httpService,
  HTTPServiceOptions,
  PagingOptions,
} from "@api";
import { CancelTokenSource } from "axios";
import { useCallback, useEffect, useState } from "react";

interface Params {
  endPoint: string;
  id?: string | number;
  queryStrings?: PagingOptions | URLSearchParams;
  reload?: boolean;
  ignorePagination?: boolean;
}

export const useFetch = <T,>(
  { endPoint, id, queryStrings, reload, ignorePagination }: Params,
  initialValue: T
) => {
  const [data, setData] = useState<T>(initialValue);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callAPI = useCallback(
    async (cancelToken?: CancelTokenSource) => {
      let res: any;

      const serviceOptions: HTTPServiceOptions = {
        ignorePagination: ignorePagination ? ignorePagination : false,
      };

      if (id !== undefined) {
        res = await httpService(endPoint, queryStrings, serviceOptions).getById(
          id
        );
      } else {
        res = await httpService(
          endPoint,
          queryStrings,
          serviceOptions
        ).getAll();
      }

      if (res && res?.status === 200) {
        setData(res?.data as T);
      } else {
        setError("an error occured.");
      }
    },
    [endPoint, queryStrings, id]
  );

  useEffect(() => {
    // const cancelToken = axios.CancelToken.source();

    (async function () {
      setIsFetching(true);
      await callAPI();
      setIsFetching(false);
    })();

    // return () => {
    //     cancelToken.cancel()
    // }
  }, [callAPI]);

  useEffect(() => {
    // const cancelToken = axios.CancelToken.source();
    if (reload !== undefined) {
      console.log("reloading data");
      (async function () {
        await callAPI();
      })();
    }
    // return () => {
    //     cancelToken.cancel()
    // }
  }, [callAPI, reload]);

  return {
    data,
    isFetching,
    error,
  };
};
