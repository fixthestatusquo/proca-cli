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
proca/0.6.4 linux-x64 node-v20.12.2
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
* [`proca action count`](#proca-action-count)
* [`proca action list [TITLE]`](#proca-action-list-title)
* [`proca action replay`](#proca-action-replay)
* [`proca campaign add [TITLE]`](#proca-campaign-add-title)
* [`proca campaign delete`](#proca-campaign-delete)
* [`proca campaign get`](#proca-campaign-get)
* [`proca campaign list [TITLE]`](#proca-campaign-list-title)
* [`proca config add [ENVIRONMENT]`](#proca-config-add-environment)
* [`proca config get`](#proca-config-get)
* [`proca config set [KEY] [VALUE]`](#proca-config-set-key-value)
* [`proca config setup [ENVIRONMENT]`](#proca-config-setup-environment)
* [`proca config token`](#proca-config-token)
* [`proca config user`](#proca-config-user)
* [`proca help [COMMAND]`](#proca-help-command)
* [`proca org add`](#proca-org-add)
* [`proca org crm`](#proca-org-crm)
* [`proca org delete`](#proca-org-delete)
* [`proca org get`](#proca-org-get)
* [`proca org join`](#proca-org-join)
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
* [`proca supporter count`](#proca-supporter-count)
* [`proca user get`](#proca-user-get)
* [`proca user leave`](#proca-user-leave)
* [`proca user list`](#proca-user-list)
* [`proca widget add`](#proca-widget-add)
* [`proca widget cache`](#proca-widget-cache)
* [`proca widget get`](#proca-widget-get)
* [`proca widget list`](#proca-widget-list)

## `proca action count`

counter of actions

```
USAGE
  $ proca action count [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-i <value>
    | -n <the_short_name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  counter of actions

EXAMPLES
  $ proca action count --id <id of the campaign>

  $ proca action count --name <name of the campaign>
```

## `proca action list [TITLE]`

```
USAGE
  $ proca action list [TITLE] -o <organisation name> [--simplify [--json | --human |
    --csv]] [-c <campaign title>] [--limit <value>] [--optin] [--testing] [--doi] [--utm]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -c, --campaign=<campaign title>  name of the campaign, % for wildchar
  -o, --org=<organisation name>    (required) campaigns of the organisation (coordinator or partner)
      --doi                        only export the double optin actions
      --limit=<value>              max number of actions
      --optin                      only export the optin actions
      --testing                    also export the test actions
      --[no-]utm                   display the utm tracking parameters

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca action list %pizza%
```

## `proca action replay`

```
USAGE
  $ proca action replay -o <organisation name> [--simplify [--json | --human | --csv]] [-c
    <campaign title>]

FLAGS
  -c, --campaign=<campaign title>  name of the campaign, % for wildchar
  -o, --org=<organisation name>    (required) campaigns of the organisation (coordinator or partner)

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca action replay %pizza%
```

## `proca campaign add [TITLE]`

```
USAGE
  $ proca campaign add [TITLE] -n <campaign name> -o <org name> [--simplify [--json |
    --human | --csv]]

ARGUMENTS
  TITLE  title of the campaign

FLAGS
  -n, --name=<campaign name>  (required) name of the campaign
  -o, --org=<org name>        (required) name of the coordinator

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca campaign add -n <new_campaign> the full name of the campaign
```

## `proca campaign delete`

delete a campaign

```
USAGE
  $ proca campaign delete [--simplify [--json | --human | --csv]] [-i <organisation name>]
    [-n <campaign name>]

FLAGS
  -i, --id=<organisation name>  id of the campaign
  -n, --name=<campaign name>    name of the campaign

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  delete a campaign

EXAMPLES
  $ proca campaign delete -i 42
```

## `proca campaign get`

view a campaign

```
USAGE
  $ proca campaign get [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-i <value>
    | -n <the_short_name> | -x <value>] [--config] [--stats] [--locale <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --[no-]config            display the config
      --locale=<value>         display a locale
      --[no-]stats             display the stats

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a campaign

EXAMPLES
  $ proca campaign get -i 42
```

## `proca campaign list [TITLE]`

list all the campaigns

```
USAGE
  $ proca campaign list [TITLE] [--simplify [--json | --human | --csv]] [-o <organisation
    name>] [-t <campaign title>] [--stats]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -o, --org=<organisation name>  campaigns of the organisation (coordinator or partner)
  -t, --title=<campaign title>   name of the campaign, % for wildchar
      --[no-]stats               display the stats

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the campaigns

EXAMPLES
  $ proca campaign list %pizza%
```

## `proca config add [ENVIRONMENT]`

create setting to access the server authentication

```
USAGE
  $ proca config add [ENVIRONMENT] --token <API-token> [--simplify [--json | --human |
    --csv]] [--force] [--url <url>] [--n8n <n8n api>] [--supabase <url>] [--supabase-anon-key <value>]
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
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  create setting to access the server authentication

ALIASES
  $ proca config setup

EXAMPLES
  $ proca config add --user=xavier@example.org --token=API-12345789
```

## `proca config get`

get the server config

```
USAGE
  $ proca config get [--simplify [--json | --human | --csv]]

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  get the server config
```

## `proca config set [KEY] [VALUE]`

update the setting used to authenticate to the servers and services

```
USAGE
  $ proca config set [KEY] [VALUE] [--simplify [--json | --human | --csv]]
    [--environment <value>] [--url <url>] [--token <API-token>]

ARGUMENTS
  KEY    variable name
  VALUE  value

FLAGS
  --environment=<value>  [default: default] environment
  --token=<API-token>    user token on proca server
  --url=<url>            [default: https://api.proca.app/api] url of the proca server api

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  update the setting used to authenticate to the servers and services

ALIASES
  $ proca config setup

EXAMPLES
  $ proca config set --user=xavier@example.org --token=API-12345789

  $ proca config set VAR1 VALUE
```

## `proca config setup [ENVIRONMENT]`

create setting to access the server authentication

```
USAGE
  $ proca config setup [ENVIRONMENT] --token <API-token> [--simplify [--json | --human |
    --csv]] [--force] [--url <url>] [--n8n <n8n api>] [--supabase <url>] [--supabase-anon-key <value>]
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
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  create setting to access the server authentication

ALIASES
  $ proca config setup

EXAMPLES
  $ proca config setup --user=xavier@example.org --token=API-12345789
```

## `proca config token`

convert between token and sql value

```
USAGE
  $ proca config token [--simplify [--json | --human | --csv]] [--token API-xxx]

FLAGS
  --token=API-xxx  the token in your config

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  convert between token and sql value
```

## `proca config user`

fetch the information about the current user (based on the token)

```
USAGE
  $ proca config user [--simplify [--json | --human | --csv]]

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  fetch the information about the current user (based on the token)

EXAMPLES
  $ proca config user
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
  $ proca org add [--simplify [--json | --human | --csv]] [--twitter <screen name>]
    [-n <org name>]

FLAGS
  -n, --name=<org name>        name of the org
      --twitter=<screen name>  twitter account

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca org add --twitter <twitter of the organisation>
```

## `proca org crm`

view a org crm synchroniser

```
USAGE
  $ proca org crm -n <org name> [--simplify [--json | --human | --csv]]
    [--synchronize]

FLAGS
  -n, --name=<org name>   (required) name of the org
      --[no-]synchronize  enable or disable the synchronisation queue

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a org crm synchroniser
```

## `proca org delete`

```
USAGE
  $ proca org delete [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-i <value>
    | -n <org name> | -x <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<org name>  name of the org
  -x, --dxid=<value>     dxid

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

EXAMPLES
  $ proca org delete  <organisation_name>
```

## `proca org get`

view a org

```
USAGE
  $ proca org get [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-n <org
    name>] [--config] [--keys] [--campaigns] [--widgets] [--users]

FLAGS
  -n, --name=<org name>  name of the org
  --[no-]campaigns
      --[no-]config      display the config
  --[no-]keys
  --[no-]users
  --[no-]widgets

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a org

EXAMPLES
  $ proca org get <name of the ngo>
```

## `proca org join`

let a user join an organisation with a role

```
USAGE
  $ proca org join -o <org name> [--simplify [--json | --human | --csv]] [--user
    <value>] [--role owner|campaigner|coordinator|translator]

FLAGS
  -o, --org=<org name>  (required) name of the org
      --role=<option>   [default: campaigner] permission level in that org
                        <options: owner|campaigner|coordinator|translator>
      --user=<value>    user email

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  let a user join an organisation with a role

EXAMPLES
  $ proca org join
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

## `proca supporter count`

counter of supporters

```
USAGE
  $ proca supporter count [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-i <value>
    | -n <the_short_name> | -x <value>] [--org] [--area] [--number --without <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --area                   segment by area
      --number                 just return the number to add to the partner's counter
      --org                    segment by partner
      --without=<value>        total to add to the partner's counter

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  counter of supporters

EXAMPLES
  $ proca supporter count --id <id of the campaign>

  $ proca supporter count --name <name of the campaign>
```

## `proca user get`

fetch the information about a user

```
USAGE
  $ proca user get [--simplify [--json | --human | --csv]] [--email <value>] [-o <org
    name>] [-i <value>]

FLAGS
  -i, --id=<value>      id of the user
  -o, --org=<org name>  name of the org
      --email=<value>   user email

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  fetch the information about a user

EXAMPLES
  $ proca user get
```

## `proca user leave`

leave a org

```
USAGE
  $ proca user leave --email <user email> -o <org name> [--simplify [--json | --human |
    --csv]]

FLAGS
  -o, --org=<org name>      (required) name of the org
      --email=<user email>  (required) email

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  leave a org

EXAMPLES
  $ proca user leave -i 42
```

## `proca user list`

list all the users

```
USAGE
  $ proca user list -o <value> [--simplify [--json | --human | --csv]]

FLAGS
  -o, --org=<value>  (required) organisation

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the users

EXAMPLES
  $ proca user list %pizza%
```

## `proca widget add`

```
USAGE
  $ proca widget add -c <campaign name> [--simplify [--json | --human | --csv]] [-o
    <en>] [-l <en>] [-n by default  <campaign>/<org>/<lang>]

FLAGS
  -c, --campaign=<campaign name>                  (required) name of the campaign
  -l, --lang=<en>                                 [default: en] language
  -n, --name=by default  <campaign>/<org>/<lang>  url slug
  -o, --org=<en>                                  organisation

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json
```

## `proca widget cache`

clear the cdn cache of a widget

```
USAGE
  $ proca widget cache [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-i <value>
    | -n <the_short_name> | -x <value>] [--url <value>]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --url=<value>            url of the widget on the CDN

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  clear the cdn cache of a widget

EXAMPLES
  $ proca widget cache --url https://cdn.proca.app/d/[campaign]/[org]/[locale]

  $ proca widget cache --name [campaign]/[org]/[locale]
```

## `proca widget get`

view a widget

```
USAGE
  $ proca widget get [ID_NAME_DXID] [--simplify [--json | --human | --csv]] [-i <value>
    | -n <the_short_name> | -x <value>] [--config]

FLAGS
  -i, --id=<value>
  -n, --name=<the_short_name>  name
  -x, --dxid=<value>           dxid
      --[no-]config            display the config

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  view a widget

EXAMPLES
  $ proca widget get <path of the widget>
```

## `proca widget list`

list all the widgets of an org or campaign

```
USAGE
  $ proca widget list [--simplify [--json | --human | --csv]] [-o <organisation name>]
    [-c <campaign name>] [--config]

FLAGS
  -c, --campaign=<campaign name>  widgets of the campaign (coordinator or partner)
  -o, --org=<organisation name>   widgets of the organisation (coordinator or partner)
      --[no-]config               get the config

OUTPUT FLAGS
  --csv       Format output as csv
  --human     Format output to be read on screen by a human [default]
  --json      Format output as json
  --simplify  flatten and filter to output only the most important attributes, mostly relevant for json

DESCRIPTION
  list all the widgets of an org or campaign

EXAMPLES
  $ proca widget list -o <organisation>
```
<!-- commandsstop -->
