# Check if script is running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script requires administrator privileges. Please run as administrator." -ForegroundColor Red
    exit 1
}

# Check firewall status
$firewall = Get-NetFirewallProfile | Select-Object Name, Enabled
Write-Host "`nFirewall Status:" -ForegroundColor Cyan
$firewall | Format-Table -AutoSize

# Check rules for ports 4001 and 4000
Write-Host "`nChecking rules for ports 4001 and 4000..." -ForegroundColor Cyan
$rules = Get-NetFirewallRule | Where-Object { 
    $_.Direction -eq "Inbound" -and 
    $_.Action -eq "Allow" -and 
    $_.Enabled -eq "True"
} | Get-NetFirewallPortFilter | Where-Object {
    $_.LocalPort -eq "4001" -or $_.LocalPort -eq "4000"
}

if ($rules) {
    Write-Host "`nFound matching firewall rules:" -ForegroundColor Green
    $rules | Format-Table -AutoSize
} else {
    Write-Host "`nNo specific firewall rules found for ports 4001 or 4000." -ForegroundColor Yellow
}

# Check if there are any rules that might be blocking Node.js
Write-Host "`nChecking for rules that might block Node.js..." -ForegroundColor Cyan
$nodeRules = Get-NetFirewallApplicationFilter -Program "*node*" -ErrorAction SilentlyContinue

if ($nodeRules) {
    Write-Host "`nFound Node.js related firewall rules:" -ForegroundColor Green
    $nodeRules | ForEach-Object {
        $rule = Get-NetFirewallRule -Name $_.InstanceID
        $portFilter = Get-NetFirewallPortFilter -AssociatedNetFirewallRule $rule
        Write-Host "Rule: $($rule.DisplayName)" -ForegroundColor Cyan
        Write-Host "  Enabled: $($rule.Enabled)"
        Write-Host "  Action: $($rule.Action)"
        Write-Host "  Direction: $($rule.Direction)"
        if ($portFilter.LocalPort) {
            Write-Host "  Ports: $($portFilter.LocalPort)"
        }
        Write-Host ""
    }
} else {
    Write-Host "`nNo Node.js specific firewall rules found." -ForegroundColor Yellow
}

Write-Host "`nTo create a firewall rule to allow Node.js, run the following command in an elevated PowerShell:" -ForegroundColor Cyan
Write-Host "New-NetFirewallRule -DisplayName 'Node.js Development' -Direction Inbound -Program '$(Get-Command node).Source' -Action Allow" -ForegroundColor Yellow
