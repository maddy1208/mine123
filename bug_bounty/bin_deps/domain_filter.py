import re

with open("scopes.txt", "r") as f:
    lines = [line.strip() for line in f if line.strip()]

wildcards = []
non_wildcards = []
excluded = []

for line in lines:
    # Skip lines without dot and not a wildcard or URL
    if '.' not in line and 'http' not in line and '*.' not in line:
        excluded.append(line)
        continue

    # Skip IPs
    if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', line):
        excluded.append(line)
        continue

    # Skip CIDRs
    if re.match(r'^\d{1,3}(\.\d{1,3}){3}/\d{1,2}$', line):
        excluded.append(line)
        continue

    # Wildcards
    if line.startswith('*.'):
        wildcards.append(line)
    else:
        non_wildcards.append(line)

# Save outputs
with open("wildcards.txt", "w") as wf:
    wf.write("\n".join(wildcards))

with open("non_wildcards.txt", "w") as nf:
    nf.write("\n".join(non_wildcards))

with open("excluded.txt", "w") as ef:
    ef.write("\n".join(excluded))

# Summary
print("✅ Wildcards:", len(wildcards))
print("✅ Non-wildcards:", len(non_wildcards))
print("❌ Excluded (junk/IPs/CIDRs):", len(excluded))
