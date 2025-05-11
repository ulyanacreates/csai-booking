// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { SECTION_PATH } from '@/path';

export const hero = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          One Kit, Endless
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              Possibilities
            </Typography>
          }
          sx={{ height: 24, bgcolor: 'primary.lighter', mr: -1, ml: 0.75, '& .MuiChip-label': { px: 1.25 } }}
          icon={
            <CardMedia
              component="img"
              image="/assets/images/shared/celebration.svg"
              sx={{ width: 16, height: 16 }}
              alt="celebration"
              loading="lazy"
            />
          }
        />
      </>
    )
  },
  headLine: 'AI Customer Service for your very special bookings ',
  captionLine: 'A platform for automated customer service support.\n Voice-based AI recommendations and booking management for customers. \n Automated management workflows for your business.',
  primaryBtn: { children: 'Log in', href: SECTION_PATH },
  // videoSrc: 'https://d2elhhoq00m1pj.cloudfront.net/saasable-intro.mp4',
  // Maybe put some video in here if we can find anything related? 
  // videoThumbnail: '/assets/videos/thumbnails/intro-thumbnail.png',
  listData: [
    // { image: '/assets/images/shared/react.svg', title: 'React 19' },
    // { image: '/assets/images/shared/next-js.svg', title: 'Next.js' },
    // { image: '/assets/images/shared/material-ui.svg', title: 'Material UI v7' },
    // { image: '/assets/images/shared/typescript.svg', title: 'TypeScript' },
    // { image: '/assets/images/shared/javascript.svg', title: 'JavaScript' },
    // { image: '/assets/images/shared/m3.svg', title: 'Material 3' },
    // { image: '/assets/images/shared/figma.svg', title: 'Figma' }
  ]
};
