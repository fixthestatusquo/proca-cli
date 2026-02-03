## Steps to duplicate the campaign

1. Archive widgets

```bash
proca campaign widget archive -c <campaign>
```

2. Copy campaign

```bash
proca campaign copy  <source> --to <destination>
```

3. Copy widgets

```bash
proca campaign widget copy --from <source> --to <destination>
```

For the petition, this should be sufficient.
For MTTs, we need to set new targets (copy the previous source with a new campaign name and deploy it) and a new snowflake.
