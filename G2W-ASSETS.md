# G2W Assets

## ASCII Logo (Gemini-generated)

Shell version (for terminal / scripts):
```sh
echo -e "\x1b[92m"
cat << "EOF"

|\  |_   |\  \   |\  \
\ \  _|  |/ /\ \  \ \  \ \  \
 \ \ \ ___ / /  /\ \  \ __\ \  \
  \ \   |\  \ / //\ \  |___\ \
   \ _/|_\ _
    |__| || |______|
EOF
echo -e "\x1b[0m"
echo -e "\x1b[1m it's going to work or it's going to work\x1b[0m"
echo ""
```

JS version (used in `lib/logo.js`):
```js
const LOGO = `\x1b[92m
|\\  |_   |\\  \\   |\\  \\
\\ \\  _|  |/ /\\ \\  \\ \\  \\ \\  \\
 \\ \\ \\ ___ / /  /\\ \\  \\ __\\ \\  \\
  \\ \\   |\\  \\ / //\\ \\  |___\\ \\
   \\ _/|_\\ _
    |__| || |______|
\x1b[0m\x1b[1m  it's going to work or it's going to work\x1b[0m
`;
```

**Color:** `\x1b[92m` = bright green. Bold motto line uses `\x1b[1m`.
**Glow tip:** Enable Retro/Bloom in Windows Terminal or iTerm2 for full glow effect.
