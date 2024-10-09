import { authExchange } from "@urql/exchange-auth";
import {
	createClient as _createClient,
	cacheExchange,
	fetchExchange,
	gql,
} from "urql";

export let client = {
	query: () => {
		throw new Error("urql graphql not initialised, call init first");
	},
};

// Create a URQL client with your GraphQL API endpoint
export const createClient = (config) => {
	client = _createClient({
		url: config.url || "https://api.proca.app/api",
		exchanges: [
			//		cacheExchange, // Handles caching
			authExchange(async (utils) => {
				const token = config.token;

				return {
					addAuthToOperation(operation) {
						if (!token) return operation;
						return utils.appendHeaders(operation, {
							Authorization: `Bearer ${token}`,
						});
					},
				};
			}),
			fetchExchange, // Handles fetching
		],
	});
};

export const query = async (query, payload) => {
	const result = await client.query(query, payload).toPromise();
	if (result.error) {
		throw new Error(result.error);
	}
	return result.data;
};

export { gql };
