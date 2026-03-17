import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import { formatDistanceToNowStrict } from "date-fns";
import Command from "#src/procaCommand.mjs";
import {
  FragmentOrg,
  FragmentStats,
  FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, query } from "#src/urql.mjs";

export default class Get extends Command {
  static flags = {
    ...this.flagify({ name: "org", char: "o" }),
    email: Flags.string({
      char: "e",
      required: true,
      description: "email of the supporter",
      helpValue: "<supporter@example.org>",
    }),
    utm: Flags.boolean({
      description: "display the utm tracking parameters",
      default: true,
      allowNo: true,
      exclusive: ["simplify"],
    }),
    comment: Flags.boolean({
      description: "display the comment",
      default: true,
      allowNo: true,
      exclusive: ["simplify"],
    }),
  };

  fetch = async (flags) => {
    const Document = gql`
      query (
        $orgName: String!
        $email: String!
      ) {
        contacts(
          orgName: $orgName
          email: $email
        ) {
          actionId
          actionPage {
            id
            locale
            name
          }
          actionType
          campaign {
            name
          }
          contact {
            contactRef
            payload
            nonce
            publicKey {
              public
            }
          }
          createdAt
          customFields
          privacy {
            emailStatus
            emailStatusChanged
            givenAt
            optIn
            withConsent
          }
          tracking {
            campaign
            content
            medium
            source
          }
        }
      }
    `;
    const result = await query(Document, {
      orgName: flags.name,
      email: flags.email,
    });
    return result.contacts.map((d) => {
      d.customFields = JSON.parse(d.customFields);
      if (!d.contact.publicKey) {
        const ref = d.contact.contactRef;
        d.contact = JSON.parse(d.contact.payload);
        d.contact.contactRef = ref;
      } else {
        this.error(
          `encrypted contact we need the private key for ${d.contact.publicKey.public}`,
        );
      }
      return d;
    });
    //		return result.exportActions;
  };

  simplify = (d) => {
    const result = {
      contactRef: d.contact.contactRef,
      firstname: d.contact.firstName,
      country: d.contact.country,
      email: d.contact.email,
      type: d.actionType,
      date: formatDistanceToNowStrict(d.createdAt),
      campaign: !this.flags.campaign && d.campaign.name,
      widget_id: d.actionPage.id,
      widget: d.actionPage.name,
      //            customFields
    };
    if (this.flags.comment && d.customFields?.comment)
      result.comment = d.customFields.comment;
    if (this.flags.utm && d.tracking) {
      result.utm_medium =
        d.tracking.medium === "unknown" ? undefined : d.tracking.medium;
      result.utm_source =
        d.tracking.source === "unknown" ? undefined : d.tracking.source;
      result.utm_campaign =
        d.tracking.campaign === "unknown" ? undefined : d.tracking.campaign;
      if (d.tracking.content)
        result.utm_content =
          d.tracking.content === "unknown" ? undefined : d.tracking.content;
    }
    if (d.customFields?.emailProvider)
      result.provider = d.customFields.emailProvider;
    return result;
  };

  async run() {
    const { flags } = await this.parse();
    const data = await this.fetch(flags);
    return this.output(data, { single: true });
  }
}
