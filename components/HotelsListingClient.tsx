'use client'

import { useState, useMemo } from 'react'
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Stack, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Skeleton, 
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Search, FilterList, Tune, Close } from '@mui/icons-material'
import useSWR from 'swr'
import { api } from '@/lib/api'
import HotelCard from '@/components/HotelCard'
import FilterSidebar from '@/components/FilterSidebar'
import { Hotel } from '@/types'

interface HotelsListingClientProps {
  initialHotels: Hotel[]
}

export default function HotelsListingClient({ initialHotels }: HotelsListingClientProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const { data: hotels, isLoading } = useSWR('getHotels', () => api.getHotels(), { fallbackData: initialHotels })
  
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 10000],
    rating: 0,
    amenities: [] as string[]
  })
  
  const [sortBy, setSortBy] = useState('sponsored')

  const COMMON_AMENITIES = ['AC', 'WiFi', 'Parking', 'Restaurant', 'TV', 'Geyser', 'Backup']

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleReset = () => {
    setFilters({
      search: '',
      priceRange: [0, 10000],
      rating: 0,
      amenities: []
    })
  }

  const filteredHotels = useMemo(() => {
    // ... (rest of filtering logic remains same)
    const data = hotels || initialHotels
    if (!data) return []
    
    let result = data.filter((hotel: Hotel) => {
      const matchesSearch = hotel.name.toLowerCase().includes(filters.search.toLowerCase())
      const matchesPrice = hotel.starting_price >= filters.priceRange[0] && hotel.starting_price <= filters.priceRange[1]
      const matchesRating = Number(hotel.rating) >= filters.rating
      const matchesAmenities = filters.amenities.length === 0 || 
        filters.amenities.every(a => hotel.amenities_search?.toLowerCase().includes(a.toLowerCase()))
      
      return matchesSearch && matchesPrice && matchesRating && matchesAmenities
    })

    result = [...result].sort((a, b) => {
      if (sortBy === 'sponsored') {
        return (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0)
      }
      if (sortBy === 'priceLow') return a.starting_price - b.starting_price
      if (sortBy === 'priceHigh') return b.starting_price - a.starting_price
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating)
      return 0
    })

    return result
  }, [hotels, initialHotels, filters, sortBy])

  return (
    <div className="bg-gray-50 min-h-screen pt-24 md:pt-32 pb-20">
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography variant="h2" fontWeight={900} sx={{ mb: 1, tracking: 'tight', color: 'primary.main', fontSize: { xs: '2rem', md: '3rem' } }}>
            Explore Hotels in Puri
          </Typography>
          <Typography variant="body1" className="text-secondary/60 font-medium">
            Find the perfect stay tailored to your needs and budget.
          </Typography>
        </Box>

        {/* Mobile Filter Bar */}
        {isMobile && (
          <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search name..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: '12px', bgcolor: 'white' }
                    }}
                />
                <IconButton 
                    onClick={() => setFilterDrawerOpen(true)}
                    sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '12px', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                    <Tune />
                </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                <Chip 
                    label="Price & Ratings" 
                    onClick={() => setFilterDrawerOpen(true)}
                    variant="outlined"
                    icon={<FilterList sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: '12px', fontWeight: 700 }}
                />
                {COMMON_AMENITIES.map(amenity => (
                    <Chip
                        key={amenity}
                        label={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        color={filters.amenities.includes(amenity) ? "primary" : "default"}
                        variant={filters.amenities.includes(amenity) ? "filled" : "outlined"}
                        sx={{ borderRadius: '12px', fontWeight: 600 }}
                    />
                ))}
            </Box>
          </Box>
        )}

        <Grid container spacing={4}>
          {!isMobile && (
            <Grid size={{ md: 3.5 }}>
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                onReset={handleReset} 
              />
            </Grid>
          )}
          
          <Grid size={{ xs: 12, md: 8.5 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body1" fontWeight={700}>
                {filteredHotels.length} Hotels found
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="sponsored">Sponsored First</MenuItem>
                  <MenuItem value="priceLow">Price: Low to High</MenuItem>
                  <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Best Rated</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Filter Drawer for Mobile */}
            <Drawer
                anchor="bottom"
                open={isFilterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '24px 24px 0 0', p: 3, maxHeight: '85vh' }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={800}>All Filters</Typography>
                    <IconButton onClick={() => setFilterDrawerOpen(false)}><Close /></IconButton>
                </Box>
                <FilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    onReset={handleReset} 
                />
                <Button 
                    fullWidth 
                    variant="contained" 
                    size="large" 
                    onClick={() => setFilterDrawerOpen(false)}
                    sx={{ mt: 4, borderRadius: '16px', py: 2, fontWeight: 800 }}
                >
                    Show {filteredHotels.length} Results
                </Button>
            </Drawer>

            {isLoading && !hotels ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ height: 450, bgcolor: 'white', borderRadius: '24px', p: 2 }}>
                       <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px' }} />
                       <Skeleton sx={{ mt: 2 }} />
                       <Skeleton width="60%" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : filteredHotels.length === 0 ? (
              <Box className="claymorphic" sx={{ p: 10, textAlign: 'center', bgcolor: 'white', borderRadius: '32px' }}>
                <Typography variant="h5" fontWeight={800} gutterBottom>No hotels matched your filters</Typography>
                <Typography color="text.secondary">Try adjusting your search or filters to see more results.</Typography>
                <Button variant="contained" onClick={handleReset} sx={{ mt: 3, borderRadius: '12px' }}>Clear All Filters</Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredHotels.map((hotel) => (
                  <Grid key={hotel.id} size={{ xs: 12, sm: 6 }}>
                    <HotelCard hotel={hotel} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
