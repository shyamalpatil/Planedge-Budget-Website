import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './components/AppAppBar';  // Navigation bar
import Hero from './components/Hero';            // Main Call to Action
import EstimationForm from './components/EstimationForm';  
// import LogoCollection from './components/LogoCollection';
// import Highlights from './components/Highlights';
// import Pricing from './components/Pricing';
// import Features from './components/Features';
// import Testimonials from './components/Testimonials';
// import FAQ from './components/FAQ';
import Footer from './components/Footer';
// import getMPTheme from './theme/getMPTheme'; // Commented out
// import TemplateFrame from './TemplateFrame'; // Uncomment if TemplateFrame exists

export default function HomePage() {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } }); // Default theme for MUI

  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  return (
    // <TemplateFrame
    //   toggleCustomTheme={toggleCustomTheme}
    //   showCustomTheme={showCustomTheme}
    //   mode={mode}
    //   toggleColorMode={toggleColorMode}
    // >
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Hero />
        { <EstimationForm />}
        <div>
          {/* <LogoCollection /> */}
          {/* <Features /> */}
          <Divider />
          {/* <Testimonials /> */}
          <Divider />
          {/* <Highlights /> */}
          <Divider />
          {/* <Pricing /> */}
          <Divider />
          {/* <FAQ /> */}
          <Divider />
          <Footer />
        </div>
      </ThemeProvider>
    // </TemplateFrame>
  );
}
