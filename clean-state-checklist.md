# Clean State Checklist

Run through this before closing a session.

## Startup path works

```bash
bash init.sh
```

Expected: exits 0, no manual fixes needed.

- [ ] `bash init.sh` exits 0

## Verification path passes

```bash
npm run check && npm run build
```

Expected: zero errors, zero warnings.

- [ ] `npm run check` exits 0
- [ ] `npm run build` exits 0 (if applicable)

## Progress is recorded

File: `claude-progress.md`

- [ ] Latest session entry is written
- [ ] Completed work is listed
- [ ] Next steps are documented

## Feature state is accurate

File: `feature_list.json`

- [ ] All `pass` features have evidence entries
- [ ] No feature is marked `pass` without evidence
- [ ] `lastUpdated` field reflects today's date

## No orphaned work

- [ ] No TODOs / FIXMEs left undocumented
- [ ] Stash is empty (`git stash list`)
- [ ] Uncommitted changes are intentional (or committed)

## Next session can start cleanly

- [ ] `bash init.sh` from a fresh terminal works
- [ ] `claude-progress.md` has clear "Next Steps"
- [ ] No credentials / secrets in uncommitted files
