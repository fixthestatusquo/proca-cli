import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SearchCampaignsQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchCampaignsQuery = { __typename?: 'RootQueryType', campaigns: Array<
    | { __typename?: 'PrivateCampaign', id: number, name: string, title: string, config: any }
    | { __typename?: 'PublicCampaign', id: number, name: string, title: string, config: any }
  > };

export type GetOrgCampaignsQueryVariables = Exact<{
  org: Scalars['String']['input'];
}>;


export type GetOrgCampaignsQuery = { __typename?: 'RootQueryType', org: { __typename?: 'PrivateOrg', campaigns: Array<
      | { __typename?: 'PrivateCampaign', id: number, name: string, title: string, config: any }
      | { __typename?: 'PublicCampaign', id: number, name: string, title: string, config: any }
    > } };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Json: { input: any; output: any; }
  NaiveDateTime: { input: any; output: any; }
};

export type Action = {
  __typename?: 'Action';
  /** Id of action */
  actionId: Scalars['Int']['output'];
  /** Action page this action was collected at */
  actionPage: ActionPage;
  /** Action type */
  actionType: Scalars['String']['output'];
  /** Campaign this action was collected in */
  campaign: Campaign;
  /** supporter contact data */
  contact: Contact;
  /** Timestamp of creation */
  createdAt: Scalars['NaiveDateTime']['output'];
  /** Action custom fields (as stringified JSON) */
  customFields: Scalars['Json']['output'];
  /** Donation specific data */
  donation?: Maybe<Donation>;
  /**
   * Deprecated, use customFields
   * @deprecated use custom_fields
   */
  fields: Array<CustomField>;
  /** Consents, privacy data of this action */
  privacy: Consent;
  /** UTM codes */
  tracking?: Maybe<Tracking>;
};

export type ActionCustomFields = {
  __typename?: 'ActionCustomFields';
  /** id of action */
  actionId: Scalars['Int']['output'];
  /** type of action */
  actionType: Scalars['String']['output'];
  /** area of supporter that did the action */
  area?: Maybe<Scalars['String']['output']>;
  /** custom fields as stringified json */
  customFields: Scalars['Json']['output'];
  /** @deprecated use custom_fields */
  fields: Array<CustomField>;
  /** creation timestamp */
  insertedAt: Scalars['NaiveDateTime']['output'];
};

/** Custom field added to action. For signature it can be contact, for mail it can be subject and body */
export type ActionInput = {
  /** Action Type */
  actionType: Scalars['String']['input'];
  /** Custom fields added to action */
  customFields?: InputMaybe<Scalars['Json']['input']>;
  /** Donation payload */
  donation?: InputMaybe<DonationActionInput>;
  /** MTT payload */
  mtt?: InputMaybe<MttActionInput>;
  /** Test mode */
  testing?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ActionPage = {
  /** Campaign this action page belongs to. */
  campaign: Campaign;
  /** Config JSON of this action page */
  config: Scalars['Json']['output'];
  /** Id */
  id: Scalars['Int']['output'];
  /**
   * List of steps in journey
   * @deprecated moved under config
   */
  journey: Array<Scalars['String']['output']>;
  /** Is live? */
  live: Scalars['Boolean']['output'];
  /** Locale for the widget, in i18n format */
  locale: Scalars['String']['output'];
  /** Name where the widget is hosted */
  name: Scalars['String']['output'];
  /** Org the action page belongs to */
  org: Org;
  /** Thank you email templated of this Action Page */
  thankYouTemplate?: Maybe<Scalars['String']['output']>;
  /** A reference to thank you email template of this ActionPage */
  thankYouTemplateRef?: Maybe<Scalars['String']['output']>;
};

/** ActionPage input */
export type ActionPageInput = {
  /** JSON string containing Action Page config */
  config?: InputMaybe<Scalars['Json']['input']>;
  /** Collected PII is processed even with no opt-in */
  delivery?: InputMaybe<Scalars['Boolean']['input']>;
  /** Duplicate action email template of this ActionPage */
  duplicateTemplate?: InputMaybe<Scalars['String']['input']>;
  /** Extra supporter count. If you want to add a number of signatories you have offline or kept in another system, you can specify the number here. */
  extraSupporters?: InputMaybe<Scalars['Int']['input']>;
  /** 2-letter, lowercase, code of ActionPage language */
  locale?: InputMaybe<Scalars['String']['input']>;
  /**
   * Unique NAME identifying ActionPage.
   *
   * Does not have to exist, must be unique. Can be a 'technical' identifier
   * scoped to particular organization, so it does not have to change when the
   * slugs/names change (eg. some.org/1234). However, frontend Widget can
   * ask for ActionPage by it's current location.href (but without https://), in which case it is useful
   * to make this url match the real widget location.
   */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Supporter confirm email template of this ActionPage */
  supporterConfirmTemplate?: InputMaybe<Scalars['String']['input']>;
  /** Thank you email template of this ActionPage */
  thankYouTemplate?: InputMaybe<Scalars['String']['input']>;
};

export enum ActionPageStatus {
  /** This action page received actions lately */
  Active = 'ACTIVE',
  /** This action page did not receive actions lately */
  Stalled = 'STALLED',
  /** This action page is ready to receive first action or is stalled for over 1 year */
  Standby = 'STANDBY'
}

/** Count of actions for particular action type */
export type ActionTypeCount = {
  __typename?: 'ActionTypeCount';
  /** action type */
  actionType: Scalars['String']['output'];
  /** count of actions of action type */
  count: Scalars['Int']['output'];
};

export type ActivateKeyResult = {
  __typename?: 'ActivateKeyResult';
  status: Status;
};

export type AddKeyInput = {
  /** Name of the key */
  name: Scalars['String']['input'];
  /** Public part of the key (base64url) */
  public: Scalars['String']['input'];
};

/** Address type which can hold different addres fields. */
export type AddressInput = {
  /** Country code (two-letter). */
  country?: InputMaybe<Scalars['String']['input']>;
  /** Locality, which can be a city/town/village */
  locality?: InputMaybe<Scalars['String']['input']>;
  /** Postcode, in format correct for country locale */
  postcode?: InputMaybe<Scalars['String']['input']>;
  /** Region, being province, voyevodship, county */
  region?: InputMaybe<Scalars['String']['input']>;
  /** Street name */
  street?: InputMaybe<Scalars['String']['input']>;
  /** Street number */
  streetNumber?: InputMaybe<Scalars['String']['input']>;
};

/** Api token metadata */
export type ApiToken = {
  __typename?: 'ApiToken';
  expiresAt: Scalars['NaiveDateTime']['output'];
};

export type Application = {
  __typename?: 'Application';
  logLevel?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

/** Count of actions for particular action type */
export type AreaCount = {
  __typename?: 'AreaCount';
  /** area */
  area: Scalars['String']['output'];
  /** count of supporters in this area */
  count: Scalars['Int']['output'];
};

export type Campaign = {
  /**
   * Fetch public actions. Can be used to display recent comments for example.
   *
   * To allow-list action fields to be public, `campaign.public_actions` must be set to a list of strings in form
   * action_type:custom_field_name, eg: `["signature:comment"]`. XXX this cannot be set in API, you need to set in backend.
   */
  actions: PublicActionsResult;
  /** Action processing settings for this campaign */
  campaignProcessing?: Maybe<CampaignProcessing>;
  /** Custom config map */
  config: Scalars['Json']['output'];
  /** Schema for contact personal information */
  contactSchema: ContactSchema;
  /** Campaign end date */
  end?: Maybe<Scalars['Date']['output']>;
  /** External ID (if set) */
  externalId?: Maybe<Scalars['Int']['output']>;
  /** Campaign id */
  id: Scalars['Int']['output'];
  /** Internal name of the campaign */
  name: Scalars['String']['output'];
  /** Lead org */
  org: Org;
  /** Campaign start date */
  start?: Maybe<Scalars['Date']['output']>;
  /** Statistics */
  stats: CampaignStats;
  /** Current status of the campaign */
  status: CampaignStatus;
  /** List MTT targets of this campaign */
  targets?: Maybe<Array<Maybe<Target>>>;
  /** Full, official name of the campaign */
  title: Scalars['String']['output'];
};


export type CampaignActionsArgs = {
  actionType: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};

/** Campaign content changed in mutations */
export type CampaignInput = {
  /**
   * Override the org's action confirmation setting for this campaign only.
   * null - inherit the org setting, true - force action confirm on, false - force it off.
   */
  actionConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  /** Action pages of this campaign */
  actionPages?: InputMaybe<Array<ActionPageInput>>;
  /** Custom config as stringified JSON map */
  config?: InputMaybe<Scalars['Json']['input']>;
  /** Schema for contact personal information */
  contactSchema?: InputMaybe<ContactSchema>;
  /** Campaign end date */
  end?: InputMaybe<Scalars['Date']['input']>;
  /** Campaign external_id. If provided, it will be used to find campaign. Can be used to rename a campaign */
  externalId?: InputMaybe<Scalars['Int']['input']>;
  /** MTT configuration */
  mtt?: InputMaybe<CampaignMttInput>;
  /** Campaign short name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Campaign start date */
  start?: InputMaybe<Scalars['Date']['input']>;
  /** Current status of the campaign */
  status?: InputMaybe<CampaignStatus>;
  /** Supporter confirmation enabled */
  supporterConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  /** Supporter confirmation template name */
  supporterConfirmTemplate?: InputMaybe<Scalars['String']['input']>;
  /** Campaign human readable title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CampaignMtt = {
  __typename?: 'CampaignMtt';
  /** List of additional contacts that will be added to CC. */
  ccContacts?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** If checked, the sender will be added to CC. */
  ccSender?: Maybe<Scalars['Boolean']['output']>;
  /** If checked, the mtt campaign emails will be delivered by the drip algo, else by the asap algo. */
  dripDelivery?: Maybe<Scalars['Boolean']['output']>;
  /** This is last day and end hour of the campaign. Note, every day of the campaign the end hour will be same. */
  endAt: Scalars['DateTime']['output'];
  /**
   * If email templates are used to create MTT, use this template (works like thank you email templates).
   * Otherwise, the raw text that is send with MTT action will make a plain text email.
   */
  messageTemplate?: Maybe<Scalars['String']['output']>;
  /** This is first day and start hour of the campaign. Note, every day of the campaign the start hour will be same. */
  startAt: Scalars['DateTime']['output'];
  /** A test target email (yourself) where test mtt actions will be sent (instead to real targets) */
  testEmail?: Maybe<Scalars['String']['output']>;
};

export type CampaignMttInput = {
  /** List of additional contacts that will be added to CC. */
  ccContacts?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** If checked, the sender will be added to CC. */
  ccSender?: InputMaybe<Scalars['Boolean']['input']>;
  /** If checked, the mtt campaign emails will be delivered by the drip algo, else by the asap algo. */
  dripDelivery?: InputMaybe<Scalars['Boolean']['input']>;
  /** This is last day and end hour of the campaign. Note, every day of the campaign the end hour will be same. */
  endAt?: InputMaybe<Scalars['DateTime']['input']>;
  /**
   * If email templates are used to create MTT, use this template (works like thank you email templates).
   * Otherwise, the raw text that is send with MTT action will make a plain text email.
   */
  messageTemplate?: InputMaybe<Scalars['String']['input']>;
  /** This is first day and start hour of the campaign. Note, every day of the campaign the start hour will be same. */
  startAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** A test target email (yourself) where test mtt actions will be sent (instead to real targets) */
  testEmail?: InputMaybe<Scalars['String']['input']>;
};

export type CampaignProcessing = {
  __typename?: 'CampaignProcessing';
  /**
   * Override the org's action confirmation setting (org.customActionConfirm) for this campaign only.
   * null - inherit the org setting, true - force action confirm on, false - force it off.
   */
  actionConfirm?: Maybe<Scalars['Boolean']['output']>;
  /** Enable supporter confirmation */
  supporterConfirm?: Maybe<Scalars['Boolean']['output']>;
  /** Supporter confirmation template name */
  supporterConfirmTemplate?: Maybe<Scalars['String']['output']>;
};

/** Campaign statistics */
export type CampaignStats = {
  __typename?: 'CampaignStats';
  /** Action counts per action types (with duplicates) */
  actionCount: Array<ActionTypeCount>;
  /** Unique action tagers count */
  supporterCount: Scalars['Int']['output'];
  /** Unique action takers by area */
  supporterCountByArea: Array<AreaCount>;
  /** Unique action takers by org */
  supporterCountByOrg: Array<OrgCount>;
  /** Unique supporter count not including the ones collected by org_name */
  supporterCountByOthers: Scalars['Int']['output'];
};


/** Campaign statistics */
export type CampaignStatsSupporterCountByOthersArgs = {
  orgName: Scalars['String']['input'];
};

export enum CampaignStatus {
  Closed = 'CLOSED',
  Draft = 'DRAFT',
  Ignored = 'IGNORED',
  Live = 'LIVE'
}

export type ChangeUserStatus = {
  __typename?: 'ChangeUserStatus';
  status: Status;
};

export type Confirm = {
  __typename?: 'Confirm';
  /** Secret code/PIN of the confirm */
  code: Scalars['String']['output'];
  /** Who created the confirm */
  creator?: Maybe<User>;
  /** Email the confirm is sent to */
  email?: Maybe<Scalars['String']['output']>;
  /** Message attached to the confirm */
  message?: Maybe<Scalars['String']['output']>;
  /** Object id that confirmable action refers to */
  objectId?: Maybe<Scalars['Int']['output']>;
};

export type ConfirmInput = {
  /** secret code of this confirm */
  code: Scalars['String']['input'];
  /** email that confirm was assigned for */
  email?: InputMaybe<Scalars['String']['input']>;
  /** object_id that this confirm refers to */
  objectId?: InputMaybe<Scalars['Int']['input']>;
};

export type ConfirmResult = {
  __typename?: 'ConfirmResult';
  /** Action page if its an object of confirm */
  actionPage?: Maybe<ActionPage>;
  /** Campaign page if its an object of confirm */
  campaign?: Maybe<Campaign>;
  /** A message attached to the confirm */
  message?: Maybe<Scalars['String']['output']>;
  /** Org if its an object of confirm */
  org?: Maybe<Org>;
  /** Status of Confirm: Success, Confirming (waiting for confirmation), Noop */
  status: Status;
};

/** GDPR consent data for this org */
export type Consent = {
  __typename?: 'Consent';
  /** Email status, whether it's normal, DOI, or bouncing */
  emailStatus: EmailStatus;
  /** When did the email status change last time */
  emailStatusChanged?: Maybe<Scalars['NaiveDateTime']['output']>;
  /** Consent timestamp */
  givenAt: Scalars['NaiveDateTime']['output'];
  /** communication (email) opt-in */
  optIn?: Maybe<Scalars['Boolean']['output']>;
  /** This action contained consent (if false, it could be a share action that is attached to another action containing a consent) */
  withConsent: Scalars['Boolean']['output'];
};

/** GDPR consent data structure */
export type ConsentInput = {
  /** Opt in to the campaign leader */
  leadOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  /** Has contact consented to receiving communication from widget owner? Null: not asked */
  optIn?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Contact = {
  __typename?: 'Contact';
  /** Contact ref (fingerprint) of supporter */
  contactRef: Scalars['ID']['output'];
  /** Rank of this action among actions from the same contact in this campaign (0 = first, >0 = duplicate) */
  dupeRank: Scalars['Int']['output'];
  /** Encryption nonce value */
  nonce?: Maybe<Scalars['String']['output']>;
  /** Stringified json with PII optionally encrypted */
  payload: Scalars['String']['output'];
  /** Public key used to encrypt this action */
  publicKey?: Maybe<KeyIds>;
  /** Signing key used to encrypt this action */
  signKey?: Maybe<KeyIds>;
};

/** Contact information */
export type ContactInput = {
  /** Contacts address */
  address?: InputMaybe<AddressInput>;
  /** Date of birth in format YYYY-MM-DD */
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  /** Email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** First name (when you provide full name split into first and last) */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Last name (when you provide full name split into first and last) */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Full name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Nationality information */
  nationality?: InputMaybe<NationalityInput>;
  /** Contacts phone number */
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type ContactReference = {
  __typename?: 'ContactReference';
  /** Contact's reference */
  contactRef: Scalars['String']['output'];
  /** Contacts first name */
  firstName?: Maybe<Scalars['String']['output']>;
};

export enum ContactSchema {
  Basic = 'BASIC',
  Eci = 'ECI',
  ItCi = 'IT_CI',
  PopularInitiative = 'POPULAR_INITIATIVE'
}

/** Custom field with a key and value. */
export type CustomField = {
  __typename?: 'CustomField';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** Custom field with a key and value. Both are strings. */
export type CustomFieldInput = {
  key: Scalars['String']['input'];
  /** Unused. To mark action_type/key as transient, use campaign.transient_actions list */
  transient?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export type DeleteUserResult = {
  __typename?: 'DeleteUserResult';
  status: Status;
};

export type Donation = {
  __typename?: 'Donation';
  /** Provide amount of this donation, in smallest units for currency */
  amount: Scalars['Int']['output'];
  /** Provide currency of this donation */
  currency: Scalars['String']['output'];
  /** Donation frequency unit */
  frequencyUnit: DonationFrequencyUnit;
  /** Donation data */
  payload: Scalars['Json']['output'];
  schema?: Maybe<DonationSchema>;
};

export type DonationActionInput = {
  /** Provide amount of this donation, in smallest units for currency */
  amount?: InputMaybe<Scalars['Int']['input']>;
  /** Provide currency of this donation */
  currency?: InputMaybe<Scalars['String']['input']>;
  /** How often is the recurring donation collected */
  frequencyUnit?: InputMaybe<DonationFrequencyUnit>;
  /** Custom JSON data */
  payload: Scalars['Json']['input'];
  /** Provide payload schema to validate, eg. stripe_payment_intent */
  schema?: InputMaybe<DonationSchema>;
};

export enum DonationFrequencyUnit {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  OneOff = 'ONE_OFF',
  Weekly = 'WEEKLY'
}

export enum DonationSchema {
  StripePaymentIntent = 'STRIPE_PAYMENT_INTENT'
}

export enum EmailStatus {
  /** This email was contacted before */
  Active = 'ACTIVE',
  /** This email was used and blocked */
  Blocked = 'BLOCKED',
  /** This email was used and bounced */
  Bounce = 'BOUNCE',
  /** The user has received a DOI on this email and accepted it */
  DoubleOptIn = 'DOUBLE_OPT_IN',
  /** This email was disabled and should not be contacted */
  Inactive = 'INACTIVE',
  /** An unused email */
  None = 'NONE',
  /** This email was used and marked spam */
  Spam = 'SPAM',
  /** This email was used and user unsubscribed */
  Unsub = 'UNSUB'
}

export type EmailTemplateInput = {
  /** External provider template ID (e.g. Brevo templateId). When set, the provider template is used instead of local html/subject/text. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Html part body */
  html?: InputMaybe<Scalars['String']['input']>;
  /** template locale */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** template name */
  name: Scalars['String']['input'];
  /** Subject text */
  subject?: InputMaybe<Scalars['String']['input']>;
  /** Plaintext part body */
  text?: InputMaybe<Scalars['String']['input']>;
};

export type GenKeyInput = {
  /** Name of the key */
  name: Scalars['String']['input'];
};

export type JoinOrgResult = {
  __typename?: 'JoinOrgResult';
  /** Org that was joined */
  org: Org;
  /** Result of joining - succes or pending confirmation */
  status: Status;
};

/** Encryption or sign key with integer id (database) */
export type Key = {
  __typename?: 'Key';
  /** Is it active? */
  active: Scalars['Boolean']['output'];
  /** Is it expired? */
  expired: Scalars['Boolean']['output'];
  /** When the key was expired, in UTC */
  expiredAt?: Maybe<Scalars['NaiveDateTime']['output']>;
  /** Key id */
  id: Scalars['Int']['output'];
  /** Name of the key (human readable) */
  name: Scalars['String']['output'];
  /** Public part of the key (base64url) */
  public: Scalars['String']['output'];
};

export type KeyIds = {
  __typename?: 'KeyIds';
  /** Key id */
  id: Scalars['Int']['output'];
  /** Public part of the key (base64url) */
  public: Scalars['String']['output'];
};

export type KeyWithPrivate = {
  __typename?: 'KeyWithPrivate';
  /** Is it active? */
  active: Scalars['Boolean']['output'];
  /** Is it expired? */
  expired: Scalars['Boolean']['output'];
  /** When the key was expired, in UTC */
  expiredAt?: Maybe<Scalars['NaiveDateTime']['output']>;
  /** Key id */
  id: Scalars['Int']['output'];
  /** Name of the key (human readable) */
  name: Scalars['String']['output'];
  /** Private (Secret) part of the key (base64url) */
  private: Scalars['String']['output'];
  /** Public part of the key (base64url) */
  public: Scalars['String']['output'];
};

export type LaunchActionPageResult = {
  __typename?: 'LaunchActionPageResult';
  status: Status;
};

export type MttActionInput = {
  /** Body */
  body?: InputMaybe<Scalars['String']['input']>;
  /** Files to attach (images allowed) */
  files?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Subject line */
  subject?: InputMaybe<Scalars['String']['input']>;
  /** Target ids */
  targets: Array<Scalars['String']['input']>;
};

export type NationalityInput = {
  /** Nationality / issuer of id document */
  country: Scalars['String']['input'];
  /** Document serial id/number */
  documentNumber?: InputMaybe<Scalars['String']['input']>;
  /** Document type */
  documentType?: InputMaybe<Scalars['String']['input']>;
};

export type Org = {
  /** config */
  config: Scalars['Json']['output'];
  /** Organisation short name */
  name: Scalars['String']['output'];
  /** Organisation title (human readable name) */
  title: Scalars['String']['output'];
};

/** Count of supporters for particular org */
export type OrgCount = {
  __typename?: 'OrgCount';
  /** count of supporters registered by org */
  count: Scalars['Int']['output'];
  /** org */
  org: Org;
};

export type OrgInput = {
  /** Config */
  config?: InputMaybe<Scalars['Json']['input']>;
  /** Schema for contact personal information */
  contactSchema?: InputMaybe<ContactSchema>;
  /** Only send thank you emails to opt-ins */
  doiThankYou?: InputMaybe<Scalars['Boolean']['input']>;
  /** Name used to rename */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Enable reply_to for emails */
  replyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** Rewrite sender address using SRS (disable for cleaner confirmation emails) */
  senderRewrite?: InputMaybe<Scalars['Boolean']['input']>;
  /** Email opt in enabled */
  supporterConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  /** Email opt in template name */
  supporterConfirmTemplate?: InputMaybe<Scalars['String']['input']>;
  /** Organisation title (human readable name) */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type OrgUser = {
  __typename?: 'OrgUser';
  /** Date and time the user was created on this instance */
  createdAt: Scalars['NaiveDateTime']['output'];
  email: Scalars['String']['output'];
  /** Date and time when user joined org */
  joinedAt: Scalars['NaiveDateTime']['output'];
  /** Will be removed */
  lastSigninAt?: Maybe<Scalars['NaiveDateTime']['output']>;
  /** Role in an org */
  role: Scalars['String']['output'];
};

export type OrgUserInput = {
  /** Email of user */
  email: Scalars['String']['input'];
  /** Role name of user in this org */
  role: Scalars['String']['input'];
};

export enum OutdatedTargets {
  /** Delete outdated targets (only possible for targets without any action) */
  Delete = 'DELETE',
  /** Disable emails for outdated targets */
  Disable = 'DISABLE',
  /** Keep outdated targets */
  Keep = 'KEEP'
}

export type Partnership = {
  __typename?: 'Partnership';
  /** Partner's pages that are part of this campaign (can be more, eg: multiple languages) */
  actionPages: Array<ActionPage>;
  /** The partner staffers who initiated a request */
  launchRequesters: Array<User>;
  /** Join/Launch requests of this partner */
  launchRequests: Array<Confirm>;
  /** Partner org */
  org: Org;
};

export type PersonalData = {
  __typename?: 'PersonalData';
  /** Schema for contact personal information */
  contactSchema: ContactSchema;
  /** Only send thank you emails to opt-ins */
  doiThankYou: Scalars['Boolean']['output'];
  /** High data security enabled */
  highSecurity: Scalars['Boolean']['output'];
  /** Enable reply_to for emails */
  replyEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** Rewrite sender address using SRS (disable for cleaner confirmation emails) */
  senderRewrite?: Maybe<Scalars['Boolean']['output']>;
  /** Email opt in enabled */
  supporterConfirm: Scalars['Boolean']['output'];
  /** Email opt in template name */
  supporterConfirmTemplate?: Maybe<Scalars['String']['output']>;
};

export type PrivateActionPage = ActionPage & {
  __typename?: 'PrivateActionPage';
  /** Campaign this action page belongs to. */
  campaign: Campaign;
  /** Config JSON of this action page */
  config: Scalars['Json']['output'];
  /**
   * Action page collects also opt-out actions, to deliver them to authorities.
   * If false, the opt-outs will fallback to lead (we never trash data with opt-outs)
   */
  delivery: Scalars['Boolean']['output'];
  /** Email template sent to supporters who sign again (duplicate action) */
  duplicateTemplate?: Maybe<Scalars['String']['output']>;
  /** Extra supporters, a number added to deduplicated supporter count. Cannot be added to per-area or per-action_type counts. */
  extraSupporters: Scalars['Int']['output'];
  /** Id */
  id: Scalars['Int']['output'];
  /**
   * List of steps in journey
   * @deprecated moved under config
   */
  journey: Array<Scalars['String']['output']>;
  /** Is live? */
  live: Scalars['Boolean']['output'];
  /** Locale for the widget, in i18n format */
  locale: Scalars['String']['output'];
  /** Location of the widget as last seen in HTTP REFERER header */
  location?: Maybe<Scalars['String']['output']>;
  /** Name where the widget is hosted */
  name: Scalars['String']['output'];
  /** Org the action page belongs to */
  org: Org;
  /** Status of action page - STANDBY (ready to get actions), ACTIVE (collecting actions), STALLED (actions not coming any more) */
  status?: Maybe<ActionPageStatus>;
  /** Email template to confirm supporter (DOI) */
  supporterConfirmTemplate?: Maybe<Scalars['String']['output']>;
  /** Thank you email templated of this Action Page */
  thankYouTemplate?: Maybe<Scalars['String']['output']>;
  /** A reference to thank you email template of this ActionPage */
  thankYouTemplateRef?: Maybe<Scalars['String']['output']>;
};

export type PrivateCampaign = Campaign & {
  __typename?: 'PrivateCampaign';
  /** Action Pages of this campaign that are accessible to current user */
  actionPages: Array<PrivateActionPage>;
  /**
   * Fetch public actions. Can be used to display recent comments for example.
   *
   * To allow-list action fields to be public, `campaign.public_actions` must be set to a list of strings in form
   * action_type:custom_field_name, eg: `["signature:comment"]`. XXX this cannot be set in API, you need to set in backend.
   */
  actions: PublicActionsResult;
  /** Action processing settings for this campaign */
  campaignProcessing?: Maybe<CampaignProcessing>;
  /** Custom config map */
  config: Scalars['Json']['output'];
  /** Schema for contact personal information */
  contactSchema: ContactSchema;
  /** Campaign end date */
  end?: Maybe<Scalars['Date']['output']>;
  /** External ID (if set) */
  externalId?: Maybe<Scalars['Int']['output']>;
  /** Campaign onwer collects opt-out actions for delivery even if campaign partner is delivering */
  forceDelivery: Scalars['Boolean']['output'];
  /** Campaign id */
  id: Scalars['Int']['output'];
  /** MTT configuration */
  mtt?: Maybe<CampaignMtt>;
  /** Internal name of the campaign */
  name: Scalars['String']['output'];
  /** Lead org */
  org: Org;
  /** List of partnerships and requests to join partnership */
  partnerships?: Maybe<Array<Partnership>>;
  /** Campaign start date */
  start?: Maybe<Scalars['Date']['output']>;
  /** Statistics */
  stats: CampaignStats;
  /** Current status of the campaign */
  status: CampaignStatus;
  /** List MTT targets of this campaign */
  targets?: Maybe<Array<Maybe<Target>>>;
  /** Full, official name of the campaign */
  title: Scalars['String']['output'];
};


export type PrivateCampaignActionsArgs = {
  actionType: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};

export type PrivateOrg = Org & {
  __typename?: 'PrivateOrg';
  /** Get one page belonging to this org */
  actionPage: ActionPage;
  /** List action pages this org has */
  actionPages: Array<ActionPage>;
  /** DEPRECATED: use campaign() in API root. Get campaign this org is leader or partner of by id */
  campaign: Campaign;
  /** List campaigns this org is leader or partner of */
  campaigns: Array<Campaign>;
  /** config */
  config: Scalars['Json']['output'];
  /** Organization id */
  id: Scalars['Int']['output'];
  /** Get encryption key */
  key: Key;
  /** Encryption keys */
  keys: Array<Key>;
  /** Organisation short name */
  name: Scalars['String']['output'];
  /** Personal data settings for this org */
  personalData: PersonalData;
  /** Action processing settings for this org */
  processing: Processing;
  /** Services of this org */
  services: Array<Maybe<Service>>;
  /** Organisation title (human readable name) */
  title: Scalars['String']['output'];
  /** Users of this org */
  users: Array<Maybe<OrgUser>>;
};


export type PrivateOrgActionPageArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type PrivateOrgActionPagesArgs = {
  select?: InputMaybe<SelectActionPage>;
};


export type PrivateOrgCampaignArgs = {
  id: Scalars['Int']['input'];
};


export type PrivateOrgCampaignsArgs = {
  select?: InputMaybe<SelectCampaign>;
};


export type PrivateOrgKeyArgs = {
  select: SelectKey;
};


export type PrivateOrgKeysArgs = {
  select?: InputMaybe<SelectKey>;
};


export type PrivateOrgServicesArgs = {
  select?: InputMaybe<SelectService>;
};

export type PrivateTarget = Target & {
  __typename?: 'PrivateTarget';
  /** Area of the target */
  area?: Maybe<Scalars['String']['output']>;
  /** Email list of this target */
  emails: Array<Maybe<TargetEmail>>;
  /** unique external_id of target, used to upsert target */
  externalId: Scalars['String']['output'];
  /** Custom fields, stringified json */
  fields?: Maybe<Scalars['Json']['output']>;
  id: Scalars['String']['output'];
  /** Locale of this target (in which language do they read emails?) */
  locale?: Maybe<Scalars['String']['output']>;
  /** Name of target */
  name: Scalars['String']['output'];
};

export type Processing = {
  __typename?: 'Processing';
  /** Should proca put action in a custom queue, so an external service can do this? */
  customActionConfirm: Scalars['Boolean']['output'];
  /** Should proca put action in custom delivery queue, so an external service can sync it? */
  customActionDeliver: Scalars['Boolean']['output'];
  /** Should proca put events in custom delivery queue, so an external service can sync it? */
  customEventDeliver: Scalars['Boolean']['output'];
  /** Should proca put action in a custom queue, so an external service can do this? */
  customSupporterConfirm: Scalars['Boolean']['output'];
  /** Use a particular owned service type for looking up supporters in CRM */
  detailBackend?: Maybe<ServiceName>;
  /** Only send thank you emails to opt-ins */
  doiThankYou: Scalars['Boolean']['output'];
  /** Use a particular owned service type for sending emails */
  emailBackend?: Maybe<ServiceName>;
  /** Envelope FROM email when sending emails */
  emailFrom?: Maybe<Scalars['String']['output']>;
  /** Email templates. (warn: contant is not available to fetch) */
  emailTemplates?: Maybe<Array<Scalars['String']['output']>>;
  /** Use a particular owned service type for sending events */
  eventBackend?: Maybe<ServiceName>;
  /** Use a particular owned service type for sending actions */
  pushBackend?: Maybe<ServiceName>;
  /** Use a particular owned service type for uploading files */
  storageBackend?: Maybe<ServiceName>;
  /** Is the supporter required to double opt in their action (and associated personal data)? */
  supporterConfirm: Scalars['Boolean']['output'];
  /** The email template name that will be used to send the action DOI request */
  supporterConfirmTemplate?: Maybe<Scalars['String']['output']>;
  /** Use a particular owned service type for sending transactional (non-MTT) emails, instead of email_backend */
  transactionalEmailBackend?: Maybe<ServiceName>;
};

export type PublicActionPage = ActionPage & {
  __typename?: 'PublicActionPage';
  /** Campaign this action page belongs to. */
  campaign: Campaign;
  /** Config JSON of this action page */
  config: Scalars['Json']['output'];
  /** Id */
  id: Scalars['Int']['output'];
  /**
   * List of steps in journey
   * @deprecated moved under config
   */
  journey: Array<Scalars['String']['output']>;
  /** Is live? */
  live: Scalars['Boolean']['output'];
  /** Locale for the widget, in i18n format */
  locale: Scalars['String']['output'];
  /** Name where the widget is hosted */
  name: Scalars['String']['output'];
  /** Org the action page belongs to */
  org: Org;
  /** Thank you email templated of this Action Page */
  thankYouTemplate?: Maybe<Scalars['String']['output']>;
  /** A reference to thank you email template of this ActionPage */
  thankYouTemplateRef?: Maybe<Scalars['String']['output']>;
};

/** Result of actions query */
export type PublicActionsResult = {
  __typename?: 'PublicActionsResult';
  /** Custom field keys which are public */
  fieldKeys?: Maybe<Array<Scalars['String']['output']>>;
  /** List of actions custom fields */
  list?: Maybe<Array<Maybe<ActionCustomFields>>>;
};

export type PublicCampaign = Campaign & {
  __typename?: 'PublicCampaign';
  /**
   * Fetch public actions. Can be used to display recent comments for example.
   *
   * To allow-list action fields to be public, `campaign.public_actions` must be set to a list of strings in form
   * action_type:custom_field_name, eg: `["signature:comment"]`. XXX this cannot be set in API, you need to set in backend.
   */
  actions: PublicActionsResult;
  /** Action processing settings for this campaign */
  campaignProcessing?: Maybe<CampaignProcessing>;
  /** Custom config map */
  config: Scalars['Json']['output'];
  /** Schema for contact personal information */
  contactSchema: ContactSchema;
  /** Campaign end date */
  end?: Maybe<Scalars['Date']['output']>;
  /** External ID (if set) */
  externalId?: Maybe<Scalars['Int']['output']>;
  /** Campaign id */
  id: Scalars['Int']['output'];
  /** Internal name of the campaign */
  name: Scalars['String']['output'];
  /** Lead org */
  org: Org;
  /** Campaign start date */
  start?: Maybe<Scalars['Date']['output']>;
  /** Statistics */
  stats: CampaignStats;
  /** Current status of the campaign */
  status: CampaignStatus;
  /** List MTT targets of this campaign */
  targets?: Maybe<Array<Maybe<Target>>>;
  /** Full, official name of the campaign */
  title: Scalars['String']['output'];
};


export type PublicCampaignActionsArgs = {
  actionType: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};

export type PublicOrg = Org & {
  __typename?: 'PublicOrg';
  /** config */
  config: Scalars['Json']['output'];
  /** Organisation short name */
  name: Scalars['String']['output'];
  /** Organisation title (human readable name) */
  title: Scalars['String']['output'];
};

export type PublicTarget = Target & {
  __typename?: 'PublicTarget';
  /** Area of the target */
  area?: Maybe<Scalars['String']['output']>;
  /** unique external_id of target, used to upsert target */
  externalId: Scalars['String']['output'];
  /** Custom fields, stringified json */
  fields?: Maybe<Scalars['Json']['output']>;
  id: Scalars['String']['output'];
  /** Locale of this target (in which language do they read emails?) */
  locale?: Maybe<Scalars['String']['output']>;
  /** Name of target */
  name: Scalars['String']['output'];
};

export enum Queue {
  /** a custom queue of action that needs moderation */
  CustomActionConfirm = 'CUSTOM_ACTION_CONFIRM',
  /** a custom queue of actions to sync to CRM */
  CustomActionDeliver = 'CUSTOM_ACTION_DELIVER',
  /** a custom queue of action that needs DOI */
  CustomSupporterConfirm = 'CUSTOM_SUPPORTER_CONFIRM',
  /** Queue of thank you email sender worker */
  EmailSupporter = 'EMAIL_SUPPORTER',
  /** Queue of SQS sync worker */
  Sqs = 'SQS',
  /** Queue of webhook sync worker */
  Webhook = 'WEBHOOK'
}

export type RequeueResult = {
  __typename?: 'RequeueResult';
  /** Count of actions selected for requeueing */
  count: Scalars['Int']['output'];
  /** Count of actions that could not be requeued */
  failed: Scalars['Int']['output'];
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Accept a confirm on behalf of organisation. */
  acceptOrgConfirm: ConfirmResult;
  /** Accept a confirm by user */
  acceptUserConfirm: ConfirmResult;
  /** A separate key activate operation, because you also need to add the key to receiving system before it is used */
  activateKey: ActivateKeyResult;
  /** Adds an action referencing contact data via contactRef */
  addAction: ContactReference;
  /** Adds an action with contact data */
  addActionContact: ContactReference;
  addActionPage: ActionPage;
  /** Add a new campaign */
  addCampaign: Campaign;
  /** Add a key to encryption keys */
  addKey: Key;
  /** Add an org. Calling user  will become it's owner. */
  addOrg: Org;
  /** Add user to org by email */
  addOrgUser: ChangeUserStatus;
  /**
   * Create stripe object using Stripe key associated with action page owning org.
   * Pass any of paymentIntent, subscription, customer, price json params to be sent as-is to Stripe API. The result is a JSON returned by Stripe API or a GraphQL Error object.
   * If you provide customer along payment intent or subscription, it will be first created, then their id will be added to params for the payment intent or subscription, so you can pack 2 Stripe API calls into one. You can do the same with price object in case of a subscription.
   */
  addStripeObject: Scalars['Json']['output'];
  /** Stripe API - add a stripe payment intent, when donating to the action page specified by id */
  addStripePaymentIntent: Scalars['Json']['output'];
  /** Stripe API - add a stripe subscription, when donating to the action page specified by id */
  addStripeSubscription: Scalars['Json']['output'];
  /**
   * Adds a new Action Page based on another Action Page. Intended to be used to
   * create a partner action page based off lead's one. Copies: campaign, locale, config, delivery flag
   */
  copyActionPage: ActionPage;
  /**
   * Adds a new Action Page based on latest Action Page from campaign. Intended to be used to
   * create a partner action page based off lead's one. Copies: campaign, locale, config, delivery flag
   */
  copyCampaignActionPage: ActionPage;
  /** Deactivate all encryption keys for the org. Use before revoking access or rotating keys. */
  deactivateAllKeys: ActivateKeyResult;
  /** Delete an action page */
  deleteActionPage: Status;
  /**
   * Delete a campaign.
   * Deletion will be blocked if there are action pages with personal data (we never remove personal data unless via GDPR).
   */
  deleteCampaign: Status;
  /**
   * Anonymize personal data (GDPR right-to-erasure).
   * Nulls PII fields on supporter and deletes all contact records.
   * Only affects fully processed (accepted/delivered) supporters.
   */
  deleteContact: Status;
  /** Delete an org */
  deleteOrg: Status;
  deleteOrgUser?: Maybe<DeleteUserResult>;
  /** Generate a new encryption key in org */
  generateKey: KeyWithPrivate;
  /** Invite an user to org by email (can be not yet user!) */
  inviteOrgUser: Confirm;
  /** Try becoming a staffer of the org */
  joinOrg: JoinOrgResult;
  /** Sends a request to lead to set the page to live=true */
  launchActionPage: LaunchActionPageResult;
  /** Link actions with refs to contact with contact reference */
  linkActions: ContactReference;
  /** Reject a confirm on behalf of organisation. */
  rejectOrgConfirm: ConfirmResult;
  /** Reject a confirm by user */
  rejectUserConfirm: ConfirmResult;
  /** Requeue actions into one of processing destinations */
  requeueActions: RequeueResult;
  resetApiToken: Scalars['String']['output'];
  /**
   * Reset the in-memory transactional email counter for an org's transactional_email_backend.
   * Call this from a nightly cron to re-open the budget window each day.
   */
  resetTransactionalEmailBudget: Status;
  /** Update an Action Page */
  updateActionPage: ActionPage;
  /** Updates an existing campaign. */
  updateCampaign: Campaign;
  /** Updates an existing campaign. */
  updateCampaignProcessing: Campaign;
  /** Update an org */
  updateOrg: PrivateOrg;
  /** Update org processing settings */
  updateOrgProcessing: PrivateOrg;
  updateOrgUser: ChangeUserStatus;
  /** Update (current) user details */
  updateUser: User;
  /**
   * Upserts a campaign.
   *
   * Creates or appends campaign and it's action pages. In case of append, it
   * will change the campaign with the matching name, and action pages with
   * matching names. It will create new action pages if you pass new names. No
   * Action Pages will be removed (principle of not removing signature data).
   */
  upsertCampaign: Campaign;
  /** Insert or update a service for an org, using id to to update a particular one */
  upsertService: Service;
  /**
   * Upsert multiple targets at once.
   * external_id is used to decide if new target record is added, or existing one is updated.
   */
  upsertTargets: Array<Maybe<PrivateTarget>>;
  /**
   * Upsert an email tempalte to be used for sending various emails.
   * It belongs to org and is identified by (name, locale), so you can have multiple "thank_you" templates for different languages.
   */
  upsertTemplate?: Maybe<Status>;
};


export type RootMutationTypeAcceptOrgConfirmArgs = {
  confirm: ConfirmInput;
  name: Scalars['String']['input'];
};


export type RootMutationTypeAcceptUserConfirmArgs = {
  confirm: ConfirmInput;
};


export type RootMutationTypeActivateKeyArgs = {
  id: Scalars['Int']['input'];
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeAddActionArgs = {
  action: ActionInput;
  actionPageId: Scalars['Int']['input'];
  contactRef: Scalars['ID']['input'];
  tracking?: InputMaybe<TrackingInput>;
};


export type RootMutationTypeAddActionContactArgs = {
  action: ActionInput;
  actionPageId: Scalars['Int']['input'];
  contact: ContactInput;
  contactRef?: InputMaybe<Scalars['ID']['input']>;
  privacy: ConsentInput;
  tracking?: InputMaybe<TrackingInput>;
};


export type RootMutationTypeAddActionPageArgs = {
  campaignName: Scalars['String']['input'];
  input: ActionPageInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeAddCampaignArgs = {
  input: CampaignInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeAddKeyArgs = {
  input: AddKeyInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeAddOrgArgs = {
  input: OrgInput;
};


export type RootMutationTypeAddOrgUserArgs = {
  input: OrgUserInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeAddStripeObjectArgs = {
  actionPageId: Scalars['Int']['input'];
  customer?: InputMaybe<Scalars['Json']['input']>;
  paymentIntent?: InputMaybe<Scalars['Json']['input']>;
  price?: InputMaybe<Scalars['Json']['input']>;
  subscription?: InputMaybe<Scalars['Json']['input']>;
  testing?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RootMutationTypeAddStripePaymentIntentArgs = {
  actionPageId: Scalars['Int']['input'];
  contactRef?: InputMaybe<Scalars['ID']['input']>;
  input: StripePaymentIntentInput;
  testing?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RootMutationTypeAddStripeSubscriptionArgs = {
  actionPageId: Scalars['Int']['input'];
  contactRef?: InputMaybe<Scalars['ID']['input']>;
  input: StripeSubscriptionInput;
  testing?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RootMutationTypeCopyActionPageArgs = {
  fromName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeCopyCampaignActionPageArgs = {
  fromCampaignName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeDeactivateAllKeysArgs = {
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeDeleteActionPageArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeDeleteCampaignArgs = {
  externalId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeDeleteContactArgs = {
  contactRef: Scalars['String']['input'];
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeDeleteOrgArgs = {
  name: Scalars['String']['input'];
};


export type RootMutationTypeDeleteOrgUserArgs = {
  email: Scalars['String']['input'];
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeGenerateKeyArgs = {
  input: GenKeyInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeInviteOrgUserArgs = {
  input: OrgUserInput;
  message?: InputMaybe<Scalars['String']['input']>;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeJoinOrgArgs = {
  name: Scalars['String']['input'];
};


export type RootMutationTypeLaunchActionPageArgs = {
  message?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type RootMutationTypeLinkActionsArgs = {
  actionPageId: Scalars['Int']['input'];
  contactRef: Scalars['ID']['input'];
  linkRefs?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type RootMutationTypeRejectOrgConfirmArgs = {
  confirm: ConfirmInput;
  name: Scalars['String']['input'];
};


export type RootMutationTypeRejectUserConfirmArgs = {
  confirm: ConfirmInput;
};


export type RootMutationTypeRequeueActionsArgs = {
  ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  orgName: Scalars['String']['input'];
  queue: Queue;
};


export type RootMutationTypeResetTransactionalEmailBudgetArgs = {
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeUpdateActionPageArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ActionPageInput;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeUpdateCampaignArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CampaignInput;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeUpdateCampaignProcessingArgs = {
  actionConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  supporterConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  supporterConfirmTemplate?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeUpdateOrgArgs = {
  input: OrgInput;
  name: Scalars['String']['input'];
};


export type RootMutationTypeUpdateOrgProcessingArgs = {
  customActionConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  customActionDeliver?: InputMaybe<Scalars['Boolean']['input']>;
  customEventDeliver?: InputMaybe<Scalars['Boolean']['input']>;
  customSupporterConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  detailBackend?: InputMaybe<ServiceName>;
  doiThankYou?: InputMaybe<Scalars['Boolean']['input']>;
  emailBackend?: InputMaybe<ServiceName>;
  emailFrom?: InputMaybe<Scalars['String']['input']>;
  eventBackend?: InputMaybe<ServiceName>;
  name: Scalars['String']['input'];
  pushBackend?: InputMaybe<ServiceName>;
  storageBackend?: InputMaybe<ServiceName>;
  supporterConfirm?: InputMaybe<Scalars['Boolean']['input']>;
  supporterConfirmTemplate?: InputMaybe<Scalars['String']['input']>;
  transactionalEmailBackend?: InputMaybe<ServiceName>;
};


export type RootMutationTypeUpdateOrgUserArgs = {
  input: OrgUserInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UserDetailsInput;
};


export type RootMutationTypeUpsertCampaignArgs = {
  input: CampaignInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeUpsertServiceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ServiceInput;
  orgName: Scalars['String']['input'];
};


export type RootMutationTypeUpsertTargetsArgs = {
  campaignId: Scalars['Int']['input'];
  outdatedTargets?: InputMaybe<OutdatedTargets>;
  targets: Array<TargetInput>;
};


export type RootMutationTypeUpsertTemplateArgs = {
  input: EmailTemplateInput;
  orgName: Scalars['String']['input'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /**
   * Get action page.
   * Depending on your access (page owner, lead, instance admin),
   * you will get private or public view of the page.
   */
  actionPage: ActionPage;
  /** Get actions collected by org, optionally filtered by campaign */
  actions: Array<Maybe<Action>>;
  /** Get application info */
  application?: Maybe<Application>;
  /**
   * Get one campaign. If you have access to the campaign, as lead or
   * partner, you will get a private view of the campaign, otherwise, a public
   * view.
   */
  campaign?: Maybe<Campaign>;
  /** Returns a public list of campaigns, filtered by title. Can be used to implement a campaign search box on a website. */
  campaigns: Array<Campaign>;
  /** Get contacts collected by org, optionally filtered by campaign */
  contacts: Array<Maybe<Action>>;
  /** Get the current user, as determined by Authorization header */
  currentUser: User;
  /**
   * Export actions collected by org, optionally filtered by campaign
   * @deprecated Renamed to `actions`, use `actions` or `contacts`
   */
  exportActions: Array<Maybe<Action>>;
  /** Organization api (authenticated) */
  org: PrivateOrg;
  /** Select users from this instnace. Requires a manage users admin permission. */
  users: Array<User>;
};


export type RootQueryTypeActionPageArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeActionsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  campaignId?: InputMaybe<Scalars['Int']['input']>;
  campaignName?: InputMaybe<Scalars['String']['input']>;
  includeTesting?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  onlyDoubleOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  onlyOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  orgName: Scalars['String']['input'];
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeCampaignArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeCampaignsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeContactsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  campaignId?: InputMaybe<Scalars['Int']['input']>;
  campaignName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  includeTesting?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  onlyDoubleOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  onlyOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  orgName: Scalars['String']['input'];
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeExportActionsArgs = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  campaignId?: InputMaybe<Scalars['Int']['input']>;
  campaignName?: InputMaybe<Scalars['String']['input']>;
  includeTesting?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  onlyDoubleOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  onlyOptIn?: InputMaybe<Scalars['Boolean']['input']>;
  orgName: Scalars['String']['input'];
  start?: InputMaybe<Scalars['Int']['input']>;
};


export type RootQueryTypeOrgArgs = {
  name: Scalars['String']['input'];
};


export type RootQueryTypeUsersArgs = {
  select?: InputMaybe<SelectUser>;
};

export type RootSubscriptionType = {
  __typename?: 'RootSubscriptionType';
  actionPageUpserted: ActionPage;
};


export type RootSubscriptionTypeActionPageUpsertedArgs = {
  orgName?: InputMaybe<Scalars['String']['input']>;
};

export type SelectActionPage = {
  /** Filter by campaign Id */
  campaignId?: InputMaybe<Scalars['Int']['input']>;
};

export type SelectCampaign = {
  orgName?: InputMaybe<Scalars['String']['input']>;
  titleLike?: InputMaybe<Scalars['String']['input']>;
};

export type SelectKey = {
  /** Only active */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Key id */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Key having this public part */
  public?: InputMaybe<Scalars['String']['input']>;
};

export type SelectService = {
  name?: InputMaybe<ServiceName>;
};

/** Criteria to filter users */
export type SelectUser = {
  /** Use % as wildcard */
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Exact org name */
  orgName?: InputMaybe<Scalars['String']['input']>;
};

export type Service = {
  __typename?: 'Service';
  /** Hostname of service, but can be used as any "container" of the service. For AWS, contains a region. */
  host?: Maybe<Scalars['String']['output']>;
  /** Id */
  id: Scalars['Int']['output'];
  /** Service name (type) */
  name: ServiceName;
  /** A sub-selector of a resource. Can be url path, but can be something like AWS bucket name */
  path?: Maybe<Scalars['String']['output']>;
  /**
   * Verified sending address for this backend. Used as the envelope From domain when rewriting
   * sender addresses (SRS). Falls back to the org's email_from if not set. Must be on a domain
   * the email backend is authorized to send from (SPF/DKIM configured).
   */
  sendingFrom?: Maybe<Scalars['String']['output']>;
  /** How many transactional emails to send via this service, when used as the org's transactional_email_backend, before falling back to email_backend (for warming up a new backend, or capping its usage). Unset means no limit. */
  transactionalEmailBudget?: Maybe<Scalars['Int']['output']>;
  /** User, Account id, client id, whatever your API has */
  user?: Maybe<Scalars['String']['output']>;
};

export type ServiceInput = {
  /** Hostname of service, but can be used as any "container" of the service. For AWS, contains a region. */
  host?: InputMaybe<Scalars['String']['input']>;
  /** Service name (type) */
  name: ServiceName;
  /** Password, key, secret or whatever your API has as secret credential */
  password?: InputMaybe<Scalars['String']['input']>;
  /** A sub-selector of a resource. Can be url path, but can be something like AWS bucket name */
  path?: InputMaybe<Scalars['String']['input']>;
  /** Verified sending address for this backend (overrides org email_from as the envelope From domain) */
  sendingFrom?: InputMaybe<Scalars['String']['input']>;
  /** How many transactional emails to send via this service, when used as the org's transactional_email_backend, before falling back to email_backend (for warming up a new backend, or capping its usage). Unset means no limit. */
  transactionalEmailBudget?: InputMaybe<Scalars['Int']['input']>;
  /** User, Account id, client id, whatever your API has */
  user?: InputMaybe<Scalars['String']['input']>;
};

export enum ServiceName {
  /** Brevo to send transactional emails */
  Brevo = 'BREVO',
  /** HubSpot to send transactional emails */
  Hubspot = 'HUBSPOT',
  /** Mailjet to send emails */
  Mailjet = 'MAILJET',
  /** Preview emails in /mailbox */
  Preview = 'PREVIEW',
  /** AWS SES to send emails */
  Ses = 'SES',
  /** SMTP to send emails */
  Smtp = 'SMTP',
  /** AWS SQS to process messages */
  Sqs = 'SQS',
  /** Stripe to process donations */
  Stripe = 'STRIPE',
  /** Supabase to store files */
  Supabase = 'SUPABASE',
  /** Use a service that instance org is using */
  System = 'SYSTEM',
  /** Stripe test account to test donations */
  TestStripe = 'TEST_STRIPE',
  /** HTTP POST webhook */
  Webhook = 'WEBHOOK',
  /** Wordpress HTTP API */
  Wordpress = 'WORDPRESS'
}

export enum Status {
  /** Operation awaiting confirmation */
  Confirming = 'CONFIRMING',
  /** Operation had no effect (already done) */
  Noop = 'NOOP',
  /** Operation completed succesfully */
  Success = 'SUCCESS'
}

export type StripePaymentIntentInput = {
  /** Amount of payment */
  amount: Scalars['Int']['input'];
  /** Currency ofo payment */
  currency: Scalars['String']['input'];
  /** Stripe payment method type */
  paymentMethodTypes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type StripeSubscriptionInput = {
  /** Amount of payment */
  amount: Scalars['Int']['input'];
  /** Currency ofo payment */
  currency: Scalars['String']['input'];
  /** how often is recurrent payment made? */
  frequencyUnit: DonationFrequencyUnit;
};

export type Target = {
  /** Area of the target */
  area?: Maybe<Scalars['String']['output']>;
  /** unique external_id of target, used to upsert target */
  externalId: Scalars['String']['output'];
  /** Custom fields, stringified json */
  fields?: Maybe<Scalars['Json']['output']>;
  id: Scalars['String']['output'];
  /** Locale of this target (in which language do they read emails?) */
  locale?: Maybe<Scalars['String']['output']>;
  /** Name of target */
  name: Scalars['String']['output'];
};

export type TargetEmail = {
  __typename?: 'TargetEmail';
  /** Email of target */
  email: Scalars['String']['output'];
  /** The status of email (normal or bouncing etc) */
  emailStatus: EmailStatus;
  /** An error received when bouncing email was reported */
  error?: Maybe<Scalars['String']['output']>;
};

export type TargetEmailInput = {
  /** Email of target */
  email: Scalars['String']['input'];
};

export type TargetInput = {
  /** Area of the target */
  area?: InputMaybe<Scalars['String']['input']>;
  /** Email list of this target */
  emails?: InputMaybe<Array<TargetEmailInput>>;
  /** unique external_id of target, used to upsert target */
  externalId: Scalars['String']['input'];
  /** Custom fields, stringified json */
  fields?: InputMaybe<Scalars['Json']['input']>;
  /** Locale of this target (in which language do they read emails?) */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** Name of target */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Tracking codes (UTM params) */
export type Tracking = {
  __typename?: 'Tracking';
  campaign: Scalars['String']['output'];
  content: Scalars['String']['output'];
  medium: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

/** Tracking codes, utm medium/campaign/source default to 'unknown', content to empty string */
export type TrackingInput = {
  campaign?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  /** Action page location. Url from which action is added. Must contain schema, domain, (port), pathname */
  location?: InputMaybe<Scalars['String']['input']>;
  medium?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  /** Users API token (to check expiry) */
  apiToken?: Maybe<ApiToken>;
  /** Email of user */
  email: Scalars['String']['output'];
  /** Id of user */
  id: Scalars['Int']['output'];
  /** Is user an admin? */
  isAdmin: Scalars['Boolean']['output'];
  /** Job title */
  jobTitle?: Maybe<Scalars['String']['output']>;
  /** Phone */
  phone?: Maybe<Scalars['String']['output']>;
  /** Url to profile picture */
  pictureUrl?: Maybe<Scalars['String']['output']>;
  /** user's roles in orgs */
  roles: Array<UserRole>;
};

export type UserDetailsInput = {
  /** Job title */
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  /** Phone */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Users profile pic url */
  pictureUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UserRole = {
  __typename?: 'UserRole';
  /** Org this role is in */
  org: Org;
  /** Role name */
  role: Scalars['String']['output'];
};


export const SearchCampaignsDocument = gql`
    query SearchCampaigns($name: String!) {
  campaigns(name: $name) {
    id
    name
    title
    config
  }
}
    `;

export function useSearchCampaignsQuery(options: Omit<Urql.UseQueryArgs<SearchCampaignsQueryVariables>, 'query'>) {
  return Urql.useQuery<SearchCampaignsQuery, SearchCampaignsQueryVariables>({ query: SearchCampaignsDocument, ...options });
};
export const GetOrgCampaignsDocument = gql`
    query GetOrgCampaigns($org: String!) {
  org(name: $org) {
    campaigns {
      id
      name
      title
      config
    }
  }
}
    `;

export function useGetOrgCampaignsQuery(options: Omit<Urql.UseQueryArgs<GetOrgCampaignsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetOrgCampaignsQuery, GetOrgCampaignsQueryVariables>({ query: GetOrgCampaignsDocument, ...options });
};