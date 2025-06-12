import PropTypes from 'prop-types';
// @next
import NextLink from 'next/link';

// @mui
import Button from '@mui/material/Button';
import { PAGE_PATH, SECTION_PATH } from '@/path';

/***************************  NAVBAR - SECONDARY BUTTON  ***************************/

export default function NavSecondaryButton({ sx, children, ...rest }) {
  return (
    <Button
      variant="outlined"
      size="small"
      sx={sx}
      href={PAGE_PATH.login}
      component={NextLink}
      {...rest}
      rel="noopener noreferrer"
      aria-label="nav-secondary-btn"
    >
      {children || 'Account'}
    </Button>
  );
}

NavSecondaryButton.propTypes = { sx: PropTypes.any, children: PropTypes.any, rest: PropTypes.any };
