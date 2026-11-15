Add-Type -AssemblyName System.Drawing

$srcPath = "E:\Hackathon_BIAS\frontend\public\earth_atmos_2048.jpg"
$dstPath = "E:\Hackathon_BIAS\frontend\public\earth_vibrant_2048.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height

$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$bmpData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$stride = $bmpData.Stride
$bytes = [byte[]]::new($stride * $height)
[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $bytes, 0, $bytes.Length)

for ($y = 0; $y -lt $height; $y++) {
    $rowStart = $y * $stride
    for ($x = 0; $x -lt $width; $x++) {
        $idx = $rowStart + ($x * 3)
        $b = [int]$bytes[$idx]
        $g = [int]$bytes[$idx + 1]
        $r = [int]$bytes[$idx + 2]

        # In Blue Marble, oceans have B >= R and low R
        $isOcean = ($b -ge $r) -and ($b -ge ($g - 10)) -and ($r -lt 85)

        if ($isOcean) {
            # Luminous royal sapphire ocean
            $bytes[$idx]     = [byte][Math]::Min(255, [int]($b * 2.2 + 45))   # Blue
            $bytes[$idx + 1] = [byte][Math]::Min(255, [int]($g * 1.5 + 20))   # Green/Cyan
            $bytes[$idx + 2] = [byte][Math]::Min(255, [int]($r * 0.7 + 5))    # Red
        } else {
            # Continental land: boost saturation and vibrancy
            if ($g -gt $b -and $g -gt 55) {
                # Forest/Vegetation: enhance emerald green
                $bytes[$idx + 1] = [byte][Math]::Min(255, [int]($g * 1.45 + 15))
                $bytes[$idx + 2] = [byte][Math]::Min(255, [int]($r * 1.15))
            } elseif ($r -gt 85 -and $g -gt 65) {
                # Mountains / Deserts: enhance golden ochre
                $bytes[$idx + 2] = [byte][Math]::Min(255, [int]($r * 1.25 + 10))
                $bytes[$idx + 1] = [byte][Math]::Min(255, [int]($g * 1.15))
            }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $bytes.Length)
$src.UnlockBits($bmpData)
$src.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$src.Dispose()
Write-Host "Created $dstPath successfully!"
