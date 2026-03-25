'use client'

import { Chip, Stack } from '@mui/material'
import { 
  Wifi as WifiIcon, 
  AcUnit as AcIcon, 
  LocalParking as ParkingIcon, 
  Restaurant as FoodIcon,
  Tv as TvIcon,
  Kitchen as KitchenIcon,
  HotTub as WaterIcon,
  Power as BackupIcon
} from '@mui/icons-material'

const AMENITY_MAP: { [key: string]: { icon: any, label: string } } = {
  wifi: { icon: <WifiIcon sx={{ fontSize: 16 }} />, label: 'WiFi' },
  ac: { icon: <AcIcon sx={{ fontSize: 16 }} />, label: 'AC' },
  parking: { icon: <ParkingIcon sx={{ fontSize: 16 }} />, label: 'Parking' },
  restaurant: { icon: <FoodIcon sx={{ fontSize: 16 }} />, label: 'Food' },
  food: { icon: <FoodIcon sx={{ fontSize: 16 }} />, label: 'Food' },
  tv: { icon: <TvIcon sx={{ fontSize: 16 }} />, label: 'TV' },
  fridge: { icon: <KitchenIcon sx={{ fontSize: 16 }} />, label: 'Fridge' },
  geyser: { icon: <WaterIcon sx={{ fontSize: 16 }} />, label: 'Geyser' },
  backup: { icon: <BackupIcon sx={{ fontSize: 16 }} />, label: 'Power Backup' },
}

interface AmenityChipsProps {
  amenities: string | string[]
  max?: number
}

export default function AmenityChips({ amenities, max = 3 }: AmenityChipsProps) {
  const list = typeof amenities === 'string' 
    ? amenities.split(',').map(s => s.trim().toLowerCase()) 
    : amenities.map(s => s.toLowerCase())

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
      {list.slice(0, max).map((item) => {
        const config = AMENITY_MAP[item]
        return (
          <Chip
            key={item}
            icon={config?.icon}
            label={config?.label || item.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{ 
                borderRadius: '8px',
                fontSize: '0.7rem',
                height: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(4px)',
                borderColor: 'divider',
                '& .MuiChip-label': { px: 1 }
            }}
          />
        )
      })}
      {list.length > max && (
        <Chip
          label={`+${list.length - max}`}
          size="small"
          variant="outlined"
          sx={{ borderRadius: '8px', fontSize: '0.7rem', height: '24px' }}
        />
      )}
    </Stack>
  )
}
