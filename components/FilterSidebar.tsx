'use client'

import { 
  Box, 
  Typography, 
  Slider, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Rating, 
  TextField, 
  InputAdornment,
  Paper,
  Divider,
  Button
} from '@mui/material'
import { Search, FilterList, RestartAlt } from '@mui/icons-material'

interface FilterSidebarProps {
  filters: any
  setFilters: (filters: any) => void
  onReset: () => void
}

const COMMON_AMENITIES = ['AC', 'WiFi', 'Parking', 'Restaurant', 'TV', 'Geyser', 'Backup']

export default function FilterSidebar({ filters, setFilters, onReset }: FilterSidebarProps) {
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setFilters({ ...filters, priceRange: newValue as number[] })
  }

  const handleAmenityToggle = (amenity: string) => {
    const current = filters.amenities || []
    const updated = current.includes(amenity)
      ? current.filter((a: string) => a !== amenity)
      : [...current, amenity]
    setFilters({ ...filters, amenities: updated })
  }

  return (
    <Paper 
      className="claymorphic"
      sx={{ 
        p: 3, 
        borderRadius: '24px', 
        position: 'sticky', 
        top: 100,
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={800}>Filters</Typography>
        </Box>
        <Button 
          size="small" 
          startIcon={<RestartAlt />} 
          onClick={onReset}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Reset
        </Button>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Search hotel name..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" color="action" />
            </InputAdornment>
          ),
          sx: { borderRadius: '12px' }
        }}
        sx={{ mb: 4 }}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Price Range (₹{filters.priceRange[0]} - ₹{filters.priceRange[1]})
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={500}
          sx={{ mt: 1 }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Minimum Rating
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Rating 
            value={filters.rating} 
            onChange={(_event, newValue) => setFilters({ ...filters, rating: newValue })}
          />
          <Typography variant="body2" color="text.secondary">
            & Up
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Amenities
        </Typography>
        <FormGroup sx={{ mt: 1 }}>
          {COMMON_AMENITIES.map((amenity) => (
            <FormControlLabel
              key={amenity}
              control={
                <Checkbox 
                  size="small"
                  checked={(filters.amenities || []).includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                />
              }
              label={<Typography variant="body2">{amenity}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  )
}
