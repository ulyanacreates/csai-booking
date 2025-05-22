'use client';
import { useEffect, useState } from 'react';

// @next
import NextLink from 'next/link';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'framer-motion';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import { GraphicsCard } from '@/components/cards';
import SectionHero from '@/components/SectionHero';
import SvgIcon from '@/components/SvgIcon';

import useFocusWithin from '@/hooks/useFocusWithin';
import { PAGE_PATH, RESERVATION_PATH } from '@/path';
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';
import GetImagePath from '@/utils/GetImagePath';

// @assets
import Background from '@/images/graphics/Background';
import Wave from '@/images/graphics/Wave';

var SectionCategory;

(function (SectionCategory) {
  SectionCategory['ESSENTIAL'] = 'essential';
  SectionCategory['MARKETING'] = 'marketing';
  SectionCategory['FEATURE'] = 'feature';
})(SectionCategory || (SectionCategory = {}));

const imagePrefix = '/assets/images/presentation';

/***************************  RESRVATION - DATA  ***************************/
const API_URL = 'http://localhost:8000';

// useEffect(() => {
//   const token = localStorage.getItem('token');
//   let user =  JSON.parse(localStorage.getItem('user'))

//   fetch(API_URL +'/api/sections', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `${user.token}`, 
//     },
//   })
//     .then(res => {
//       if (!res.ok) {
//         throw new Error('Failed to fetch sections');
//         alert("Log in again");
//       }
//       return res.json();
//     })
//     .then(data => {
//       const mappedSections = data.map(section => ({
//         ...section,
//         image: `${imagePrefix}/navbar-light.svg`,
//         title: section.rest,
//         subtitle: section.res_time + ", for" + section.num + "people. Phone: "+section.phone,
//         link: NULL,
//         category: SectionCategory.ESSENTIAL
//       }));
//       setSections(mappedSections);
//     })
//     .catch(err => {
//       console.error('Error fetching sections:', err);
//     });
// }, []);


/***************************  RESERVATION LAYOUT  ***************************/

export default function Sections() {
  const theme = useTheme();
  const [sections, setSections] = useState([]);
  useEffect(() => {
  const token = localStorage.getItem('token');
  let user =  JSON.parse(localStorage.getItem('user'))
  let payload = {user_name: user.user_name};
  fetch(API_URL +`/api/reservation/${user.user_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${user.token}`, 
    },
  })
    .then(res => {
      if (!res.ok) {
        alert("Log in again");
        throw new Error('Failed to fetch sections');
      }
      return res.json();
    })
    .then(data => {
        let mappedSections = data.data.map(section => ({
        ...section,
        image: section.img,
        title: section.rest,
        subTitle: section.res_time + ", for " + section.num + " people. Phone used for reservations: "+section.phone,
        link: RESERVATION_PATH,
        category: SectionCategory.ESSENTIAL
      }));
      setSections(mappedSections);
    })
    .catch(err => {
      console.error('Error fetching sections:', err);
    });
}, []);
//   const [filterBy, setFilterBy] = useState('');
//   const [filterSections, setFilterSections] = useState(sections);

//   const [searchValue, setSearchValue] = useState('');

//   const handleSearchValue = (event) => {
//     const search = event.target.value.trim().toLowerCase();
//     setSearchValue(search);
//   };

//   useEffect(() => {
//     const newData = sections.filter((value) => {
//       if (searchValue) {
//         return value.title.toLowerCase().includes(searchValue.toLowerCase());
//       } else {
//         return value;
//       }
//     });
//     setFilterSections(newData);
//   }, [searchValue]);

  const isFocusWithin = useFocusWithin();

  return (
    <>
      <SectionHero heading="Current Reservations" search={false} offer />
      <ContainerWrapper>
        <Stack sx={{ py: 6, gap: { xs: 3, sm: 4, md: 5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ alignItems: 'center', justifyContent: 'space-between', gap: { xs: 2.5, md: 1.5 } }}
          >
          </Stack>
          <Grid container spacing={1.5}>
            {sections.map((item, index) => (
              <Grid key={index} size={{ xs: 6, sm: 4, md: 4 }}>
                <GraphicsCard sx={{ overflow: 'hidden', WebkitTapHighlightColor: 'transparent' }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5
                    }}
                  >
                    <GraphicsCard
                      sx={{
                        height: { xs: 300, sm: 400, md: 480 },
                        position: 'relative',
                        overflow: 'hidden',
                        ...(isFocusWithin && { '&:focus-within': generateFocusVisibleStyles(theme.palette.primary.main) })
                      }}
                    >
                      <Link
                        href={item.link}
                        component={NextLink}
                        aria-label={item.title}
                        sx={{ position: 'absolute', top: 0, height: 1, width: 1, borderRadius: { xs: 6, sm: 8, md: 10 }, zIndex: 1 }}
                      />
                      <Background />
                      <Box sx={{ position: 'absolute', top: 0, width: 1, height: 1, textAlign: 'center' }}>
                        <CardMedia
                          component="img"
                          image={item.image}
                          sx={{ px: '14.5%', pt: '16%', pb: { xs: 2, md: 1 }, objectFit: 'contain' }}
                          alt="other sections"
                          loading="lazy"
                        />
                        <Box sx={{ '& div': { alignItems: 'center', pt: 0.875 } }}>
                          <Wave />
                        </Box>
                      </Box>
                      <Stack
                        sx={{
                          height: 177,
                          bottom: 0,
                          width: 1,
                          position: 'absolute',
                          justifyContent: 'end',
                          textAlign: 'center',
                          gap: { xs: 0.25, md: 0.5, sm: 1 },
                          p: 3,
                          background: `linear-gradient(180deg, ${alpha(theme.palette.grey[100], 0)} 0%, ${theme.palette.grey[100]} 100%)`
                        }}
                      >
                        <Typography variant="h4" sx={{ color: 'primary.main' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {item.subTitle}
                        </Typography>
                      </Stack>
                    </GraphicsCard>
                  </motion.div>
                </GraphicsCard>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </ContainerWrapper>
    </>
  );
}