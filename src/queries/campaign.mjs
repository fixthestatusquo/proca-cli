import { gql } from "#src/urql.mjs";

export const FragmentSummary = gql`fragment Summary on Campaign {id name title externalId status}`;

export const FragmentOrg = gql`
      fragment Org on Campaign {
        org {
          name
          title
        }
      }
    `;

export const FragmentStats = gql`
      fragment Stats on Campaign {
        stats {
          supporterCount
          actionCount {actionType count}
        }
      }
    `;
