import uniqBy from "lodash/uniqBy";
import { parse } from "graphql";
import {
  GraphQLClient,
  type RequestDocument,
  type Variables,
} from "graphql-request";
import { addTypenameToDocument } from "@apollo/client/utilities";
import { getOptionalEnvVar } from "&/drips/common/wallet/provider.js";

const envBaseUrl = getOptionalEnvVar("PUBLIC_BASE_URL");
const BASE_URL = envBaseUrl ?? "https://localhost:5173";

export default async function query<
  TResponse,
  TVariables extends Variables = Variables,
>(
  query: RequestDocument,
  variables?: TVariables,
  customFetch: typeof fetch = fetch,
): Promise<TResponse> {
  const client = new GraphQLClient(`${BASE_URL}/api/gql`, {
    fetch: customFetch,
  });

  const parsedQuery = typeof query === "string" ? parse(query) : query;

  const queryWithTypenames = addTypenameToDocument(parsedQuery);

  return await client.request<TResponse>(
    {
      ...queryWithTypenames,
      definitions: uniqBy(queryWithTypenames.definitions, "name.value"),
    },
    variables,
  );
}
