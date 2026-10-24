param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRoot
)

$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$buildDir = Join-Path $ProjectRoot "build"
$htmlPath = Join-Path $ProjectRoot "index.html"
$cssPath = Join-Path $ProjectRoot "css\style.css"
$scriptPath = Join-Path $ProjectRoot "js\app-bundle.js"

foreach ($path in @($htmlPath, $cssPath, $scriptPath)) {
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Required source file not found: $path"
  }
}

$html = [System.IO.File]::ReadAllText($htmlPath)
$css = [System.IO.File]::ReadAllText($cssPath)
$script = [System.IO.File]::ReadAllText($scriptPath)

$stylesheetTag = '<link rel="stylesheet" href="css/style.css" />'
if (-not $html.Contains($stylesheetTag)) {
  throw "Could not find the stylesheet reference in index.html."
}
$html = $html.Replace(
  $stylesheetTag,
  "<style>`r`n$css`r`n</style>"
)

$scriptPattern = '<script src="js/app-bundle\.js"[^>]*></script>'
$scriptMatches = [regex]::Matches($html, $scriptPattern)
if ($scriptMatches.Count -ne 1) {
  throw "Expected exactly one app-bundle.js script reference in index.html."
}
$match = $scriptMatches[0]
$inlineScript = "<script>`r`n$script`r`n</script>"
$html = $html.Substring(0, $match.Index) + $inlineScript +
  $html.Substring($match.Index + $match.Length)

if (-not (Test-Path -LiteralPath $buildDir -PathType Container)) {
  New-Item -ItemType Directory -Path $buildDir | Out-Null
}

$outputPath = Join-Path $buildDir "index.html"
$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputPath, $html, $encoding)
Write-Output "Standalone app created: $outputPath"
