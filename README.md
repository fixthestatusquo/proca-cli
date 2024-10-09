# Command line access the proca api

This is to manage the components of campaigns as an admin, or to integrate with external tools (eg. get counters and stats). For the widget builder, check [@proca/widget](https://www.npmjs.com/@proca/widget)

## Proca: Progressive Campaigning

Proca is an open-source campaign toolkit designed to empower activists and organisations in their digital advocacy efforts. It provides a flexible and customisable platform for creating and managing online petitions, email campaigns, and other forms of digital engagement, enabling users to effectively mobilise supporters and drive social change.

One of Proca's standout features is its robust support for coalition campaigns, allowing multiple organisations to collaborate seamlessly on shared initiatives. This coalition functionality enables partners to pool resources, amplify their collective voice, and reach a broader audience whilst maintaining individual branding and supporter relationships. By facilitating data sharing and joint campaign management, Proca helps coalitions to maximise their impact, streamline operations, and present a united front on critical issues, all whilst ensuring compliance with data protection regulations.


## usage

### global installation
  <!-- usage -->
```sh-session
$ npm install -g proca
$ proca COMMAND
running command...
$ proca (--version)
proca/0.1.2 linux-x64 node-v20.12.2
$ proca --help [COMMAND]
USAGE
  $ proca COMMAND
...
```
<!-- usagestop -->

### local development

```sh-session
   $ git clone https://github.com/fixthestatusquo/proca-cli.git
   $ git install
   $ cd proca-cli
   $./proca-cli --help
...
```

### TOPICS
-  campaign  Handle campaigns
- org
-  config    create setting to access the server authentication

### TODO TOPICS

- widget
- actions
- service
- target

# Commands
<!-- commands -->
* [`proca campaign get`](#proca-campaign-get)
* [`proca campaign list [TITLE]`](#proca-campaign-list-title)
* [`proca config add [ENVIRONMENT]`](#proca-config-add-environment)
* [`proca config setup [ENVIRONMENT]`](#proca-config-setup-environment)
* [`proca org get`](#proca-org-get)

## `proca campaign get`

view a campaign

```
USAGE
  $ proca campaign get [--simplify [--json | --csv | --table]] [-i <organisation name>]
    [-n <campaign name>] [--config] [--stats] [--locale <value>]

FLAGS
  -i, --id=<organisation name>  id of the campaign
  -n, --name=<campaign name>    name of the campaign
      --[no-]config             display the config
      --locale=<value>          display a locale
      --[no-]stats              display the stats

OUTPUT FLAGS
  --csv       Format output as csv
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes
  --table     Format output as table [default]

DESCRIPTION
  view a campaign

EXAMPLES
  $ proca campaign get -i 42
```

## `proca campaign list [TITLE]`

list all the campaigns

```
USAGE
  $ proca campaign list [TITLE] [--simplify [--json | --csv | --table]] [-o <organisation
    name> | -t <campaign title>] [--stats]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -o, --org=<organisation name>  campaigns of the organisation (coordinator or partner)
  -t, --title=<campaign title>   name of the campaign, % for wildchar
      --[no-]stats               display the stats

OUTPUT FLAGS
  --csv       Format output as csv
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes
  --table     Format output as table [default]

DESCRIPTION
  list all the campaigns

EXAMPLES
  $ proca campaign list %pizza%
```

## `proca config add [ENVIRONMENT]`

create setting to access the server authentication

```
USAGE
  $ proca config add [ENVIRONMENT] --token <API-token> [--simplify [--json | --csv |
    --table]] [--force] [--url <url>] [--n8n <n8n api>] [--supabase <url>] [--supabase-anon-key <value>]
    [--supabase-secrey-key <value>]

ARGUMENTS
  ENVIRONMENT  [default: default] environment

FLAGS
  --force                        write over an existing configuration
  --n8n=<n8n api>                api access on the n8n server
  --supabase=<url>               url of the supabase
  --supabase-anon-key=<value>    anonymous key
  --supabase-secrey-key=<value>  secret service key
  --token=<API-token>            (required) user token on proca server
  --url=<url>                    [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv       Format output as csv
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes
  --table     Format output as table [default]

DESCRIPTION
  create setting to access the server authentication

ALIASES
  $ proca config setup

EXAMPLES
  $ proca config add --user=xavier@example.org --token=API-12345789
```

## `proca config setup [ENVIRONMENT]`

create setting to access the server authentication

```
USAGE
  $ proca config setup [ENVIRONMENT] --token <API-token> [--simplify [--json | --csv |
    --table]] [--force] [--url <url>] [--n8n <n8n api>] [--supabase <url>] [--supabase-anon-key <value>]
    [--supabase-secrey-key <value>]

ARGUMENTS
  ENVIRONMENT  [default: default] environment

FLAGS
  --force                        write over an existing configuration
  --n8n=<n8n api>                api access on the n8n server
  --supabase=<url>               url of the supabase
  --supabase-anon-key=<value>    anonymous key
  --supabase-secrey-key=<value>  secret service key
  --token=<API-token>            (required) user token on proca server
  --url=<url>                    [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv       Format output as csv
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes
  --table     Format output as table [default]

DESCRIPTION
  create setting to access the server authentication

ALIASES
  $ proca config setup

EXAMPLES
  $ proca config setup --user=xavier@example.org --token=API-12345789
```

## `proca org get`

view a org

```
USAGE
  $ proca org get [--simplify [--json | --csv | --table]] [-n <org name>] [--config]
    [--keys] [--campaigns] [--widgets] [--users]

FLAGS
  -n, --name=<org name>  name of the org
  --[no-]campaigns
      --[no-]config      display the config
  --[no-]keys
  --[no-]users
  --[no-]widgets

OUTPUT FLAGS
  --csv       Format output as csv
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes
  --table     Format output as table [default]

DESCRIPTION
  view a org

EXAMPLES
  $ proca org get <name of the ngo>
```
<!-- commandsstop -->
