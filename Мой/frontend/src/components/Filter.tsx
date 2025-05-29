import React from 'react';
import { TextField, Box, Button } from '@mui/material';

interface FilterProps {
  filters: { [key: string]: string };
  onFilterChange: (field: string, value: string) => void;
  onReset: () => void;
  filterFields: { field: string; label: string }[];
}

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange, onReset, filterFields }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      {filterFields.map(({ field, label }) => (
        <TextField
          key={field}
          size="small"
          label={label}
          value={filters[field] || ''}
          onChange={(e) => onFilterChange(field, e.target.value)}
          sx={{ minWidth: 200 }}
        />
      ))}
      <Button variant="outlined" onClick={onReset} size="small">
        Сбросить
      </Button>
    </Box>
  );
};

export default Filter; 