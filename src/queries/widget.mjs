import { gql } from "#src/urql.mjs";

export const FragmentSummary = gql`fragment Summary on PrivateActionPage {
id
locale
name
journey
extraSupporters
status,
location
}
`;
