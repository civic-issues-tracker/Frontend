# Jira CSV Import Instructions

Files generated:
- frontend_jira_import_Unassigned.csv
- frontend_jira_import_Track_1_Public_and_Citizen.csv
- frontend_jira_import_Track_2_Admin.csv
- frontend_jira_import_Track_3_Organization_Admin.csv
- frontend_jira_import_All.csv

Quick steps to import into Jira Cloud:
1. In Jira, go to Settings → System → Import & Export → External System Import → CSV.
2. Upload the CSV file for the epic and tasks (choose one per import, or import epics first).
3. Map `Summary` → Summary, `Issue Type` → Issue Type, `Description` → Description, `Priority` → Priority, `Epic Name` → Epic Link (or Epic Name if using Classic). Map `Assignee`, `Labels` as needed.
4. Import epics first (Issue Type = Epic) so later tasks can reference `Epic Name`.
5. Verify imported issues in Jira; assign components/versions as needed.

Validation report:
No basic validation issues detected. All required columns present and priorities look OK.
