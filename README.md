# Command line access the proca api

This is to manage the components of campaigns as an admin, or to integrate with external tools (eg. get counters and stats). For the widget builder, check [@proca/widget](https://www.npmjs.com/@proca/widget)

## Proca: Progressive Campaigning

Proca is an open-source campaign toolkit designed to empower activists and organisations in their digital advocacy efforts. It provides a flexible and customisable platform for creating and managing online petitions, email campaigns, and other forms of digital engagement, enabling users to effectively mobilise supporters and drive social change.

One of Proca's standout features is its robust support for coalition campaigns, allowing multiple organisations to collaborate seamlessly on shared initiatives. This coalition functionality enables partners to pool resources, amplify their collective voice, and reach a broader audience whilst maintaining individual branding and supporter relationships. By facilitating data sharing and joint campaign management, Proca helps coalitions to maximise their impact, streamline operations, and present a united front on critical issues, all whilst ensuring compliance with data protection regulations.

## usage

### global installation

if you have or plan to have multiple servers (eg. production and staging) or multiple users, you can setup multiple environments. each proca command support a --env <environment> param (optional, 'default' if not specified.

All the examples are using the default environment, add --env=staging if you need to access another server than your default one. By convention, we keep default for production.

```sh-session
$ npm install -g proca
$# if you don't have your API token, generate one
$ proca user reset --email <your_email> --passowrd <your password>
$ proca config init --token=<API-token>
```

you can set up the config folder the widget builder will use to store the caches. skip unless you want a different one than the default (your/widget/folder/config).

### local development

```sh-session
   $ git clone https://github.com/fixthestatusquo/proca-cli.git
   $ cd proca-cli
   $ npm install
   $ npm link # let the proca widget and other use the local version
   $./proca-cli config add --env=local  --url=http://localhost:4000/api
   $./proca-cli config server --env=local #check if the config is working
   $./proca-cli config user #check if the config is working
```

you should also use the local proca-api in your [widget generator](https://github.com/fixthestatusquo/proca)

```sh-session
   $ cd /your/path/to/proca
   $ npm link proca # use the local proca-cli repo
```

# Commands

<!-- commands -->
* [`proca action add`](#proca-action-add)
* [`proca action confirm`](#proca-action-confirm)
* [`proca action count`](#proca-action-count)
* [`proca action list [TITLE]`](#proca-action-list-title)
* [`proca action replay`](#proca-action-replay)
* [`proca action requeue`](#proca-action-requeue)
* [`proca campaign add [TITLE]`](#proca-campaign-add-title)
* [`proca campaign close`](#proca-campaign-close)
* [`proca campaign copy`](#proca-campaign-copy)
* [`proca campaign delete`](#proca-campaign-delete)
* [`proca campaign get`](#proca-campaign-get)
* [`proca campaign list [TITLE]`](#proca-campaign-list-title)
* [`proca campaign mtt`](#proca-campaign-mtt)
* [`proca campaign status`](#proca-campaign-status)
* [`proca campaign widget archive`](#proca-campaign-widget-archive)
* [`proca campaign widget copy`](#proca-campaign-widget-copy)
* [`proca campaign widget get`](#proca-campaign-widget-get)
* [`proca campaign widget rebuild`](#proca-campaign-widget-rebuild)
* [`proca config add [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY]`](#proca-config-add-env-human-json-csv-markdown-simplify)
* [`proca config folder`](#proca-config-folder)
* [`proca config init [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY]`](#proca-config-init-env-human-json-csv-markdown-simplify)
* [`proca config server`](#proca-config-server)
* [`proca config set [KEY] [VALUE]`](#proca-config-set-key-value)
* [`proca config setup [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY]`](#proca-config-setup-env-human-json-csv-markdown-simplify)
* [`proca config user`](#proca-config-user)
* [`proca contact count`](#proca-contact-count)
* [`proca contact list [TITLE]`](#proca-contact-list-title)
* [`proca help [COMMAND]`](#proca-help-command)
* [`proca org add`](#proca-org-add)
* [`proca org crm`](#proca-org-crm)
* [`proca org delete`](#proca-org-delete)
* [`proca org email`](#proca-org-email)
* [`proca org get`](#proca-org-get)
* [`proca org user get`](#proca-org-user-get)
* [`proca plugins`](#proca-plugins)
* [`proca plugins add PLUGIN`](#proca-plugins-add-plugin)
* [`proca plugins:inspect PLUGIN...`](#proca-pluginsinspect-plugin)
* [`proca plugins install PLUGIN`](#proca-plugins-install-plugin)
* [`proca plugins link PATH`](#proca-plugins-link-path)
* [`proca plugins remove [PLUGIN]`](#proca-plugins-remove-plugin)
* [`proca plugins reset`](#proca-plugins-reset)
* [`proca plugins uninstall [PLUGIN]`](#proca-plugins-uninstall-plugin)
* [`proca plugins unlink [PLUGIN]`](#proca-plugins-unlink-plugin)
* [`proca plugins update`](#proca-plugins-update)
* [`proca service add`](#proca-service-add)
* [`proca service list`](#proca-service-list)
* [`proca target add`](#proca-target-add)
* [`proca template add`](#proca-template-add)
* [`proca template list`](#proca-template-list)
* [`proca user get`](#proca-user-get)
* [`proca user invite`](#proca-user-invite)
* [`proca user join`](#proca-user-join)
* [`proca user leave`](#proca-user-leave)
* [`proca user list`](#proca-user-list)
* [`proca user me`](#proca-user-me)
* [`proca user reset [USER]`](#proca-user-reset-user)
* [`proca user whoami`](#proca-user-whoami)
* [`proca widget add`](#proca-widget-add)
* [`proca widget delete`](#proca-widget-delete)
* [`proca widget get`](#proca-widget-get)
* [`proca widget list`](#proca-widget-list)
* [`proca widget rebuild`](#proca-widget-rebuild)
* [`proca widget update`](#proca-widget-update)

## `proca action add`

```
USAGE
  $ proca action add [ID_NAME_DXID...] -i <value> --firstname <value> --email <value>
    [--json | --human | --csv | --markdown] [--env <value>] [--simplify] [-x <value>] [-n <the_short_name>] [--testing]
    [--optin] [--action_type <value>] [--lastname <value>] [--street <value>] [--locality <value>] [--region <value>]
    [--country <value>] [--utm <value>] [--target <value>] [--subject <value>] [--body <value>]

FLAGS
  -i, --id=<value>             (required) widget's id
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --action_type=<value>    [default: register]
      --body=<value>           [mtt] body of the email
      --country=<value>        2-letter country iso code
      --email=<value>          (required) email
      --env=<value>            [default: default] allow to switch between configurations (server or users)
      --firstname=<value>      (required) supporter's firstname
  --lastname=<value>
  --locality=<value>
      --[no-]optin             Whether the user opts in (default: false). Use --optin to enable or --no-optin to
                               explicitly disable.
  --region=<value>
  --street=<value>
      --subject=<value>        [mtt] subject of the email
      --target=<value>         [mtt] uid of the target
      --[no-]testing           Run action in testing mode (default: true). Use --no-testing to disable.
      --utm=<value>            utm=campaign.source.medium

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca action add -i <widget_id> --firstname=John --email=john@example.org

  $ proca action add -i <widget_id> --firstname=John --email=john@example.org --country=FR custom1=A custom2=B

  $ proca action add -i <widget_id> --firstname=John --email=john@example.org target=715a9580-cfe6-4005-9e23-61a62ddecfea --subject='MTT subject' --body='message MTT'
```

## `proca action confirm`

Should the supporter confirm the action? it can be set either for all the widgets or an organisation or all the widgets of a campaign

```
USAGE
  $ proca action confirm [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--org <value>] [--campaign <value>] [--confirm] [--template <value>]

FLAGS
  --campaign=<value>  campaign collecting the action
  --[no-]confirm      should the supporters confirm each action
  --env=<value>       [default: default] allow to switch between configurations (server or users)
  --org=<value>       organisation collecting the action
  --template=<value>  template for sending the message

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Should the supporter confirm the action? it can be set either for all the widgets or an organisation or all the
  widgets of a campaign
```

## `proca action count`

counter of actions

```
USAGE
  $ proca action count [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  counter of actions

EXAMPLES
  $ proca action count --id <id of the campaign>

  $ proca action count --name <name of the campaign>
```

## `proca action list [TITLE]`

```
USAGE
  $ proca action list [TITLE] -o <organisation name> [--json | --human | --csv |
    --markdown] [--env <value>] [-c <campaign name>] [--limit <value>] [--today | --after 2025-04-09] [--optin]
    [--testing] [--doi] [--utm | --simplify] [--comment | ]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -c, --campaign=<campaign name>  name of the campaign, % for wildchar
  -o, --org=<organisation name>   (required) campaigns of the organisation (coordinator or partner)
      --after=2025-04-09          only actions after a date
      --[no-]comment              display the comment
      --doi                       only export the double optin actions
      --env=<value>               [default: default] allow to switch between configurations (server or users)
      --limit=<value>             max number of actions
      --optin                     only export the optin actions
      --testing                   also export the test actions
      --today                     only actions today
      --[no-]utm                  display the utm tracking parameters

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca action list %pizza%
```

## `proca action replay`

```
USAGE
  $ proca action replay -o <organisation name> [--json | --human | --csv | --markdown]
    [--env <value>] [--simplify] [-c <campaign title>]

FLAGS
  -c, --campaign=<campaign title>  name of the campaign, % for wildchar
  -o, --org=<organisation name>    (required) campaigns of the organisation (coordinator or partner)
      --env=<value>                [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca action replay %pizza%
```

## `proca action requeue`

requeue actions

```
USAGE
  $ proca action requeue -o <org name> -q
    CUSTOM_ACTION_CONFIRM|CUSTOM_ACTION_DELIVER|CUSTOM_SUPPORTER_CONFIRM|EMAIL_SUPPORTER|SQS|WEBHOOK [--json | --human |
    --csv | --markdown] [--env <value>] [--simplify] [-c <campaign name>] [--limit <value>] [--today | --after
    2025-04-09] [--optin] [--testing] [--doi]

FLAGS
  -c, --campaign=<campaign name>  name of the campaign, % for wildchar
  -o, --org=<org name>            (required) name of the org
  -q, --queue=<option>            (required) [default: CUSTOM_ACTION_DELIVER] queue to redeliver to
                                  <options: CUSTOM_ACTION_CONFIRM|CUSTOM_ACTION_DELIVER|CUSTOM_SUPPORTER_CONFIRM|EMAIL_S
                                  UPPORTER|SQS|WEBHOOK>
      --after=2025-04-09          only actions after a date
      --doi                       only export the double optin actions
      --env=<value>               [default: default] allow to switch between configurations (server or users)
      --limit=<value>             [default: 1000] how many actions per page
      --optin                     only export the optin actions
      --testing                   also export the test actions
      --today                     only actions today

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  requeue actions

EXAMPLES
  $ proca action requeue
```

## `proca campaign add [TITLE]`

```
USAGE
  $ proca campaign add [TITLE] -n <campaign name> -o <org name> [--json | --human | --csv
    | --markdown] [--env <value>] [--simplify]

ARGUMENTS
  TITLE  title of the campaign

FLAGS
  -n, --name=<campaign name>  (required) name of the campaign
  -o, --org=<org name>        (required) name of the coordinator
      --env=<value>           [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca campaign add -n <new_campaign> the full name of the campaign
```

## `proca campaign close`

```
USAGE
  $ proca campaign close [ID_NAME_DXID] --status draft|live|closed|ignored [--json |
    --human | --csv | --markdown] [--env <value>] [--simplify]

FLAGS
  --env=<value>      [default: default] allow to switch between configurations (server or users)
  --status=<option>  (required) Status to set
                     <options: draft|live|closed|ignored>

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

ALIASES
  $ proca campaign close

EXAMPLES
  $ proca campaign close -name <campaign>

  $ proca campaign close -i <campaign_id>
```

## `proca campaign copy`

Copy campaign settings to a new campaign

```
USAGE
  $ proca campaign copy [ID_NAME_DXID] -t <campaign name> [--json | --human | --csv |
    --markdown] [--env <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [-o <org name>] [--title
    <campaign title>] [--dry-run]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>   name
  -o, --org=<org name>          organization for the new campaign (defaults to source campaign org)
  -t, --to=<campaign name>      (required) new campaign name
  -x, --dxid=<value>            dxid
      --dry-run                 preview changes without executing
      --env=<value>             [default: default] allow to switch between configurations (server or users)
      --title=<campaign title>  title for the new campaign (defaults to source campaign title)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Copy campaign settings to a new campaign

EXAMPLES
  $ proca campaign copy test_2025 --to test_2026

  $ proca campaign copy -n old_campaign --to new_campaign -o different_org
```

## `proca campaign delete`

delete a campaign

```
USAGE
  $ proca campaign delete [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  delete a campaign

EXAMPLES
  $ proca campaign delete 42

  $ proca campaign delete -i 42

  $ proca campaign delete my_campaign

  $ proca campaign delete -n my_campaign
```

## `proca campaign get`

view a campaign

```
USAGE
  $ proca campaign get [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [--config] [--stats] [--locale <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --[no-]config            display the config
      --env=<value>            [default: default] allow to switch between configurations (server or users)
      --locale=<value>         display a locale
      --[no-]stats             display the stats

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a campaign

EXAMPLES
  $ proca campaign get -i 42
```

## `proca campaign list [TITLE]`

list all the campaigns

```
USAGE
  $ proca campaign list [TITLE] [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [-o <organisation name>] [-t <campaign title>] [--stats]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -o, --org=<organisation name>  campaigns of the organisation (coordinator or partner)
  -t, --title=<campaign title>   name of the campaign, % for wildchar
      --env=<value>              [default: default] allow to switch between configurations (server or users)
      --[no-]stats               display the stats

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the campaigns

EXAMPLES
  $ proca campaign list %pizza%
```

## `proca campaign mtt`

set the mail to target (mtt) params

```
USAGE
  $ proca campaign mtt [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [--from <value>] [--to <value>] [--template
    <value>] [--period <value>] [--email <value>] [--cc <value>] [--sender] [--drip]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --cc=<value>             comma-separated list of CC email addresses
      --drip                   drip delivery or deliver as fast as possible
      --email=<value>          test email address
      --env=<value>            [default: default] allow to switch between configurations (server or users)
      --from=<value>           start date (yyyy-mm-dd)
      --period=<value>         [default: 09:09-18:18] period of the day (HH:HH-HH:HH)
      --sender                 add sender to CC
      --template=<value>       mtt template to use
      --to=<value>             end date (yyyy-mm-dd)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  set the mail to target (mtt) params

EXAMPLES
  $ proca campaign mtt -n <test-mtt-campaign>
```

## `proca campaign status`

```
USAGE
  $ proca campaign status [ID_NAME_DXID] --status draft|live|closed|ignored [--json |
    --human | --csv | --markdown] [--env <value>] [--simplify]

FLAGS
  --env=<value>      [default: default] allow to switch between configurations (server or users)
  --status=<option>  (required) Status to set
                     <options: draft|live|closed|ignored>

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

ALIASES
  $ proca campaign close

EXAMPLES
  $ proca campaign status -name <campaign>

  $ proca campaign status -i <campaign_id>
```

## `proca campaign widget archive`

Archive all widgets in the campaign by adding suffix

```
USAGE
  $ proca campaign widget archive [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [-s <suffix>] [--dry-run]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -s, --suffix=<suffix>        [default: _archive] custom suffix to append (default: _archive)
  -x, --dxid=<value>           dxid
      --dry-run                preview changes without executing
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Archive all widgets in the campaign by adding suffix

EXAMPLES
  $ proca campaign widget archive old_campaign

  $ proca campaign widget archive -n old_campaign --suffix _backup

  $ proca campaign widget archive old_campaign --dry-run
```

## `proca campaign widget copy`

Copy widgets from one campaign to another

```
USAGE
  $ proca campaign widget copy [ID_NAME_DXID] -t <campaign name> [--json | --human | --csv |
    --markdown] [--env <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [-s <suffix>] [--dry-run]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -s, --suffix=<suffix>        [default: _archive] suffix to remove from widget names (e.g., _archive, -v1)
  -t, --to=<campaign name>     (required) destination campaign name
  -x, --dxid=<value>           dxid
      --dry-run                preview changes without executing
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Copy widgets from one campaign to another

EXAMPLES
  $ proca campaign widget copy old_campaign --to new_campaign

  $ proca campaign widget copy -n old_campaign --to new_campaign

  $ proca campaign widget copy old_campaign --to new_campaign --suffix _archive

  $ proca campaign widget copy old_campaign --to new_campaign --dry-run
```

## `proca campaign widget get`

List widgets in a campaign

```
USAGE
  $ proca campaign widget get [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  List widgets in a campaign
```

## `proca campaign widget rebuild`

(re)build all the widgets of a campaign

```
USAGE
  $ proca campaign widget rebuild [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  (re)build all the widgets of a campaign

EXAMPLES
  $ proca-cli campaign widget rebuild climate-action
```

## `proca config add [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY]`

create setting to access to a server

```
USAGE
  $ proca config add [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY] [--json | --human
    | --csv | --markdown] [--env <value>] [--simplify] [--url http://localhost:4000] [--token API-token>] [--email
    you@example.org] [--folder /var/www/proca/config.example]

ARGUMENTS
  ENV       [default: default] allow to switch between configurations (server or users)
  HUMAN     [default: true] Format output to be read on screen by a human [default]
  JSON      Format output as json
  CSV       Format output as csv
  MARKDOWN  Format output as markdown table
  SIMPLIFY  flatten and filter to output only the most important attributes, mostly relevant for json

FLAGS
  --email=you@example.org                 user email on proca server
  --env=<value>                           [default: default] allow to switch between configurations (server or users)
  --folder=/var/www/proca/config.example  config folder (in the proca widget generator)
  --token=API-token>                      user token on proca server
  --url=http://localhost:4000             [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  create setting to access to a server

ALIASES
  $ proca config setup
  $ proca config init

EXAMPLES
  $ proca config add --user=xavier@example.org --token=API-12345789
```

## `proca config folder`

Check and create config folders

```
USAGE
  $ proca config folder [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Check and create config folders

  Check if the PROCA_CONFIG_FOLDER is set up, if it is, check if the required subfolders exists and create if not
```

## `proca config init [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY]`

create setting to access to a server

```
USAGE
  $ proca config init [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY] [--json | --human
    | --csv | --markdown] [--env <value>] [--simplify] [--url http://localhost:4000] [--token API-token>] [--email
    you@example.org] [--folder /var/www/proca/config.example]

ARGUMENTS
  ENV       [default: default] allow to switch between configurations (server or users)
  HUMAN     [default: true] Format output to be read on screen by a human [default]
  JSON      Format output as json
  CSV       Format output as csv
  MARKDOWN  Format output as markdown table
  SIMPLIFY  flatten and filter to output only the most important attributes, mostly relevant for json

FLAGS
  --email=you@example.org                 user email on proca server
  --env=<value>                           [default: default] allow to switch between configurations (server or users)
  --folder=/var/www/proca/config.example  config folder (in the proca widget generator)
  --token=API-token>                      user token on proca server
  --url=http://localhost:4000             [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  create setting to access to a server

ALIASES
  $ proca config setup
  $ proca config init

EXAMPLES
  $ proca config init --user=xavier@example.org --token=API-12345789
```

## `proca config server`

get the server config

```
USAGE
  $ proca config server [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  get the server config
```

## `proca config set [KEY] [VALUE]`

update the setting used to authenticate to the servers and services

```
USAGE
  $ proca config set [KEY] [VALUE] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [--environment <value>] [--url <url>] [--token <API-token>]

ARGUMENTS
  KEY    variable name
  VALUE  value

FLAGS
  --env=<value>          [default: default] allow to switch between configurations (server or users)
  --environment=<value>  [default: default] environment
  --token=<API-token>    user token on proca server
  --url=<url>            [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  update the setting used to authenticate to the servers and services

ALIASES
  $ proca config setup

EXAMPLES
  $ proca config set --user=xavier@example.org --token=API-12345789

  $ proca config set VAR1 VALUE
```

## `proca config setup [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY]`

create setting to access to a server

```
USAGE
  $ proca config setup [ENV] [HUMAN] [JSON] [CSV] [MARKDOWN] [SIMPLIFY] [--json | --human
    | --csv | --markdown] [--env <value>] [--simplify] [--url http://localhost:4000] [--token API-token>] [--email
    you@example.org] [--folder /var/www/proca/config.example]

ARGUMENTS
  ENV       [default: default] allow to switch between configurations (server or users)
  HUMAN     [default: true] Format output to be read on screen by a human [default]
  JSON      Format output as json
  CSV       Format output as csv
  MARKDOWN  Format output as markdown table
  SIMPLIFY  flatten and filter to output only the most important attributes, mostly relevant for json

FLAGS
  --email=you@example.org                 user email on proca server
  --env=<value>                           [default: default] allow to switch between configurations (server or users)
  --folder=/var/www/proca/config.example  config folder (in the proca widget generator)
  --token=API-token>                      user token on proca server
  --url=http://localhost:4000             [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  create setting to access to a server

ALIASES
  $ proca config setup
  $ proca config init

EXAMPLES
  $ proca config setup --user=xavier@example.org --token=API-12345789
```

## `proca config user`

fetch the information about the current user (based on the token)

```
USAGE
  $ proca config user [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  fetch the information about the current user (based on the token)

ALIASES
  $ proca user whoami
  $ proca user me

EXAMPLES
  $ proca config user
```

## `proca contact count`

counter of supporters

```
USAGE
  $ proca contact count [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  counter of supporters

EXAMPLES
  $ proca contact count --id <id of the campaign>

  $ proca contact count --name <name of the campaign>
```

## `proca contact list [TITLE]`

```
USAGE
  $ proca contact list [TITLE] -o <organisation name> [--json | --human | --csv |
    --markdown] [--env <value>] [-c <campaign title>] [-n <value>] [--today | --after 2025-04-09] [--optin] [--testing]
    [--doi] [--utm | --simplify] [--comment | ]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -c, --campaign=<campaign title>  name of the campaign, % for wildchar
  -n, --limit=<value>              max number of actions
  -o, --org=<organisation name>    (required) campaigns of the organisation (coordinator or partner)
      --after=2025-04-09           only actions after a date
      --[no-]comment               display the comment
      --doi                        only export the double optin actions
      --env=<value>                [default: default] allow to switch between configurations (server or users)
      --optin                      only export the optin actions
      --testing                    also export the test actions
      --today                      only actions today
      --[no-]utm                   display the utm tracking parameters

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca contact list %pizza%
```

## `proca help [COMMAND]`

Display help for proca.

```
USAGE
  $ proca help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for proca.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.27/src/commands/help.ts)_

## `proca org add`

```
USAGE
  $ proca org add [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--twitter <screen name>] [-n <org acronym/name>] [-t <org full name>]

FLAGS
  -n, --name=<org acronym/name>  short name of the org
  -t, --title=<org full name>    title/full name of the org
      --env=<value>              [default: default] allow to switch between configurations (server or users)
      --twitter=<screen name>    twitter account

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca org add --name <twitter of the organisation> --title='this is an organisation'

  $ proca org add --twitter <twitter of the organisation>
```

## `proca org crm`

view a org crm synchroniser

```
USAGE
  $ proca org crm -n <org name> [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [--synchronize]

FLAGS
  -n, --name=<org name>   (required) name of the org
      --env=<value>       [default: default] allow to switch between configurations (server or users)
      --[no-]synchronize  enable or disable the synchronisation queue

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a org crm synchroniser
```

## `proca org delete`

```
USAGE
  $ proca org delete [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <org name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<org name>  name of the org
  -x, --dxid=<value>     dxid
      --env=<value>      [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca org delete  <organisation_name>
```

## `proca org email`

Set email service and supporter confirmation for an org

```
USAGE
  $ proca org email [ID_NAME_DXID] --org <value> --mailer mailjet ses stripe
    test_stripe system preview webhook supabase smtp [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--from <value>] [--supporter-confirm]

FLAGS
  --env=<value>                                                                 [default: default] allow to switch
                                                                                between configurations (server or users)
  --from=<value>                                                                Email address to send from (default:
                                                                                <org>@proca.app)
  --mailer=mailjet ses stripe test_stripe system preview webhook supabase smtp  (required) [default: MAILJET] service to
                                                                                send emails
  --org=<value>                                                                 (required) organisation running the
                                                                                service
  --[no-]supporter-confirm                                                      enable/disable action confirmation
                                                                                emails

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Set email service and supporter confirmation for an org

EXAMPLES
  $ proca org:email --org myorg --mailer mailjet

  $ proca org:email -o myorg --mailer system --from campaigns@myorg.org

  $ proca org:email --org myorg --supporter-confirm

  $ proca org:email --org myorg --no-supporter-confirm
```

## `proca org get`

view a org

```
USAGE
  $ proca org get [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-n <org name>] [--config] [--personaldata] [--processing] [--keys] [--campaigns] [--users]

FLAGS
  -n, --name=<org name>    name of the org
  --[no-]campaigns
      --[no-]config        display the config
      --env=<value>        [default: default] allow to switch between configurations (server or users)
  --[no-]keys
      --[no-]personaldata  how are the personal data of the supporter processed
      --[no-]processing    additional processing workflows on the actions
  --[no-]users

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a org

EXAMPLES
  $ proca org get <name of the ngo>
```

## `proca org user get`

list all the users

```
USAGE
  $ proca org user get -o <value> [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  -o, --org=<value>  (required) organisation
      --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the users

ALIASES
  $ proca org user get

EXAMPLES
  $ proca org user get %pizza%
```

## `proca plugins`

List installed plugins.

```
USAGE
  $ proca plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ proca plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/index.ts)_

## `proca plugins add PLUGIN`

Installs a plugin into proca.

```
USAGE
  $ proca plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into proca.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PROCA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PROCA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ proca plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ proca plugins add myplugin

  Install a plugin from a github url.

    $ proca plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ proca plugins add someuser/someplugin
```

## `proca plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ proca plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ proca plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/inspect.ts)_

## `proca plugins install PLUGIN`

Installs a plugin into proca.

```
USAGE
  $ proca plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into proca.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the PROCA_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the PROCA_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ proca plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ proca plugins install myplugin

  Install a plugin from a github url.

    $ proca plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ proca plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/install.ts)_

## `proca plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ proca plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ proca plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/link.ts)_

## `proca plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ proca plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ proca plugins unlink
  $ proca plugins remove

EXAMPLES
  $ proca plugins remove myplugin
```

## `proca plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ proca plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/reset.ts)_

## `proca plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ proca plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ proca plugins unlink
  $ proca plugins remove

EXAMPLES
  $ proca plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/uninstall.ts)_

## `proca plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ proca plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ proca plugins unlink
  $ proca plugins remove

EXAMPLES
  $ proca plugins unlink myplugin
```

## `proca plugins update`

Update installed plugins.

```
USAGE
  $ proca plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.25/src/commands/plugins/update.ts)_

## `proca service add`

Set service, usually email backend for an org, the specific meaning of each param is dependant on the service

```
USAGE
  $ proca service add -o <value> --type
    mailjet|ses|stripe|test_stripe|preview|webhook|supabase|smtp [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--user <value>] [--password <value>] [--host <value>] [--path <value>]

FLAGS
  -o, --org=<value>       (required) organisation running the service
      --env=<value>       [default: default] allow to switch between configurations (server or users)
      --host=<value>      server of the service
      --password=<value>  credential of the account on the service
      --path=<value>      path on the service
      --type=<option>     (required) [default: system] type of the service
                          <options: mailjet|ses|stripe|test_stripe|preview|webhook|supabase|smtp>
      --user=<value>      credential of the account on the service

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Set service, usually email backend for an org, the specific meaning of each param is dependant on the service
```

## `proca service list`

list services set for an organisation

```
USAGE
  $ proca service list -o <value> [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  -o, --org=<value>  (required) organisation running the service
      --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list services set for an organisation
```

## `proca target add`

```
USAGE
  $ proca target add -c <value> --name <value> --email <value> [--json | --human |
    --csv | --markdown] [--env <value>] [--simplify] [--external_id <value>]

FLAGS
  -c, --campaign=<value>     (required) mtt campaign to add the target
      --email=<value>        (required) email of the target
      --env=<value>          [default: default] allow to switch between configurations (server or users)
      --external_id=<value>  external id of the target
      --name=<value>         (required) name of the target

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json
```

## `proca template add`

```
USAGE
  $ proca template add -o <value> [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--type thankyou|doi|confirm|doi_thankyou|doi_confirm] [-l <locale>] [-n by default  type@language] [-s
    'template:' + type]

FLAGS
  -l, --lang=<locale>                   [default: en] language
  -n, --name=by default  type@language  name
  -o, --org=<value>                     (required) organisation
  -s, --subject='template:' + type      subject
      --env=<value>                     [default: default] allow to switch between configurations (server or users)
      --type=<option>                   [default: thankyou]
                                        <options: thankyou|doi|confirm|doi_thankyou|doi_confirm>

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json
```

## `proca template list`

list services set for an organisation

```
USAGE
  $ proca template list -o <value> [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  -o, --org=<value>  (required) organisation having the templates
      --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list services set for an organisation
```

## `proca user get`

fetch the information about a user

```
USAGE
  $ proca user get [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--email <value>] [-o <org name>] [-i <value>]

FLAGS
  -i, --id=<value>      id of the user
  -o, --org=<org name>  name of the org
      --email=<value>   user email
      --env=<value>     [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  fetch the information about a user

EXAMPLES
  $ proca user get
```

## `proca user invite`

invite a user to join an organisation with a role

```
USAGE
  $ proca user invite -o <org name> -u <user email> [--json | --human | --csv |
    --markdown] [--env <value>] [--simplify] [--role owner|campaigner|coordinator|translator]

FLAGS
  -o, --org=<org name>     (required) name of the org
  -u, --user=<user email>  (required) email
      --env=<value>        [default: default] allow to switch between configurations (server or users)
      --role=<option>      [default: campaigner] permission level in that org
                           <options: owner|campaigner|coordinator|translator>

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  invite a user to join an organisation with a role

EXAMPLES
  $ proca user invite
```

## `proca user join`

let a user join an organisation with a role

```
USAGE
  $ proca user join -o <org name> [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [--role owner|campaigner|coordinator|translator] [-u <user email>]

FLAGS
  -o, --org=<org name>     (required) name of the org
  -u, --user=<user email>  email
      --env=<value>        [default: default] allow to switch between configurations (server or users)
      --role=<option>      [default: campaigner] permission level in that org
                           <options: owner|campaigner|coordinator|translator>

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  let a user join an organisation with a role

EXAMPLES
  $ proca user join
```

## `proca user leave`

leave a org

```
USAGE
  $ proca user leave -o <org name> [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-u <user email>]

FLAGS
  -o, --org=<org name>     (required) name of the org
  -u, --user=<user email>  email
      --env=<value>        [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  leave a org

EXAMPLES
  $ proca user leave -i 42
```

## `proca user list`

list all the users

```
USAGE
  $ proca user list -o <value> [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  -o, --org=<value>  (required) organisation
      --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the users

ALIASES
  $ proca org user get

EXAMPLES
  $ proca user list %pizza%
```

## `proca user me`

fetch the information about the current user (based on the token)

```
USAGE
  $ proca user me [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  fetch the information about the current user (based on the token)

ALIASES
  $ proca user whoami
  $ proca user me

EXAMPLES
  $ proca user me
```

## `proca user reset [USER]`

Reset user API token

```
USAGE
  $ proca user reset [USER] [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [--password <value>] [--url <value>]

ARGUMENTS
  USER  Username (email)

FLAGS
  --env=<value>       [default: default] allow to switch between configurations (server or users)
  --password=<value>  Password
  --url=<value>       URL of the Proca server API

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Reset user API token
```

## `proca user whoami`

fetch the information about the current user (based on the token)

```
USAGE
  $ proca user whoami [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify]

FLAGS
  --env=<value>  [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  fetch the information about the current user (based on the token)

ALIASES
  $ proca user whoami
  $ proca user me

EXAMPLES
  $ proca user whoami
```

## `proca widget add`

```
USAGE
  $ proca widget add -c <campaign name> [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-o <en>] [-l <en>] [-n by default  <campaign>/<org>/<lang>]

FLAGS
  -c, --campaign=<campaign name>                  (required) name of the campaign
  -l, --lang=<en>                                 [default: en] language
  -n, --name=by default  <campaign>/<org>/<lang>  url slug
  -o, --org=<en>                                  organisation
      --env=<value>                               [default: default] allow to switch between configurations (server or
                                                  users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json
```

## `proca widget delete`

Delete a widget

```
USAGE
  $ proca widget delete [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Delete a widget
```

## `proca widget get`

view a widget

```
USAGE
  $ proca widget get [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [--config]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --[no-]config            display the config
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a widget
```

## `proca widget list`

list all the widgets of an org or campaign

```
USAGE
  $ proca widget list [--json | --human | --csv | --markdown] [--env <value>]
    [--simplify] [-o <organisation name>] [-c <campaign name>] [--config]

FLAGS
  -c, --campaign=<campaign name>  widgets of the campaign (coordinator or partner)
  -o, --org=<organisation name>   widgets of the organisation (coordinator or partner)
      --[no-]config               get the config
      --env=<value>               [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the widgets of an org or campaign

EXAMPLES
  $ proca widget list -o <organisation>
```

## `proca widget rebuild`

(re)build a widget

```
USAGE
  $ proca widget rebuild [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  (re)build a widget

EXAMPLES
  $ proca widget rebuild 42

  $ proca widget rebuild climate-action/my-org/en

  SEE ALSO:

  $ proca campaign widget rebuild   Rebuild all the widgets of a campaign
```

## `proca widget update`

Update a widget's properties

```
USAGE
  $ proca widget update [ID_NAME_DXID] [--json | --human | --csv | --markdown] [--env
    <value>] [--simplify] [-i <value> | -n <the_short_name> | -x <value>] [-n <widget name>] [-l <locale>] [--color <hex
    code>] [--confirm-optin] [--dry-run]

FLAGS
  -i, --id=<value>
  -l, --locale=<locale>        change the locale
  -n, --name=<the_short_name>  name
  -n, --rename=<widget name>   new name for the widget
  -x, --dxid=<value>           dxid
      --color=<hex code>       update color (not yet implemented)
      --confirm-optin          add confirmOptIn (check email snack) to consent.email component
      --dry-run                Show changes without updating the widget
      --env=<value>            [default: default] allow to switch between configurations (server or users)

OUTPUT FLAGS
  --csv            Format output as csv
  --human          Format output to be read on screen by a human [default]
  --json           Format output as json
  --markdown       Format output as markdown table
  --[no-]simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  Update a widget's properties

EXAMPLES
  $ proca widget update 4454 --name new_widget_name

  $ proca widget update 4454 --locale fr

  $ proca widget update 4454 --confirm-optin

  $ proca widget update 4454 --confirm-optin --dry-run
```
<!-- commandsstop -->
