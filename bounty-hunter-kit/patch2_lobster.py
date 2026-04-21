with open(r"C:\Users\Administrator\.openclaw\workspace\lobster-platform\app\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Find <TodayJobs /> in the Home component
target = "<TodayJobs />"
idx = content.index(target)
print(f"Found <TodayJobs /> at index: {idx}")
print(f"Context: {repr(content[idx-100:idx+100])}")

# Find the section-divider before TodayJobs and insert BountyRadar before it
# Pattern: <div className="section-divider" />
#           <TodayJobs />
old_block = "      <div className=\"section-divider\" />\n      <TodayJobs />"
new_block = "      <BountyRadar />\n      <div className=\"section-divider\" />\n      <TodayJobs />"
if old_block in content:
    content = content.replace(old_block, new_block, 1)
    print("Replaced section-divider + TodayJobs block")
else:
    print("Could not find exact block, trying simpler replace")
    content = content.replace("<TodayJobs />", "<BountyRadar />\n      <TodayJobs />", 1)
    print("Did simpler replace")

with open(r"C:\Users\Administrator\.openclaw\workspace\lobster-platform\app\page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done - added <BountyRadar /> to Home render")
