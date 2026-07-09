---
name: node-process-killer
description: Kill Node.js worker processes to prevent conflicts during deployment or restart
---

# Node Process Killer Skill

## Overview

Kill Node.js worker processes to prevent port conflicts and ensure clean deployments. This skill standardizes the process of stopping running worker processes before starting new ones.

## When to Use

- Before deploying new code
- When restarting services
- When experiencing port conflicts
- During development when workers are stuck

## The Process

### Step 1: Identify Target Processes

Determine which Node.js processes to kill based on the project:

#### For worker processes:
```bash
powershell -NoProfile "$w = Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*worker*index.ts*' }; $w | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
```

#### For specific project processes:
```bash
powershell -NoProfile "$w = Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*PROJECT_NAME*' }; $w | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
```

#### For all Node.js processes (use with caution):
```bash
taskkill /F /IM node.exe
```

### Step 2: Verify Process Termination

After killing processes, verify they are stopped:

```bash
powershell -NoProfile "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Select-Object ProcessId, CommandLine | Format-Table -AutoSize"
```

### Step 3: Confirm Clean State

Ensure no orphaned processes remain before starting new services.

## Safety Considerations

1. **Always verify process ownership** before killing processes
2. **Use specific filters** to avoid killing unrelated processes
3. **Check for dependent services** that might be affected
4. **Have a recovery plan** if processes don't terminate

## Common Use Cases

### Heatline Project
- Kill worker processes before deploying edge functions
- Restart admin server during development

### AIS System
- Kill worker processes before deploying new worker code
- Clean up stuck background tasks

### General Node.js Projects
- Kill dev servers before restarting
- Clean up port conflicts

## Error Handling

### Process Won't Terminate
```bash
# Force kill with /F flag
taskkill /F /PID PROCESS_ID
```

### Permission Denied
```bash
# Run as administrator if needed
# Or use Get-Process with -Force parameter
```

### Process Already Stopped
- Verify with status check
- Proceed with next steps

## Tips

- Always check for running processes before starting new ones
- Use specific process filters to avoid collateral damage
- Keep a list of common process patterns for your projects
- Test kill commands in development before production use

## Example Workflow

```bash
# 1. Check for running worker processes
powershell -NoProfile "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*worker*' }"

# 2. Kill worker processes
powershell -NoProfile "$w = Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*worker*index.ts*' }; $w | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"

# 3. Verify termination
powershell -NoProfile "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Select-Object ProcessId, CommandLine | Format-Table -AutoSize"

# 4. Start new processes
npm run start:worker
```
