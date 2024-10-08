proca
=================a

Access the proca api
npx proca-cli --help

## local development:
./proca-cli --help


### TOPICS
-  campaign  Handle campaigns
-  config    create setting to access the server authentication

### TODO TOPICS

- widget
- org
- actions
- 

### COMMAND 
#### campaign

./proca-cli.mjs campaign --help

- campaign get   view a campaign
- campaign list  list all the campaigns

#### campaign list 
./proca-cli.mjs campaign list --help
list all the campaigns

USAGE
  $ proca campaign list [TITLE] [--simplify [--json | --csv | --table]] [-o <organisation name> | -t <campaign title>] [--stats]

ARGUMENTS
  TITLE  name of the campaign, % for wildchar

FLAGS
  -o, --org=<organisation name>  organisation coordinating the campaigns
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

